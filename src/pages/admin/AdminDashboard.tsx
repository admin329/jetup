import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  Calendar, 
  Settings, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Plane,
  FileText,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SupabaseConnectButton from '../../components/SupabaseConnectButton';
import AdminOverview from './AdminOverview';
import CustomerManagement from './CustomerManagement';
import OperatorManagement from './OperatorManagement';
import BookingManagement from './BookingManagement';
import SubscriberManagement from './SubscriberManagement';
import FAQManagement from './FAQManagement';
import AdminSettings from './AdminSettings';
import InvoiceManagement from './InvoiceManagement';
import AircraftGuideManagement from './AircraftGuideManagement';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/admin', icon: BarChart3 },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Operators', href: '/admin/operators', icon: Building },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Invoices', href: '/admin/invoices', icon: FileText },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'FAQ', href: '/admin/faq', icon: MessageCircle },
    { name: 'Aircraft Guide', href: '/admin/aircraft-guide', icon: Plane },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
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
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
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
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
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
                  <p className="text-xs text-gray-500">Administrator</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {/* Desktop Supabase Connect Button */}
              <div className="hidden lg:block">
                <SupabaseConnectButton />
              </div>
              <div className="w-6 lg:hidden"></div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="operators" element={<OperatorManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="subscribers" element={<SubscriberManagement />} />
            <Route path="faq" element={<FAQManagement />} />
            <Route path="aircraft-guide" element={<AircraftGuideManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
