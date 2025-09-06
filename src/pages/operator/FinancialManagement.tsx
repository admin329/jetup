import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Ban as Bank, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FinancialManagement: React.FC = () => {
  const { user } = useAuth();
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState<any>(null);
  const [bankData, setBankData] = useState({
    bankName: '',
    accountNumber: '',
    ibanNumber: '',
    routingNumber: '',
    accountHolderName: '',
    swiftCode: '',
    currency: 'USD'
  });

  // Mock financial data - replace with real API data
  const financialStats = [
    { name: 'Total Sales Revenue', value: '$156,000', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Tax Amount', value: '$23,400', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Commission', value: user?.membershipType === 'yearly' ? '$0' : '$7,800', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Total Payout', value: '$124,800', icon: Bank, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  // Mock bank accounts data
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      accountHolderName: 'Premium Aviation Ltd.',
      isDefault: true,
      currency: 'USD'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankData({
      ...bankData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddBank = () => {
    // Add new bank account logic
    const newBank = {
      id: Date.now().toString(),
      ...bankData,
      accountNumber: `****${bankData.accountNumber.slice(-4)}`,
      isDefault: bankAccounts.length === 0,
      currency: bankData.currency
    };
    setBankAccounts([...bankAccounts, newBank]);
    setBankData({
      bankName: '',
      accountNumber: '',
      ibanNumber: '',
      routingNumber: '',
      accountHolderName: '',
      swiftCode: '',
      currency: 'USD'
    });
    setShowAddBankModal(false);
  };

  const handleEditBank = (bank: any) => {
    setEditingBank(bank);
    setBankData({
      bankName: bank.bankName,
      accountNumber: '',
      ibanNumber: '',
      routingNumber: '',
      accountHolderName: bank.accountHolderName,
      swiftCode: '',
      currency: bank.currency || 'USD'
    });
    setShowAddBankModal(true);
  };

  const handleDeleteBank = (bankId: string) => {
    setBankAccounts(bankAccounts.filter(bank => bank.id !== bankId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Commission Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Information</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Membership</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {user?.membershipType || 'No membership'} Plan
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Commission Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              0%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bank Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Bank Accounts</h3>
            <button
              onClick={() => {
                setEditingBank(null);
                setBankData({
                  bankName: '',
                  accountNumber: '',
                  ibanNumber: '',
                  routingNumber: '',
                  accountHolderName: '',
                  swiftCode: '',
                  currency: 'USD'
                });
                setShowAddBankModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </button>
          </div>
        </div>

        <div className="p-6">
          {bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((bank) => (
                <div key={bank.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <Bank className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bank.bankName}</p>
                      <p className="text-sm text-gray-600">{bank.accountNumber}</p>
                        <div className="text-sm text-gray-500">{bank.currency}</div>
                      <p className="text-sm text-gray-600">{bank.accountHolderName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {bank.isDefault && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                    <button
                      onClick={() => handleEditBank(bank)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBank(bank.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bank accounts added yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add/Edit Bank Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={bankData.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g., Chase Bank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={bankData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Account holder full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Number</label>
                <input
                  type="text"
                  name="ibanNumber"
                  value={bankData.ibanNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., GB29 NWBK 6016 1331 9268 19"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={bankData.routingNumber}
                  onChange={handleInputChange}
                  placeholder="Routing number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT Code (Optional)</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={bankData.swiftCode}
                  onChange={handleInputChange}
                  placeholder="SWIFT code for international transfers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={bankData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddBankModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBank}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingBank ? 'Update Account' : 'Add Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;