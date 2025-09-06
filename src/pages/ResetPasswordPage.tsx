import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyResetToken, updatePassword } = useAuth();
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success' | 'error'>('loading');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      // Minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        const isValid = await verifyResetToken(token);
        setStatus(isValid ? 'valid' : 'invalid');
      } catch (error) {
        console.error('Token verification error:', error);
        setStatus('invalid');
      }
    };

    verifyToken();
  }, [token, verifyResetToken]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&* etc.)');
    }
    
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordErrors.length > 0) {
      alert('Please fix password validation errors:\n' + passwordErrors.join('\n'));
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updatePassword(token!, formData.newPassword);
      
      if (success) {
        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Password update error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {status === 'loading' && (
          <div>
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Reset Link</h2>
            <p className="text-gray-600">Please wait while we verify your password reset link...</p>
          </div>
        )}

        {status === 'valid' && (
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-gray-600 mb-6">Enter your new password below</p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Requirements - Register Modal Style */}
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className={`flex items-center transition-colors ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center transition-colors ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center transition-colors ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center transition-colors ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One number (0-9)
                    </div>
                    <div className={`flex items-center transition-colors ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\/&%]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\/&%]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      One special character (!@#$%^&*/&% etc.)
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.newPassword === formData.confirmPassword ? (
                      <p className="text-green-600 text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-red-600 text-xs flex items-center">
                        <XCircle className="w-3 h-3 mr-2" />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || passwordErrors.length > 0 || formData.newPassword !== formData.confirmPassword}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </motion.button>
            </form>
          </div>
        )}

        {status === 'invalid' && (
          <div>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset link.
            </p>
            <Link
              to="/"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now login with your new password.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Redirecting to homepage in 3 seconds...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Failed</h2>
            <p className="text-gray-600 mb-6">
              Failed to update your password. Please try again or request a new reset link.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setStatus('valid')}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;