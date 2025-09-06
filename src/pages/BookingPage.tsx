import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Search, Plane, ArrowRight, MapPin, Lock, AlertTriangle, Crown, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import AirportSelector from '../components/AirportSelector';
import DateTimePicker from '../components/TimePicker';
import { getDiscountInfo } from '../utils/membershipUtils';
import { getMinimumBookingTime, validateMinimumBookingTime, getTimezoneDisplayName, getCurrentTimeInAirportTimezone } from '../utils/timezoneUtils';

const BookingPage: React.FC = () => {
  const { user, addBookingRequest, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [useDiscountOption, setUseDiscountOption] = useState(false);
  const [timezoneInfo, setTimezoneInfo] = useState<string>('');
  const [minimumDateTime, setMinimumDateTime] = useState<string>('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Check if user is operator or admin
  const isOperatorOrAdmin = user?.role === 'operator' || user?.role === 'admin';
  
  // Check membership status for customers
  const checkMembershipStatus = () => {
    if (user?.role !== 'customer') return { canBook: true, reason: '' };
    
    const now = new Date();
    const expiryDate = user.membershipExpiryDate ? new Date(user.membershipExpiryDate) : null;
    
    // Check if membership expired
    if (expiryDate && now > expiryDate) {
      return { canBook: false, reason: 'membership_expired' };
    }
    
    // Check booking limit for standard membership
    if (!user.membershipType || user.membershipType === 'standard') {
      const currentBookingCount = user.bookingCount || 0;
      const bookingLimit = user.bookingLimit || 10;
      
      if (currentBookingCount >= bookingLimit) {
        return { canBook: false, reason: 'booking_limit_reached' };
      }
    }
    
    return { canBook: true, reason: '' };
  };
  
  const membershipStatus = checkMembershipStatus();
  const isCustomerProfileApproved = user?.role === 'customer' ? user?.profileCompletionStatus === 'approved' : true;
  const isBookingDisabled = isOperatorOrAdmin || !isCustomerProfileApproved || !membershipStatus.canBook;
  
  // Get form data from URL parameters
  const urlFrom = searchParams.get('from') || '';
  const urlTo = searchParams.get('to') || '';
  const urlDeparture = searchParams.get('departure') || '';
  const urlReturn = searchParams.get('return') || '';
  const urlPassengers = parseInt(searchParams.get('passengers') || '1');
  const urlTripType = searchParams.get('tripType') || 'oneWay';
  
  const [formData, setFormData] = useState({
    from: urlFrom,
    to: urlTo,
    departure: urlDeparture,
    return: urlReturn,
    passengers: urlPassengers,
    tripType: urlTripType as 'oneWay' | 'roundTrip',
    specialRequests: '',
    discountRequested: false
  });

  // Update minimum datetime when departure location changes
  React.useEffect(() => {
    if (formData.from) {
      const minTime = getMinimumBookingTime(formData.from);
      setMinimumDateTime(minTime);
      
      const timezoneDisplay = getTimezoneDisplayName(formData.from);
      const currentAirportTime = getCurrentTimeInAirportTimezone(formData.from);
      setTimezoneInfo(`${timezoneDisplay} - Current time: ${currentAirportTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
      
      // Clear departure time if it's now invalid
      if (formData.departure) {
        const validation = validateMinimumBookingTime(formData.departure, formData.from);
        if (!validation.isValid) {
          setFormData(prev => ({ ...prev, departure: '' }));
        }
      }
    } else {
      setMinimumDateTime('');
      setTimezoneInfo('');
    }
  }, [formData.from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (isBookingDisabled) return;
    
    const { name, value } = e.target;
    
    // Handle date and time separately for better validation
    if (name === 'departure') {
      // Date selection
      const currentTime = formData.departure.split('T')[1] || '';
      const newDateTime = currentTime ? `${value}T${currentTime}` : value;
      
      if (newDateTime.includes('T') && formData.from) {
        const validation = validateMinimumBookingTime(newDateTime, formData.from);
        if (!validation.isValid) {
          alert(validation.message);
          return;
        }
      }
      
      setFormData({
        ...formData,
        departure: newDateTime
      });
      return;
    }
    
    if (name === 'departureHour' || name === 'departureMinute') {
      // Hour or minute selection
      const currentDate = formData.departure.split('T')[0] || '';
      const currentHour = formData.departure.split('T')[1]?.split(':')[0] || '';
      const currentMinute = formData.departure.split('T')[1]?.split(':')[1] || '';
      
      const newHour = name === 'departureHour' ? value : currentHour;
      const newMinute = name === 'departureMinute' ? value : currentMinute;
      
      if (currentDate && newHour && newMinute) {
        const newDateTime = `${currentDate}T${newHour}:${newMinute}`;
        
        if (formData.from) {
          const validation = validateMinimumBookingTime(newDateTime, formData.from);
          if (!validation.isValid) {
            alert(validation.message);
            return;
          }
        }
        
        setFormData({
          ...formData,
          departure: newDateTime
        });
      }
      return;
    }
    
    if (name === 'return') {
      // Return date selection
      const currentReturnTime = formData.return.split('T')[1] || '12:00';
      const newReturnDateTime = `${value}T${currentReturnTime}`;
      
      setFormData({
        ...formData,
        return: newReturnDateTime
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePassengerChange = (increment: boolean) => {
    if (isBookingDisabled) return;
    
    const newPassengers = increment ? formData.passengers + 1 : formData.passengers - 1;
    if (newPassengers >= 1 && newPassengers <= 200) {
      setFormData({
        ...formData,
        passengers: newPassengers
      });
    }
  };

  const handleTripTypeChange = (type: 'oneWay' | 'roundTrip') => {
    if (isBookingDisabled) return;
    
    setFormData({
      ...formData,
      tripType: type,
      return: type === 'oneWay' ? '' : formData.return
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent operators, admins, and unapproved customers from booking
    if (isBookingDisabled) {
      return;
    }
    
    // Additional membership check with user feedback
    if (!membershipStatus.canBook) {
      if (membershipStatus.reason === 'membership_expired') {
        alert('Your membership has expired. Please upgrade to continue booking flights.');
        navigate('/customer/membership');
      } else if (membershipStatus.reason === 'booking_limit_reached') {
        alert('You have reached your booking limit for the standard plan. Please upgrade to continue booking flights.');
        navigate('/customer/membership');
      }
      return;
    }
    
    // Validate required fields
    if (!formData.from || !formData.to || !formData.departure) {
      alert('Please fill in all required fields (From, To, Departure)');
      return;
    }
    
    if (formData.tripType === 'roundTrip' && !formData.return) {
      alert('Please select a return date for round trip');
      return;
    }
    
    // Show confirmation modal instead of directly submitting
    setShowConfirmationModal(true);
  };

  const handleConfirmBooking = () => {
    const newRequest = {
      id: Date.now().toString(),
      bookingNumber: '', // Will be generated by addBookingRequest
      type: 'flight_request' as const,
      customer: user?.name || 'Unknown',
      email: user?.email || '',
      from: formData.from,
      to: formData.to,
      departure: formData.departure,
      return: formData.return,
      passengers: formData.passengers,
      tripType: formData.tripType,
      specialRequests: formData.specialRequests,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      offers: [],
      rejectedByOperators: [],
      discountRequested: useDiscountOption,
      customerMembershipType: user?.membershipType || 'basic'
    };
    
    // Add to global state
    addBookingRequest(newRequest);
    
    // Show success message
    alert(`Flight request sent successfully! Operators will send you offers within 24 hours. You can track the status in your booking history.`);
    
    // Navigate to customer dashboard booking history
    navigate('/customer/history');
    
    // Reset form
    setShowConfirmationModal(false);
    setFormData({
      from: '',
      to: '',
      departure: '',
      return: '',
      passengers: 1,
      tripType: 'oneWay',
      specialRequests: '',
      discountRequested: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8" style={{backgroundColor: '#0B1733'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-12">
              Create Flight Request
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Tell us your travel needs and receive personalized proposals from verified operators
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#0B1733'}}>
                  <img 
                    src="/Up-app-logo.png" 
                    alt="JETUP" 
                    className="h-8 w-auto"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Flight Request</h3>
                <p className="text-gray-600">Please review your booking details before submitting</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Flight Route Map */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Flight Route</h4>
                    
                    {/* Simple Route Map */}
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-sm">
                              {formData.from.substring(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{formData.from}</p>
                        </div>
                        
                        <div className="flex-1 relative">
                          <div className="h-0.5 bg-blue-600 relative">
                            <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 bg-white rounded-full p-1" />
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-xs text-blue-600 font-medium">Direct Flight</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-sm">
                              {formData.to.substring(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{formData.to}</p>
                        </div>
                      </div>
                      
                      {formData.tripType === 'roundTrip' && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="flex items-center justify-center space-x-2">
                            <ArrowRight className="h-4 w-4 text-blue-600 transform rotate-180" />
                            <span className="text-sm text-blue-600 font-medium">Round Trip</span>
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discount Information */}
                  {useDiscountOption && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Crown className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-800">Membership Discount Requested</h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        You've requested a {user?.membershipType === 'standard' ? '5' : '10'}% discount on all operator offers. 
                        All operators will see your discount request and adjust their prices accordingly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Route:</span>
                        <span className="text-sm text-gray-900 font-medium">{formData.from} → {formData.to}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Departure:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(formData.departure).toLocaleDateString()} at {new Date(formData.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      
                      {formData.tripType === 'roundTrip' && formData.return && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Return:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(formData.return).toLocaleDateString()} at {new Date(formData.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Passengers:</span>
                        <span className="text-sm text-gray-900">{formData.passengers} people</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Trip Type:</span>
                        <span className="text-sm text-gray-900 capitalize">
                          {formData.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Customer:</span>
                        <span className="text-sm text-gray-900">{user?.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <span className="text-sm text-gray-900">{user?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {formData.specialRequests && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h4>
                      <p className="text-gray-700 text-sm">{formData.specialRequests}</p>
                    </div>
                  )}

                  {/* LTC Warning in Modal */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 text-sm">
                          For all booking request (one-way and road trip), the departure time is considered LTC. On Instant Booking, departure is accepted 3 hours after local time! JETUP disclaims any liability for any inconveniences that may arise. Please visit the{' '}
                          <a href="/disclaimer" className="text-yellow-900 underline hover:text-yellow-700 font-medium">
                            Disclaimer page
                          </a>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowConfirmationModal(false)}
                      className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Form */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Access Restriction Notice for Operators/Admins */}
          {isBookingDisabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-8"
            >
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-amber-800 mb-4">
                  {isOperatorOrAdmin ? 'Access Restricted' : 'Profile Approval Required'}
                </h2>
                <p className="text-amber-700 text-lg mb-6">
                  {isOperatorOrAdmin ? (
                    user?.role === 'operator' 
                    ? 'As an operator, you cannot create flight requests. Please use your operator dashboard to manage your aircraft and routes.'
                    : 'As an administrator, you cannot create flight requests. Please use your admin dashboard to manage the platform.'
                  ) : (
                    !isCustomerProfileApproved 
                      ? 'Your profile must be completed and approved by our admin team before you can create flight requests. This is required for aviation security compliance.'
                      : membershipStatus.reason === 'membership_expired'
                      ? 'Your membership has expired. Please upgrade to continue booking flights.'
                      : membershipStatus.reason === 'booking_limit_reached'
                      ? 'You have reached your booking limit for the standard plan. Please upgrade to unlimited bookings.'
                      : 'Unable to create booking request at this time.'
                  )}
                </p>
                <div className="flex justify-center space-x-4">
                  {isOperatorOrAdmin ? (
                    <button
                      onClick={() => navigate(user?.role === 'operator' ? '/operator' : '/admin')}
                      className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                    >
                      Go to {user?.role === 'operator' ? 'Operator' : 'Admin'} Dashboard
                    </button>
                  ) : !isCustomerProfileApproved ? (
                    <button
                      onClick={() => navigate('/customer/settings')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Complete Profile
                    </button>
                  ) : (membershipStatus.reason === 'membership_expired' || membershipStatus.reason === 'booking_limit_reached') ? (
                    <button
                      onClick={() => navigate('/customer/membership')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Upgrade Membership
                    </button>
                  ) : null}
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-white rounded-2xl shadow-lg p-8 ${isBookingDisabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Trip Type Selection */}
              <div className="flex justify-center">
                <div className="flex bg-gray-50 border border-gray-300 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => handleTripTypeChange('oneWay')}
                    disabled={isBookingDisabled}
                    className={`py-3 px-8 rounded-lg text-sm font-normal transition-colors ${
                      formData.tripType === 'oneWay'
                        ? `${isBookingDisabled ? 'bg-gray-400 text-gray-600' : 'bg-red-600 text-white'} shadow-sm`
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTripTypeChange('roundTrip')}
                    disabled={isBookingDisabled}
                    className={`py-3 px-8 rounded-lg text-sm font-normal transition-colors ${
                      formData.tripType === 'roundTrip'
                        ? `${isBookingDisabled ? 'bg-gray-400 text-gray-600' : 'bg-red-600 text-white'} shadow-sm`
                        : 'text-gray-500 hover:text-gray-700 bg-transparent'
                    }`}
                  >
                    Round Trip
                  </button>
                </div>
              </div>

              {/* Main Form - Horizontal Layout */}
              <div className="space-y-6">
                {/* From and To - Wider Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* From */}
                  <div>
                    <AirportSelector
                      value={formData.from}
                      onChange={(value) => setFormData({ ...formData, from: value })}
                      placeholder="From"
                      name="from"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* To */}
                  <div>
                    <AirportSelector
                      value={formData.to}
                      onChange={(value) => setFormData({ ...formData, to: value })}
                      placeholder="To"
                      name="to"
                      required
                      className="w-full"
                      excludeAirport={formData.from}
                    />
                  </div>
                </div>

                {/* Date and Passengers Row */}
                <div className={`grid gap-6 ${formData.tripType === 'roundTrip' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {/* Date & Time Combined */}
                  <div>
                    <DateTimePicker
                      value={formData.departure.split('T')[1]?.substring(0, 5) || ''}
                      value={formData.departure}
                      onChange={(datetime) => {
                        if (datetime && formData.from) {
                          const validation = validateMinimumBookingTime(datetime, formData.from);
                          if (!validation.isValid) {
                            alert(validation.message);
                            return;
                          }
                        }
                        setFormData({
                          ...formData,
                          departure: datetime
                        });
                      }}
                      placeholder={formData.tripType === 'oneWay' ? "Flight Date" : "Departure Date"}
                      required
                      minDateTime={minimumDateTime}
                      timezoneInfo={timezoneInfo}
                    />
                  </div>

                  {/* Return Date & Time */}
                  {formData.tripType === 'roundTrip' && (
                    <div>
                      <DateTimePicker
                        value={formData.return}
                        onChange={(datetime) => {
                          setFormData({
                            ...formData,
                            return: datetime
                          });
                        }}
                        placeholder="Return Flight Date"
                        required
                        minDateTime={formData.departure || minimumDateTime}
                        timezoneInfo={formData.to ? (() => {
                          const returnTimezoneDisplay = getTimezoneDisplayName(formData.to);
                          const returnCurrentTime = getCurrentTimeInAirportTimezone(formData.to);
                          return `${returnTimezoneDisplay} - Current: ${returnCurrentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                        })() : undefined}
                      />
                    </div>
                  )}

                  {/* Passengers */}
                  <div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <div className="w-full pl-10 pr-20 py-4 border border-gray-300 rounded-xl bg-gray-50 flex items-center text-sm">
                        <span className="flex-1 text-gray-900">{formData.passengers} {formData.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
                      </div>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handlePassengerChange(false)}
                          disabled={formData.passengers <= 1}
                          className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-black disabled:text-gray-400 font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePassengerChange(true)}
                          disabled={formData.passengers >= 200}
                          className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-black disabled:text-gray-400 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Those aged 18 and under are counted as passengers.
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    disabled={isBookingDisabled}
                    rows={3}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl resize-vertical ${
                      isBookingDisabled 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
                    }`}
                    placeholder="Any special requirements, catering preferences, or additional services..."
                  />
                </div>

                {/* Discount Option for Flight Request */}
                {user?.role === 'customer' && (user?.membershipType === 'standard' || user?.membershipType === 'premium') && !isBookingDisabled && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Crown className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Request Membership Discount</h4>
                    </div>
                    
                    {(() => {
                      const discountInfo = getDiscountInfo(user, 'General'); // General for flight requests
                      
                      if (discountInfo.canUseDiscount) {
                        return (
                          <div>
                            <label className="flex items-center space-x-2 cursor-pointer mb-2">
                              <input
                                type="checkbox"
                                checked={useDiscountOption}
                                onChange={(e) => setUseDiscountOption(e.target.checked)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-green-700">
                                Request {discountInfo.discountPercentage}% discount on all operator offers
                              </span>
                            </label>
                            <p className="text-xs text-green-600">
                              Remaining: {discountInfo.remainingTotalDiscounts || 20}/20 total, 2 per operator
                            </p>
                            {useDiscountOption && (
                              <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
                                ✅ All operators will see your {discountInfo.discountPercentage}% discount request and adjust their offers
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-sm text-green-700">
                            <p className="mb-2">You have used all your discount rights for this period.</p>
                            <p className="text-xs text-green-600">
                              Total discounts used: {discountInfo.totalDiscountsUsed || 0}/20
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* LTC Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 text-sm">
                        For all booking request (one-way and road trip), the departure time is considered LTC. On Instant Booking, departure is accepted 3 hours after local time! JETUP disclaims any liability for any inconveniences that may arise. Please visit the{' '}
                        <a href="/disclaimer" className="text-yellow-900 underline hover:text-yellow-700 font-medium">
                          Disclaimer page
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Centered */}
                <div className="flex justify-center pt-4">
                  {/* Membership Upgrade Notice for Standard Users */}
                  {user?.role === 'customer' && user?.membershipType === 'standard' && (
                    <div className="w-full max-w-md mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Crown className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Get Flight Discounts</span>
                        </div>
                        <p className="text-xs text-blue-700 mb-3">
                          Upgrade to Standard (5% off) or Premium (10% off) to save on all your flight bookings! Get 2 uses per operator (20 total limit).
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/customer/membership')}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Membership
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Membership Upgrade Notice for Basic Users */}
                  {user?.role === 'customer' && user?.membershipType === 'basic' && (
                    <div className="w-full max-w-md mb-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">No Discount Available</span>
                        </div>
                        <p className="text-xs text-amber-700 mb-3">
                          Basic members cannot use discounts. Upgrade to Standard (5% off) or Premium (10% off) to get discount rights!
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/customer/membership')}
                          className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                        >
                          Upgrade for Discounts
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="w-full max-w-md">
                    <motion.button
                      type="submit"
                      disabled={isBookingDisabled}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
                        isBookingDisabled
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'text-white hover:bg-red-600'
                      }`}
                      style={{ backgroundColor: '#0B1733' }}
                    >
                      {isOperatorOrAdmin ? (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Access Restricted</span>
                        </>
                      ) : (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Profile Approval Required</span>
                        </>
                      ) : membershipStatus.reason === 'cancellation_limit_reached' ? (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Cancellation Limit Reached</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          <span>Create Request</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;