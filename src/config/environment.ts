// Environment configuration for production
export const config = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || (import.meta.env.NODE_ENV === 'production' ? 'pk_live_51Rxm5xRoRmnrtidggbBqABsqH839S7iN1UoodLKBs3yi6Y25CHJLSE9AT6H5XpyahRV5I56IoQt0i8rAsRBXezVu00ixCbtnzc' : 'pk_test_51Rxm5xRoRmnrtidggbBqABsqH839S7iN1UoodLKBs3yi6Y25CHJLSE9AT6H5XpyahRV5I56IoQt0i8rAsRBXezVu00ixCbtnzc'),
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || (import.meta.env.NODE_ENV === 'production' ? 'sk_live_51•••••fwW' : 'sk_test_51•••••fwW')
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero',
    timeout: 30000
  },

  // Database Configuration
  database: {
    url: import.meta.env.VITE_DATABASE_URL || '',
    ssl: import.meta.env.NODE_ENV === 'production'
  },

  // Email Configuration
  email: {
    sendgridApiKey: import.meta.env.SENDGRID_API_KEY || '',
    fromEmail: 'noreply@jetup.aero',
    fromName: 'JETUP LTD (UK)',
    replyTo: 'support@jetup.aero',
    templates: {
      customerWelcome: 'd-846240dc98ca4094b0330dbdb9839dd9',
      operatorWelcome: 'd-529d8eb572ad432db0712e851846be1c',
      loginVerification: 'd-74bb7a402aef49aeaa8c977012222d24',
      passwordReset: 'd-203baa8d244a45b2924ced9645f6955f'
    }
  },

  // File Upload Configuration
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: {
      images: ['image/jpeg', 'image/png', 'image/webp'],
      documents: ['application/pdf'],
      receipts: ['application/pdf', 'image/jpeg', 'image/png']
    },
    s3Bucket: import.meta.env.VITE_S3_BUCKET || '',
    s3Region: import.meta.env.VITE_S3_REGION || 'us-east-1'
  },

  // Security Configuration
  security: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || '',
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Feature Flags
  features: {
    enablePayments: true,
    enableEmailVerification: true,
    enableFileUploads: true,
    enableAnalytics: import.meta.env.NODE_ENV === 'production',
    maintenanceMode: false
  },

  // Company Information
  company: {
    name: 'JETUP LTD (UK)',
    companyId: '16643231',
    address: {
      street: '27 Old Gloucester Street',
      city: 'London',
      country: 'United Kingdom',
      postalCode: 'WC1N 3AX'
    },
    contact: {
      email: 'support@jetup.aero',
      phone: '+1 888 565 6090',
      whatsapp: '+18885656090'
    },
    social: {
      instagram: 'https://www.instagram.com/jetupaero/',
      twitter: 'https://x.com/jetupaero/',
      youtube: 'https://www.youtube.com/@jetupaero'
    }
  }
};

// Environment validation
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required environment variables for production
  if (import.meta.env.NODE_ENV === 'production') {
    if (!config.stripe.publishableKey.startsWith('pk_live_')) {
      errors.push('Production Stripe publishable key required');
    }
  } else {
    // Development environment should use test keys
    if (config.stripe.publishableKey.startsWith('pk_live_')) {
      console.warn('⚠️ Using live Stripe key in development - consider using test keys');
    }
    
    if (!config.api.baseUrl || config.api.baseUrl.includes('localhost')) {
      errors.push('Production API base URL required');
    }
    
    if (!config.database.url) {
      errors.push('Database URL required for production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Initialize environment
export const initializeEnvironment = (): void => {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.warn('⚠️ Environment validation warnings:', validation.errors);
  }
  
  console.log('🔧 Environment initialized:', {
    mode: import.meta.env.NODE_ENV,
    stripe: config.stripe.publishableKey ? '✅ Configured' : '❌ Missing',
    api: config.api.baseUrl ? '✅ Configured' : '❌ Missing',
    database: config.database.url ? '✅ Configured' : '❌ Missing'
  });
};
