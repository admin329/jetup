import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Crown, CreditCard, Search, Plus, Plane, Building, DollarSign, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OperatorOverview: React.FC = () => {
  const { user } = useAuth();

  // Check operator's membership payment status
  const getOperatorPaymentInfo = () => {
    try {
      const membershipPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
      return membershipPayments.find((payment: any) => payment.operatorEmail === user?.email);
    } catch (error) {
      return null;
    }
  };

  const operatorPayment = getOperatorPaymentInfo();

  const getAccessStatus = () => {
    if (operatorPayment) {
      return {
        membershipStatus: operatorPayment.status || 'pending_admin_approval',
        paymentInfo: operatorPayment
      };
    }
    return {
      membershipStatus: 'none',
      paymentInfo: null
    };
  };

  const accessStatus = getAccessStatus();

  const recentBookings = [
    { 
      id: '1', 
      route: 'NYC → LA', 
      date: '2024-03-15', 
      aircraft: 'Gulfstream G650', 
      status: 'Confirmed',
      amount: '$25,000',
      customer: 'John Smith'
    },
    { 
      id: '2', 
      route: 'LHR → DXB', 
      date: '2024-02-28', 
      aircraft: 'Global 7500', 
      status: 'Completed',
      amount: '$32,000',
      customer: 'Sarah Johnson'
    },
  ];

  const stats = [
    { name: 'Total Aircraft', value: '5', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Routes', value: '12', icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Total Bookings', value: '48', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Revenue', value: '$156K', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Membership Status */}
      {(() => {
        if (accessStatus.membershipStatus === 'pending_admin_approval') {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
            >
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Membership Payment Under Review
                  </h3>
                  <p className="text-yellow-700 mt-1">
                    Your {accessStatus.paymentInfo?.planName} payment ({accessStatus.paymentInfo?.amount}) is being reviewed by our admin team. 
                  </p>
                  <div className="mt-2 text-sm text-yellow-600">
                    <p><strong>Transfer Date:</strong> {accessStatus.paymentInfo?.transferDate ? new Date(accessStatus.paymentInfo.transferDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Reference:</strong> {accessStatus.paymentInfo?.referenceNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        } else if (accessStatus.membershipStatus === 'approved') {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6"
            >
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-green-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-800">
                    Active {accessStatus.paymentInfo?.planName}
                  </h3>
                  <p className="text-green-700 mt-1">
                    Your membership is active! You have full access to all operator features with 0% commission rate.
                  </p>
                  <div className="mt-2 text-sm text-green-600">
                    <p><strong>Plan:</strong> {accessStatus.paymentInfo?.planName}</p>
                    <p><strong>Amount Paid:</strong> {accessStatus.paymentInfo?.amount}</p>
                    <p><strong>Commission Rate:</strong> 0%</p>
                    <p><strong>Approved:</strong> {accessStatus.paymentInfo?.approvedAt ? new Date(accessStatus.paymentInfo.approvedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        } else if (accessStatus.membershipStatus === 'rejected') {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6"
            >
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-red-800">
                    Membership Payment Rejected
                  </h3>
                  <p className="text-red-700 mt-1">
                    Your {accessStatus.paymentInfo?.planName} payment was rejected. Please contact support or submit a new payment.
                  </p>
                  <div className="mt-2 text-sm text-red-600">
                    <p><strong>Rejected:</strong> {accessStatus.paymentInfo?.rejectedAt ? new Date(accessStatus.paymentInfo.rejectedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <Link
                  to="/operator/membership"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </Link>
              </div>
            </motion.div>
          );
        } else if (!user?.hasMembership) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-6"
            >
              <div className="flex items-center">
                <Crown className="h-6 w-6 text-amber-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-amber-800">
                    Membership Required
                  </h3>
                  <p className="text-amber-700 mt-1">
                    You need an active membership to receive booking requests and manage your fleet. Choose a plan to get started.
                  </p>
                </div>
                <Link
                  to="/operator/membership"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Choose Plan
                </Link>
              </div>
            </motion.div>
          );
        }
        return null;
      })()}

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100 mb-6">Manage your fleet and grow your aviation business</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/operator/aircraft"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plane className="h-5 w-5 mr-2" />
            Manage Aircraft
          </Link>
          <Link
            to="/operator/bookings"
            className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Requests
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="bg-white p-6 rounded-lg shadow"
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

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
            <Link
              to="/operator/bookings"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-900 font-medium">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.route}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.aircraft}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.customer}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{booking.amount}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet</p>
              <Link
                to="/operator/bookings"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                View Booking Requests
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/operator/aircraft"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plane className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Aircraft</p>
              <p className="text-sm text-gray-600">Add or edit your fleet</p>
            </div>
          </Link>
          
          <Link
            to="/operator/routes"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <MapPin className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Popular Routes</p>
              <p className="text-sm text-gray-600">Create route offers</p>
            </div>
          </Link>
          
          <Link
            to="/operator/send-invoice"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Send Invoice</p>
              <p className="text-sm text-gray-600">Submit payment request</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OperatorOverview;