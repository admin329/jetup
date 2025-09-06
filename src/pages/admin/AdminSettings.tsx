import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings: React.FC = () => {
  const { user, updateAdminCredentials } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const [adminData, setAdminData] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@jetup.aero',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validate required fields
      if (!adminData.name.trim() || !adminData.email.trim()) {
        alert('Name and email are required');
        setIsSaving(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminData.email.trim())) {
        alert('Please enter a valid email address');
        setIsSaving(false);
        return;
      }
      
      // If changing password, validate it
      if (adminData.newPassword) {
        if (!adminData.currentPassword) {
          alert('Please enter your current password to change it');
          setIsSaving(false);
          return;
        }
        
        if (passwordErrors.length > 0) {
          alert('Please fix password validation errors:\n' + passwordErrors.join('\n'));
          setIsSaving(false);
          return;
        }
        
        if (adminData.newPassword !== adminData.confirmPassword) {
          alert('New passwords do not match');
          setIsSaving(false);
          return;
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update admin credentials in context
      if (updateAdminCredentials) {
        await updateAdminCredentials({
          name: adminData.name.trim(),
          email: adminData.email.trim(),
          currentPassword: adminData.currentPassword,
          newPassword: adminData.newPassword
        });
      }
      
      // Reset password fields
      setAdminData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setPasswordErrors([]);
      setIsEditing(false);
      
      alert('Admin settings updated successfully!');
    } catch (error) {
      console.error('Error updating admin settings:', error);
      alert('Failed to update settings. Please check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setAdminData({
      name: user?.name || 'Admin',
      email: user?.email || 'admin@jetup.aero',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors([]);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Edit Settings
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Administrator Account Security
              </h3>
              <p className="text-red-700 mt-1">
                Changes to admin credentials will affect login access. Updated email and password will be required for future logins.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Enter admin name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Enter admin email"
                  required
                />
              </div>
              {isEditing && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ This email will be used for admin login
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Password Update Section */}
        {isEditing && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={adminData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter current password to change"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={adminData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {adminData.newPassword && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center ${adminData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${adminData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      8+ characters
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(adminData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(adminData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Uppercase letter
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(adminData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[0-9]/.test(adminData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Number
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(adminData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(adminData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Special character
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={adminData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {adminData.confirmPassword && adminData.newPassword && (
                  <div className="mt-1">
                    {adminData.newPassword === adminData.confirmPassword ? (
                      <p className="text-green-600 text-xs flex items-center">
                        <CheckCircle className="w-3 h-3 mr-2" />
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-red-600 text-xs flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2" />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">All credentials are encrypted</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Secure password requirements</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Admin access logging</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Two-factor authentication ready</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Session timeout protection</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Audit trail maintenance</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Session Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Login Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Session Status</p>
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;