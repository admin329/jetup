import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Edit, Trash2, Check, X, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  isDefault: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const PaymentMethods: React.FC = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolderName: '',
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

  // Mock payment methods - replace with real API data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardNumber: '**** **** **** 1234',
      cardHolderName: 'John Smith',
      expiryDate: '12/26',
      cardType: 'visa',
      isDefault: true,
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      }
    },
    {
      id: '2',
      cardNumber: '**** **** **** 5678',
      cardHolderName: 'John Smith',
      expiryDate: '08/27',
      cardType: 'mastercard',
      isDefault: false,
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      }
    }
  ]);

  const validateCardNumber = (cardNumber: string): string[] => {
    const errors: string[] = [];
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.push('Card number must be between 13-19 digits');
    }
    
    if (!/^\d+$/.test(cleanNumber)) {
      errors.push('Card number must contain only digits');
    }
    
    return errors;
  };

  const getCardType = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    if (cleanNumber.startsWith('6')) return 'discover';
    
    return 'visa'; // default
  };

  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s/g, '');
    const groups = cleanValue.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19); // Max 4 groups of 4 digits
  };

  const maskCardNumber = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const lastFour = cleanNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setCardData({ ...cardData, [name]: formattedValue });
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setCardData({
        ...cardData,
        billingAddress: {
          ...cardData.billingAddress,
          [addressField]: value
        }
      });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate card number
      const cardErrors = validateCardNumber(cardData.cardNumber);
      if (cardErrors.length > 0) {
        alert('Card validation errors:\n' + cardErrors.join('\n'));
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPaymentMethod: PaymentMethod = {
        id: Date.now().toString(),
        cardNumber: maskCardNumber(cardData.cardNumber),
        cardHolderName: cardData.cardHolderName,
        expiryDate: cardData.expiryDate,
        cardType: getCardType(cardData.cardNumber),
        isDefault: paymentMethods.length === 0,
        billingAddress: cardData.billingAddress
      };

      if (editingCard) {
        // Update existing card
        setPaymentMethods(prev => 
          prev.map(card => 
            card.id === editingCard.id 
              ? { ...newPaymentMethod, id: editingCard.id, isDefault: editingCard.isDefault }
              : card
          )
        );
        setShowEditModal(false);
        setEditingCard(null);
      } else {
        // Add new card
        setPaymentMethods(prev => [...prev, newPaymentMethod]);
        setShowAddModal(false);
      }

      // Reset form
      setCardData({
        cardNumber: '',
        cardHolderName: '',
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

      alert(editingCard ? 'Payment method updated successfully!' : 'Payment method added successfully!');
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert('Failed to save payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (card: PaymentMethod) => {
    setEditingCard(card);
    setCardData({
      cardNumber: card.cardNumber,
      cardHolderName: card.cardHolderName,
      expiryDate: card.expiryDate,
      cvv: '',
      billingAddress: card.billingAddress
    });
    setShowEditModal(true);
  };

  const handleDelete = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
      alert('Payment method deleted successfully!');
    }
  };

  const handleSetDefault = (cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    alert('Default payment method updated!');
  };

  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return (
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
            MC
          </div>
        );
      case 'amex':
        return (
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
            AMEX
          </div>
        );
      default:
        return (
          <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">
            CARD
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button
          onClick={() => {
            setEditingCard(null);
            setCardData({
              cardNumber: '',
              cardHolderName: '',
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
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-blue-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Secure Payment Processing</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and securely stored. We never store your CVV.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getCardIcon(card.cardType)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{card.cardNumber}</p>
                    {card.isDefault && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{card.cardHolderName}</p>
                  <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleEdit(card)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={card.isDefault}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Billing Address */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Billing Address</p>
              <p className="text-sm text-gray-600">
                {card.billingAddress.street}, {card.billingAddress.city}, {card.billingAddress.state} {card.billingAddress.zipCode}
              </p>
              <p className="text-sm text-gray-600">{card.billingAddress.country}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12 bg-white rounded-lg shadow"
        >
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Methods</h3>
          <p className="text-gray-600 mb-6">
            Add a payment method to make booking flights easier
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Card
          </button>
        </motion.div>
      )}

      {/* Add/Edit Payment Method Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingCard ? 'Edit Payment Method' : 'Add Payment Method'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingCard(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Card Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={cardData.cardHolderName}
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
                        value={cardData.expiryDate}
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
                        value={cardData.cvv}
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
                      value={cardData.billingAddress.street}
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
                        value={cardData.billingAddress.city}
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
                        value={cardData.billingAddress.state}
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
                        value={cardData.billingAddress.zipCode}
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
                        value={cardData.billingAddress.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-700">
                      Your payment information is encrypted and securely stored. CVV is never saved.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingCard(null);
                    }}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingCard ? 'Update Card' : 'Add Card')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Usage Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">How Payment Methods Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Secure encryption for all transactions</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Default card used for automatic payments</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Easy card management and updates</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Multiple cards for different bookings</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">Instant payment processing</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-700">24/7 fraud protection monitoring</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentMethods;