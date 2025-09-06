// Email Test Functions for JETUP
import { 
  sendWelcomeEmail, 
  sendLoginVerificationEmail, 
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  testEmailConnection,
  generateVerificationCode,
  generatePasswordResetToken,
  generatePasswordResetLink
} from '../services/emailService';

// Test all email templates
export const runAllEmailTests = async (): Promise<void> => {
  console.log('🚀 JETUP Email System Tests');
  console.log('============================');
  
  try {
    // Test 1: Email service connection
    console.log('\n📡 Testing email service connection...');
    const connectionTest = await testEmailConnection();
    console.log('📡 Connection test result:', connectionTest ? '✅ Connected' : '❌ Failed');
    
    // Test 2: Customer Welcome Email
    console.log('\n📧 Testing Customer Welcome Email...');
    const customerWelcomeResult = await sendWelcomeEmail({
      to_email: 'test@customer.com',
      to_name: 'Test Customer',
      confirmation_link: 'https://jetup.aero/confirm-email?token=demo-token-123',
      user_role: 'customer'
    });
    console.log('📧 Customer welcome result:', customerWelcomeResult ? '✅ Sent' : '❌ Failed');
    
    // Test 3: Operator Welcome Email
    console.log('\n🏢 Testing Operator Welcome Email...');
    const operatorWelcomeResult = await sendWelcomeEmail({
      to_email: 'test@operator.com',
      to_name: 'Test Aviation Ltd.',
      confirmation_link: 'https://jetup.aero/confirm-email?token=demo-operator-token-789',
      user_role: 'operator'
    });
    console.log('🏢 Operator welcome result:', operatorWelcomeResult ? '✅ Sent' : '❌ Failed');
    
    // Test 4: Login Verification Email
    console.log('\n🔐 Testing Login Verification Email...');
    const verificationCode = generateVerificationCode();
    const loginVerificationResult = await sendLoginVerificationEmail({
      to_email: 'test@customer.com',
      to_name: 'Test Customer',
      verification_code: verificationCode
    });
    console.log('🔐 Login verification result:', loginVerificationResult ? '✅ Sent' : '❌ Failed');
    console.log('🔐 Generated code:', verificationCode);
    
    // Test 5: Password Reset Email
    console.log('\n🔑 Testing Password Reset Email...');
    const resetToken = generatePasswordResetToken();
    const resetLink = generatePasswordResetLink(resetToken);
    const passwordResetResult = await sendPasswordResetEmail({
      to_email: 'test@customer.com',
      to_name: 'Test Customer',
      reset_link: resetLink,
      user_role: 'customer'
    });
    console.log('🔑 Password reset result:', passwordResetResult ? '✅ Sent' : '❌ Failed');
    console.log('🔑 Reset link:', resetLink);
    
    // Test 6: Booking Confirmation Email
    console.log('\n✈️ Testing Booking Confirmation Email...');
    const bookingConfirmationResult = await sendBookingConfirmationEmail({
      to_email: 'test@customer.com',
      to_name: 'Test Customer',
      booking_number: 'BID00001',
      route: 'New York → Los Angeles',
      departure_date: '2024-04-15',
      aircraft: 'Gulfstream G650',
      amount: '$25,000'
    });
    console.log('✈️ Booking confirmation result:', bookingConfirmationResult ? '✅ Sent' : '❌ Failed');
    
    console.log('\n🎉 All email tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('   - Connection:', connectionTest ? '✅' : '❌');
    console.log('   - Customer Welcome:', customerWelcomeResult ? '✅' : '❌');
    console.log('   - Operator Welcome:', operatorWelcomeResult ? '✅' : '❌');
    console.log('   - Login Verification:', loginVerificationResult ? '✅' : '❌');
    console.log('   - Password Reset:', passwordResetResult ? '✅' : '❌');
    console.log('   - Booking Confirmation:', bookingConfirmationResult ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
};

// Individual test functions
export const testCustomerWelcomeEmail = async (): Promise<void> => {
  console.log('🧪 Testing Customer Welcome Email...');
  
  const result = await sendWelcomeEmail({
    to_email: 'test@customer.com',
    to_name: 'John Smith',
    confirmation_link: 'https://jetup.aero/confirm-email?token=demo-customer-token',
    user_role: 'customer'
  });
  
  console.log('📧 Customer welcome email result:', result ? '✅ Success' : '❌ Failed');
};

export const testOperatorWelcomeEmail = async (): Promise<void> => {
  console.log('🧪 Testing Operator Welcome Email...');
  
  const result = await sendWelcomeEmail({
    to_email: 'test@operator.com',
    to_name: 'Premium Aviation Ltd.',
    confirmation_link: 'https://jetup.aero/confirm-email?token=demo-operator-token',
    user_role: 'operator'
  });
  
  console.log('🏢 Operator welcome email result:', result ? '✅ Success' : '❌ Failed');
};

export const testLoginVerificationEmail = async (): Promise<void> => {
  console.log('🧪 Testing Login Verification Email...');
  
  const verificationCode = generateVerificationCode();
  const result = await sendLoginVerificationEmail({
    to_email: 'test@customer.com',
    to_name: 'John Smith',
    verification_code: verificationCode
  });
  
  console.log('🔐 Login verification email result:', result ? '✅ Success' : '❌ Failed');
  console.log('🔐 Verification code:', verificationCode);
};

export const testPasswordResetEmail = async (): Promise<void> => {
  console.log('🧪 Testing Password Reset Email...');
  
  const resetToken = generatePasswordResetToken();
  const resetLink = generatePasswordResetLink(resetToken);
  
  const result = await sendPasswordResetEmail({
    to_email: 'test@customer.com',
    to_name: 'John Smith',
    reset_link: resetLink,
    user_role: 'customer'
  });
  
  console.log('🔑 Password reset email result:', result ? '✅ Success' : '❌ Failed');
  console.log('🔑 Reset link:', resetLink);
};

export const testBookingConfirmationEmail = async (): Promise<void> => {
  console.log('🧪 Testing Booking Confirmation Email...');
  
  const result = await sendBookingConfirmationEmail({
    to_email: 'test@customer.com',
    to_name: 'John Smith',
    booking_number: 'BID00001',
    route: 'New York → Los Angeles',
    departure_date: '2024-04-15',
    aircraft: 'Gulfstream G650',
    amount: '$25,000'
  });
  
  console.log('✈️ Booking confirmation email result:', result ? '✅ Success' : '❌ Failed');
};

// Test with real email addresses
export const testWithRealEmail = async (email: string): Promise<void> => {
  console.log(`🧪 Testing with real email: ${email}`);
  
  try {
    // Test customer welcome
    const welcomeResult = await sendWelcomeEmail({
      to_email: email,
      to_name: 'Test User',
      confirmation_link: 'https://jetup.aero/confirm-email?token=real-test-token',
      user_role: 'customer'
    });
    
    console.log('📧 Real email test result:', welcomeResult ? '✅ Success' : '❌ Failed');
    
    if (welcomeResult) {
      console.log(`✅ Email sent successfully to ${email}!`);
      console.log('📬 Check your inbox and spam folder');
    } else {
      console.log(`❌ Failed to send email to ${email}`);
    }
    
  } catch (error) {
    console.error('❌ Real email test error:', error);
  }
};

// Export test functions to global scope for console testing
(window as any).emailTests = {
  runAll: runAllEmailTests,
  testCustomerWelcome: testCustomerWelcomeEmail,
  testOperatorWelcome: testOperatorWelcomeEmail,
  testLoginVerification: testLoginVerificationEmail,
  testPasswordReset: testPasswordResetEmail,
  testBookingConfirmation: testBookingConfirmationEmail,
  testWithRealEmail: testWithRealEmail
};

console.log('💡 Email tests available in console:');
console.log('   emailTests.runAll() - Run all email tests');
console.log('   emailTests.testCustomerWelcome() - Test customer welcome');
console.log('   emailTests.testOperatorWelcome() - Test operator welcome');
console.log('   emailTests.testLoginVerification() - Test 2FA code');
console.log('   emailTests.testPasswordReset() - Test password reset');
console.log('   emailTests.testBookingConfirmation() - Test booking confirmation');
console.log('   emailTests.testWithRealEmail("your@email.com") - Test with real email');