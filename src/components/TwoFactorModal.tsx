import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw, X, AlertCircle, CheckCircle } from 'lucide-react';
import { verifyTwoFactorCode, sendTwoFactorCode, getTwoFactorTimeRemaining } from '../services/twoFactorService';

interface TwoFactorModalProps {
  isOpen: boolean;
  email: string;
  name: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  email,
  name,
  onSuccess,
  onCancel
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

  // Update countdown timer
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const remaining = getTwoFactorTimeRemaining(email);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setError('Verification code has expired. Please request a new one.');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [isOpen, email]);

  // Auto-focus on code input
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('2fa-code');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
    
    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify || code;
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = verifyTwoFactorCode(email, verificationCode);
      
      if (result.isValid) {
        console.log('✅ 2FA verification successful');
        onSuccess();
      } else {
        setError(result.error || 'Invalid verification code');
        setAttemptsRemaining(result.attemptsRemaining || 0);
        
        if (result.attemptsRemaining === 0) {
          setTimeout(() => {
            onCancel();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setCode('');

    try {
      const sent = await sendTwoFactorCode(email, name);
      
      if (sent) {
        setTimeRemaining(600); // 10 minutes
        setAttemptsRemaining(3);
        alert('New verification code sent to your email!');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error resending 2FA code:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h3>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {email}
            </p>
          </div>

          {/* Timer */}
          {timeRemaining > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Code expires in: {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          )}

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              id="2fa-code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-4 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              {attemptsRemaining > 0 && (
                <p className="text-red-700 text-xs mt-2">
                  {attemptsRemaining} attempts remaining
                </p>
              )}
            </div>
          )}

          {/* Development Mode Notice */}
          {import.meta.env.DEV && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 text-sm font-medium">Development Mode</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    2FA code will be shown in browser console and alert
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || code.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify Code
                </>
              )}
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleResendCode}
                disabled={isResending || timeRemaining > 540} // Can resend after 1 minute
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <p className="text-gray-700 text-xs">
                This code is valid for 10 minutes and can only be used once for security.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TwoFactorModal;