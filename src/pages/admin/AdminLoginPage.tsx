import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TwoFactorModal from '../../components/TwoFactorModal';
import { sendTwoFactorCode } from '../../services/twoFactorService';

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{email: string, password: string} | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  // Get admin credentials from localStorage
  const getAdminCredentials = () => {
    try {
      const saved = localStorage.getItem('adminCredentials');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading admin credentials:', error);
    }
    return {
      email: 'admin@jetup.aero',
      password: 'Osar2024/istanbul',
      name: 'Admin'
    };
  };
  
  const adminCredentials = getAdminCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if using demo credentials
      if (formData.email === adminCredentials?.email && formData.password === adminCredentials?.password) {
        // Admin login requires 2FA
        console.log('🔐 Admin credentials verified, sending 2FA code...');
        
        // Send 2FA code
        const codeSent = await sendTwoFactorCode(formData.email, adminCredentials.name);
        
        if (codeSent) {
          setPendingLogin({ email: formData.email, password: formData.password });
          setShowTwoFactor(true);
          setLoading(false);
          return;
        } else {
          throw new Error('Failed to send verification code');
        }
      }
      
      await login(formData.email, formData.password, 'admin');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Invalid admin credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    if (!pendingLogin) return;
    
    try {
      console.log('✅ 2FA verified, completing admin login...');
      
      // Complete login after 2FA verification
      const mockUser = {
        id: '1',
        name: adminCredentials.name,
        email: pendingLogin.email,
        role: 'admin' as const,
        isEmailConfirmed: true,
        twoFactorVerified: true,
        loginTime: new Date().toISOString()
      };
      
      // Set user and redirect
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      setShowTwoFactor(false);
      setPendingLogin(null);
      
      // Redirect to admin dashboard
      window.location.href = '/admin';
      
    } catch (error) {
      console.error('Error completing admin login:', error);
      alert('Login completion failed. Please try again.');
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setPendingLogin(null);
    setCode('');
    setError('');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      // Validate email
      if (!resetEmail || !resetEmail.trim()) {
        alert('Please enter your email address');
        setResetLoading(false);
        return;
      }
      
      // Send password reset email
      const success = await resetPassword(resetEmail.trim(), 'admin');
      
      if (success) {
        alert('Password reset link has been sent to your admin email address. Please check your inbox and spam folder.');
      } else {
        alert('Failed to send password reset email. Please try again.');
      }
      
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset failed:', error);
      alert('Password reset failed. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-1 rounded-full flex items-center justify-center" style={{backgroundColor: '#0B1733'}}>
            <img 
              src="/Up-app-logo.png" 
              alt="JETUP" 
              className="h-8 w-auto"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {showForgotPassword ? 'Reset Password' : 'Admin Access'}
          </h2>
          <p className="text-gray-600">
            {showForgotPassword ? 'Enter your email to reset password' : 'Secure administrator login portal'}
          </p>
        </div>

        {/* Security Warning */}
        {!showForgotPassword && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
              <div>
                <p className="text-amber-800 text-sm font-medium">Restricted Access</p>
                <p className="text-amber-700 text-sm">
                  Administrator access only. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email Address
              </label>
              <input
                id="resetEmail"
                name="resetEmail"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your admin email address"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-blue-800 text-sm font-medium">Demo Test</p>
                  <p className="text-blue-700 text-sm">
                    Use: admin@jetup.aero for testing
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={resetLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 disabled:opacity-50"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to admin login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Enter your admin email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              <Lock className="h-5 w-5 mr-2" />
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </motion.button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Forgot Password?
              </button>
              
              <div className="border-t border-gray-200 pt-3">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  ← Back to Homepage
                </Link>
              </div>
            </div>
          </form>
        )}
      </motion.div>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={showTwoFactor}
        email={pendingLogin?.email || ''}
        name={adminCredentials?.name || 'Admin'}
        onSuccess={handleTwoFactorSuccess}
        onCancel={handleTwoFactorCancel}
      />
    </div>
  );
};

export default AdminLoginPage;