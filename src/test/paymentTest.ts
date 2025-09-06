import { runPaymentTests, testPayment, processMembershipPayment, processOperatorMembershipPayment } from '../services/paymentService';

// Test runner for payment system
export const runAllPaymentTests = async (): Promise<void> => {
  console.log('🚀 JETUP LIVE Payment System Tests');
  console.log('================================');
  
  try {
    // Run basic payment tests
    await runPaymentTests();
    
    // Test customer membership payments
    console.log('\n💳 Testing LIVE Customer Membership Payments...');
    
    const testCustomerCard = {
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
    
    // Test Basic membership
    const basicResult = await processMembershipPayment(
      'basic',
      testCustomerCard,
      { name: 'Test Customer', email: 'test@customer.com' }
    );
    console.log('📋 LIVE Basic Membership Result:', basicResult);
    
    // Test Premium membership
    const premiumResult = await processMembershipPayment(
      'premium',
      testCustomerCard,
      { name: 'Test Customer', email: 'test@customer.com' }
    );
    console.log('📋 LIVE Premium Membership Result:', premiumResult);
    
    // Test operator membership payments
    console.log('\n🏢 Testing LIVE Operator Membership Payments...');
    
    const testOperatorCard = {
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
    
    // Test Monthly plan
    const monthlyResult = await processOperatorMembershipPayment(
      'monthly',
      testOperatorCard,
      { name: 'Test Operator', email: 'test@operator.com', operatorId: 'OID00001' }
    );
    console.log('📋 LIVE Monthly Plan Result:', monthlyResult);
    
    // Test Yearly plan
    const yearlyResult = await processOperatorMembershipPayment(
      'yearly',
      testOperatorCard,
      { name: 'Test Operator', email: 'test@operator.com', operatorId: 'OID00001' }
    );
    console.log('📋 LIVE Yearly Plan Result:', yearlyResult);
    
    console.log('\n✅ All LIVE payment tests completed successfully!');
    
  } catch (error) {
    console.error('❌ LIVE Payment test failed:', error);
  }
};

// Individual test functions
export const testCustomerPayment = async (): Promise<void> => {
  console.log('🧪 Testing customer payment...');
  await testPayment();
};

export const testOperatorPayment = async (): Promise<void> => {
  console.log('🧪 Testing operator payment...');
  
  const testCard = {
    cardNumber: '4000 0000 0000 0002',
    expiryDate: '12/25',
    cvv: '123',
    cardName: 'Test Operator',
    billingAddress: {
      street: '123 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  };
  
  const result = await processOperatorMembershipPayment(
    'yearly',
    testCard,
    { name: 'Test Operator', email: 'operator@test.com', operatorId: 'OID00002' }
  );
  
  console.log('🏢 Operator payment result:', result);
};

// Export test functions to global scope for console testing
(window as any).testPayments = {
  runAll: runAllPaymentTests,
  testCustomer: testCustomerPayment,
  testOperator: testOperatorPayment,
  runBasic: runPaymentTests
};

console.log('💡 Payment tests available in console:');
console.log('   testPayments.runAll() - Run all tests');
console.log('   testPayments.testCustomer() - Test customer payment');
console.log('   testPayments.testOperator() - Test operator payment');
console.log('   testPayments.runBasic() - Run basic tests');