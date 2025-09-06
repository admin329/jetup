import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Save, Calendar, Hash, DollarSign, CreditCard, AlertCircle, X, CheckCircle, User, Search, Filter, Eye, Clock, XCircle, Lock, Crown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const InvoiceSending: React.FC = () => {
  const { user, addOperatorInvoice, operatorInvoices } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: '',
    invoiceNumber: '',
    bookingId: '',
    productDescription: '',
    amount: '',
    currency: 'USD',
    paymentMethod: '',
    paymentDetails: '',
    notes: ''
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
  
  const accessStatus = {
    hasMembership: operatorPayment?.status === 'approved',
    hasAOC: user?.hasUploadedAOC && user?.isApprovedByAdmin,
    cancellationLimitReached: (user?.operatorCancellationCount || 0) >= 25,
    membershipStatus: operatorPayment?.status || 'pending',
    hasFullAccess: operatorPayment?.status === 'approved' && user?.hasUploadedAOC && user?.isApprovedByAdmin,
    paymentInfo: operatorPayment
  };

  // Check if operator can send invoices
  const canSendInvoices = () => {
    // Must have approved membership payment
    const hasMembershipApproval = operatorPayment?.status === 'approved';
    
    // Must have approved AOC
    const hasAOCApproval = user?.hasUploadedAOC && user?.isApprovedByAdmin;
    
    return hasMembershipApproval && hasAOCApproval;
  };

  const hasAccess = canSendInvoices();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!hasAccess) return;
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAccess) return;
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!invoiceData.invoiceDate.trim()) {
      alert('Invoice date is required');
      return false;
    }
    
    if (!invoiceData.invoiceNumber.trim()) {
      alert('Invoice number is required');
      return false;
    }
    
    if (!invoiceData.bookingId.trim()) {
      alert('Booking ID is required');
      return false;
    }
    
    if (!invoiceData.productDescription.trim()) {
      alert('Product description is required');
      return false;
    }
    
    if (!invoiceData.amount.trim()) {
      alert('Amount is required');
      return false;
    }
    
    if (!uploadedFile) {
      alert('PDF file upload is required');
      return false;
    }
    
    // Validate amount format
    const amount = parseFloat(invoiceData.amount.replace(/[$,]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasAccess) {
      alert('Access restricted. Please complete membership and AOC approval first.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to send invoice to admin
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create operator invoice object
      const newOperatorInvoice = {
        id: Date.now().toString(),
        invoiceNumber: invoiceData.invoiceNumber,
        operatorName: user?.name || 'Unknown Operator',
        operatorEmail: user?.email || '',
        operatorId: user?.operatorId || 'OID00001',
        invoiceDate: invoiceData.invoiceDate,
        bookingId: invoiceData.bookingId,
        productDescription: invoiceData.productDescription,
        amount: `$${parseFloat(invoiceData.amount.replace(/[$,]/g, '')).toLocaleString()}`,
        currency: invoiceData.currency,
        paymentMethod: invoiceData.paymentMethod,
        paymentDetails: invoiceData.paymentDetails,
        notes: invoiceData.notes,
        attachedFile: uploadedFile.name,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };
      
      // Add to operator invoices (will be visible to admin)
      addOperatorInvoice(newOperatorInvoice);
      
      console.log('Invoice sent to admin:', newOperatorInvoice);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setInvoiceData({
          invoiceDate: '',
          invoiceNumber: '',
          bookingId: '',
          productDescription: '',
          amount: '',
          currency: 'USD',
          paymentMethod: '',
          paymentDetails: '',
          notes: ''
        });
        setUploadedFile(null);
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Parse and format with commas
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAmount(e.target.value);
    setInvoiceData({
      ...invoiceData,
      amount: formattedValue
    });
  };

  // Filter operator's own invoices
  const userInvoices = operatorInvoices.filter(invoice => 
    invoice.operatorEmail === user?.email
  );

  const filteredInvoices = userInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.productDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Access Restriction Notice */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4">
              <Lock className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Access Restricted</h3>
                <p className="text-red-700 mt-1">
                  {accessStatus.cancellationLimitReached 
                    ? 'Invoice sending disabled due to cancellation limit reached (25/25). Contact admin to reset.'
                    : 'You need approved membership and AOC license to send invoices.'
                  }
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      Membership Status: {accessStatus.hasMembership ? '✅ Approved' : '❌ Required'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      AOC License: {accessStatus.hasAOC ? '✅ Approved' : '❌ Required'}
                    </span>
                  </div>
                  {accessStatus.cancellationLimitReached && (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-sm text-red-700">
                        Cancellation Rights: {user?.operatorCancellationCount || 0}/25 (Limit Reached)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2"
            >
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Invoice sent successfully!</span>
            </motion.div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Send Invoice
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Invoice History ({userInvoices.length})
          </button>
        </div>

        {activeTab === 'create' ? (
          <>
            {/* Info Card */}
            {hasAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <User className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Send Invoice to Admin</h3>
                    <p className="text-blue-700 mt-1">
                      Create and send invoices directly to the admin team for processing and payment.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Invoice Form */}
            {hasAccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-lg shadow p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invoice Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        name="invoiceDate"
                        value={invoiceData.invoiceDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Invoice Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., OP-INV-2024-001"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="bookingId"
                        value={invoiceData.bookingId}
                        onChange={handleInputChange}
                        placeholder="e.g., BID00001"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="amount"
                        value={invoiceData.amount}
                        onChange={handleAmountChange}
                        placeholder="25,000"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter amount without $ symbol</p>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Service Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="productDescription"
                    value={invoiceData.productDescription}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the service or product being invoiced..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Payment Information (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method (Optional)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        name="paymentMethod"
                        value={invoiceData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select payment method</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Wire Transfer">Wire Transfer</option>
                        <option value="Check">Check</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={invoiceData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                    </select>
                  </div>
                </div>
                {/* Payment Details (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Details (Optional)
                  </label>
                  <textarea
                    name="paymentDetails"
                    value={invoiceData.paymentDetails}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Additional payment information, terms, or instructions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice PDF Document <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pdf-upload"
                      required
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-1 text-sm font-medium">
                        {uploadedFile ? 'Replace PDF Document' : 'Upload Invoice PDF'}
                        <span className="text-red-500 ml-1">*</span>
                      </p>
                      <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
                    </label>
                    {uploadedFile && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-green-700 font-medium">Selected: {uploadedFile.name}</span>
                        </div>
                        <p className="text-green-600 text-xs mt-1">
                          Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
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
                    value={invoiceData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional information or special instructions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Required Fields Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium">Required Fields</p>
                      <p className="text-amber-700 text-sm mt-1">
                        All fields marked with <span className="text-red-500">*</span> are required. PDF document upload is mandatory.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all data?')) {
                        setInvoiceData({
                          invoiceDate: '',
                          invoiceNumber: '',
                          bookingId: '',
                          productDescription: '',
                          amount: '',
                          currency: 'USD',
                          paymentMethod: '',
                          paymentDetails: '',
                          notes: ''
                        });
                        setUploadedFile(null);
                      }
                    }}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Sending Invoice...' : 'Send Invoice to Admin'}
                  </motion.button>
                </div>
              </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-100 rounded-lg shadow p-8 opacity-50"
              >
                <div className="text-center">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Invoice Sending Restricted</h3>
                  <p className="text-gray-500">
                    Complete membership payment and AOC approval to send invoices
                  </p>
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            {hasAccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Submission Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Include all required booking information</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Upload PDF document with invoice details</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Provide accurate booking ID reference</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Clear product/service description</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Accurate amount and currency</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">Admin will process within 24-48 hours</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Invoice History */}
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Invoices Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="relative px-4 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => {
                        const StatusIcon = getStatusIcon(invoice.status);
                        return (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                  <div className="text-xs text-gray-500">{invoice.operatorId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-blue-600">{invoice.bookingId}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">{invoice.productDescription}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{invoice.amount}</div>
                              <div className="text-xs text-gray-500">{invoice.currency}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                              {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {userInvoices.length === 0 ? 'No invoices sent yet' : 'No invoices found'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Invoice Details</h3>
                  <p className="text-blue-600 font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Invoice Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Invoice Number</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Invoice Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-medium text-blue-600">{selectedInvoice.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.amount} {selectedInvoice.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                        {React.createElement(getStatusIcon(selectedInvoice.status), { className: "h-3 w-3 mr-1" })}
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sent Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Product/Service Description</h4>
                  <p className="text-gray-700">{selectedInvoice.productDescription}</p>
                </div>

                {/* Payment Information */}
                {(selectedInvoice.paymentMethod || selectedInvoice.paymentDetails) && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                    <div className="space-y-3">
                      {selectedInvoice.paymentMethod && (
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-medium text-gray-900">{selectedInvoice.paymentMethod}</p>
                        </div>
                      )}
                      {selectedInvoice.paymentDetails && (
                        <div>
                          <p className="text-sm text-gray-500">Payment Details</p>
                          <p className="text-gray-700">{selectedInvoice.paymentDetails}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Attached File */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Attached Document</h4>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-gray-700">{selectedInvoice.attachedFile}</span>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedInvoice.notes && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-gray-700">{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default InvoiceSending;