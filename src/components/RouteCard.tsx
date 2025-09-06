import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, Building2, Calendar, Users, X, Lock, CreditCard, Check, Crown, AlertTriangle, DollarSign, Ban, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDiscountInfo } from '../utils/membershipUtils';
import { processBookingPayment, formatCardNumber, formatExpiryDate, getCardType } from '../services/paymentService';
import { generateBookingConfirmationPDF } from '../types/invoice';
import DateTimePicker from './TimePicker';

import { getMinimumBookingTime, validateMinimumBookingTime, getTimezoneDisplayName, getCurrentTimeInAirportTimezone } from '../utils/timezoneUtils';

interface RouteCardProps {
  route: {
    id: string;
    from: string;
    to: string;
    price: string;
    duration: string;
    rating: number;
    aircraft: string;
    operator: string;
  };
  onOpenAuthModal?: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, onOpenAuthModal }) => {
  const { user, isAuthenticated, addBookingRequest, updateBookingRequest, bookingRequests } = useAuth();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [useDiscountOption, setUseDiscountOption] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [approvedBooking, setApprovedBooking] = useState<any>(null);
  const [cancellationInfo, setCancellationInfo] = useState<any>(null);
  const [timezoneInfo, setTimezoneInfo] = useState<string>('');
  const [minimumDateTime, setMinimumDateTime] = useState<string>('');
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    passengers: 1,
    message: ''
  });

  // Update timezone info when route changes
  React.useEffect(() => {
    if (route.from) {
      const minTime = getMinimumBookingTime(route.from);
      setMinimumDateTime(minTime);
      
      const timezoneDisplay = getTimezoneDisplayName(route.from);
      const currentAirportTime = getCurrentTimeInAirportTimezone(route.from);
      setTimezoneInfo(`${timezoneDisplay} - Current: ${currentAirportTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
    }
  }, [route.from]);

  const isOperatorOrAdmin = user?.role === 'operator' || user?.role === 'admin';

  // Check membership status for customers
  const checkMembershipStatus = () => {
    if (user?.role !== 'customer') return { canBook: true, reason: '' };
    
    const now = new Date();
    const expiryDate = user.membershipExpiryDate ? new Date(user.membershipExpiryDate) : null;
    
    if (expiryDate && now > expiryDate) {
      return { canBook: false, reason: 'membership_expired' };
    }
    
    if (!user.membershipType || user.membershipType === 'standard') {
      const currentBookingCount = user.bookingCount || 0;
      const bookingLimit = user.bookingLimit || 10;
      
      if (currentBookingCount >= bookingLimit) {
        return { canBook: false, reason: 'booking_limit_reached' };
      }
    }
    
    // Check cancellation limit
    const currentCancellations = user?.cancellationCount || 0;
    const cancellationLimit = user?.cancellationLimit || 10;
    
    if (currentCancellations >= cancellationLimit) {
      return { canBook: false, reason: 'cancellation_limit_reached' };
    }
    
    return { canBook: true, reason: '' };
  };
  
  const membershipStatus = checkMembershipStatus();

  // Find existing booking for this route
  const existingBooking = bookingRequests.find(booking => 
    booking.email === user?.email && 
    booking.selectedRoute?.id === route.id &&
    booking.type === 'route_booking'
  );

  // Check if booking is approved and waiting for payment
  const isWaitingForPayment = existingBooking?.operatorApprovalStatus === 'approved' && 
                              !existingBooking?.isPaid && 
                              existingBooking?.paymentDeadline;

  // Payment countdown timer
  useEffect(() => {
    if (isWaitingForPayment && existingBooking?.paymentDeadline) {
      const updateTimer = () => {
        const deadline = new Date(existingBooking.paymentDeadline!);
        const now = new Date();
        const timeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
        
        setPaymentTimeLeft(timeLeft);
        
        // Auto-cancel if time expired
        if (timeLeft <= 0 && existingBooking.status !== 'Expired') {
          updateBookingRequest(existingBooking.id, {
            status: 'Expired',
            operatorApprovalStatus: 'expired'
          });
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [isWaitingForPayment, existingBooking, updateBookingRequest]);

  const handleBookFlight = () => {
    if (isOperatorOrAdmin || (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved')) {
      return;
    }
    
    if (!membershipStatus.canBook) {
      if (membershipStatus.reason === 'membership_expired') {
        alert('Your membership has expired. Please upgrade to continue booking flights.');
        navigate('/customer/membership');
      } else if (membershipStatus.reason === 'booking_limit_reached') {
        alert('You have reached your booking limit for the standard plan. Please upgrade to continue booking flights.');
        navigate('/customer/membership');
      } else if (membershipStatus.reason === 'cancellation_limit_reached') {
        alert('You have reached your cancellation limit. Please contact admin to reset your rights.');
        return;
      }
      return;
    }
    
    if (!isAuthenticated && onOpenAuthModal) {
      onOpenAuthModal();
    } else if (isAuthenticated) {
      // Check if already has booking for this route
      if (existingBooking) {
        if (isWaitingForPayment) {
          setApprovedBooking(existingBooking);
          setShowPaymentModal(true);
        } else {
          alert(`You already have a booking for this route. Status: ${existingBooking.status}`);
        }
      } else {
        setShowBookingModal(true);
      }
    }
  };

  const isBookingDisabled = isOperatorOrAdmin || 
                           (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ||
                           !membershipStatus.canBook;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      alert('Please select both date and time for your flight');
      return;
    }
    
    // Get discount info
    const discountInfo = getDiscountInfo(user, route.operator);
    
    // Create route booking request
    const newRouteBooking = {
      id: Date.now().toString(),
      bookingNumber: '', // Will be generated by addBookingRequest
      type: 'route_booking' as const,
      customer: user?.name || 'Unknown',
      email: user?.email || '',
      from: route.from,
      to: route.to,
      departure: `${bookingData.date}T${bookingData.time}`,
      return: '',
      passengers: bookingData.passengers,
      tripType: 'oneWay' as const,
      specialRequests: bookingData.message,
      status: 'Pending Operator Approval',
      requestDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      offers: [],
      rejectedByOperators: [],
      isConfirmed: false,
      routePrice: route.price,
      routeAircraft: route.aircraft,
      routeOperator: route.operator,
      routeRating: route.rating,
      routeDuration: route.duration,
      isOperatorApprovalRequired: true,
      operatorApprovalStatus: 'pending',
      operatorApprovalDeadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours
      discountRequested: useDiscountOption && discountInfo.canUseDiscount,
      customerMembershipType: user?.membershipType || 'basic',
      discountPercentage: useDiscountOption && discountInfo.canUseDiscount ? discountInfo.discountPercentage : 0,
      originalPrice: route.price,
      discountAmount: useDiscountOption && discountInfo.canUseDiscount ? 
        (parseFloat(route.price.replace(/[$,]/g, '')) * discountInfo.discountPercentage / 100) : 0,
      finalPrice: useDiscountOption && discountInfo.canUseDiscount ? 
        (parseFloat(route.price.replace(/[$,]/g, '')) * (1 - discountInfo.discountPercentage / 100)) : 
        parseFloat(route.price.replace(/[$,]/g, '')),
      selectedRoute: {
        id: route.id,
        from: route.from,
        to: route.to,
        price: route.price,
        aircraft: route.aircraft,
        operator: route.operator,
        duration: route.duration,
        rating: route.rating
      }
    };
    
    try {
      addBookingRequest(newRouteBooking);
      setShowBookingModal(false);
      alert(`Route booking request sent successfully! The operator has 3 hours to approve your booking. You can track the status in your booking history.`);
      
      // Increment booking count for standard membership
      if (user?.role === 'customer' && (!user.membershipType || user.membershipType === 'standard')) {
        const updatedUser = {
          ...user,
          bookingCount: (user.bookingCount || 0) + 1
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      navigate('/customer/history');
      
      // Reset form
      setBookingData({
        date: '',
        time: '',
        passengers: 1,
        message: ''
      });
      setUseDiscountOption(false);
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      if (!approvedBooking) {
        throw new Error('No approved booking found');
      }

      // Calculate final amount with discount
      const originalAmount = parseFloat(approvedBooking.originalPrice.replace(/[$,]/g, ''));
      const discountAmount = approvedBooking.discountRequested ? approvedBooking.discountAmount : 0;
      const finalAmount = originalAmount - discountAmount;

      // Process payment
      const result = await processBookingPayment(
        {
          bookingId: approvedBooking.bookingNumber,
          amount: finalAmount,
          route: `${approvedBooking.from} → ${approvedBooking.to}`,
          aircraft: approvedBooking.routeAircraft,
          operator: approvedBooking.routeOperator
        },
        paymentData,
        { name: user?.name || '', email: user?.email || '' }
      );

      if (result.success) {
        // Update booking with payment info
        const paymentInfo = {
          isPaid: true,
          paidAt: new Date().toISOString(),
          status: 'Confirmed',
          paymentMethod: `${getCardType(paymentData.cardNumber)} ending in ${paymentData.cardNumber.replace(/\s/g, '').slice(-4)}`,
          transactionId: result.transactionId,
          discountUsed: approvedBooking.discountRequested,
          discountPercentage: approvedBooking.discountPercentage,
          discountAmount: discountAmount
        };

        updateBookingRequest(approvedBooking.id, paymentInfo);

        // Update discount usage if discount was used
        if (approvedBooking.discountRequested && user) {
          const updatedUser = {
            ...user,
            discountUsage: {
              ...user.discountUsage,
              [approvedBooking.routeOperator]: (user.discountUsage?.[approvedBooking.routeOperator] || 0) + 1
            },
            totalDiscountsUsed: (user.totalDiscountsUsed || 0) + 1
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        alert(`✅ Payment successful! Your route booking is confirmed.\nTransaction ID: ${result.transactionId}`);
        setShowPaymentModal(false);
        navigate('/customer/history');
      } else {
        alert(`❌ Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateCancellationPenalty = (departureDate: string) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const hoursUntilDeparture = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture > 72) {
      return { penaltyPercentage: 25, refundPercentage: 75 };
    } else if (hoursUntilDeparture > 48) {
      return { penaltyPercentage: 35, refundPercentage: 65 };
    } else if (hoursUntilDeparture > 24) {
      return { penaltyPercentage: 50, refundPercentage: 50 };
    } else {
      return { penaltyPercentage: 100, refundPercentage: 0 };
    }
  };

  const handleCancelBooking = () => {
    if (!existingBooking || !existingBooking.isPaid) return;
    
    const penalty = calculateCancellationPenalty(existingBooking.departure);
    const originalAmount = existingBooking.finalPrice || parseFloat(existingBooking.routePrice?.replace(/[$,]/g, '') || '0');
    const penaltyAmount = originalAmount * penalty.penaltyPercentage / 100;
    const refundAmount = originalAmount * penalty.refundPercentage / 100;
    
    setCancellationInfo({
      penaltyPercentage: penalty.penaltyPercentage,
      refundPercentage: penalty.refundPercentage,
      penaltyAmount: penaltyAmount.toFixed(2),
      refundAmount: refundAmount.toFixed(2),
      originalAmount: originalAmount.toFixed(2),
      timeBeforeFlight: `${Math.floor((new Date(existingBooking.departure).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours`
    });
    
    setShowCancellationModal(true);
  };

  const confirmCancellation = () => {
    if (!existingBooking || !cancellationInfo) return;
    
    // Check cancellation rights
    const currentCancellations = user?.cancellationCount || 0;
    if (currentCancellations >= 10) {
      alert('You have reached your cancellation limit (10/10). Please contact admin to reset your rights.');
      return;
    }
    
    // Update booking with cancellation info
    updateBookingRequest(existingBooking.id, {
      status: 'Cancelled',
      isCancelled: true,
      cancellationDate: new Date().toISOString(),
      cancellationInfo: {
        ...cancellationInfo,
        cancellationDate: new Date().toISOString(),
        reason: 'Customer cancellation'
      }
    });
    
    // Update user cancellation count
    if (user) {
      const updatedUser = {
        ...user,
        cancellationCount: (user.cancellationCount || 0) + 1
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    setShowCancellationModal(false);
    alert(`Booking cancelled successfully. Refund amount: $${cancellationInfo.refundAmount}. This used 1 of your 10 cancellation rights. Remaining: ${9 - (user?.cancellationCount || 0)}/10`);
    
    // Refresh page to show updated status
    window.location.reload();
  };

  const handleDownloadConfirmation = () => {
    if (existingBooking && existingBooking.isPaid) {
      generateBookingConfirmationPDF(existingBooking, user);
    }
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'expiryDate') {
      const formattedValue = formatExpiryDate(value);
      setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'hour' || name === 'minute') {
      const currentHour = bookingData.time.split(':')[0] || '';
      const currentMinute = bookingData.time.split(':')[1] || '';
      
      const newHour = name === 'hour' ? value : currentHour;
      const newMinute = name === 'minute' ? value : currentMinute;
      
      if (newHour && newMinute) {
        const newTime = `${newHour}:${newMinute}`;
        const dateTime = bookingData.date ? `${bookingData.date}T${newTime}` : '';
        
        if (bookingData.date && route.from) {
          const validation = validateMinimumBookingTime(dateTime, route.from);
          if (!validation.isValid) {
            alert(validation.message);
            return;
          }
        }
        
        setBookingData({
          ...bookingData,
          time: newTime
        });
      }
      return;
    }
    
    // Validate departure time if date is being changed
    if (name === 'date' && value && route.from && bookingData.time) {
      const dateTime = `${value}T${bookingData.time}`;
      
      if (bookingData.time) {
        const validation = validateMinimumBookingTime(dateTime, route.from);
        if (!validation.isValid) {
          alert(validation.message);
          return;
        }
      }
    }
    
    setBookingData({
      ...bookingData,
      [name]: value
    });
  };

  const handlePassengerChange = (increment: boolean) => {
    const newPassengers = increment ? bookingData.passengers + 1 : bookingData.passengers - 1;
    if (newPassengers >= 1 && newPassengers <= 200) {
      setBookingData({
        ...bookingData,
        passengers: newPassengers
      });
    }
  };

  // Get button text and action based on booking status
  const getButtonInfo = () => {
    if (isBookingDisabled) {
      return {
        text: isOperatorOrAdmin ? 'Booking Disabled' : 
              (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? 'Profile Approval Required' :
              membershipStatus.reason === 'cancellation_limit_reached' ? 'Cancellation Limit Reached' : 'Booking Restricted',
        icon: Lock,
        disabled: true,
        color: 'bg-gray-400 text-gray-600 cursor-not-allowed'
      };
    }
    
    if (existingBooking) {
      if (isWaitingForPayment) {
        return {
          text: 'Complete Payment',
          icon: CreditCard,
          disabled: false,
          color: 'bg-green-600 text-white hover:bg-green-700'
        };
      } else if (existingBooking.isPaid) {
        return {
          text: 'View Booking',
          icon: Check,
          disabled: false,
          color: 'bg-blue-600 text-white hover:bg-blue-700'
        };
      } else {
        return {
          text: `Status: ${existingBooking.status}`,
          icon: Clock,
          disabled: true,
          color: 'bg-gray-400 text-gray-600 cursor-not-allowed'
        };
      }
    }
    
    return {
      text: 'Book This Flight',
      icon: Calendar,
      disabled: false,
      color: 'bg-red-600 text-white hover:bg-red-700'
    };
  };

  const buttonInfo = getButtonInfo();

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        {/* Payment Timer Warning */}
        {isWaitingForPayment && paymentTimeLeft > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium text-sm">Payment Required</p>
                <p className="text-red-700 text-xs">
                  Complete payment in {Math.floor(paymentTimeLeft / 3600)}h {Math.floor((paymentTimeLeft % 3600) / 60)}m {paymentTimeLeft % 60}s
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Status */}
        {existingBooking && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-medium text-sm">Booking Status</p>
                <p className="text-blue-700 text-xs">{existingBooking.status}</p>
              </div>
              {existingBooking.isPaid && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadConfirmation}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-3 w-3 inline mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{route.from}</p>
              <p className="text-sm text-gray-500">Departure</p>
            </div>
            <ArrowRight className="h-5 w-5 text-red-600" />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{route.to}</p>
              <p className="text-sm text-gray-500">Arrival</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xl font-bold text-red-600">{route.price}</p>
            <p className="text-sm text-gray-500">Per flight</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{route.duration}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{route.rating}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="font-medium">{route.aircraft}</p>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">{route.operator}</span>
            </div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: buttonInfo.disabled ? 1 : 1.05 }}
          whileTap={{ scale: buttonInfo.disabled ? 1 : 0.95 }}
          onClick={handleBookFlight}
          disabled={buttonInfo.disabled}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${buttonInfo.color}`}
        >
          <div className="flex items-center justify-center">
            <buttonInfo.icon className="h-4 w-4 mr-2" />
            <span>{buttonInfo.text}</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Route Booking</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Route Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                {(() => {
                  const discountInfo = getDiscountInfo(user, route.operator);
                  const originalAmount = parseFloat(route.price.replace(/[$,]/g, ''));
                  const discountAmount = useDiscountOption && discountInfo.canUseDiscount 
                    ? (originalAmount * discountInfo.discountPercentage / 100) : 0;
                  const finalAmount = originalAmount - discountAmount;
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{route.from} → {route.to}</span>
                        <span className="font-bold text-red-600">{route.price}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>{route.aircraft} • {route.operator}</p>
                      </div>
                      
                      {/* Discount Option - Only for Standard and Premium */}
                      {discountInfo.canUseDiscount && (user?.membershipType === 'standard' || user?.membershipType === 'premium') && (
                        <div className="border-t pt-3 mt-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useDiscountOption}
                              onChange={(e) => setUseDiscountOption(e.target.checked)}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-green-600">
                              Use {discountInfo.discountPercentage}% discount ({discountInfo.remainingDiscounts}/2 for {route.operator}, {discountInfo.remainingTotalDiscounts}/20 total)
                            </span>
                          </label>
                          
                          {useDiscountOption && (
                            <div className="mt-2 text-sm">
                              <div className="flex justify-between">
                                <span>Original Price:</span>
                                <span>${originalAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Discount ({discountInfo.discountPercentage}%):</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold border-t pt-1">
                                <span>Final Price:</span>
                                <span>${finalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* No Discount Notice for Basic Users */}
                      {user?.membershipType === 'basic' && (
                        <div className="border-t pt-3 mt-3">
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-800">No Discount Available</span>
                            </div>
                            <p className="text-xs text-amber-700 mb-3">
                              Basic members cannot use discounts. Upgrade to Standard (5% off) or Premium (10% off) to get discount rights!
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate('/customer/membership')}
                              className="w-full px-3 py-2 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700 transition-colors"
                            >
                              Upgrade for Discounts
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Date & Time - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date & Time
                  </label>
                  <DateTimePicker
                    value={bookingData.date && bookingData.time ? `${bookingData.date}T${bookingData.time}` : ''}
                    onChange={(datetime) => {
                      const [date, time] = datetime.split('T');
                      
                      if (date && time && route.from) {
                        const validation = validateMinimumBookingTime(datetime, route.from);
                        if (!validation.isValid) {
                          alert(validation.message);
                          return;
                        }
                      }
                      
                      setBookingData({ 
                        ...bookingData, 
                        date: date || '', 
                        time: time ? time.substring(0, 5) : '' 
                      });
                    }}
                    placeholder="Select date & time"
                    required
                    minDateTime={minimumDateTime}
                    timezoneInfo={timezoneInfo}
                  />
                </div>

                {/* Passengers - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Passengers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <div className="w-full pl-10 pr-20 py-4 border border-gray-300 rounded-xl bg-gray-50 text-sm flex items-center">
                      <span className="flex-1">{bookingData.passengers} {bookingData.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
                    </div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handlePassengerChange(false)}
                        disabled={bookingData.passengers <= 1}
                        className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 disabled:text-gray-400 text-xs font-bold"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePassengerChange(true)}
                        disabled={bookingData.passengers >= 200}
                        className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 disabled:text-gray-400 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={bookingData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special requirements or requests..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Submit Booking Request
                </motion.button>
              </form>

              {/* Info Note */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    Your booking request will be sent to the operator for approval. 
                    You'll receive confirmation within 3 hours.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && approvedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Payment Timer */}
              {paymentTimeLeft > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Payment Deadline</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    Complete payment in {Math.floor(paymentTimeLeft / 3600)}h {Math.floor((paymentTimeLeft % 3600) / 60)}m {paymentTimeLeft % 60}s
                  </p>
                </div>
              )}

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">{approvedBooking.from} → {approvedBooking.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aircraft:</span>
                    <span>{approvedBooking.routeAircraft}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator:</span>
                    <span>{approvedBooking.routeOperator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{approvedBooking.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(approvedBooking.departure).toLocaleString()}</span>
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span>${parseFloat(approvedBooking.originalPrice.replace(/[$,]/g, '')).toFixed(2)}</span>
                    </div>
                    {approvedBooking.discountRequested && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({approvedBooking.discountPercentage}%):</span>
                        <span>-${approvedBooking.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-green-600">
                        ${(parseFloat(approvedBooking.originalPrice.replace(/[$,]/g, '')) - (approvedBooking.discountRequested ? approvedBooking.discountAmount : 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    {paymentData.cardNumber && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs font-medium text-gray-600">
                          {getCardType(paymentData.cardNumber)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Billing Address */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Billing Address</h4>
                  
                  <input
                    type="text"
                    name="billingAddress.street"
                    value={paymentData.billingAddress.street}
                    onChange={handlePaymentInputChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="billingAddress.city"
                      value={paymentData.billingAddress.city}
                      onChange={handlePaymentInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      name="billingAddress.state"
                      value={paymentData.billingAddress.state}
                      onChange={handlePaymentInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="billingAddress.zipCode"
                      value={paymentData.billingAddress.zipCode}
                      onChange={handlePaymentInputChange}
                      placeholder="ZIP Code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <select
                      name="billingAddress.country"
                      value={paymentData.billingAddress.country}
                      onChange={handlePaymentInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${approvedBooking.discountRequested ? approvedBooking.finalPrice.toFixed(2) : parseFloat(approvedBooking.originalPrice.replace(/[$,]/g, '')).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancellationModal && cancellationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ban className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking</h3>
                <p className="text-gray-600">
                  {existingBooking?.from} → {existingBooking?.to}
                </p>
              </div>

              {/* Cancellation Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-red-800 mb-3">Cancellation Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Original Amount:</span>
                    <span className="font-medium">${cancellationInfo.originalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Penalty ({cancellationInfo.penaltyPercentage}%):</span>
                    <span className="font-medium">-${cancellationInfo.penaltyAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-red-300 pt-2">
                    <span className="text-red-800">Refund Amount:</span>
                    <span className="text-green-600">${cancellationInfo.refundAmount}</span>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-xs">
                    ⚠️ This will use 1 of your 10 cancellation rights.
                    Remaining: {9 - (user?.cancellationCount || 0)}/10
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancellationModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancellation}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default RouteCard;