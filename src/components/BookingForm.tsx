import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Search, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AirportSelector from './AirportSelector';
import { Crown } from 'lucide-react';

interface BookingFormProps {
  onOpenAuthModal?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    tripType: 'oneWay'
  });

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
    
    // Check cancellation limit
    const currentCancellations = user?.cancellationCount || 0;
    const cancellationLimit = user?.cancellationLimit || 10;
    
    if (currentCancellations >= cancellationLimit) {
      return { canBook: false, reason: 'cancellation_limit_reached' };
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
  const canMakeBooking = !isOperatorOrAdmin && 
                        (user?.role === 'customer' ? user?.profileCompletionStatus === 'approved' : true) &&
                        membershipStatus.canBook;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent operators and admins from booking
    if (isOperatorOrAdmin) {
      return;
    }
    
    // Check membership status
    if (!membershipStatus.canBook) {
      if (membershipStatus.reason === 'membership_expired') {
        alert('Your membership has expired. Please upgrade to continue booking flights.');
        window.location.href = '/customer/membership';
      } else if (membershipStatus.reason === 'booking_limit_reached') {
        alert('You have reached your booking limit for the standard plan. Please upgrade to continue booking flights.');
        window.location.href = '/customer/membership';
      }
      return;
    }
    
    if (!isAuthenticated) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      }
      return;
    }
    
    // Navigate to booking page with form data as URL parameters
    const params = new URLSearchParams();
    if (formData.from) params.set('from', formData.from);
    if (formData.to) params.set('to', formData.to);
    if (formData.departure) params.set('departure', formData.departure);
    if (formData.return && formData.tripType === 'roundTrip') params.set('return', formData.return);
    if (formData.passengers) params.set('passengers', formData.passengers.toString());
    if (formData.tripType) params.set('tripType', formData.tripType);
    
    navigate(`/booking?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePassengerChange = (increment: boolean) => {
    const currentPassengers = formData.passengers;
    let newPassengers = increment ? currentPassengers + 1 : currentPassengers - 1;
    
    // Min 1, Max 200 sınırı
    if (newPassengers < 1) newPassengers = 1;
    if (newPassengers > 200) newPassengers = 200;
    
    setFormData({
      ...formData,
      passengers: newPassengers
    });
  };

  const handleTripTypeChange = (type: 'oneWay' | 'roundTrip') => {
    setFormData({
      ...formData,
      tripType: type,
      return: type === 'oneWay' ? '' : formData.return
    });
  };

  return (
    <>
      <motion.div
        className="rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md"
        style={{ backgroundColor: '#F1F6FC' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Trip Type Selection */}
          <div className="flex bg-gray-200 rounded-xl p-1 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => handleTripTypeChange('oneWay')}
              className={`flex-1 py-4 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                formData.tripType === 'oneWay'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 bg-transparent'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange('roundTrip')}
              className={`flex-1 py-4 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                formData.tripType === 'roundTrip'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 bg-transparent'
              }`}
            >
              Round Trip
            </button>
          </div>

          {/* From and To - Side by Side */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <AirportSelector
                value={formData.from}
                onChange={(value) => setFormData({ ...formData, from: value })}
                placeholder="From"
                name="from"
                required
              />
            </div>

            <div>
              <AirportSelector
                value={formData.to}
                onChange={(value) => setFormData({ ...formData, to: value })}
                placeholder="To"
                name="to"
                required
                excludeAirport={formData.from}
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <div className="w-full pl-8 sm:pl-10 pr-16 sm:pr-20 py-4 border border-gray-200 rounded-xl bg-gray-50 text-xs sm:text-sm flex items-center">
                <span className="flex-1">{formData.passengers} {formData.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handlePassengerChange(false)}
                  disabled={formData.passengers <= 1}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 disabled:text-gray-400 text-xs font-bold"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handlePassengerChange(true)}
                  disabled={formData.passengers >= 200}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 disabled:text-gray-400 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 text-center">
            {isOperatorOrAdmin ? (
              <p className="text-amber-800 text-xs sm:text-xs mb-2 sm:mb-3">
                <strong>Booking disabled:</strong> Operators and admins cannot make bookings
              </p>
            ) : !isAuthenticated ? (
              <p className="text-amber-800 text-xs sm:text-xs mb-2 sm:mb-3">
                <strong>Membership required:</strong> Please login or register to continue
              </p>
            ) : (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? (
              <p className="text-amber-800 text-xs sm:text-xs mb-2 sm:mb-3">
                <strong>Profile approval required:</strong> Complete your profile and get admin approval to book flights
              </p>
            ) : !membershipStatus.canBook ? (
              <p className="text-amber-800 text-xs sm:text-xs mb-2 sm:mb-3">
                <strong>
                  {membershipStatus.reason === 'membership_expired' ? 'Membership expired:' : 
                   membershipStatus.reason === 'booking_limit_reached' ? 'Booking limit reached:' :
                   membershipStatus.reason === 'cancellation_limit_reached' ? 'Cancellation limit reached:' : 'Booking restricted:'}
                </strong> 
                {membershipStatus.reason === 'membership_expired' 
                  ? ' Please upgrade your membership to continue booking' 
                  : membershipStatus.reason === 'booking_limit_reached'
                  ? ' Upgrade to unlimited bookings'
                  : membershipStatus.reason === 'cancellation_limit_reached'
                  ? ' You have cancelled too many confirmed bookings'
                  : ' Please contact support'}
              </p>
            ) : (user?.role === 'customer' && user?.membershipType === 'standard') ? (
              <div className="space-y-2">
                <p className="text-green-800 text-xs sm:text-xs mb-1">
                  You'll receive confirmation within 3 hours.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Crown className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">Get Flight Discounts</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">
                    Standard: 5% off, Premium: 10% off - 2 per operator, 20 total
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/customer/membership')}
                    className="w-full px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-green-800 text-xs sm:text-xs mb-2 sm:mb-3">
                <strong>Welcome back!</strong> Ready to search for your perfect flight
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!canMakeBooking}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
              !canMakeBooking
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'text-white hover:bg-red-600'
            }`}
            style={{ backgroundColor: '#0B1733' }}
          >
            {isOperatorOrAdmin ? (
              <>
                <Lock className="h-4 w-4 sm:h-4 sm:w-4" />
                <span>Booking Disabled</span>
              </>
            ) : (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? (
              <>
                <Lock className="h-4 w-4 sm:h-4 sm:w-4" />
                <span>Profile Approval Required</span>
              </>
            ) : !membershipStatus.canBook ? (
              <>
                <Lock className="h-4 w-4 sm:h-4 sm:w-4" />
                <span>
                  {membershipStatus.reason === 'cancellation_limit_reached' ? 'Cancellation Limit Reached' : 
                   membershipStatus.reason === 'membership_expired' ? 'Membership Expired' : 'Booking Limit Reached'}
                </span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 sm:h-4 sm:w-4" />
                <span>Search Private Jets</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default BookingForm;
