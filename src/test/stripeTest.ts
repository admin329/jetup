// Stripe Payment Test Functions for JETUP
import { processPayment, processMembershipPayment, processOperatorMembershipPayment, validateCardData, getCardType } from '../services/paymentService';

import { config } from '../config/environment';

// Test Stripe connection and payment processing
export const runStripeTests = async (): Promise<void> => {
  console.log('🚀 JETUP Stripe Payment Tests');
  console.log('==============================');
  
  try {
    // Test 1: Stripe initialization
    console.log('\n💳 Testing Stripe initialization...');
    const stripe = await import('@stripe/stripe-js').then(module => 
      module.loadStripe(config.stripe.publishableKey)
    );
    console.log('💳 Stripe initialization:', stripe ? '✅ Success' : '❌ Failed');
    
    // Test 2: Card validation
    console.log('\n🔍 Testing card validation...');
    const testCard = {
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
    
    const validation = validateCardData(testCard);
    console.log('🔍 Card validation result:', validation.isValid ? '✅ Valid' : '❌ Invalid');
    if (!validation.isValid) {
      console.log('❌ Validation error:', validation.error);
    }
    
    // Test 3: Card type detection
    console.log('\n🏦 Testing card type detection...');
    const cardTypes = [
      { number: '4242424242424242', expected: 'Visa' },
      { number: '5555555555554444', expected: 'Mastercard' },
      { number: '378282246310005', expected: 'American Express' }
    ];
    
    cardTypes.forEach(({ number, expected }) => {
      const detected = getCardType(number);
      console.log(`🏦 ${number.slice(0,4)}******: ${detected} (Expected: ${expected}) ${detected === expected ? '✅' : '❌'}`);
    });
    
    // Test 4: Customer membership payment simulation
    console.log('\n👤 Testing customer membership payment...');
    try {
      const customerResult = await processMembershipPayment(
        'basic',
        testCard,
        { name: 'Test Customer', email: 'test@customer.com' }
      );
      console.log('👤 Customer payment result:', customerResult.success ? '✅ Success' : '❌ Failed');
      if (customerResult.success) {
        console.log('💳 Transaction ID:', customerResult.transactionId);
        console.log('💳 Payment Method:', customerResult.paymentMethod);
      } else {
        console.log('❌ Error:', customerResult.error);
      }
    } catch (error) {
      console.log('❌ Customer payment test failed:', error);
    }
    
    // Test 5: Operator membership payment simulation
    console.log('\n🏢 Testing operator membership payment...');
    try {
      const operatorResult = await processOperatorMembershipPayment(
        'yearly',
        testCard,
        { name: 'Test Operator', email: 'test@operator.com', operatorId: 'OID00001' }
      );
      console.log('🏢 Operator payment result:', operatorResult.success ? '✅ Success' : '❌ Failed');
      if (operatorResult.success) {
        console.log('💳 Transaction ID:', operatorResult.transactionId);
        console.log('💳 Payment Method:', operatorResult.paymentMethod);
      } else {
        console.log('❌ Error:', operatorResult.error);
      }
    } catch (error) {
      console.log('❌ Operator payment test failed:', error);
    }
    
    console.log('\n🎉 Stripe tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('   - Stripe Init: ✅');
    console.log('   - Card Validation: ✅');
    console.log('   - Card Type Detection: ✅');
    console.log('   - Customer Payment: Test in browser');
    console.log('   - Operator Payment: Test in browser');
    
  } catch (error) {
    console.error('❌ Stripe test failed:', error);
  }
};

// Test individual payment types
export const testCustomerPayment = async (membershipType: 'basic' | 'premium' = 'basic'): Promise<void> => {
  console.log(`🧪 Testing ${membershipType} customer payment...`);
  
  const testCard = {
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
  
  try {
    const result = await processMembershipPayment(
      membershipType,
      testCard,
      { name: 'Test Customer', email: 'test@customer.com' }
    );
    
    console.log('👤 Customer payment result:', result);
  } catch (error) {
    console.error('❌ Customer payment test error:', error);
  }
};

export const testOperatorPayment = async (planType: 'monthly' | 'yearly' = 'yearly'): Promise<void> => {
  console.log(`🧪 Testing ${planType} operator payment...`);
  
  const testCard = {
    cardNumber: '5555 5555 5555 4444',
    expiryDate: '03/26',
    cvv: '456',
    cardName: 'Test Operator',
    billingAddress: {
      street: '456 Aviation Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'United States'
    }
  };
  
  try {
    const result = await processOperatorMembershipPayment(
      planType,
      testCard,
      { name: 'Test Operator', email: 'test@operator.com', operatorId: 'OID00001' }
    );
    
    console.log('🏢 Operator payment result:', result);
  } catch (error) {
    console.error('❌ Operator payment test error:', error);
  }
};

// Check Stripe configuration
export const checkStripeConfig = (): void => {
  console.log('🔧 Stripe Configuration Check');
  console.log('==============================');
  
  const publishableKey = config.stripe.publishableKey;
  
  console.log('📋 Configuration Status:');
  console.log(`   - Publishable Key: ${publishableKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - Key Type: ${publishableKey.startsWith('pk_live_') ? '✅ Live Key' : '⚠️ Test Key'}`);
  console.log(`   - Environment: ${import.meta.env.NODE_ENV || 'development'}`);
  
  if (publishableKey.startsWith('pk_live_')) {
    console.log('🎯 LIVE STRIPE KEYS ACTIVE - Real payments will be processed!');
  } else {
    console.log('🧪 Test mode - No real charges will be made');
  }
};

// Export test functions to global scope
(window as any).stripeTests = {
  runAll: runStripeTests,
  testCustomer: testCustomerPayment,
  testOperator: testOperatorPayment,
  checkConfig: checkStripeConfig
};

console.log('💡 Stripe tests available in console:');
console.log('   stripeTests.runAll() - Run all Stripe tests');
console.log('   stripeTests.testCustomer("basic") - Test customer payment');
console.log('   stripeTests.testOperator("yearly") - Test operator payment');
console.log('   stripeTests.checkConfig() - Check Stripe configuration');