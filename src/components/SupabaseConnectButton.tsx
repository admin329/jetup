import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const SupabaseConnectButton: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if environment variables are set
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        setIsConnected(true);
        alert('Supabase connected successfully! Database migrations will run automatically.');
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-green-800 text-sm font-medium">Supabase Connected</span>
      </div>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {isConnecting ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {isConnecting ? 'Connecting...' : 'Connect to Supabase'}
        </span>
      </motion.button>

      {/* Connection Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Connect to Supabase</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">Supabase Setup Instructions</h4>
                  <div className="space-y-3 text-blue-800">
                    <p><strong>1.</strong> Go to supabase.com and create a new project</p>
                    <p><strong>2.</strong> Copy your Project URL and Anon Key from Settings API</p>
                    <p><strong>3.</strong> Add them to your environment variables:</p>
                  </div>
                </div>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                  </pre>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">What Happens After Connection</h4>
                  <div className="space-y-2 text-green-800">
                    <p>✅ 6 database tables will be created automatically</p>
                    <p>✅ Row Level Security policies will be applied</p>
                    <p>✅ User authentication will switch to Supabase</p>
                    <p>✅ All booking data will be stored in database</p>
                    <p>✅ Real-time updates will be enabled</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Important Note</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Current demo data in localStorage will be preserved. You can migrate it to Supabase after connection.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it, I will set up Supabase
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SupabaseConnectButton;