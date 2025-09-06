// Environment configuration for production
export const config = {
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Rxm5xRoRmnrtidggbBqABsqH839S7iN1UoodLKBs3yi6Y25CHJLSE9AT6H5XpyahRV5I56IoQt0i8rAsRBXezVu00ixCbtnzc'
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.jetup.aero',
    timeout: 30000
  },

  // Company Information
  company: {
    name: 'JETUP LTD (UK)',
    companyId: '16643231',
    contact: {
      email: 'support@jetup.aero',
      phone: '+1 888 565 6090'
    }
  }
};

export default config;
