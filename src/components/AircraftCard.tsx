import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MapPin, Gauge, Building2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Aircraft {
  id: string;
  name: string;
  type: string;
  capacity: number;
  range: string;
  speed: string;
  image: string;
  operator: string;
  country: string;
}

interface AircraftCardProps {
  aircraft: Aircraft;
  showOperator?: boolean;
  onRequestQuote?: () => void;
  isAuthenticated?: boolean;
}

const AircraftCard: React.FC<AircraftCardProps> = ({ aircraft, showOperator = true, onRequestQuote, isAuthenticated = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  const handleRequestQuote = () => {
    // Prevent operators and admins from booking
    if (isOperatorOrAdmin) {
      return;
    }
    
    // Prevent customers without approved profile from booking
    if (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') {
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
    
    if (isAuthenticated) {
      navigate('/booking');
    } else if (onRequestQuote) {
      onRequestQuote();
    }
  };

  const isBookingDisabled = isOperatorOrAdmin || 
                           (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ||
                           !membershipStatus.canBook;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={aircraft.image}
          alt={aircraft.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
          {aircraft.type}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{aircraft.name}</h3>
        
        {/* Country - Always visible to everyone */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{aircraft.country}</span>
        </div>
        
        {/* Operator - Only visible to authenticated users when showOperator is true */}
        {showOperator && isAuthenticated && aircraft.operator && (
          <div className="flex items-center text-gray-600 mb-4">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="text-sm">{aircraft.operator}</span>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <div>
              <p className="text-gray-500">Capacity</p>
              <p className="font-semibold">{aircraft.capacity}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-blue-600 mr-2" />
            <div>
              <p className="text-gray-500">Range</p>
              <p className="font-semibold">{aircraft.range}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Gauge className="h-4 w-4 text-blue-600 mr-2" />
            <div>
              <p className="text-gray-500">Speed</p>
              <p className="font-semibold">{aircraft.speed}</p>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRequestQuote}
          disabled={isBookingDisabled}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
            isBookingDisabled
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isOperatorOrAdmin ? (
            <div className="flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2" />
              <span>Booking Disabled</span>
            </div>
          ) : (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? (
            <div className="flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2" />
              <span>Profile Approval Required</span>
            </div>
          ) : !membershipStatus.canBook ? (
            <div className="flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2" />
              <span>
                {membershipStatus.reason === 'membership_expired' ? 'Membership Expired' : 'Booking Limit Reached'}
              </span>
            </div>
          ) : (
            'Request Quote'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AircraftCard;