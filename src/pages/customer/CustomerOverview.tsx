import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Crown, CreditCard, Search, Plus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerOverview: React.FC = () => {
  const { user } = useAuth();

  const recentBookings = [
    { 
      id: '1', 
      route: 'NYC → LA', 
      date: '2024-03-15', 
      aircraft: 'Gulfstream G650', 
      status: 'Confirmed',
      amount: '$25,000'
    },
    { 
      id: '2', 
      route: 'LHR → DXB', 
      date: '2024-02-28', 
      aircraft: 'Global 7500', 
      status: 'Completed',
      amount: '$32,000'
    },
  ];

  const stats = [
    { name: 'Total Bookings', value: '12', icon: Calendar },
    { name: 'Total Spent', value: '$156K', icon: CreditCard },
    { name: 'Membership', value: user?.membershipType || 'None', icon: Crown },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100 mb-6">Ready for your next luxury flight experience?</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Book New Flight
          </Link>
          <Link
            to="/customer/history"
            className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="h-5 w-5 mr-2" />
            View Bookings
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-2xl font-bold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Membership Status */}
      {!user?.hasMembership && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-6"
        >
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-amber-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-amber-800">
                Upgrade Your Membership
              </h3>
              <p className="text-amber-700 mt-1">
                Get access to exclusive benefits and priority booking with a premium membership.
              </p>
            </div>
            <Link
              to="/customer/membership"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
            <Link
              to="/customer/history"
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
                      {new Date(booking.date).toLocaleDateString()} at {new Date(booking.departure || booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.aircraft}
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
                to="/"
                className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Make Your First Booking
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* LTC Warning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 text-sm">
              For all booking request (one-way and road trip), the departure time is considered LTC. 
              JETUP disclaims any liability for any inconveniences that may arise. Please visit the{' '}
              <a href="/disclaimer" className="text-yellow-900 underline hover:text-yellow-700 font-medium">
                Disclaimer page
              </a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerOverview;