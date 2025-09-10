import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Test SendGrid connection
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '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'
    
    // Simple test request to SendGrid
    const testResponse = await fetch('https://api.sendgrid.com/v3/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    const isConnected = testResponse.ok
    
    return new Response(
      JSON.stringify({ 
        success: isConnected,
        message: isConnected ? 'SendGrid connection successful' : 'SendGrid connection failed',
        status: testResponse.status,
        sendgrid_configured: !!SENDGRID_API_KEY
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Email test failed:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Email test failed' 
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
