// Error handling utilities for production

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  
  // Payment errors
  PAYMENT_CARD_DECLINED: 'PAYMENT_CARD_DECLINED',
  PAYMENT_INSUFFICIENT_FUNDS: 'PAYMENT_INSUFFICIENT_FUNDS',
  PAYMENT_PROCESSING_ERROR: 'PAYMENT_PROCESSING_ERROR',
  PAYMENT_INVALID_CARD: 'PAYMENT_INVALID_CARD',
  
  // Booking errors
  BOOKING_NOT_AVAILABLE: 'BOOKING_NOT_AVAILABLE',
  BOOKING_INVALID_DATE: 'BOOKING_INVALID_DATE',
  BOOKING_LIMIT_EXCEEDED: 'BOOKING_LIMIT_EXCEEDED',
  BOOKING_MEMBERSHIP_REQUIRED: 'BOOKING_MEMBERSHIP_REQUIRED',
  
  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password. Please check your credentials and try again.',
  [ERROR_CODES.AUTH_EMAIL_NOT_VERIFIED]: 'Please verify your email address before logging in.',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Your account has been temporarily locked due to multiple failed login attempts.',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  
  [ERROR_CODES.PAYMENT_CARD_DECLINED]: 'Your card was declined. Please check your card details or try a different card.',
  [ERROR_CODES.PAYMENT_INSUFFICIENT_FUNDS]: 'Insufficient funds. Please check your account balance.',
  [ERROR_CODES.PAYMENT_PROCESSING_ERROR]: 'Payment processing failed. Please try again.',
  [ERROR_CODES.PAYMENT_INVALID_CARD]: 'Invalid card information. Please check your card details.',
  
  [ERROR_CODES.BOOKING_NOT_AVAILABLE]: 'This booking is no longer available. Please try a different option.',
  [ERROR_CODES.BOOKING_INVALID_DATE]: 'Invalid booking date. Please select a future date.',
  [ERROR_CODES.BOOKING_LIMIT_EXCEEDED]: 'You have reached your booking limit. Please upgrade your membership.',
  [ERROR_CODES.BOOKING_MEMBERSHIP_REQUIRED]: 'A valid membership is required to make bookings.',
  
  [ERROR_CODES.FILE_TOO_LARGE]: 'File size is too large. Please upload a smaller file.',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'Invalid file type. Please upload a supported file format.',
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'File upload failed. Please try again.',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: 'Please fill in all required fields.',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
};

// Create standardized error
export const createError = (code: string, details?: any): AppError => {
  return {
    code,
    message: ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    details,
    timestamp: new Date().toISOString()
  };
};

// Handle API errors
export const handleApiError = (error: any): AppError => {
  console.error('API Error:', error);
  
  if (error.name === 'AbortError') {
    return createError(ERROR_CODES.TIMEOUT_ERROR);
  }
  
  if (error.message?.includes('Failed to fetch')) {
    return createError(ERROR_CODES.NETWORK_ERROR);
  }
  
  if (error.status) {
    switch (error.status) {
      case 400:
        return createError(ERROR_CODES.VALIDATION_ERROR, error.message);
      case 401:
        return createError(ERROR_CODES.AUTH_INVALID_CREDENTIALS);
      case 403:
        return createError(ERROR_CODES.AUTH_SESSION_EXPIRED);
      case 404:
        return createError(ERROR_CODES.BOOKING_NOT_AVAILABLE);
      case 429:
        return createError(ERROR_CODES.AUTH_ACCOUNT_LOCKED);
      case 500:
        return createError(ERROR_CODES.SERVER_ERROR);
      default:
        return createError(ERROR_CODES.UNKNOWN_ERROR, error.message);
    }
  }
  
  return createError(ERROR_CODES.UNKNOWN_ERROR, error.message);
};

// Handle payment errors
export const handlePaymentError = (error: any): AppError => {
  console.error('Payment Error:', error);
  
  if (error.type === 'card_error') {
    switch (error.code) {
      case 'card_declined':
        return createError(ERROR_CODES.PAYMENT_CARD_DECLINED);
      case 'insufficient_funds':
        return createError(ERROR_CODES.PAYMENT_INSUFFICIENT_FUNDS);
      case 'invalid_number':
      case 'invalid_expiry_month':
      case 'invalid_expiry_year':
      case 'invalid_cvc':
        return createError(ERROR_CODES.PAYMENT_INVALID_CARD);
      default:
        return createError(ERROR_CODES.PAYMENT_PROCESSING_ERROR, error.message);
    }
  }
  
  return createError(ERROR_CODES.PAYMENT_PROCESSING_ERROR, error.message);
};

// Log error for monitoring
export const logError = (error: AppError, context?: string): void => {
  const logData = {
    ...error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: getCurrentUserId()
  };
  
  // In production, send to error monitoring service
  if (import.meta.env.NODE_ENV === 'production') {
    // Send to error monitoring service (e.g., Sentry, LogRocket)
    console.error('Production Error:', logData);
    
    // You can integrate with services like:
    // Sentry.captureException(error);
    // LogRocket.captureException(error);
  } else {
    console.error('Development Error:', logData);
  }
};

// Get current user ID for error context
const getCurrentUserId = (): string | null => {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.id || null;
  } catch {
    return null;
  }
};

// Show user-friendly error message
export const showErrorMessage = (error: AppError): void => {
  // Log the error
  logError(error);
  
  // Show user-friendly message
  alert(error.message);
};

// Retry mechanism for failed requests
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Global error handler
export const setupGlobalErrorHandler = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = createError(ERROR_CODES.UNKNOWN_ERROR, event.reason);
    logError(error, 'Unhandled Promise Rejection');
    event.preventDefault();
  });
  
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    const error = createError(ERROR_CODES.UNKNOWN_ERROR, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    logError(error, 'JavaScript Error');
  });
};