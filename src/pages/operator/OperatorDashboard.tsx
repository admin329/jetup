import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Route as RouteIcon, 
  Calendar, 
  Settings, 
  BarChart3, 
  Crown,
  FileText,
  LogOut,
  Menu,
  X,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import OperatorOverview from './OperatorOverview';
import AircraftManagement from './AircraftManagement';
import RouteManagement from './RouteManagement';
import BookingRequests from './BookingRequests';
import RoutesRequest from './RoutesRequest';
import MembershipManagement from './MembershipManagement';
import FinancialManagement from './FinancialManagement';
import Invoices from './Invoices';
import InvoiceSending from './InvoiceSending';
import OperatorSettings from './OperatorSettings';
import Agreements from './Agreements';

const OperatorDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Auto logout after 5 minutes of inactivity
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        // Navigate to home page and open GET STARTED modal
        window.location.href = '/?showModal=true';
      }, 30 * 60 * 1000); // 30 minutes (increased from 5 minutes)
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [logout]);

  const handleLogout = () => {
    logout();
    // Navigate to home page
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Overview', href: '/operator', icon: BarChart3 },
    { name: 'Membership', href: '/operator/membership', icon: Crown },
    { name: 'Agreements', href: '/operator/agreements', icon: FileCheck },
    { name: 'Financial', href: '/operator/financial', icon: DollarSign },
    { name: 'Invoices', href: '/operator/invoices', icon: FileText },
    { name: 'Send Invoice', href: '/operator/send-invoice', icon: FileText },
    { name: 'Aircraft', href: '/operator/aircraft', icon: Plane },
    { name: 'Routes', href: '/operator/routes', icon: RouteIcon },
    { name: 'Routes Request', href: '/operator/routes-request', icon: Calendar },
    { name: 'Booking Requests', href: '/operator/bookings', icon: Calendar },
    { name: 'Settings', href: '/operator/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/operator') {
      return location.pathname === '/operator';
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
                  <div className="flex items-center">
                    {user?.membershipType && (
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
              <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
              <div className="w-6 lg:hidden"></div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<OperatorOverview />} />
            <Route path="membership" element={<MembershipManagement />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="agreements" element={<Agreements />} />
            <Route path="financial" element={<FinancialManagement />} />
           <Route path="invoices" element={<Invoices />} />
            <Route path="send-invoice" element={<InvoiceSending />} />
            <Route path="aircraft" element={<AircraftManagement />} />
            <Route path="routes" element={<RouteManagement />} />
            <Route path="bookings" element={<BookingRequests />} />
            <Route path="routes-request" element={<RoutesRequest />} />
            <Route path="settings" element={<OperatorSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OperatorDashboard;