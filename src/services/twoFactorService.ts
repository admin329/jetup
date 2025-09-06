// Two-Factor Authentication Service for JETUP Admin
import { sendLoginVerificationEmail } from './emailService';

export interface TwoFactorCode {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

// Generate 6-digit verification code
export const generateTwoFactorCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store 2FA code securely
export const storeTwoFactorCode = (email: string, code: string): void => {
  const twoFactorData: TwoFactorCode = {
    code,
    email,
    expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
    attempts: 0,
    maxAttempts: 3
  };
  
  sessionStorage.setItem(`2fa_${email}`, JSON.stringify(twoFactorData));
  console.log('🔐 2FA code stored for:', email);
};

// Verify 2FA code
export const verifyTwoFactorCode = (email: string, inputCode: string): {
  isValid: boolean;
  error?: string;
  attemptsRemaining?: number;
} => {
  try {
    const stored = sessionStorage.getItem(`2fa_${email}`);
    if (!stored) {
      return { isValid: false, error: 'No verification code found. Please request a new one.' };
    }
    
    const twoFactorData: TwoFactorCode = JSON.parse(stored);
    
    // Check expiration
    if (Date.now() > twoFactorData.expiresAt) {
      sessionStorage.removeItem(`2fa_${email}`);
      return { isValid: false, error: 'Verification code has expired. Please request a new one.' };
    }
    
    // Check max attempts
    if (twoFactorData.attempts >= twoFactorData.maxAttempts) {
      sessionStorage.removeItem(`2fa_${email}`);
      return { isValid: false, error: 'Too many failed attempts. Please request a new code.' };
    }
    
    // Verify code
    if (twoFactorData.code === inputCode.trim()) {
      sessionStorage.removeItem(`2fa_${email}`);
      console.log('✅ 2FA verification successful for:', email);
      return { isValid: true };
    } else {
      // Increment attempts
      twoFactorData.attempts += 1;
      sessionStorage.setItem(`2fa_${email}`, JSON.stringify(twoFactorData));
      
      const remaining = twoFactorData.maxAttempts - twoFactorData.attempts;
      return { 
        isValid: false, 
        error: `Invalid code. ${remaining} attempts remaining.`,
        attemptsRemaining: remaining
      };
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    return { isValid: false, error: 'Verification failed. Please try again.' };
  }
};

// Send 2FA code via email
export const sendTwoFactorCode = async (email: string, name: string): Promise<boolean> => {
  try {
    const code = generateTwoFactorCode();
    
    // Store code
    storeTwoFactorCode(email, code);
    
    // Send email
    const emailSent = await sendLoginVerificationEmail({
      to_email: email,
      to_name: name,
      verification_code: code
    });
    
    if (emailSent) {
      console.log('📧 2FA code sent to:', email);
      return true;
    } else {
      console.warn('⚠️ Email service unavailable, but 2FA code generated');
      // In development, show code in console
      if (import.meta.env.DEV) {
        console.log('🔐 DEV MODE - 2FA Code:', code);
        alert(`DEV MODE - 2FA Code: ${code}`);
      }
      return true;
    }
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return false;
  }
};

// Clear expired 2FA codes (cleanup)
export const clearExpiredTwoFactorCodes = (): void => {
  try {
    const keys = Object.keys(sessionStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith('2fa_')) {
        try {
          const data = JSON.parse(sessionStorage.getItem(key) || '');
          if (now > data.expiresAt) {
            sessionStorage.removeItem(key);
          }
        } catch {
          sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired 2FA codes:', error);
  }
};

// Initialize 2FA service
export const initializeTwoFactorService = (): void => {
  // Clear expired codes on startup
  clearExpiredTwoFactorCodes();
  
  // Set up periodic cleanup
  setInterval(clearExpiredTwoFactorCodes, 5 * 60 * 1000); // Every 5 minutes
  
  console.log('🔐 Two-Factor Authentication service initialized');
};

// Get remaining time for 2FA code
export const getTwoFactorTimeRemaining = (email: string): number => {
  try {
    const stored = sessionStorage.getItem(`2fa_${email}`);
    if (!stored) return 0;
    
    const twoFactorData: TwoFactorCode = JSON.parse(stored);
    const remaining = Math.max(0, twoFactorData.expiresAt - Date.now());
    return Math.ceil(remaining / 1000); // Return seconds
  } catch {
    return 0;
  }
};