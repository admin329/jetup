import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, User, Building, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (passwordErrors.length > 0) {
        alert('Please fix password validation errors:\n' + passwordErrors.join('\n'));
        setLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    
    try {
      if (mode === 'register') {
        await register(formData.name, formData.email, formData.password, formData.role);
      } else {
        await login(formData.email, formData.password, formData.role);
      }
      
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      alert(mode === 'login' ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate password in real-time for register mode
    if (name === 'password' && mode === 'register') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Close Button - Top Left Inside Modal */}
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex-1"></div>
          </div>

          <div className="text-center mb-6 -mt-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: '#0B1733'}}>
              <img 
                src="/Up-app-logo.png" 
                alt="JETUP" 
                className="h-8 w-auto"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Booking System' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' ? 'Sign in to your account' : 'Join the premium aviation community'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'login' ? 'Login as' : 'Register as'}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer' })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all flex-1 ${
                    formData.role === 'customer'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'operator' })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all flex-1 ${
                    formData.role === 'operator'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span className="text-sm font-medium">Operator</span>
                </button>
              </div>
            </div>

            {/* Name (Register only) */}
            {mode === 'register' && (
              <div>
                {formData.role === 'operator' && (
                  <div className="mb-4">
                    <label htmlFor="operatorName" className="block text-sm font-medium text-gray-700 mb-2">
                      Operator Name
                    </label>
                    <input
                      id="operatorName"
                      name="operatorName"
                      type="text"
                      required
                      value={formData.operatorName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter operator/company name"
                    />
                  </div>
                )}
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Requirements - Always visible in register mode */}
              {mode === 'register' && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className={`flex items-center transition-colors ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center transition-colors ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center transition-colors ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center transition-colors ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One number (0-9)
                    </div>
                    <div className={`flex items-center transition-colors ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\/&%]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\/&%]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One special character (!@#$%^&*/&% etc.)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
                
                {/* Password Match Indicator */}
                {mode === 'register' && formData.confirmPassword && formData.password && (
                  <div className="mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <p className="text-green-600 text-xs flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-red-600 text-xs flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Role-specific warnings for Register mode */}
            {mode === 'register' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    {formData.role === 'customer' ? (
                      <div>
                        <p className="text-yellow-800 text-sm font-medium mb-2">Customer Registration Requirements</p>
                        <ul className="text-yellow-700 text-xs space-y-1">
                          <li>• ID verification required after registration</li>
                          <li>• Government-issued photo ID must be uploaded</li>
                          <li>• Admin approval needed before booking flights</li>
                          <li>• Process takes 24-48 hours for aviation security compliance</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-yellow-800 text-sm font-medium mb-2">Operator Registration Requirements</p>
                        <ul className="text-yellow-700 text-xs space-y-1">
                          <li>• AOC (Air Operator Certificate) license verification required</li>
                          <li>• Membership package payment needed for platform access</li>
                          <li>• Service agreement approval by admin team</li>
                          <li>• Complete verification process takes 48-72 hours</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          {/* Forgot Password Link - Only for Login Mode */}
          {mode === 'login' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  // Navigate to reset password page with role parameter
                  const resetUrl = `/reset-password?role=${formData.role}`;
                  window.open(resetUrl, '_blank');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
