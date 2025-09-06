// Security utilities for production

// Encrypt sensitive data
export const encryptData = (data: string, key?: string): string => {
  // Simple encryption for demo - use proper encryption in production
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const keyBytes = encoder.encode(key || 'jetup-default-key');
  
  const encrypted = dataBytes.map((byte, index) => 
    byte ^ keyBytes[index % keyBytes.length]
  );
  
  return btoa(String.fromCharCode(...encrypted));
};

// Decrypt sensitive data
export const decryptData = (encryptedData: string, key?: string): string => {
  try {
    const decoder = new TextDecoder();
    const keyBytes = new TextEncoder().encode(key || 'jetup-default-key');
    
    const encrypted = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    
    const decrypted = encrypted.map((byte, index) => 
      byte ^ keyBytes[index % keyBytes.length]
    );
    
    return decoder.decode(decrypted);
  } catch {
    return '';
  }
};

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Hash password (client-side hashing for additional security)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Validate session token
export const validateSessionToken = (token: string): boolean => {
  if (!token || token.length < 10) return false;
  
  try {
    // Basic token validation - implement proper JWT validation in production
    const parts = token.split('.');
    return parts.length === 3; // JWT format
  } catch {
    return false;
  }
};

// Check if user session is valid
export const isSessionValid = (): boolean => {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const sessionStart = localStorage.getItem('sessionStart');
    
    if (!user.id || !sessionStart) return false;
    
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    return sessionAge < maxAge;
  } catch {
    return false;
  }
};

// Refresh session
export const refreshSession = (): void => {
  localStorage.setItem('sessionStart', Date.now().toString());
};

// Clear sensitive data from memory
export const clearSensitiveData = (): void => {
  // Clear localStorage
  const keysToKeep = ['theme', 'language'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
};

// Mask sensitive information for logging
export const maskSensitiveInfo = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  const masked = { ...data };
  const sensitiveFields = [
    'password', 'cardNumber', 'cvv', 'ssn', 'accountNumber', 
    'routingNumber', 'token', 'secret', 'key'
  ];
  
  for (const field of sensitiveFields) {
    if (masked[field]) {
      if (field === 'cardNumber') {
        masked[field] = `****-****-****-${masked[field].slice(-4)}`;
      } else {
        masked[field] = '***MASKED***';
      }
    }
  }
  
  return masked;
};

// Content Security Policy headers
export const getCSPHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://cdn.emailjs.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://api.emailjs.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  };
};

// Security headers for production
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    ...getCSPHeaders(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
};

// Input validation and sanitization
export const validateAndSanitizeInput = (input: string, type: 'email' | 'phone' | 'text' | 'number'): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} => {
  const errors: string[] = [];
  let sanitized = input.trim();
  
  // Basic sanitization
  sanitized = sanitized.replace(/[<>]/g, '');
  
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        errors.push('Invalid email format');
      }
      break;
      
    case 'phone':
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(sanitized)) {
        errors.push('Invalid phone number format');
      }
      break;
      
    case 'number':
      if (isNaN(Number(sanitized))) {
        errors.push('Must be a valid number');
      }
      break;
      
    case 'text':
      if (sanitized.length > 1000) {
        errors.push('Text too long (max 1000 characters)');
        sanitized = sanitized.substring(0, 1000);
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};

// Rate limiting
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};

// Initialize security measures
export const initializeSecurity = (): void => {
  // Set up global error handlers
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Log to error monitoring service in production
  });
  
  // Prevent right-click in production (optional)
  if (import.meta.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (e) => {
      // e.preventDefault(); // Uncomment to disable right-click
    });
  }
  
  // Clear sensitive data on page unload
  window.addEventListener('beforeunload', () => {
    // Clear sensitive form data
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[type="password"], input[name*="card"], input[name*="cvv"]');
      inputs.forEach((input: any) => {
        input.value = '';
      });
    });
  });
  
  console.log('🔒 Security measures initialized');
};