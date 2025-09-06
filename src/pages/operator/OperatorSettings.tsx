import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Upload, Calendar, Hash, Save, AlertCircle, Lock, Eye, EyeOff, Crown, XCircle, Clock, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const OperatorSettings: React.FC = () => {
  const { user } = useAuth();
  
  // Get operator's membership payment info
  const getOperatorPaymentInfo = () => {
    try {
      const membershipPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
      return membershipPayments.find((payment: any) => payment.operatorEmail === user?.email);
    } catch (error) {
      return null;
    }
  };
  
  const operatorPayment = getOperatorPaymentInfo();
  
  const accessStatus = {
    hasMembership: operatorPayment?.status === 'approved',
    hasAOC: user?.hasUploadedAOC && user?.isApprovedByAdmin,
    cancellationLimitReached: (user?.operatorCancellationCount || 0) >= 25,
    membershipStatus: operatorPayment?.status || 'pending',
    hasFullAccess: operatorPayment?.status === 'approved' && user?.hasUploadedAOC && user?.isApprovedByAdmin,
    paymentInfo: operatorPayment
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  // Mock operator data - replace with real API data
  const [operatorData, setOperatorData] = useState({
    operatorName: user?.operatorName || 'Premium Aviation Ltd.',
    firstName: 'John',
    lastName: 'Smith',
    email: user?.email || 'operator@jetup.aero',
    phone: '+1 (555) 123-4567',
    mobilePhone: '+1 (555) 987-6543',
    aocLicense: null as File | null,
    memberSince: '2024-01-15',
    operatorNumber: 'OP0001'
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
    setOperatorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setOperatorData(prev => ({
        ...prev,
        aocLicense: file
      }));
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword) {
      alert('Please enter your current password');
      return false;
    }
    
    if (passwordErrors.length > 0) {
      alert('Please fix password validation errors');
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return false;
    }
    
    try {
      // Simulate API call to verify current password and update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call
      console.log('Updating password...');
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors([]);
      setShowPasswordSection(false);
      
      alert('Password updated successfully!');
      return true;
    } catch (error) {
      console.error('Password update failed:', error);
      alert('Failed to update password. Please check your current password.');
      return false;
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // If password section is open, update password first
      if (showPasswordSection) {
        const passwordUpdated = await handlePasswordUpdate();
        if (!passwordUpdated) {
          setIsSaving(false);
          return;
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to update operator data
      console.log('Updating operator data:', operatorData);
      
      // If AOC license was uploaded, update user context
      if (uploadedFile) {
        // This would normally update the user's hasUploadedAOC status via API
        console.log('AOC License uploaded, waiting for admin approval');
      }
      
      setIsEditing(false);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setOperatorData({
      operatorName: 'Premium Aviation Ltd.',
      firstName: 'John',
      lastName: 'Smith',
      email: user?.email || 'operator@jetup.aero',
      phone: '+1 (555) 123-4567',
      mobilePhone: '+1 (555) 987-6543',
      aocLicense: null,
      memberSince: '2024-01-15',
      operatorNumber: 'OP0001'
    });
    setUploadedFile(null);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors([]);
    setShowPasswordSection(false);
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Edit Profile
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
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Operator Status & Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 mb-8"
      >
        {/* Membership Status */}
        {(() => {
          if (accessStatus.membershipStatus === 'pending_admin_approval') {
            return (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Membership Payment Under Review
                    </h3>
                    <p className="text-yellow-700 mt-1">
                      Your {accessStatus.paymentInfo?.planName} payment ({accessStatus.paymentInfo?.amount}) is being reviewed by our admin team.
                    </p>
                    <div className="mt-2 text-sm text-yellow-600">
                      <p><strong>Transfer Date:</strong> {accessStatus.paymentInfo?.transferDate ? new Date(accessStatus.paymentInfo.transferDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Reference:</strong> {accessStatus.paymentInfo?.referenceNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (accessStatus.membershipStatus === 'approved') {
            return (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-green-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-green-800">
                      ✅ Active {accessStatus.paymentInfo?.planName}
                    </h3>
                    <p className="text-green-700 mt-1">
                      Your membership is active! Full access to all operator features with 0% commission rate.
                    </p>
                    <div className="mt-2 text-sm text-green-600">
                      <p><strong>Plan:</strong> {accessStatus.paymentInfo?.planName}</p>
                      <p><strong>Commission Rate:</strong> 0%</p>
                      <p><strong>Approved:</strong> {accessStatus.paymentInfo?.approvedAt ? new Date(accessStatus.paymentInfo.approvedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (accessStatus.membershipStatus === 'rejected') {
            return (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <XCircle className="h-6 w-6 text-red-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-800">
                      ❌ Membership Payment Rejected
                    </h3>
                    <p className="text-red-700 mt-1">
                      Your {accessStatus.paymentInfo?.planName} payment was rejected. Please contact support or submit a new payment.
                    </p>
                    <div className="mt-2 text-sm text-red-600">
                      <p><strong>Rejected:</strong> {accessStatus.paymentInfo?.rejectedAt ? new Date(accessStatus.paymentInfo.rejectedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <Link
                    to="/operator/membership"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </Link>
                </div>
              </div>
            );
          } else {
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Crown className="h-6 w-6 text-amber-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-amber-800">
                      ⚠️ Membership Required
                    </h3>
                    <p className="text-amber-700 mt-1">
                      You need an active membership to receive booking requests and manage your fleet. Choose a plan to get started.
                    </p>
                  </div>
                  <Link
                    to="/operator/membership"
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Choose Plan
                  </Link>
                </div>
              </div>
            );
          }
        })()}

        {/* Operator Requirements Checklist */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-blue-800">Operator Requirements Checklist</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Membership Status */}
            <div className="flex items-center">
              {operatorPayment?.status === 'approved' ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  operatorPayment?.status === 'approved' ? 'text-green-700' : 'text-red-700'
                }`}>
                  Active Membership
                </p>
                <p className="text-xs text-gray-600">
                  {accessStatus.hasMembership 
                    ? `${accessStatus.paymentInfo?.planName} - 0% Commission`
                    : accessStatus.membershipStatus === 'pending_admin_approval'
                    ? 'Payment under review'
                    : accessStatus.membershipStatus === 'rejected'
                    ? 'Payment rejected - resubmit required'
                    : 'No membership plan selected'
                  }
                </p>
              </div>
            </div>

            {/* AOC License Status */}
            <div className="flex items-center">
              {accessStatus.hasAOC ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                ) : user?.hasUploadedAOC ? (
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  accessStatus.hasAOC 
                    ? 'text-green-700' 
                    : user?.hasUploadedAOC 
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  AOC License
                </p>
                <p className="text-xs text-gray-600">
                  {accessStatus.hasAOC 
                    ? 'Approved by admin'
                    : user?.hasUploadedAOC 
                    ? 'Pending admin approval'
                    : 'Upload required'
                  }
                </p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="flex items-center">
              {operatorData.operatorName && operatorData.firstName && operatorData.lastName && operatorData.phone ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  operatorData.operatorName && operatorData.firstName && operatorData.lastName && operatorData.phone
                    ? 'text-green-700' : 'text-red-700'
                }`}>
                  Profile Information
                </p>
                <p className="text-xs text-gray-600">
                  {operatorData.operatorName && operatorData.firstName && operatorData.lastName && operatorData.phone
                    ? 'Complete profile information'
                    : 'Missing required information'
                  }
                </p>
              </div>
            </div>

            {/* Booking Capability */}
            <div className="flex items-center">
              {accessStatus.hasFullAccess ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  accessStatus.hasFullAccess
                    ? 'text-green-700' : 'text-red-700'
                }`}>
                  Booking Capability
                </p>
                <p className="text-xs text-gray-600">
                  {accessStatus.hasFullAccess
                    ? 'Can receive booking requests'
                    : 'Complete requirements to receive bookings'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Required Notice */}
          {!accessStatus.hasFullAccess && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">Action Required</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Complete all requirements above to start receiving booking requests from customers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operator Name</label>
              <input
                type="text"
                name="operatorName"
                value={operatorData.operatorName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operator Number</label>
              <input
                type="text"
                value={user?.operatorId || 'OID00001'}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={operatorData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={operatorData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={operatorData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(operatorData.memberSince).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>

          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={operatorData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
              <input
                type="tel"
                name="mobilePhone"
                value={operatorData.mobilePhone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>
        </div>

        {/* AOC License Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AOC License</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {!isEditing ? (
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {operatorData.aocLicense ? 'AOC License uploaded' : 'No AOC License uploaded'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="aoc-upload"
                />
                <label
                  htmlFor="aoc-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-1 text-sm">Click to upload AOC License</p>
                  <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
                </label>
                {uploadedFile && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <p className="text-green-700">Selected: {uploadedFile.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Password Update Section */}
        {isEditing && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showPasswordSection ? 'Cancel' : 'Update Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter new password"
                      required
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
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      8+ characters
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Uppercase letter
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[0-9]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Number
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      Special character
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Confirm new password"
                      required
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
                  {passwordData.confirmPassword && (
                    <div className="mt-1">
                      {passwordData.newPassword === passwordData.confirmPassword ? (
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorSettings;