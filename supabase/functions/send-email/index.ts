import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// SendGrid API Configuration
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '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'
const SENDGRID_FROM_EMAIL = 'noreply@jetup.aero'
const SENDGRID_FROM_NAME = 'JETUP LTD (UK)'

// Template IDs
const TEMPLATES = {
  CUSTOMER_WELCOME: 'd-846240dc98ca4094b0330dbdb9839dd9',
  OPERATOR_WELCOME: 'd-529d8eb572ad432db0712e851846be1c',
  LOGIN_VERIFICATION: 'd-74bb7a402aef49aeaa8c977012222d24',
  PASSWORD_RESET: 'd-203baa8d244a45b2924ced9645f6955f'
}

interface EmailRequest {
  type: 'welcome' | 'login_verification' | 'password_reset' | 'booking_confirmation' | 'custom'
  to_email: string
  to_name: string
  templateId?: string
  templateData?: Record<string, any>
  subject?: string
  html?: string
  text?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, to_email, to_name, templateId, templateData, subject, html, text }: EmailRequest = await req.json()

    console.log('📧 Email request received:', { type, to_email, to_name })

    // Validate required fields
    if (!to_email || !to_name) {
      throw new Error('Missing required fields: to_email, to_name')
    }

    let emailData: any = {
      personalizations: [{
        to: [{ email: to_email, name: to_name }],
        dynamic_template_data: templateData || {}
      }],
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: SENDGRID_FROM_NAME
      }
    }

    // Handle different email types
    switch (type) {
      case 'welcome':
        emailData.template_id = templateId || (templateData?.user_role === 'operator' ? TEMPLATES.OPERATOR_WELCOME : TEMPLATES.CUSTOMER_WELCOME)
        emailData.personalizations[0].dynamic_template_data = {
          to_name,
          to_email,
          confirmation_link: templateData?.confirmation_link || `https://jetup.aero/confirm-email?token=demo-token-${Date.now()}`,
          user_role: templateData?.user_role || 'customer',
          ...templateData
        }
        break

      case 'login_verification':
        emailData.template_id = templateId || TEMPLATES.LOGIN_VERIFICATION
        emailData.personalizations[0].dynamic_template_data = {
          to_name,
          to_email,
          verification_code: templateData?.verification_code || '123456',
          login_time: new Date().toLocaleString(),
          login_ip: '192.168.1.100',
          device_info: 'Chrome on macOS',
          ...templateData
        }
        break

      case 'password_reset':
        emailData.template_id = templateId || TEMPLATES.PASSWORD_RESET
        emailData.personalizations[0].dynamic_template_data = {
          to_name,
          to_email,
          user_role: templateData?.user_role || 'customer',
          reset_link: templateData?.reset_link || `https://jetup.aero/reset-password?token=demo-reset-${Date.now()}`,
          request_time: new Date().toLocaleString(),
          request_ip: '192.168.1.100',
          ...templateData
        }
        break

      case 'booking_confirmation':
        // Use custom HTML for booking confirmation
        emailData.subject = subject || `JETUP Booking Confirmation - ${templateData?.booking_number || 'N/A'}`
        emailData.content = [{
          type: 'text/html',
          value: html || generateBookingConfirmationHTML(templateData)
        }]
        break

      case 'custom':
        emailData.subject = subject || 'JETUP Notification'
        emailData.content = [{
          type: 'text/html',
          value: html || '<p>Custom email content</p>'
        }]
        if (text) {
          emailData.content.push({
            type: 'text/plain',
            value: text
          })
        }
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    // Send email via SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid API error:', response.status, errorText)
      throw new Error(`SendGrid API error: ${response.status}`)
    }

    console.log('✅ Email sent successfully via SendGrid')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        type,
        to_email 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Email sending failed' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

// Generate booking confirmation HTML
function generateBookingConfirmationHTML(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>JETUP Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #0B1733; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .booking-info { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .route { font-size: 24px; font-weight: bold; color: #0B1733; text-align: center; margin: 20px 0; }
        .footer { background-color: #0B1733; color: white; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
          <p>Your flight has been confirmed</p>
        </div>
        <div class="content">
          <div class="route">${data?.route || 'Flight Route'}</div>
          <div class="booking-info">
            <p><strong>Booking Number:</strong> ${data?.booking_number || 'N/A'}</p>
            <p><strong>Departure:</strong> ${data?.departure_date || 'N/A'}</p>
            <p><strong>Aircraft:</strong> ${data?.aircraft || 'N/A'}</p>
            <p><strong>Amount:</strong> ${data?.amount || 'N/A'}</p>
          </div>
          <p>Thank you for choosing JETUP for your private flight needs!</p>
        </div>
        <div class="footer">
          <p>JETUP LTD (UK) - Private Flight Network</p>
          <p>support@jetup.aero | +1 888 565 6090</p>
        </div>
      </div>
    </body>
    </html>
  `
}
