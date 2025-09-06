import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CreditCard, 
  Settings, 
  History, 
  Crown,
  FileText,
  LogOut,
  Menu,
  X,
  Plane,
  Plus,
  Route as RouteIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CustomerOverview from './CustomerOverview';
import BookingHistory from './BookingHistory';
import MembershipSettings from './MembershipSettings';
import PaymentMethods from './PaymentMethods';
import CustomerSettings from './CustomerSettings';
import Invoices from './Invoices';

const CustomerDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/customer', icon: Calendar },
    { name: 'Create Flight', href: '/booking', icon: Plus },
    { name: 'Route Offers', href: '/routes', icon: RouteIcon },
    { name: 'Booking History', href: '/customer/history', icon: History },
    { name: 'Invoices', href: '/customer/invoices', icon: FileText },
    { name: 'Membership', href: '/customer/membership', icon: Crown },
    { name: 'Payment Methods', href: '/customer/payment', icon: CreditCard },
    { name: 'Settings', href: '/customer/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/customer') {
      return location.pathname === '/customer';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{backgroundColor: '#0B1733'}}
            >
              <img 
                src="/Up-app-logo.png" 
                alt="JETUP" 
                className="h-6 w-auto"
              />
            </div>
          </Link>
        </div>

        <div className="flex flex-col justify-between h-full px-6 py-8">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={logout}
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="flex items-center w-full px-3 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>

            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center px-3 py-2 text-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-700">{user?.name}</p>
                  <div className="flex items-center">
                    {user?.membershipType === 'premium' && (
                      <Crown className="h-3 w-3 text-yellow-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500 capitalize">
                      {user?.membershipType || 'No membership'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <div className="w-6 lg:hidden"></div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<CustomerOverview />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="membership" element={<MembershipSettings />} />
            <Route path="payment" element={<PaymentMethods />} />
            <Route path="settings" element={<CustomerSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;