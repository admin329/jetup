import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, Crown, User, Eye, X, CheckCircle, XCircle, Shield, AlertCircle, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { updateUserApprovalStatus } = useAuth();

  const customers = [
    {
      id: '1',
      customerId: 'CID00001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      membership: 'Premium',
      totalBookings: 12,
      totalSpent: '$156,000',
      joinDate: '2024-01-15',
      status: 'Active',
      hasUploadedID: true,
      profileCompletionStatus: 'pending',
      idDocumentUrl: '/mock-id-document.pdf'
    },
    {
      id: '2',
      customerId: 'CID00002',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States'
      },
      membership: 'Basic',
      totalBookings: 5,
      totalSpent: '$45,000',
      joinDate: '2024-02-20',
      status: 'Active',
      hasUploadedID: false,
      profileCompletionStatus: 'incomplete',
      idDocumentUrl: null
    },
    {
      id: '3',
      customerId: 'CID00003',
      name: 'Michael Brown',
      email: 'mbrown@startup.io',
      phone: '+1 (555) 456-7890',
      address: {
        street: '789 Pine Street',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      },
      membership: 'Premium',
      totalBookings: 23,
      totalSpent: '$289,000',
      joinDate: '2023-11-10',
      status: 'Active',
      hasUploadedID: true,
      profileCompletionStatus: 'approved',
      idDocumentUrl: '/mock-id-document-2.pdf'
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleApproveProfile = (customerId: string) => {
    if (window.confirm('Are you sure you want to approve this customer profile?')) {
      try {
        console.log(`Approving customer profile: ${customerId}`);
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedCustomer.customerId, 'customer', 'profile', true);
        
        alert('Customer profile approved successfully! Customer can now make bookings.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error approving customer profile:', error);
        alert('Failed to approve customer profile. Please try again.');
      }
    }
  };

  const handleRejectProfile = (customerId: string) => {
    if (window.confirm('Are you sure you want to reject this customer profile?')) {
      try {
        console.log(`Rejecting customer profile: ${customerId}`);
        
        // Update user approval status in real-time
        updateUserApprovalStatus(selectedCustomer.customerId, 'customer', 'profile', false);
        
        alert('Customer profile rejected. Customer will be notified.');
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error rejecting customer profile:', error);
        alert('Failed to reject customer profile. Please try again.');
      }
    }
  };

  const getProfileStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Profile Approved',
          message: 'Customer can make bookings'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Pending Review',
          message: 'Waiting for admin approval'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Profile Rejected',
          message: 'Customer needs to update information'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Profile Incomplete',
          message: 'Customer needs to complete profile'
        };
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search customers..."
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

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          customer.profileCompletionStatus === 'approved' 
                            ? 'bg-green-100' 
                            : customer.profileCompletionStatus === 'pending'
                            ? 'bg-yellow-100'
                            : customer.profileCompletionStatus === 'rejected'
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <User className={`h-5 w-5 ${
                            customer.profileCompletionStatus === 'approved' 
                              ? 'text-green-600' 
                              : customer.profileCompletionStatus === 'pending'
                              ? 'text-yellow-600'
                              : customer.profileCompletionStatus === 'rejected'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-xs text-blue-600 font-medium">{customer.customerId}</div>
                        <div className="flex items-center mt-1">
                          {customer.hasUploadedID ? (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              customer.profileCompletionStatus === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : customer.profileCompletionStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : customer.profileCompletionStatus === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.profileCompletionStatus === 'approved' ? 'ID Approved' :
                               customer.profileCompletionStatus === 'pending' ? 'ID Pending' :
                               customer.profileCompletionStatus === 'rejected' ? 'ID Rejected' : 'ID Incomplete'}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              No ID
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {customer.membership === 'Premium' ? (
                        <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                      ) : (
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.membership === 'Premium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.membership}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalBookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewCustomer(customer)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Profile Status */}
              {(() => {
                const statusInfo = getProfileStatusInfo(selectedCustomer.profileCompletionStatus);
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
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Customer ID</p>
                          <p className="font-medium text-blue-600">{selectedCustomer.customerId}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Membership</p>
                          <p className="font-medium text-gray-900">{selectedCustomer.membership}</p>
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
                          <p>{selectedCustomer.address.street}</p>
                          <p>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}</p>
                          <p>{selectedCustomer.address.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Document and Actions */}
                <div className="space-y-6">
                  {/* ID Document Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Identity Document</h4>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Aviation Security</span>
                      </div>
                    </div>
                    
                    {selectedCustomer.hasUploadedID ? (
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <span className="font-medium text-gray-900">ID Document Uploaded</span>
                            </div>
                            <button
                              onClick={() => window.open(selectedCustomer.idDocumentUrl, '_blank')}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Document
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p>Document Type: Government-issued Photo ID</p>
                            <p>Upload Date: {new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Admin Actions */}
                        {selectedCustomer.profileCompletionStatus === 'pending' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                              <span className="font-medium text-yellow-800">Pending Admin Review</span>
                            </div>
                            <p className="text-yellow-700 text-sm mb-4">
                              This customer's ID document is waiting for your approval. Review the document and approve or reject the profile.
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleApproveProfile(selectedCustomer.id)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Profile
                              </button>
                              <button
                                onClick={() => handleRejectProfile(selectedCustomer.id)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Profile
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedCustomer.profileCompletionStatus === 'approved' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-medium text-green-800">Profile Approved</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                              This customer's profile has been approved and they can make bookings.
                            </p>
                          </div>
                        )}

                        {selectedCustomer.profileCompletionStatus === 'rejected' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <XCircle className="h-5 w-5 text-red-600 mr-2" />
                              <span className="font-medium text-red-800">Profile Rejected</span>
                            </div>
                            <p className="text-red-700 text-sm mt-1">
                              This customer's profile was rejected. They need to update their information.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="font-medium text-orange-800">No ID Document</span>
                        </div>
                        <p className="text-orange-700 text-sm mt-1">
                          Customer has not uploaded their ID document yet. They cannot make bookings until this is completed.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Booking Statistics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Statistics</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalBookings}</p>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedCustomer.totalSpent}</p>
                        <p className="text-sm text-gray-600">Total Spent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CustomerManagement;