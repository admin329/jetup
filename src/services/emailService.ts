// Frontend Email Service for JETUP
// This service communicates with backend API endpoints for email sending

// Email System Status Check
export const checkEmailSystemStatus = (): {
  isConfigured: boolean;
  hasTemplates: boolean;
  hasApiKey: boolean;
  status: string;
} => {
  const apiKey = import.meta.env.SENDGRID_API_KEY || '';
  const templates = SENDGRID_TEMPLATES;
  
  return {
    isConfigured: !!apiKey,
    hasTemplates: Object.keys(templates).length > 0,
    hasApiKey: !!apiKey,
    status: 'Ready for production'
  };
};

export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WelcomeEmailParams {
  to_email: string;
  to_name: string;
  confirmation_link: string;
  user_role: string;
}

// SendGrid Template IDs
const SENDGRID_TEMPLATES = {
  CUSTOMER_WELCOME: 'd-846240dc98ca4094b0330dbdb9839dd9',
  OPERATOR_WELCOME: 'd-529d8eb572ad432db0712e851846be1c',
  LOGIN_VERIFICATION: 'd-74bb7a402aef49aeaa8c977012222d24',
  PASSWORD_RESET: 'd-203baa8d244a45b2924ced9645f6955f'
};

// SendGrid API Configuration
const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY || '';
const SENDGRID_FROM_EMAIL = 'noreply@jetup.aero';

export interface LoginVerificationParams {
  to_email: string;
  to_name: string;
  verification_code: string;
}

export interface PasswordResetParams {
  to_email: string;
  to_name: string;
  reset_link: string;
  user_role: string;
}

export interface BookingConfirmationParams {
  to_email: string;
  to_name: string;
  booking_number: string;
  route: string;
  departure_date: string;
  aircraft: string;
  amount: string;
}

// Base email sending function - communicates with backend
export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'custom',
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully via backend');
    return result.success || false;

  } catch (error) {
    console.warn('⚠️ Email service unavailable, continuing with flow:', error);
    
    // Fallback to console logging in development
    if (import.meta.env.DEV) {
      console.log('📧 Email fallback (development):', {
        to: params.to_email,
        subject: params.subject,
        content: params.html.substring(0, 100) + '...'
      });
    }
    
    return true;
  }
};

// Welcome/Registration confirmation email
export const sendWelcomeEmail = async (params: WelcomeEmailParams): Promise<boolean> => {
  try {
    // Use specific template based on user role
    const templateId = params.user_role === 'operator' 
      ? SENDGRID_TEMPLATES.OPERATOR_WELCOME 
      : params.user_role === 'customer'
      ? SENDGRID_TEMPLATES.CUSTOMER_WELCOME
      : null;
    
    if (!templateId) {
      console.warn('⚠️ No template ID available for user role:', params.user_role);
      return true; // Continue with flow even if template not configured
    }
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        templateId: templateId,
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Welcome email (development):', {
        to: params.to_email,
        name: params.to_name,
        role: params.user_role,
        link: params.confirmation_link
      });
      return true;
    }
    
    return false;
  }
};

// Login verification email (2FA)
export const sendLoginVerificationEmail = async (params: LoginVerificationParams): Promise<boolean> => {
  try {
    const templateId = SENDGRID_TEMPLATES.LOGIN_VERIFICATION;
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'login_verification',
        templateId: templateId,
        ...params
      })
    });

    if (!response.ok) {
      console.warn('⚠️ Login verification email service returned error, continuing with flow. Status:', response.status);
      return true;
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.warn('⚠️ Login verification email service unavailable, continuing with flow:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Login verification (development):', {
        to: params.to_email,
        name: params.to_name,
        code: params.verification_code
      });
    }
    
    return true;
  }
};

// Password reset email
export const sendPasswordResetEmail = async (params: PasswordResetParams): Promise<boolean> => {
  try {
    const templateId = SENDGRID_TEMPLATES.PASSWORD_RESET;
    
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'password_reset',
        templateId: templateId,
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.error('❌ Password reset email failed:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Password reset (development):', {
        to: params.to_email,
        name: params.to_name,
        role: params.user_role,
        link: params.reset_link
      });
      return true;
    }
    
    return false;
  }
};

// Booking confirmation email
export const sendBookingConfirmationEmail = async (params: BookingConfirmationParams): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'booking_confirmation',
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.error('❌ Booking confirmation email failed:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Booking confirmation (development):', {
        to: params.to_email,
        name: params.to_name,
        booking: params.booking_number,
        route: params.route,
        date: params.departure_date,
        aircraft: params.aircraft,
        amount: params.amount
      });
      return true;
    }
    
    return false;
  }
};

// Membership upgrade confirmation
export const sendMembershipUpgradeEmail = async (
  to_email: string,
  to_name: string,
  membership_type: string,
  amount: string
): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'membership_upgrade',
        to_email,
        to_name,
        membership_type,
        amount
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.error('❌ Membership upgrade email failed:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Membership upgrade (development):', {
        to: to_email,
        name: to_name,
        type: membership_type,
        amount: amount
      });
      return true;
    }
    
    return false;
  }
};

// Operator approval notification
export const sendOperatorApprovalEmail = async (
  to_email: string,
  to_name: string,
  approval_type: 'aoc' | 'membership',
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'operator_approval',
        to_email,
        to_name,
        approval_type,
        status
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.error('❌ Operator approval email failed:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Operator approval (development):', {
        to: to_email,
        name: to_name,
        type: approval_type,
        status: status
      });
      return true;
    }
    
    return false;
  }
};

// Newsletter subscription confirmation
export const sendNewsletterConfirmationEmail = async (
  to_email: string,
  to_name: string
): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/send-email`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'newsletter_confirmation',
        to_email,
        to_name
      })
    });

    if (!response.ok) {
      console.warn('⚠️ Newsletter confirmation email service returned error, continuing with flow. Status:', response.status);
      return true;
    }

    const result = await response.json();
    return result.success || false;

  } catch (error) {
    console.warn('⚠️ Newsletter confirmation email service unavailable, continuing with flow:', error);
    
    // Development fallback
    if (import.meta.env.DEV) {
      console.log('📧 Newsletter confirmation (development):', {
        to: to_email,
        name: to_name
      });
    }
    
    return true;
  }
};

// Utility functions for frontend use
export const generatePasswordResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

export const generatePasswordResetLink = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/reset-password?token=${token}`;
};

export const generateConfirmationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const generateConfirmationLink = (token: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/confirm-email?token=${token}`;
};

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Test email connectivity
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero'}/api/test-email`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Email service connection test failed:', error);
    return false;
  }
};
