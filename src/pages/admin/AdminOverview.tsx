import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Calendar, DollarSign, TrendingUp, Activity, Crown, CreditCard } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const stats = [
    { name: 'Total Customers', value: '2,847', icon: Users, change: '+12%', changeType: 'increase', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Operators', value: '156', icon: Building, change: '+5%', changeType: 'increase', color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Total Bookings', value: '1,234', icon: Calendar, change: '+18%', changeType: 'increase', color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Total Booking Revenue', value: '$4.2M', icon: Calendar, change: '+23%', changeType: 'increase', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Customer Membership Revenue', value: '$890K', icon: Crown, change: '+15%', changeType: 'increase', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Operator Membership Revenue', value: '$2.1M', icon: CreditCard, change: '+8%', changeType: 'increase', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Commission Revenue', value: '$320K', icon: DollarSign, change: '+28%', changeType: 'increase', color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Total Admin Revenue', value: '$3.31M', icon: TrendingUp, change: '+18%', changeType: 'increase', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentBookings = [
    { id: '1', customer: 'John Smith', route: 'NYC → LA', aircraft: 'Gulfstream G650', amount: '$25,000', status: 'Confirmed' },
    { id: '2', customer: 'Sarah Johnson', route: 'LHR → DXB', aircraft: 'Global 7500', amount: '$32,000', status: 'Pending' },
    { id: '3', customer: 'Mike Wilson', route: 'MIA → ASE', aircraft: 'Citation X+', amount: '$18,500', status: 'Completed' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Activity</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <p className="font-medium text-gray-900">{booking.customer}</p>
                  <p className="text-sm text-gray-600">{booking.route}</p>
                  <div>
                    <p className="text-xs text-gray-500">{booking.aircraft}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{booking.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;