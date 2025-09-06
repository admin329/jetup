import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Building, Calendar, Eye, X, CheckCircle, XCircle, Shield, AlertCircle, Phone, Mail, MapPin, User, Crown, Download, FileText, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OperatorManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { updateUserApprovalStatus } = useAuth();
  const [membershipPayments, setMembershipPayments] = useState(() => {
    // Load membership payments from localStorage
    try {
      const saved = localStorage.getItem('operatorMembershipPayments');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading membership payments:', error);
      return [];
    }
  });

  const operators = [
    {
      id: '1',
      operatorId: 'OID00001',
      name: 'Premium Aviation Ltd.',
      email: 'contact@premiumaviation.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Aviation Blvd',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'United States'
      },
      membership: 'Yearly',
      aircraftCount: 5,
      totalBookings: 48,
      revenue: '$1,240,000',
      joinDate: '2023-08-15',
      status: 'Active',
      hasUploadedAOC: true,
      aocApprovalStatus: 'approved',
      aocDocumentUrl: '/mock-aoc-document.pdf'
    },
    {
      id: '2',
      operatorId: 'OID00002',
      name: 'Elite Jets Inc.',
      email: 'info@elitejets.com',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Airport Way',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      },
      membership: 'Monthly',
      aircraftCount: 3,
      totalBookings: 22,
      revenue: '$580,000',
      joinDate: '2024-01-10',
      status: 'Active',
      hasUploadedAOC: true,
      aocApprovalStatus: 'pending',
      aocDocumentUrl: '/mock-aoc-document-2.pdf'
    },
    {
      id: '3',
      operatorId: 'OID00003',
      name: 'Luxury Air Services',
      email: 'hello@luxuryair.com',
      phone: '+1 (555) 456-7890',
      address: {
        street: '789 Hangar Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      membership: 'Yearly',
      aircraftCount: 8,
      totalBookings: 67,
      revenue: '$1,890,000',
      joinDate: '2023-05-20',
      status: 'Active',
      hasUploadedAOC: false,
      aocApprovalStatus: 'incomplete',
      aocDocumentUrl: null
    },
  ];

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOperator = (operator: any) => {
    setSelectedOperator(operator);
    setShowDetailModal(true);
  };

  const handleApproveAOC = (operatorId: string) => {
    if (window.confirm('Are you sure you want to approve this operator\'s AOC license?')) {
      try {
        console.log(`Approving AOC for operator: ${operatorId}`);
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'aoc', true);
        
        alert('AOC license approved successfully! Operator now has access to all features.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error approving AOC:', error);
        alert('Failed to approve AOC. Please try again.');
      }
    }
  };

  const handleRejectAOC = (operatorId: string) => {
    if (window.confirm('Are you sure you want to reject this operator\'s AOC license?')) {
      try {
        console.log(`Rejecting AOC for operator: ${operatorId}`);
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'aoc', false);
        
        alert('AOC license rejected. Operator will be notified.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error rejecting AOC:', error);
        alert('Failed to reject AOC. Please try again.');
      }
    }
  };

  const handleApproveMembership = (operatorId: string, paymentId: string) => {
    if (window.confirm('Are you sure you want to approve this operator membership payment?')) {
      try {
        // Update payment status
        const updatedPayments = membershipPayments.map((payment: any) => 
          payment.id === paymentId 
            ? { ...payment, status: 'approved', approvedAt: new Date().toISOString() }
            : payment
        );
        setMembershipPayments(updatedPayments);
        localStorage.setItem('operatorMembershipPayments', JSON.stringify(updatedPayments));
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'membership', true, paymentId);
        
        alert('Operator membership approved successfully! Operator now has full access to all features.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error approving membership:', error);
        alert('Failed to approve membership. Please try again.');
      }
    }
  };

  const handleRejectMembership = (operatorId: string, paymentId: string) => {
    if (window.confirm('Are you sure you want to reject this operator membership payment?')) {
      try {
        // Update payment status
        const updatedPayments = membershipPayments.map((payment: any) => 
          payment.id === paymentId 
            ? { ...payment, status: 'rejected', rejectedAt: new Date().toISOString() }
            : payment
        );
        setMembershipPayments(updatedPayments);
        localStorage.setItem('operatorMembershipPayments', JSON.stringify(updatedPayments));
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'membership', false, paymentId);
        
        alert('Operator membership payment rejected. Operator will be notified.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error rejecting membership:', error);
        alert('Failed to reject membership. Please try again.');
      }
    }
  };

  const handleApproveAgreement = (operatorId: string, agreementId: string) => {
    if (window.confirm('Are you sure you want to approve this operator service agreement?')) {
      try {
        // Update agreement status
        const existingAgreements = JSON.parse(localStorage.getItem('operatorAgreements') || '[]');
        const updatedAgreements = existingAgreements.map((agreement: any) => 
          agreement.id === agreementId 
            ? { ...agreement, status: 'approved', approvedAt: new Date().toISOString() }
            : agreement
        );
        localStorage.setItem('operatorAgreements', JSON.stringify(updatedAgreements));
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'agreement', true, agreementId);
        
        alert('Service agreement approved successfully! Operator now has full access to all features.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error approving agreement:', error);
        alert('Failed to approve agreement. Please try again.');
      }
    }
  };

  const handleRejectAgreement = (operatorId: string, agreementId: string) => {
    if (window.confirm('Are you sure you want to reject this operator service agreement?')) {
      try {
        // Update agreement status
        const existingAgreements = JSON.parse(localStorage.getItem('operatorAgreements') || '[]');
        const updatedAgreements = existingAgreements.map((agreement: any) => 
          agreement.id === agreementId 
            ? { ...agreement, status: 'rejected', rejectedAt: new Date().toISOString() }
            : agreement
        );
        localStorage.setItem('operatorAgreements', JSON.stringify(updatedAgreements));
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedOperator.operatorId, 'operator', 'agreement', false, agreementId);
        
        alert('Service agreement rejected. Operator was notified to resubmit.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error rejecting agreement:', error);
        alert('Failed to reject agreement. Please try again.');
      }
    }
  };

  const handleResetCancellationRights = (operatorEmail: string) => {
    if (window.confirm('Are you sure you want to reset this operator\'s cancellation rights? This will set their count back to 0.')) {
      try {
        // Reset cancellation count in user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) => 
          user.email === operatorEmail 
            ? { ...user, operatorCancellationCount: 0 }
            : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        alert('Cancellation rights reset successfully! Operator now has 25/25 rights available.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error resetting cancellation rights:', error);
        alert('Failed to reset cancellation rights. Please try again.');
      }
    }
  };

  // Get operator's agreement status
  const getOperatorAgreementInfo = (operatorId: string) => {
    try {
      const agreements = JSON.parse(localStorage.getItem('operatorAgreements') || '[]');
      return agreements.find((agreement: any) => agreement.operatorId === operatorId);
    } catch (error) {
      return null;
    }
  };
  
  const handleDownloadReceipt = (payment: any) => {
    // Simulate receipt download
    alert(`Downloading payment receipt: ${payment.receiptFile}`);
  };

  // Get operator's membership payment info
  const getOperatorPaymentInfo = (operatorId: string) => {
    return membershipPayments.find((payment: any) => payment.operatorId === operatorId);
  };

  const getAOCStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'AOC Approved',
          message: 'Operator can receive booking requests'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'AOC Pending Review',
          message: 'Waiting for admin approval'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'AOC Rejected',
          message: 'Operator needs to update AOC document'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'AOC Not Uploaded',
          message: 'Operator needs to upload AOC license'
        };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Operator Management</h2>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search operators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Operators Table */}
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
                  Operator
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aircraft
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AOC Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-3 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOperators.map((operator) => (
                <tr key={operator.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          operator.aocApprovalStatus === 'approved' 
                            ? 'bg-green-100' 
                            : operator.aocApprovalStatus === 'pending'
                            ? 'bg-yellow-100'
                            : operator.aocApprovalStatus === 'rejected'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <Building className={`h-5 w-5 ${
                            operator.aocApprovalStatus === 'approved' 
                              ? 'text-green-600' 
                              : operator.aocApprovalStatus === 'pending'
                              ? 'text-yellow-600'
                              : operator.aocApprovalStatus === 'rejected'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 max-w-[150px] truncate">{operator.name}</div>
                        <div className="text-sm text-gray-500 max-w-[150px] truncate">{operator.email}</div>
                        <div className="text-xs text-blue-600 font-medium">{operator.operatorId}</div>
                        <div className="flex items-center mt-1">
                          {operator.hasUploadedAOC ? (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              operator.aocApprovalStatus === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : operator.aocApprovalStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : operator.aocApprovalStatus === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {operator.aocApprovalStatus === 'approved' ? 'AOC ✓' :
                               operator.aocApprovalStatus === 'pending' ? 'AOC ⏳' :
                               operator.aocApprovalStatus === 'rejected' ? 'AOC ✗' : 'AOC ?'}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              No AOC
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      operator.membership === 'Yearly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {operator.membership}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {operator.aircraftCount}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {operator.revenue}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      operator.aocApprovalStatus === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : operator.aocApprovalStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {operator.aocApprovalStatus === 'approved' ? 'Approved' :
                       operator.aocApprovalStatus === 'pending' ? 'Pending' :
                       operator.aocApprovalStatus === 'rejected' ? 'Rejected' : 'Missing'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {operator.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewOperator(operator)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Operator Detail Modal */}
      {showDetailModal && selectedOperator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Operator Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* AOC Status */}
              {(() => {
                const statusInfo = getAOCStatusInfo(selectedOperator.aocApprovalStatus);
                return (
                  <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-6 mb-6`}>
                    <div className="flex items-center space-x-4">
                      <statusInfo.icon className={`h-8 w-8 ${statusInfo.color}`} />
                      <div>
                        <h4 className={`text-lg font-semibold ${statusInfo.color}`}>
                          {statusInfo.title}
                        </h4>
                        <p className={`${statusInfo.color} mt-1`}>
                          {statusInfo.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Company Name</p>
                          <p className="font-medium text-gray-900">{selectedOperator.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Operator ID</p>
                          <p className="font-medium text-blue-600">{selectedOperator.operatorId}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedOperator.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{selectedOperator.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedOperator.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Membership</p>
                          <p className="font-medium text-gray-900">{selectedOperator.membership}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <div className="font-medium text-gray-900">
                          <p>{selectedOperator.address.street}</p>
                          <p>{selectedOperator.address.city}, {selectedOperator.address.state} {selectedOperator.address.zipCode}</p>
                          <p>{selectedOperator.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AOC Document and Actions */}
                <div className="space-y-6">
                  {/* Membership Payment Section */}
                  {(() => {
                    const paymentInfo = getOperatorPaymentInfo(selectedOperator.operatorId);
                    if (paymentInfo || selectedOperator.operatorId === 'OID00002') {
                      // Show payment section for operators with payment data or demo operator
                      const payment = paymentInfo || {
                        id: 'demo-payment-1',
                        operatorId: selectedOperator.operatorId,
                        planName: 'Monthly Plan',
                        amount: '$2,450',
                        paymentMethod: 'Bank Transfer',
                        transferDate: '2024-01-10',
                        referenceNumber: 'REF123456789',
                        senderName: 'Elite Jets Inc.',
                        senderBank: 'Chase Bank',
                        receiptFile: 'payment-receipt-elite-jets.pdf',
                        receiptSize: '2.1 MB',
                        status: 'pending_admin_approval',
                        createdAt: '2024-01-10T14:30:00Z',
                        notes: 'Monthly membership payment for Elite Jets Inc. - Bank transfer completed.'
                      };
                      
                      return (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">Membership Payment</h4>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Bank Transfer</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Plan Type</p>
                                  <p className="font-medium text-gray-900">{payment.planName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Amount</p>
                                  <p className="font-medium text-gray-900">{payment.amount}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Transfer Date</p>
                                  <p className="font-medium text-gray-900">
                                    {new Date(payment.transferDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Reference Number</p>
                                  <p className="font-medium text-gray-900">{payment.referenceNumber}</p>
                                </div>
                                {payment.senderName && (
                                  <div>
                                    <p className="text-sm text-gray-500">Sender Name</p>
                                    <p className="font-medium text-gray-900">{payment.senderName}</p>
                                  </div>
                                )}
                                {payment.senderBank && (
                                  <div>
                                    <p className="text-sm text-gray-500">Sender Bank</p>
                                    <p className="font-medium text-gray-900">{payment.senderBank}</p>
                                  </div>
                                )}
                              </div>
                              
                              {/* Receipt Download */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-500">Payment Receipt</p>
                                    <p className="font-medium text-gray-900">{payment.receiptFile}</p>
                                    <p className="text-xs text-gray-500">Size: {payment.receiptSize}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDownloadReceipt(payment)}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </button>
                                </div>
                              </div>
                              
                              {payment.notes && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <p className="text-sm text-gray-500">Additional Notes</p>
                                  <p className="text-gray-700">{payment.notes}</p>
                                </div>
                              )}
                            </div>

                            {/* Payment Status and Actions */}
                            {payment.status === 'pending_admin_approval' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                                  <span className="font-medium text-yellow-800">Pending Payment Approval</span>
                                </div>
                                <p className="text-yellow-700 text-sm mb-4">
                                  This operator has submitted bank transfer payment details. Review and approve to activate their membership.
                                </p>
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleApproveMembership(selectedOperator.id, payment.id)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve Membership
                                  </button>
                                  <button
                                    onClick={() => handleRejectMembership(selectedOperator.id, payment.id)}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Payment
                                  </button>
                                </div>
                              </div>
                            )}

                            {payment.status === 'approved' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                  <span className="font-medium text-green-800">Membership Approved</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                  Payment approved on {new Date(payment.approvedAt || payment.createdAt).toLocaleDateString()}. 
                                  Operator has full access to all features.
                                </p>
                              </div>
                            )}

                            {payment.status === 'rejected' && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                  <span className="font-medium text-red-800">Payment Rejected</span>
                                </div>
                                <p className="text-red-700 text-sm mt-1">
                                  Payment rejected on {new Date(payment.rejectedAt || payment.createdAt).toLocaleDateString()}. 
                                  Operator was notified to resubmit.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    
                    // Show "No Payment Submitted" for operators without payment data
                    return (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Membership Payment</h4>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">No Payment</span>
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                            <span className="font-medium text-orange-800">No Payment Submitted</span>
                          </div>
                          <p className="text-orange-700 text-sm mt-1">
                            This operator has not submitted any membership payment yet. They need to choose a plan and make payment to access operator features.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Service Agreement Section */}
                  {(() => {
                    const agreementInfo = getOperatorAgreementInfo(selectedOperator.operatorId);
                    
                    return (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">Service Agreement</h4>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600">Contract Management</span>
                          </div>
                        </div>
                        
                        {agreementInfo ? (
                          <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Contract Number</p>
                                  <p className="font-medium text-gray-900">{agreementInfo.contractNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Contract Duration</p>
                                  <p className="font-medium text-gray-900">{agreementInfo.contractDuration}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Plan Name</p>
                                  <p className="font-medium text-gray-900">{agreementInfo.planName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Amount</p>
                                  <p className="font-medium text-gray-900">{agreementInfo.amount}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Uploaded Date</p>
                                  <p className="font-medium text-gray-900">
                                    {new Date(agreementInfo.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">File Name</p>
                                  <p className="font-medium text-gray-900">{agreementInfo.signedFileName}</p>
                                </div>
                              </div>
                            </div>

                            {/* Agreement Status and Actions */}
                            {agreementInfo.status === 'pending_admin_approval' && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center mb-3">
                                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                                  <span className="font-medium text-yellow-800">Pending Agreement Approval</span>
                                </div>
                                <p className="text-yellow-700 text-sm mb-4">
                                  This operator has submitted their signed service agreement. Review and approve to complete their setup.
                                </p>
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => handleApproveAgreement(selectedOperator.id, agreementInfo.id)}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve Agreement
                                  </button>
                                  <button
                                    onClick={() => handleRejectAgreement(selectedOperator.id, agreementInfo.id)}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Agreement
                                  </button>
                                </div>
                              </div>
                            )}

                            {agreementInfo.status === 'approved' && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                  <span className="font-medium text-green-800">Agreement Approved</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                  Service agreement approved on {new Date(agreementInfo.approvedAt || agreementInfo.uploadedAt).toLocaleDateString()}. 
                                  Operator has full access to all features.
                                </p>
                              </div>
                            )}

                            {agreementInfo.status === 'rejected' && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                  <span className="font-medium text-red-800">Agreement Rejected</span>
                                </div>
                                <p className="text-red-700 text-sm mt-1">
                                  Agreement rejected on {new Date(agreementInfo.rejectedAt || agreementInfo.uploadedAt).toLocaleDateString()}. 
                                  Operator was notified to resubmit.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                              <span className="font-medium text-orange-800">No Agreement Submitted</span>
                            </div>
                            <p className="text-orange-700 text-sm mt-1">
                              This operator has not submitted their service agreement yet. They need to download, sign, and upload the agreement to complete their setup.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* AOC Document Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">AOC License</h4>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Aviation Authority</span>
                      </div>
                    </div>
                    
                    {selectedOperator.hasUploadedAOC ? (
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span className="font-medium text-gray-900">AOC License Uploaded</span>
                            </div>
                            <button
                              onClick={() => window.open(selectedOperator.aocDocumentUrl, '_blank')}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Document
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p>Document Type: Air Operator Certificate</p>
                            <p>Upload Date: {new Date(selectedOperator.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Admin Actions */}
                        {selectedOperator.aocApprovalStatus === 'pending' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                              <span className="font-medium text-yellow-800">Pending Admin Review</span>
                            </div>
                            <p className="text-yellow-700 text-sm mb-4">
                              This operator's AOC license is waiting for your approval. Review the document and approve or reject.
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleApproveAOC(selectedOperator.id)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve AOC
                              </button>
                              <button
                                onClick={() => handleRejectAOC(selectedOperator.id)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject AOC
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedOperator.aocApprovalStatus === 'approved' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-medium text-green-800">AOC Approved</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                              This operator's AOC license has been approved and they can receive booking requests.
                            </p>
                          </div>
                        )}

                        {selectedOperator.aocApprovalStatus === 'rejected' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <XCircle className="h-5 w-5 text-red-600 mr-2" />
                              <span className="font-medium text-red-800">AOC Rejected</span>
                            </div>
                            <p className="text-red-700 text-sm mt-1">
                              This operator's AOC license was rejected. They need to update their documentation.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="font-medium text-orange-800">No AOC License</span>
                        </div>
                        <p className="text-orange-700 text-sm mt-1">
                          Operator has not uploaded their AOC license yet. They cannot receive booking requests until this is completed.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Business Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Business Statistics</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedOperator.aircraftCount}</p>
                        <p className="text-sm text-gray-600">Aircraft</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedOperator.totalBookings}</p>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg col-span-2">
                        <p className="text-2xl font-bold text-purple-600">{selectedOperator.revenue}</p>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                      </div>
                    </div>
                  </div>

                  {/* Cancellation Rights Management */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Cancellation Rights</h4>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Operator Management</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">Cancellation Usage</p>
                            <p className="text-sm text-gray-600">
                              Used: {selectedOperator.operatorCancellationCount || 0} / 25 rights
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              (selectedOperator.operatorCancellationCount || 0) >= 25 
                                ? 'text-red-600' 
                                : (selectedOperator.operatorCancellationCount || 0) >= 20
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}>
                              {25 - (selectedOperator.operatorCancellationCount || 0)} remaining
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full ${
                              (selectedOperator.operatorCancellationCount || 0) >= 25 
                                ? 'bg-red-500' 
                                : (selectedOperator.operatorCancellationCount || 0) >= 20
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(((selectedOperator.operatorCancellationCount || 0) / 25) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        
                        {(selectedOperator.operatorCancellationCount || 0) >= 25 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                              <span className="text-sm font-medium text-red-800">Limit Reached</span>
                            </div>
                            <p className="text-red-700 text-sm mt-1">
                              This operator has reached the cancellation limit. Their aircraft, routes, and booking features are disabled.
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleResetCancellationRights(selectedOperator.email)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Reset Cancellation Rights (Admin Only)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OperatorManagement;