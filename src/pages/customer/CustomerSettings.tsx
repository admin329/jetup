import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Upload, Save, AlertCircle, Lock, Eye, EyeOff, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerSettings: React.FC = () => {
  const { user } = useAuth();
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
  
  // Mock customer data - replace with real API data
  const [customerData, setCustomerData] = useState({
    customerId: user?.customerId || 'CID00001',
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Smith',
    email: user?.email || 'customer@example.com',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    memberSince: user?.memberSince || '2024-01-15',
    hasUploadedID: user?.hasUploadedID || false,
    isProfileApproved: user?.isProfileApproved || false,
    profileCompletionStatus: user?.profileCompletionStatus || 'incomplete'
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setCustomerData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
      setCustomerData(prev => ({
        ...prev,
        hasUploadedID: true,
        profileCompletionStatus: 'pending'
      }));
    } else {
      alert('Please upload a PDF or image file (JPG, PNG).');
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
      // Validate required fields
      if (!customerData.firstName || !customerData.lastName || !customerData.phone) {
        alert('Please fill in all required fields (First Name, Last Name, Phone)');
        setIsSaving(false);
        return;
      }
      
      if (!customerData.address.street || !customerData.address.city || !customerData.address.state || !customerData.address.zipCode) {
        alert('Please fill in complete address information');
        setIsSaving(false);
        return;
      }
      
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
      
      // Here you would make the actual API call to update customer data
      console.log('Updating customer data:', customerData);
      
      // If ID document was uploaded, set status to pending
      if (uploadedFile && !customerData.hasUploadedID) {
        setCustomerData(prev => ({
          ...prev,
          hasUploadedID: true,
          profileCompletionStatus: 'pending'
        }));
        
        // Update user context
        if (user) {
          const updatedUser = {
            ...user,
            hasUploadedID: true,
            profileCompletionStatus: 'pending'
          };
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        console.log('ID document uploaded, waiting for admin approval');
      }
      
      setIsEditing(false);
      alert('Profile updated successfully! If you uploaded an ID document, it will be reviewed by our admin team.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setCustomerData({
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Smith',
      email: user?.email || 'customer@example.com',
      phone: user?.phone || '',
      address: user?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      },
      memberSince: user?.memberSince || '2024-01-15',
      hasUploadedID: user?.hasUploadedID || false,
      isProfileApproved: user?.isProfileApproved || false,
      profileCompletionStatus: user?.profileCompletionStatus || 'incomplete'
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

  const getProfileStatusInfo = () => {
    switch (customerData.profileCompletionStatus) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Profile Approved',
          message: 'Your profile has been approved by our admin team. You can now make bookings.'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Profile Under Review',
          message: 'Your profile is being reviewed by our admin team. You cannot make bookings until approved.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Profile Rejected',
          message: 'Your profile was rejected. Please update your information and ID document.'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Profile Incomplete',
          message: 'Please complete your profile and upload ID document to start booking flights.'
        };
    }
  };

  const profileStatus = getProfileStatusInfo();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
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

      <div className="space-y-6">
        {/* Profile Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${profileStatus.bgColor} ${profileStatus.borderColor} border rounded-lg p-6`}
        >
          <div className="flex items-center space-x-4">
            <profileStatus.icon className={`h-8 w-8 ${profileStatus.color}`} />
            <div>
              <h3 className={`text-lg font-semibold ${profileStatus.color}`}>
                {profileStatus.title}
              </h3>
              <p className={`${profileStatus.color} mt-1`}>
                {profileStatus.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={customerData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={customerData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={customerData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(customerData.memberSince).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                value={customerData.customerId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.street"
                value={customerData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="123 Main Street"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.city"
                value={customerData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="New York"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.state"
                value={customerData.address.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="NY"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={customerData.address.zipCode}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="10001"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="address.country"
                value={customerData.address.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                }`}
                required
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Turkey">Turkey</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* ID Document Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Identity Document</h3>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Required for Aviation Security</span>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-800 text-sm font-medium mb-1">Aviation Security Requirement</p>
                <p className="text-blue-700 text-sm">
                  Due to aviation security regulations, all passengers must provide valid government-issued photo identification. 
                  This document will be securely stored and only used for flight verification purposes.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`border-2 border-dashed rounded-lg p-6 ${
            customerData.hasUploadedID ? 'border-green-300 bg-green-50' : 'border-gray-300'
          }`}>
            {!isEditing ? (
              <div className="text-center">
                {customerData.hasUploadedID ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-green-700 font-medium">ID Document Uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-500">No ID Document uploaded</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="id-upload"
                />
                <label
                  htmlFor="id-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-1 text-sm font-medium">
                    {customerData.hasUploadedID ? 'Replace ID Document' : 'Upload ID Document'}
                    <span className="text-red-500 ml-1">*</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Accepted: Passport, Driver's License, National ID
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG files only, max 10MB</p>
                </label>
                {uploadedFile && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <p className="text-green-700">Selected: {uploadedFile.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Document Status */}
          {customerData.hasUploadedID && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Document Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  customerData.profileCompletionStatus === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : customerData.profileCompletionStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : customerData.profileCompletionStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {customerData.profileCompletionStatus === 'approved' ? 'Approved' :
                   customerData.profileCompletionStatus === 'pending' ? 'Under Review' :
                   customerData.profileCompletionStatus === 'rejected' ? 'Rejected' : 'Incomplete'}
                </span>
              </div>
            </div>
          )}
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

        {/* Booking Restriction Notice */}
        {customerData.profileCompletionStatus !== 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-amber-800 mb-2">Booking Restrictions</h3>
                <p className="text-amber-700 mb-3">
                  To comply with aviation security regulations, you must complete your profile and have it approved before making flight bookings.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-3 ${
                      customerData.firstName && customerData.lastName && customerData.phone && 
                      customerData.address.street && customerData.address.city && customerData.address.state && customerData.address.zipCode
                        ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                    <span className={customerData.firstName && customerData.lastName && customerData.phone && 
                      customerData.address.street && customerData.address.city && customerData.address.state && customerData.address.zipCode
                        ? 'text-green-700' : 'text-amber-700'
                    }>
                      Complete profile information
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-3 ${customerData.hasUploadedID ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className={customerData.hasUploadedID ? 'text-green-700' : 'text-amber-700'}>
                      Upload valid ID document
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-3 ${customerData.profileCompletionStatus === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    <span className={customerData.profileCompletionStatus === 'approved' ? 'text-green-700' : 'text-amber-700'}>
                      Admin approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">All data is encrypted and securely stored</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">ID documents used only for flight verification</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Compliance with aviation security regulations</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">Data never shared with third parties</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">24/7 security monitoring</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-gray-700 text-sm">GDPR compliant data handling</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerSettings;