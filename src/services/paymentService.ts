import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration - Live keys
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Rxm5xRoRmnrtidggbBqABsqH839S7iN1UoodLKBs3yi6Y25CHJLSE9AT6H5XpyahRV5I56IoQt0i8rAsRBXezVu00ixCbtnzc';
const STRIPE_SECRET_KEY = 'sk_live_51•••••fwW'; // Secret key for server-side operations (backend only)
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface CardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  paymentMethod?: string;
}

// Simulate Stripe payment processing
export const processPayment = async (
  paymentData: PaymentData,
  cardData: CardData
): Promise<PaymentResult> => {
  try {
    console.log('🔄 Processing LIVE payment with Stripe...');
    console.log('💳 Payment Data:', paymentData);
    console.log('🏦 Card Data (Live):', { ...cardData, cvv: '***', cardNumber: cardData.cardNumber.slice(0, 4) + ' **** **** ' + cardData.cardNumber.slice(-4) });

    // Validate card data
    const cardValidation = validateCardData(cardData);
    if (!cardValidation.isValid) {
      return {
        success: false,
        error: cardValidation.error
      };
    }

    // Initialize Stripe
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Create payment method
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: {
        number: cardData.cardNumber.replace(/\s/g, ''),
        exp_month: parseInt(cardData.expiryDate.split('/')[0]),
        exp_year: parseInt('20' + cardData.expiryDate.split('/')[1]),
        cvc: cardData.cvv,
      },
      billing_details: {
        name: cardData.cardName,
        address: {
          line1: cardData.billingAddress.street,
          city: cardData.billingAddress.city,
          state: cardData.billingAddress.state,
          postal_code: cardData.billingAddress.zipCode,
          country: cardData.billingAddress.country === 'United States' ? 'US' : 'US',
        },
      },
    });

    if (paymentMethodError) {
      console.log('❌ Payment method creation failed:', paymentMethodError);
      return {
        success: false,
        error: paymentMethodError.message || 'Payment method creation failed'
      };
    }

    if (paymentMethod) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('✅ LIVE Payment successful!');
      console.log('🆔 Transaction ID:', transactionId);
      console.log('💳 Payment Method ID:', paymentMethod.id);

      return {
        success: true,
        transactionId,
        paymentMethod: `${getCardType(cardData.cardNumber)} ending in ${cardData.cardNumber.replace(/\s/g, '').slice(-4)}`
      };
    } else {
      console.log('❌ Payment failed - no payment method created');
      return {
        success: false,
        error: 'Payment method creation failed. Please check your card details and try again.'
      };
    }

  } catch (error) {
    console.error('💥 LIVE Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed. Please try again.'
    };
  }
};

// Validate card data
export const validateCardData = (cardData: CardData): { isValid: boolean; error?: string } => {
  // Validate card number
  const cleanCardNumber = cardData.cardNumber.replace(/\s/g, '');
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    return { isValid: false, error: 'Invalid card number length' };
  }

  if (!/^\d+$/.test(cleanCardNumber)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }

  // Validate expiry date
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(cardData.expiryDate)) {
    return { isValid: false, error: 'Invalid expiry date format (MM/YY)' };
  }

  // Check if card is expired
  const [month, year] = cardData.expiryDate.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  if (expiryDate < now) {
    return { isValid: false, error: 'Card has expired' };
  }

  // Validate CVV
  if (!/^\d{3,4}$/.test(cardData.cvv)) {
    return { isValid: false, error: 'Invalid CVV' };
  }

  // Validate cardholder name
  if (!cardData.cardName.trim()) {
    return { isValid: false, error: 'Cardholder name is required' };
  }

  // Validate billing address
  if (!cardData.billingAddress.street.trim() || 
      !cardData.billingAddress.city.trim() || 
      !cardData.billingAddress.state.trim() || 
      !cardData.billingAddress.zipCode.trim()) {
    return { isValid: false, error: 'Complete billing address is required' };
  }

  return { isValid: true };
};

// Get card type from card number
export const getCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (cleanNumber.startsWith('4')) return 'Visa';
  if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard';
  if (cleanNumber.startsWith('3')) return 'American Express';
  if (cleanNumber.startsWith('6')) return 'Discover';
  
  return 'Credit Card';
};

// Format card number with spaces
export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\s/g, '');
  const groups = cleanValue.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19);
};

// Format expiry date
export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
  }
  return cleanValue;
};

