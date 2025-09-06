import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Upload,
  Shield,
  ArrowRight,
  Banknote,
  Crown,
  DollarSign,
  Users,
  Star,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { processOperatorMembershipPayment, formatCardNumber, formatExpiryDate, getCardType } from '../../services/paymentService';

interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  commission: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const MembershipManagement: React.FC = () => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank_transfer'>('online');
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [onlinePaymentData, setOnlinePaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const [bankTransferData, setBankTransferData] = useState({
    transferAmount: '',
    transferDate: '',
    referenceNumber: '',
    senderName: '',
    senderBank: '',
    notes: '',
    receiptFile: null as File | null
  });

  // Get operator's membership payment info
  const getOperatorPaymentInfo = () => {
    try {
      const membershipPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
      return membershipPayments.find((payment: any) => payment.operatorEmail === user?.email);
    } catch (error) {
      return null;
    }
  };

  const operatorPayment = getOperatorPaymentInfo();

  // Calculate membership status
  const getMembershipStatus = () => {
    if (operatorPayment?.status === 'approved') {
      // Calculate days remaining based on plan
      const approvedDate = new Date(operatorPayment.approvedAt);
      const expiryDate = new Date(approvedDate);
      
      if (operatorPayment.planName === 'Monthly Plan') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }
      
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        status: diffDays <= 0 ? 'expired' : diffDays <= 7 ? 'expiring' : 'active',
        daysRemaining: Math.max(0, diffDays),
        expiryDate: expiryDate,
        plan: operatorPayment.planName,
        commission: '0%'
      };
    }
    
    return {
      status: 'no_membership',
      daysRemaining: 0,
      expiryDate: null,
      plan: 'No Active Plan',
      commission: 'N/A'
    };
  };

  const membershipStatus = getMembershipStatus();

  const membershipPlans: MembershipPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$2,450',
      period: 'per month',
      commission: '0%',
      features: [
        '0% commission on all bookings',
        'Add unlimited aircraft',
        'Create popular routes',
        'Receive booking requests',
        'Respond to customer inquiries',
        'Advanced analytics & reporting',
        'API access for integrations',
        '24/7 support Solutions'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$14,700',
      period: 'per year',
      commission: '0%',
      features: [
        '0% commission on all bookings',
        'Add unlimited aircraft',
        'Create popular routes',
        'Receive booking requests',
        'Respond to customer inquiries',
        'Advanced analytics & reporting',
        'API access for integrations',
        '24/7 support Solutions'
      ],
      popular: true,
      savings: '50% OFF - Save $14,700'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': 
        return membershipStatus.daysRemaining <= 7 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';
      case 'expiring': 
        return 'bg-yellow-50 border-yellow-200';
      case 'expired': 
        return 'bg-red-50 border-red-200';
      default: 
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active': 
        return membershipStatus.daysRemaining <= 7 ? 'text-yellow-800' : 'text-green-800';
      case 'expiring': 
        return 'text-yellow-800';
      case 'expired': 
        return 'text-red-800';
      default: 
        return 'text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': 
        return membershipStatus.daysRemaining <= 7 ? AlertCircle : Crown;
      case 'expiring': 
        return AlertCircle;
      case 'expired': 
        return XCircle;
      default: 
        return AlertCircle;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': 
        return membershipStatus.daysRemaining <= 7 ? 'Membership Expiring Soon' : 'Active Membership';
      case 'expiring': 
        return 'Membership Expiring Soon';
      case 'expired': 
        return 'Membership Expired';
      case 'no_membership':
        return 'No Active Membership';
      default: 
        return 'Unknown Status';
    }
  };

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
    
    // Set transfer amount for bank transfer
    const amount = plan.price.replace(/[$,]/g, '');
    setBankTransferData(prev => ({
      ...prev,
      transferAmount: amount
    }));
  };

  const handleOnlinePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setOnlinePaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      const formattedValue = formatExpiryDate(value);
      setOnlinePaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setOnlinePaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setOnlinePaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBankTransferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBankTransferData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setBankTransferData(prev => ({
        ...prev,
        receiptFile: file
      }));
    } else {
      alert('Please upload a PDF or image file (JPG, PNG).');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'online') {
        // Process online payment with Stripe
        const result = await processOperatorMembershipPayment(
          selectedPlan?.id === 'monthly' ? 'monthly' : 'yearly',
          onlinePaymentData,
          { 
            name: user?.name || 'Unknown Operator', 
            email: user?.email || '', 
            operatorId: user?.operatorId || 'OID00001' 
          }
        );

        if (result.success) {
          // Create payment record for admin review
          const paymentRecord = {
            id: Date.now().toString(),
            operatorId: user?.operatorId || 'OID00001',
            operatorName: user?.name || 'Unknown Operator',
            operatorEmail: user?.email || '',
            planName: selectedPlan?.name || '',
            amount: selectedPlan?.price || '',
            paymentMethod: 'Credit Card',
            cardNumber: `**** **** **** ${onlinePaymentData.cardNumber.slice(-4)}`,
            cardName: onlinePaymentData.cardName,
            billingAddress: onlinePaymentData.billingAddress,
            status: 'approved', // Auto-approve for successful online payments
            createdAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            transactionId: result.transactionId
          };

          // Save to localStorage
          const existingPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
          existingPayments.push(paymentRecord);
          localStorage.setItem('operatorMembershipPayments', JSON.stringify(existingPayments));

          alert(`✅ Payment successful! Your ${selectedPlan?.name} is now active.\nTransaction ID: ${result.transactionId}`);
          
          // Reload page to reflect changes
          window.location.reload();
        } else {
          alert(`❌ Payment failed: ${result.error}`);
          setIsSubmitting(false);
          return;
        }
      } else {
        // Validate bank transfer data
        if (!bankTransferData.transferAmount || !bankTransferData.transferDate || 
            !bankTransferData.referenceNumber || !bankTransferData.receiptFile) {
          alert('Please fill in all required fields and upload receipt');
          setIsSubmitting(false);
          return;
        }

        // Create bank transfer record
        const paymentRecord = {
          id: Date.now().toString(),
          operatorId: user?.operatorId || 'OID00001',
          operatorName: user?.name || 'Unknown Operator',
          operatorEmail: user?.email || '',
          planName: selectedPlan?.name || '',
          amount: selectedPlan?.price || '',
          paymentMethod: 'Bank Transfer',
          transferDate: bankTransferData.transferDate,
          referenceNumber: bankTransferData.referenceNumber,
          senderName: bankTransferData.senderName,
          senderBank: bankTransferData.senderBank,
          notes: bankTransferData.notes,
          receiptFile: bankTransferData.receiptFile.name,
          receiptSize: `${(bankTransferData.receiptFile.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'pending_admin_approval',
          createdAt: new Date().toISOString()
        };

        // Save to localStorage for admin review
        const existingPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
        existingPayments.push(paymentRecord);
        localStorage.setItem('operatorMembershipPayments', JSON.stringify(existingPayments));

        alert('Bank transfer details submitted successfully! Your payment will be reviewed by our admin team within 24-48 hours.');
      }

      // Reset forms and close modal
      setShowPayment(false);
      setSelectedPlan(null);
      setOnlinePaymentData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      });
      setBankTransferData({
        transferAmount: '',
        transferDate: '',
        referenceNumber: '',
        senderName: '',
        senderBank: '',
        notes: '',
        receiptFile: null
      });

    } catch (error) {
      console.error('Payment submission failed:', error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusIcon = getStatusIcon(membershipStatus.status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Membership Management</h1>
          <p className="text-gray-600">Manage your operator membership and billing</p>
        </div>
      </div>

      {/* Current Membership Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-lg border p-6 ${getStatusColor(membershipStatus.status)}`}
      >
        <div className="flex items-center space-x-4 mb-6">
          <StatusIcon className={`h-8 w-8 ${getStatusTextColor(membershipStatus.status)}`} />
          <div>
            <h2 className={`text-xl font-semibold ${getStatusTextColor(membershipStatus.status)}`}>
              {getStatusText(membershipStatus.status)}
            </h2>
            <p className={`${getStatusTextColor(membershipStatus.status)} mt-1`}>
              {membershipStatus.status === 'active' && membershipStatus.daysRemaining <= 7
                ? `Your membership expires in ${membershipStatus.daysRemaining} days`
                : membershipStatus.status === 'expired'
                ? 'Your membership has expired. Renew to continue receiving bookings.'
                : membershipStatus.status === 'no_membership'
                ? 'You need an active membership to receive booking requests.'
                : 'Your membership is active and all features are available.'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-semibold text-gray-900">{membershipStatus.plan}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Days Remaining</p>
              <p className="font-semibold text-gray-900">{membershipStatus.daysRemaining} days</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commission Rate</p>
              <p className="font-semibold text-gray-900">{membershipStatus.commission}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expires On</p>
              <p className="font-semibold text-gray-900">
                {membershipStatus.expiryDate ? membershipStatus.expiryDate.toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {(membershipStatus.status === 'expired' || membershipStatus.daysRemaining <= 7 || membershipStatus.status === 'no_membership') && (
          <div className="mt-6 flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {membershipStatus.status === 'expired' ? 'Membership Expired' : 
                   membershipStatus.status === 'no_membership' ? 'No Active Membership' : 'Membership Expiring Soon'}
                </p>
                <p className="text-sm text-yellow-600">
                  {membershipStatus.status === 'expired' 
                    ? 'Renew your membership to continue receiving bookings'
                    : membershipStatus.status === 'no_membership'
                    ? 'Choose a membership plan to start receiving booking requests'
                    : `Your membership expires in ${membershipStatus.daysRemaining} days`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const plansSection = document.getElementById('membership-plans');
                if (plansSection) {
                  plansSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {membershipStatus.status === 'expired' ? 'Renew Now' : 
               membershipStatus.status === 'no_membership' ? 'Choose Plan' : 'Extend Now'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Membership Plans */}
      <div id="membership-plans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-red-500' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-red-600 text-white px-4 py-1 text-sm font-bold rounded-full border-2 border-red-700 shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  {plan.id === 'monthly' && (
                    <p className="text-green-600 font-medium mt-2">Getting started</p>
                  )}
                  {plan.savings && (
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-sm">!</span>
                        </div>
                        <span className="text-red-600 font-bold text-lg">{plan.savings}</span>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Commission Rate:</span> {plan.commission}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                     <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${
                       plan.popular ? 'text-red-500' : 'text-green-500'
                     }`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-white ${
                    plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Select {plan.name}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Information</h3>
                  <p className="text-gray-600">{selectedPlan.name} - {selectedPlan.price}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setSelectedPlan(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                    paymentMethod === 'online'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Online Payment</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Bank Transfer</span>
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {paymentMethod === 'online' ? (
                  /* Online Payment Form */
                  <div className="space-y-6">
                    {/* Card Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Card Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={onlinePaymentData.cardNumber}
                            onChange={handleOnlinePaymentChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          {onlinePaymentData.cardNumber && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <span className="text-xs font-medium text-gray-600">
                                {getCardType(onlinePaymentData.cardNumber)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={onlinePaymentData.cardName}
                            onChange={handleOnlinePaymentChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={onlinePaymentData.expiryDate}
                            onChange={handleOnlinePaymentChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={onlinePaymentData.cvv}
                            onChange={handleOnlinePaymentChange}
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
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="billingAddress.street"
                          value={onlinePaymentData.billingAddress.street}
                          onChange={handleOnlinePaymentChange}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billingAddress.city"
                            value={onlinePaymentData.billingAddress.city}
                            onChange={handleOnlinePaymentChange}
                            placeholder="New York"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billingAddress.state"
                            value={onlinePaymentData.billingAddress.state}
                            onChange={handleOnlinePaymentChange}
                            placeholder="NY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="billingAddress.zipCode"
                            value={onlinePaymentData.billingAddress.zipCode}
                            onChange={handleOnlinePaymentChange}
                            placeholder="10001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="billingAddress.country"
                            value={onlinePaymentData.billingAddress.country}
                            onChange={handleOnlinePaymentChange}
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

                    {/* Security Notice */}
                    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-800">
                        Your payment information is encrypted and secure. All transactions are processed securely.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Bank Transfer Form */
                  <div className="space-y-6">
                    {/* JETUP Bank Details */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">JETUP Bank Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Bank Name:</p>
                          <p className="font-medium">Column National Association</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account Number:</p>
                          <p className="font-medium">797990115603522</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Routing Number:</p>
                          <p className="font-medium">084009519</p>
                          <p className="text-xs text-gray-500">For ACH and wire transfers</p>
                        </div>
                        <div>
                          <p className="text-gray-600">SWIFT Code:</p>
                          <p className="font-medium">TRWIUS35XXX</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Account Holder:</p>
                          <p className="font-medium">JETUP LTD</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bank Address:</p>
                          <p className="font-medium">108 W 13th St, Wilmington, DE 19801, United States</p>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transfer Amount <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="transferAmount"
                          value={selectedPlan.price}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transfer Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="transferDate"
                          value={bankTransferData.transferDate}
                          onChange={handleBankTransferChange}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="referenceNumber"
                          value={bankTransferData.referenceNumber}
                          onChange={handleBankTransferChange}
                          placeholder="REF123456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Sender Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sender Name (Optional)
                        </label>
                        <input
                          type="text"
                          name="senderName"
                          value={bankTransferData.senderName}
                          onChange={handleBankTransferChange}
                          placeholder="Name on sender account"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sender Bank (Optional)
                        </label>
                        <input
                          type="text"
                          name="senderBank"
                          value={bankTransferData.senderBank}
                          onChange={handleBankTransferChange}
                          placeholder="Bank name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Receipt Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Receipt <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="receipt-upload"
                          required
                        />
                        <label
                          htmlFor="receipt-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-gray-600 mb-1 text-sm font-medium">
                            {bankTransferData.receiptFile ? 'Replace Receipt' : 'Upload Payment Receipt'}
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                        </label>
                        {bankTransferData.receiptFile && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-green-700 font-medium">Selected: {bankTransferData.receiptFile.name}</span>
                            </div>
                            <p className="text-green-600 text-xs mt-1">
                              Size: {(bankTransferData.receiptFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={bankTransferData.notes}
                        onChange={handleBankTransferChange}
                        rows={3}
                        placeholder="Any additional information about the transfer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      />
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Rate</span>
                      <span className="font-medium">{selectedPlan.commission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Period</span>
                      <span className="font-medium">{selectedPlan.period.replace('per ', '')}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">{selectedPlan.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Approval Notice */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Admin Approval Required</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        All membership payments require admin approval. You will receive a confirmation email 
                        within 24-48 hours after your payment is reviewed and approved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPayment(false);
                      setSelectedPlan(null);
                    }}
                    className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : paymentMethod === 'online' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span className="ml-2">Pay {selectedPlan?.price}</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="w-5 h-5" />
                        <span className="ml-2">Submit Transfer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MembershipManagement;