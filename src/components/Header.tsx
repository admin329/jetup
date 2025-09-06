import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Calendar, Crown, Shield, Phone, Plane } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  showAuthModal?: boolean;
  setShowAuthModal?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showAuthModal = false, setShowAuthModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'customer':
        return '/customer';
      case 'operator':
        return '/operator';
      default:
        return '/';
    }
  };

  // Determine header background
  const getHeaderBackground = () => {
    if (isHomePage && !isScrolled && !mobileMenuOpen) {
      return 'bg-transparent';
    }
    return 'bg-[#0B1733]';
  };

  // Determine text color
  const getTextColor = () => {
    if (isHomePage && !isScrolled) {
      return 'text-white';
    }
    return 'text-white';
  };

  const navigation = [
    { name: 'Experience', href: '/experience' },
    { name: 'Membership', href: '/membership' },
    { name: 'Aircrafts', href: '/aircrafts' },
    { name: 'Routes', href: '/routes' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${getHeaderBackground()} ${
        isHomePage && !isScrolled ? '' : 'shadow-lg'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/JetUp-web-Logo.png" 
                  alt="JETUP" 
                  className="h-14 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 ml-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${getTextColor()} hover:text-red-500 px-2 py-2 text-base font-normal transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Phone Number */}
              <a
                href="tel:+18885656090"
                className={`flex items-center space-x-2 ${getTextColor()} hover:text-red-500 px-2 py-2 text-base font-normal transition-colors`}
              >
                <Phone className="h-4 w-4" />
                <span>+1-888-565-6090</span>
              </a>
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    {user?.role === 'customer' && <User className="h-4 w-4" />}
                    {user?.role === 'operator' && <Shield className="h-4 w-4" />}
                    {user?.role === 'admin' && <Crown className="h-4 w-4" />}
                    <span>
                      {user?.role === 'customer' ? 'CUSTOMER PORTAL' : 
                       user?.role === 'operator' ? 'OPERATOR PORTAL' : 
                       user?.role === 'admin' ? 'ADMIN PORTAL' : 'PORTAL'}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-red-500">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      
                     {user?.role === 'customer' && (
                       <Link
                         to="/booking"
                         onClick={() => setUserMenuOpen(false)}
                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                        <Plane className="h-4 w-4 mr-2" />
                         Create Flight
                       </Link>
                     )}
                     
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      
                      <Link
                        to={`/${user?.role}/settings`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal && setShowAuthModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                >
                  GET STARTED
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <div className="flex items-center space-x-3">
                {!isAuthenticated && (
                  <button
                    onClick={() => setShowAuthModal && setShowAuthModal(true)}
                    className="text-white text-lg font-medium mr-3"
                  >
                    Get Started
                  </button>
                )}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`${getTextColor()} hover:text-red-500 p-2`}
                >
                 {mobileMenuOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed inset-0 top-24 bg-[#0B1733] overflow-y-auto z-50"
            >
              <div className="px-4 py-8 space-y-2">
                <Link
                  to="/membership"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  MEMBERSHIP
                </Link>
                
                <Link
                  to="/aircrafts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  AIRCRAFT NETWORK
                </Link>
                
                <Link
                  to="/routes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  POPULER ROUTE OFFERS
                </Link>
                
                <Link
                  to="/experience"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  MORE EXPERIENCE
                </Link>
                
                <Link
                  to="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  GET SUPPORT
                </Link>
                
                <div className="pt-2">
                <a
                  href="tel:+18885656090"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-white hover:text-red-500 px-4 py-0 text-lg font-medium transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  +1-888-565-6090
                </a>
                </div>
                
                {isAuthenticated ? (
                  <div className="pt-8 mt-8">
                    <div className="px-4 py-4 mb-4">
                      <p className="text-lg font-medium text-red-500">{user?.name}</p>
                    <p className="text-sm text-gray-300 capitalize">{user?.role}</p>
                    </div>
                    
                    <>
                    {user?.role === 'customer' && (
                      <Link
                        to="/booking"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-1 text-lg text-white rounded-lg mb-2"
                      >
                        <Plane className="h-6 w-6 mr-3" />
                        Create Flight
                      </Link>
                    )}
                    
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-1 text-lg text-white rounded-lg"
                    >
                      <Calendar className="h-6 w-6 mr-3" />
                      Dashboard
                    </Link>
                    
                    <Link
                      to={`/${user?.role}/settings`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-1 text-lg text-white rounded-lg"
                    >
                      <Settings className="h-6 w-6 mr-3" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-1 text-lg text-red-500 rounded-lg"
                    >
                      <LogOut className="h-6 w-6 mr-3" />
                      Logout
                    </button>
                    </>
                    
                    {/* Compact Red Buttons - After User Area */}
                    <div className="flex items-center space-x-3 mt-6 px-4">
                      <Link
                        to="/operators"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 px-3 py-2 bg-red-600 border border-red-600 text-white rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors text-center text-sm font-medium"
                      >
                        FOR OPERATORS
                      </Link>
                      <Link
                        to="/fleet"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 px-3 py-2 bg-red-600 border border-red-600 text-white rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors text-center text-sm font-medium"
                      >
                        FLEET GUIDE
                      </Link>
                    </div>
                   
                   {/* Copyright */}
                   <div className="mt-6 px-4">
                     <p className="text-left text-white text-sm">&copy; 2025 JETUP LTD (UK)</p>
                   </div>
                  </div>
                ) : (
                  <div className="pt-8 mt-8">
                    <>
                      <button
                        onClick={() => {
                          setShowAuthModal && setShowAuthModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="text-red-500 text-lg font-medium px-4 py-0 text-left w-full"
                      >
                        GET STARTED
                      </button>
                      
                      {/* Compact Red Buttons - After GET STARTED */}
                      <div className="flex items-center space-x-3 mt-6 px-4">
                        <Link
                          to="/operators"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 px-3 py-2 bg-red-600 border border-red-600 text-white rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors text-center text-sm font-medium"
                        >
                          FOR OPERATORS
                        </Link>
                        <Link
                          to="/fleet"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 px-3 py-2 bg-red-600 border border-red-600 text-white rounded-lg hover:bg-red-700 hover:border-red-700 transition-colors text-center text-sm font-medium"
                        >
                          FLEET GUIDE
                        </Link>
                      </div>
                     
                     {/* Copyright */}
                     <div className="mt-6 px-4">
                       <p className="text-left text-white text-sm">&copy; 2025 JETUP LTD (UK)</p>
                     </div>
                    </>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      {showAuthModal && setShowAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  );
};

export default Header;