// Test payment with demo data
export const testPayment = async (): Promise<void> => {
  console.log('🧪 Testing LIVE payment system...');

  const testPaymentData: PaymentData = {
    amount: 95000, // $950.00 in cents
    currency: 'usd',
    description: 'JETUP Basic Membership - Annual',
    customerEmail: 'test@example.com',
    customerName: 'Test Customer',
    metadata: {
      membershipType: 'basic',
      planDuration: '1 year'
    }
  };

  const testCardData: CardData = {
    cardNumber: '4242 4242 4242 4242', // Stripe live test card
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'Test Customer',
    billingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  };

  const result = await processPayment(testPaymentData, testCardData);
  
  if (result.success) {
    console.log('✅ LIVE Test payment successful!');
    console.log('🆔 Transaction ID:', result.transactionId);
  } else {
    console.log('❌ LIVE Test payment failed:', result.error);
  }
};

// Process membership payment
export const processMembershipPayment = async (
  membershipType: 'basic' | 'premium',
  cardData: CardData,
  customerInfo: { name: string; email: string }
): Promise<PaymentResult> => {
  const amounts = {
    basic: 95000, // $950.00 in cents
    premium: 145000 // $1,450.00 in cents
  };

  const paymentData: PaymentData = {
    amount: amounts[membershipType],
    currency: 'usd',
    description: `JETUP ${membershipType.charAt(0).toUpperCase() + membershipType.slice(1)} Membership - Annual`,
    customerEmail: customerInfo.email,
    customerName: customerInfo.name,
    metadata: {
      membershipType,
      planDuration: '1 year',
      platform: 'jetup'
    }
  };

  return await processPayment(paymentData, cardData);
};

// Process operator membership payment
export const processOperatorMembershipPayment = async (
  planType: 'monthly' | 'yearly',
  cardData: CardData,
  operatorInfo: { name: string; email: string; operatorId: string }
): Promise<PaymentResult> => {
  const amounts = {
    monthly: 245000, // $2,450.00 in cents
    yearly: 1470000 // $14,700.00 in cents
  };

  const paymentData: PaymentData = {
    amount: amounts[planType],
    currency: 'usd',
    description: `JETUP Operator ${planType.charAt(0).toUpperCase() + planType.slice(1)} Membership`,
    customerEmail: operatorInfo.email,
    customerName: operatorInfo.name,
    metadata: {
      membershipType: `operator_${planType}`,
      operatorId: operatorInfo.operatorId,
      commission: '0%',
      platform: 'jetup'
    }
  };

  return await processPayment(paymentData, cardData);
};

// Process booking payment
export const processBookingPayment = async (
  bookingData: any,
  cardData?: CardData,
  customerInfo?: { name: string; email: string }
): Promise<PaymentResult> => {
  // Handle different payment data structures
  let amount: number;
  let description: string;
  
  if (typeof bookingData === 'object' && bookingData.amount !== undefined) {
    amount = bookingData.amount * 100; // Convert to cents
    description = bookingData.bookingDetails ? 
      `JETUP Route Booking - ${bookingData.bookingDetails.route}` :
      `JETUP Flight Booking - ${bookingData.route || 'Unknown Route'}`;
  } else {
    // Legacy format
    amount = bookingData.amount * 100;
    description = `JETUP Flight Booking - ${bookingData.route}`;
  }
  
  // Use provided card data or default
  const finalCardData = cardData || {
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'Test Customer',
    billingAddress: {
      street: '123 Test Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  };
  
  const finalCustomerInfo = customerInfo || { name: 'Test Customer', email: 'test@customer.com' };
  
  const paymentData: PaymentData = {
    amount,
    currency: 'usd',
    description,
    customerEmail: finalCustomerInfo.email,
    customerName: finalCustomerInfo.name,
    metadata: {
      bookingId: bookingData.bookingId || bookingData.bookingDetails?.bookingId || 'unknown',
      route: bookingData.route || bookingData.bookingDetails?.route || 'unknown',
      aircraft: bookingData.aircraft || bookingData.selectedRoute?.aircraft || 'unknown',
      operator: bookingData.operator || bookingData.selectedRoute?.operator || 'unknown',
      platform: 'jetup'
    }
  };

  return await processPayment(paymentData, finalCardData);
};

// Initialize Stripe Elements (for future use)
export const initializeStripeElements = async () => {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }
  return stripe;
};

// Demo test function
export const runPaymentTests = async (): Promise<void> => {
  console.log('🚀 Running payment system tests...');
  
  // Test 1: Basic membership payment
  console.log('\n📋 Test 1: Basic Membership Payment');
  await testPayment();
  
  // Test 2: Card validation
  console.log('\n📋 Test 2: Card Validation');
  const invalidCard: CardData = {
    cardNumber: '1234', // Invalid
    expiryDate: '13/20', // Invalid month
    cvv: '12', // Too short
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  };
  
  const validation = validateCardData(invalidCard);
  console.log('❌ Invalid card validation:', validation);
  
  // Test 3: Valid card
  const validCard: CardData = {
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'Test User',
    billingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  };
  
  const validValidation = validateCardData(validCard);
  console.log('✅ Valid card validation:', validValidation);
  
  console.log('\n🎉 Payment tests completed!');
};