import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EmailConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmEmail, resendConfirmation } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(3);

  const token = searchParams.get('token');

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      // Minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        const success = await confirmEmail(token);
        if (success) {
          setStatus('success');
          
          // Start countdown
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/customer'); // Will be redirected based on user role
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus('expired');
        }
      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
      }
    };

    handleConfirmation();
  }, [token, confirmEmail, navigate]);

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      alert('Please enter your email address');
      return;
    }

    setResendLoading(true);
    try {
      const success = await resendConfirmation(userEmail);
      if (success) {
        alert('Confirmation email sent! Please check your inbox.');
      } else {
        alert('Failed to send confirmation email. Please check your email address.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend confirmation email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <Link to="/" className="flex items-center justify-center mb-6">
          <img 
            src="/JetUp-web-Logo.png" 
            alt="JETUP" 
            className="h-12 w-auto"
          />
        </Link>

        {status === 'loading' && (
          <div>
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                ✨ Activating your account...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully activated. You will be redirected to your dashboard shortly.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Redirecting to dashboard in {countdown} seconds...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h2>
            <p className="text-gray-600 mb-6">
              The confirmation link is invalid or has already been used.
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        )}

        {status === 'expired' && (
          <div>
            <Mail className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
            <p className="text-gray-600 mb-6">
              Your confirmation link has expired. Enter your email below to receive a new one.
            </p>
            
            <div className="space-y-4">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                {resendLoading ? 'Sending...' : 'Resend Confirmation'}
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

export default EmailConfirmationPage;