import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Star, Shield, Clock, Plane, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { processMembershipPayment, formatCardNumber, formatExpiryDate, getCardType } from '../../services/paymentService';

const MembershipSettings: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  
  // Calculate remaining days and booking count
  const getRemainingDays = () => {
    if (!user?.membershipExpiryDate) return 0;
    const now = new Date();
    const expiryDate = new Date(user.membershipExpiryDate);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  const remainingDays = getRemainingDays();
  const isExpired = remainingDays <= 0;
  const currentBookingCount = user?.bookingCount || 0;
  const bookingLimit = user?.bookingLimit || 10;
  const remainingBookings = Math.max(0, bookingLimit - currentBookingCount);
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const membershipPlans = [
    {
      name: 'Standard',
      price: 'Free',
      period: '30 days',
      description: 'Perfect for first-time users',
      features: [
        'Access to booking platform',
        'Standard customer support',
        'Basic aircraft selection',
        'Mobile app access',
        'No discount on bookings',
        '10 bookings limit',
        '30 days validity'
      ],
      buttonText: 'Free Plan',
      buttonColor: 'bg-gray-600',
      current: !user?.membershipType || user?.membershipType === 'standard',
    },
    {
      name: 'Basic',
      price: '$950',
      period: 'per year',
      description: 'Great for regular travelers',
      features: [
        'Everything in Standard',
        'Priority booking',
        'Extended aircraft selection',
        'Email support',
        '5% discount on all bookings',
        'Flexible cancellation',
        'Unlimited bookings',
        '1 year validity'
      ],
      buttonText: 'Upgrade to Basic',
      buttonColor: 'bg-blue-600',
      current: user?.membershipType === 'basic',
    },
    {
      name: 'Premium',
      price: '$1,450',
      period: 'per year',
      description: 'Ideal for frequent flyers',
      features: [
        'Everything in Basic',
        'Premium aircraft access',
        '24/7 concierge support',
        '10% discount on all bookings',
        'Priority customer service',
        'Exclusive deals and offers',
        'Complimentary upgrades',
        '10 cancellation rights',
        'Unlimited bookings',
        '1 year validity'
      ],
      buttonText: 'Upgrade to Premium',
      buttonColor: 'bg-blue-900',
      popular: true,
      current: user?.membershipType === 'premium',
    },
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Standard') {
      // Free plan, no payment needed
      console.log('Switching to Standard plan');
      return;
    }
    
    setSelectedPlan(planName.toLowerCase() as 'basic' | 'premium');
    setShowPayment(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!selectedPlan || !user) {
        throw new Error('Missing payment information');
      }

      // Process payment with Stripe
      const result = await processMembershipPayment(
        selectedPlan as 'basic' | 'premium',
        paymentData,
        { name: user.name, email: user.email }
      );

      if (result.success) {
        // Update user membership in localStorage
        const updatedUser = {
          ...user,
          membershipType: selectedPlan,
          membershipExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          hasMembership: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert(`✅ Payment successful! Your ${selectedPlan} membership is now active.\nTransaction ID: ${result.transactionId}`);
        
        // Reload page to reflect changes
        window.location.reload();
      } else {
        alert(`❌ Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
    
    setShowPayment(false);
    setSelectedPlan(null);
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      const formattedValue = formatExpiryDate(value);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Membership Settings</h2>
      </div>

      {/* Membership Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-lg shadow p-6 ${
          isExpired ? 'bg-red-50 border border-red-200' : 
          remainingDays <= 7 ? 'bg-yellow-50 border border-yellow-200' : 
          'bg-green-50 border border-green-200'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Crown className={`h-8 w-8 ${
              isExpired ? 'text-red-600' : 
              remainingDays <= 7 ? 'text-yellow-600' : 
              'text-green-600'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              isExpired ? 'text-red-800' : 
              remainingDays <= 7 ? 'text-yellow-800' : 
              'text-green-800'
            }`}>
              {isExpired ? 'Membership Expired' : 
               remainingDays <= 7 ? 'Membership Expiring Soon' : 
               'Active Membership'}
            </h3>
            <div className={`mt-1 space-y-1 ${
              isExpired ? 'text-red-700' : 
              remainingDays <= 7 ? 'text-yellow-700' : 
              'text-green-700'
            }`}>
              <p className="text-sm">
                <strong>Plan:</strong> {user?.membershipType ? user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1) : 'Standard'}
              </p>
              <p className="text-sm">
                <strong>Days Remaining:</strong> {remainingDays} days
              </p>
              {(!user?.membershipType || user?.membershipType === 'standard') && (
                <p className="text-sm">
                  <strong>Bookings Used:</strong> {currentBookingCount} / {bookingLimit}
                  {remainingBookings > 0 ? ` (${remainingBookings} remaining)` : ' (Limit reached)'}
                </p>
              )}
              {(user?.membershipType === 'basic' || user?.membershipType === 'premium') && (
                <p className="text-sm">
                  <strong>Bookings:</strong> Unlimited
                </p>
              )}
            </div>
          </div>
          {(isExpired || (remainingDays <= 7) || (remainingBookings <= 0 && (!user?.membershipType || user?.membershipType === 'standard'))) && (
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  const plansSection = document.getElementById('membership-plans');
                  if (plansSection) {
                    plansSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isExpired ? 'bg-red-600 hover:bg-red-700' : 
                  'bg-yellow-600 hover:bg-yellow-700'
                } text-white`}
              >
                {isExpired ? 'Renew Now' : 'Upgrade Now'}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Current Membership Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Membership: {user?.membershipType ? user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1) : 'None'}
            </h3>
            <p className="text-gray-600">
              {user?.membershipType === 'premium' 
                ? 'You have access to all premium features and benefits'
                : user?.membershipType === 'basic'
                ? 'Upgrade to Premium for additional benefits'
                : 'Choose a membership plan to start booking flights'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Membership Plans - 3 columns in one row */}
      <div id="membership-plans" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {membershipPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl shadow-lg p-8 ${
              plan.popular ? 'ring-2 ring-blue-900' : 'border border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-900 text-white px-4 py-1 text-sm font-medium rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={plan.current}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.current
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : `${plan.buttonColor} text-white hover:opacity-90`
              }`}
            >
              {plan.current ? 'Current Plan' : plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h3>
                <p className="text-gray-600">
                  {selectedPlan === 'basic' ? 'Basic Plan - $950/month' : 'Premium Plan - $1,450/month'}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                  <p className="text-amber-800 text-sm">
                    Payment processing will be implemented with secure API keys
                  </p>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Card Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Card Information</h4>
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                    {paymentData.cardNumber && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs font-medium text-gray-600">
                          {getCardType(paymentData.cardNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Billing Address</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="billingAddress.street"
                      value={paymentData.billingAddress.street}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="billingAddress.city"
                        value={paymentData.billingAddress.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="billingAddress.state"
                        value={paymentData.billingAddress.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="billingAddress.zipCode"
                        value={paymentData.billingAddress.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="billingAddress.country"
                        value={paymentData.billingAddress.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium">{selectedPlan?.charAt(0).toUpperCase() + selectedPlan?.slice(1)} Membership</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">{selectedPlan === 'basic' ? '$950.00' : '$1,450.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Period</span>
                      <span className="font-medium">Annual</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">{selectedPlan === 'basic' ? '$950.00' : '$1,450.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPayment(false);
                      setSelectedPlan(null);
                    }}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${selectedPlan === 'basic' ? '950' : '1,450'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Benefits Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Premium Membership Benefits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Priority Booking</h4>
            <p className="text-sm text-gray-600">Get first access to premium aircraft and preferred time slots</p>
          </div>
          
          <div className="text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">24/7 Concierge</h4>
            <p className="text-sm text-gray-600">Round-the-clock support for all your travel needs</p>
          </div>
          
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Flexible Cancellation</h4>
            <p className="text-sm text-gray-600">Change or cancel bookings with minimal penalties</p>
          </div>
          
          <div className="text-center">
            <Plane className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Premium Fleet</h4>
            <p className="text-sm text-gray-600">Access to the latest and most luxurious aircraft</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipSettings;