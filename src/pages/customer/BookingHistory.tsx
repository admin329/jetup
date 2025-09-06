import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, Clock, CheckCircle, XCircle, Eye, X, CreditCard, Download, Ban, Crown, AlertTriangle, DollarSign, Plane, Building, Trash2, SortDesc, Lock, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateBookingConfirmationPDF } from '../../types/invoice';
import { getDiscountInfo } from '../../utils/membershipUtils';
import { processBookingPayment, formatCardNumber, formatExpiryDate, getCardType } from '../../services/paymentService';

const BookingHistory: React.FC = () => {
  const { user, bookingRequests, updateBookingRequest } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationInfo, setCancellationInfo] = useState<any>(null);
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
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

  // Payment countdown timer
  useEffect(() => {
    const updateTimers = () => {
      userBookings.forEach(booking => {
        if (booking.operatorApprovalStatus === 'approved' && !booking.isPaid && booking.paymentDeadline) {
          const deadline = new Date(booking.paymentDeadline);
          const now = new Date();
          const timeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
          
          if (timeLeft <= 0 && booking.status !== 'Expired') {
            updateBookingRequest(booking.id, {
              status: 'Expired',
              operatorApprovalStatus: 'expired'
            });
          }
        }
      });
    };

    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [bookingRequests, updateBookingRequest]);

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

  const handleCancelBooking = (booking: any) => {
    if (!booking.isPaid) {
      // Free cancellation for unpaid bookings
    // Check cancellation rights (10 for customers)
    const currentCancellations = user?.cancellationCount || 0;
    if (currentCancellations >= 10) {
      alert('You have reached your cancellation limit (10/10). Please contact admin to reset your rights.');
      return;
    }
    
      const confirmCancel = window.confirm('Are you sure you want to cancel this unpaid booking?');
      if (confirmCancel) {
        updateBookingRequest(booking.id, {
          status: 'Cancelled',
          isCancelled: true,
          cancellationDate: new Date().toISOString()
        });
        alert('Booking cancelled successfully.');
      }
      return;
    }
    
    // Check cancellation rights
    const currentCancellations = user?.cancellationCount || 0;
    if (currentCancellations >= 10) {
      alert('You have reached your cancellation limit (10/10). Please contact admin to reset your rights.');
      return;
    }
    
    const penalty = calculateCancellationPenalty(booking.departure);
    const originalAmount = booking.finalPrice || parseFloat(booking.routePrice?.replace(/[$,]/g, '') || '0');
    const penaltyAmount = originalAmount * penalty.penaltyPercentage / 100;
    const refundAmount = originalAmount * penalty.refundPercentage / 100;
    
    setCancellationInfo({
      penaltyPercentage: penalty.penaltyPercentage,
      refundPercentage: penalty.refundPercentage,
      penaltyAmount: penaltyAmount.toFixed(2),
      refundAmount: refundAmount.toFixed(2),
      originalAmount: originalAmount.toFixed(2),
      timeBeforeFlight: `${Math.floor((new Date(booking.departure).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours`
    });
    
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const handleDeleteBooking = (booking: any) => {
    setDeletingBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDeleteBooking = () => {
    if (!deletingBooking) return;
    
    // Remove booking from list
    updateBookingRequest(deletingBooking.id, { isDeleted: true });
    
    setShowDeleteModal(false);
    setDeletingBooking(null);
    alert('Booking deleted successfully!');
    
    // Refresh page to show updated list
    window.location.reload();
  };

  const confirmCancellation = () => {
    if (!selectedBooking || !cancellationInfo) return;
    
    updateBookingRequest(selectedBooking.id, {
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

  const handleCompletePayment = (booking: any) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
    
    // Calculate payment time left
    if (booking.paymentDeadline) {
      const deadline = new Date(booking.paymentDeadline);
      const now = new Date();
      const timeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
      setPaymentTimeLeft(timeLeft);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      if (!selectedBooking) {
        throw new Error('No booking selected');
      }

      // Calculate final amount with discount
      const originalAmount = parseFloat(selectedBooking.originalPrice?.replace(/[$,]/g, '') || selectedBooking.routePrice?.replace(/[$,]/g, '') || '0');
      const discountAmount = selectedBooking.discountRequested ? selectedBooking.discountAmount || 0 : 0;
      const finalAmount = originalAmount - discountAmount;

      // Process payment
      const result = await processBookingPayment(
        {
          bookingId: selectedBooking.bookingNumber,
          amount: finalAmount,
          route: `${selectedBooking.from} → ${selectedBooking.to}`,
          aircraft: selectedBooking.routeAircraft,
          operator: selectedBooking.routeOperator
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
          discountUsed: selectedBooking.discountRequested,
          discountPercentage: selectedBooking.discountPercentage,
          discountAmount: discountAmount
        };

        updateBookingRequest(selectedBooking.id, paymentInfo);

        // Update discount usage if discount was used
        if (selectedBooking.discountRequested && user) {
          const updatedUser = {
            ...user,
            discountUsage: {
              ...user.discountUsage,
              [selectedBooking.routeOperator]: (user.discountUsage?.[selectedBooking.routeOperator] || 0) + 1
            },
            totalDiscountsUsed: (user.totalDiscountsUsed || 0) + 1
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        alert(`✅ Payment successful! Your booking is confirmed.\nTransaction ID: ${result.transactionId}`);
        setShowPaymentModal(false);
        
        // Refresh to show updated status
        window.location.reload();
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

  const handleDownloadConfirmation = (booking: any) => {
    if (booking.isPaid) {
      generateBookingConfirmationPDF(booking, user);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending operator approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'rejected by operator':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending operator approval':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'confirmed':
        return CheckCircle;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
      case 'rejected by operator':
        return XCircle;
      case 'expired':
        return Clock;
      default:
        return Clock;
    }
  };

  // Get user's bookings and sort by creation date (newest first)
  const userBookings = bookingRequests
    .filter(booking => booking.email === user?.email)
    .filter(booking => {
      const matchesSearch = 
        booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.routeAircraft && booking.routeAircraft.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === '' || booking.status.toLowerCase().includes(statusFilter.toLowerCase());
      
      let matchesDate = true;
      if (dateFilter) {
        const bookingDate = new Date(booking.createdAt);
        const filterDate = new Date(dateFilter);
        const diffTime = Math.abs(bookingDate.getTime() - filterDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesDate = diffDays <= 30;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Get action button info for each booking
  const getBookingActionInfo = (booking: any) => {
    const isWaitingForPayment = booking.operatorApprovalStatus === 'approved' && 
                               !booking.isPaid && 
                               booking.paymentDeadline;

    if (isWaitingForPayment) {
      return {
        text: 'Complete Payment',
        icon: CreditCard,
        action: () => handleCompletePayment(booking),
        color: 'bg-green-600 text-white hover:bg-green-700'
      };
    } else if (booking.isPaid) {
      return {
        text: 'Download PDF',
        icon: Download,
        action: () => handleDownloadConfirmation(booking),
        color: 'bg-purple-600 text-white hover:bg-purple-700'
      };
    } else if (booking.status === 'Pending Operator Approval') {
      return {
        text: 'Waiting Approval',
        icon: Clock,
        action: () => {},
        color: 'bg-gray-400 text-gray-600 cursor-not-allowed'
      };
    } else if (booking.status === 'Rejected by Operator' || booking.status === 'Expired') {
      return {
        text: 'Booking Closed',
        icon: XCircle,
        action: () => {},
        color: 'bg-gray-400 text-gray-600 cursor-not-allowed'
      };
    }
    
    return {
      text: 'View Details',
      icon: Eye,
      action: () => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
      },
      color: 'bg-blue-600 text-white hover:bg-blue-700'
    };
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking History</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Total: {userBookings.length} bookings
            </div>
            <div className="text-sm text-gray-600">
              Cancellation Rights: {10 - (user?.cancellationCount || 0)}/10
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filter & Sort Bookings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Bookings
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by route, booking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Shows bookings within 30 days</p>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter || dateFilter || sortOrder !== 'newest') && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDateFilter('');
                  setSortOrder('newest');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </motion.div>

        {userBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12 bg-white rounded-lg shadow"
          >
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bookingRequests.filter(b => b.email === user?.email).length === 0 ? 'No bookings yet' : 'No bookings match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {bookingRequests.filter(b => b.email === user?.email).length === 0 
                ? 'Your booking history will appear here once you make your first booking.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
            {bookingRequests.filter(b => b.email === user?.email).length === 0 ? (
              <button
                onClick={() => navigate('/booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Booking
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDateFilter('');
                  setSortOrder('newest');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg shadow px-4 py-3">
              <div className="flex items-center space-x-2">
                <SortDesc className="h-4 w-4" />
                <span>
                  Showing {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''} 
                  {sortOrder === 'newest' ? ' (newest first)' : ' (oldest first)'}
                </span>
              </div>
              {(searchTerm || statusFilter || dateFilter) && (
                <span className="text-blue-600 font-medium">Filtered results</span>
              )}
            </div>

            {userBookings.map((booking, index) => {
              const StatusIcon = getStatusIcon(booking.status);
              const actionInfo = getBookingActionInfo(booking);
              const isWaitingForPayment = booking.operatorApprovalStatus === 'approved' && 
                                         !booking.isPaid && 
                                         booking.paymentDeadline;

              // Calculate payment time left for this booking
              let timeLeft = 0;
              if (isWaitingForPayment && booking.paymentDeadline) {
                const deadline = new Date(booking.paymentDeadline);
                const now = new Date();
                timeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
              }

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    {/* Payment Timer Warning */}
                    {isWaitingForPayment && timeLeft > 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-red-800 font-medium text-sm">Payment Required</p>
                            <p className="text-red-700 text-xs">
                              Complete payment in {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {timeLeft % 60}s
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.from} → {booking.to}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              <StatusIcon className="h-3 w-3 inline mr-1" />
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-blue-600 font-medium">{booking.bookingNumber}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600">
                              Created {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • IP: {booking.createdIP || '192.168.1.100'} • By: {booking.createdBy || booking.customer}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={actionInfo.action}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${actionInfo.color}`}
                        >
                          <actionInfo.icon className="h-4 w-4 mr-2" />
                          {actionInfo.text}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailModal(true);
                          }}
                          className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="text-sm font-medium">{new Date(booking.departure).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">{new Date(booking.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Passengers</p>
                          <p className="text-sm font-medium">{booking.passengers} people</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Trip Type</p>
                          <p className="text-sm font-medium">{booking.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Booking Type</p>
                          <p className="text-sm font-medium">
                            {booking.type === 'route_booking' ? 'Route Booking' : 'Flight Request'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-sm font-medium">
                            {booking.discountRequested && booking.finalPrice ? 
                              `$${booking.finalPrice.toFixed(2)} (${booking.discountPercentage}% off)` : 
                              booking.routePrice || booking.originalPrice || 'TBD'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Route/Aircraft Info */}
                    {booking.routeAircraft && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {booking.routeAircraft} • {booking.routeOperator}
                            </span>
                          </div>
                          {booking.routeRating && (
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">{booking.routeRating}/5</span>
                            </div>
                          )}
                          {/* Delete Button - Always Available */}
                          <button
                            onClick={() => handleDeleteBooking(booking)}
                            className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Payment Status */}
                    {booking.isPaid && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">Payment Completed</p>
                            <p className="text-green-700 text-xs">
                              Paid on {new Date(booking.paidAt).toLocaleDateString()} • {booking.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Discount Information */}
                    {booking.discountRequested && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">
                              {booking.discountPercentage}% Membership Discount Applied
                            </p>
                            <p className="text-green-700 text-xs">
                              Saved: ${booking.discountAmount?.toFixed(2) || '0'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.isCancelled && booking.cancellationInfo && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Ban className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-red-800 font-medium text-sm">Booking Cancelled</p>
                            <p className="text-red-700 text-xs">
                              Refund: ${booking.cancellationInfo.refundAmount} • 
                              Cancelled on {new Date(booking.cancellationInfo.cancellationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>Updated {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString()} at {new Date(booking.updatedAt || booking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • IP: {booking.updatedIP || '192.168.1.100'} • By: {booking.updatedBy || booking.customer}</span>
                        </div>
                        {booking.type === 'route_booking' && (
                          <div className="flex items-center space-x-1 text-sm text-blue-600">
                            <MapPin className="h-4 w-4" />
                            <span>Route Booking</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {(booking.isPaid || booking.status === 'Confirmed') && (
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            disabled={(user?.cancellationCount || 0) >= 10}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              (user?.cancellationCount || 0) >= 10
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                <p className="text-gray-600">Booking approved! Complete payment to confirm</p>
                
                {/* Payment Timer */}
                {paymentTimeLeft > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-5 w-5 text-red-600" />
                      <span className="text-red-800 font-medium">
                        Payment deadline: {Math.floor(paymentTimeLeft / 3600)}h {Math.floor((paymentTimeLeft % 3600) / 60)}m {paymentTimeLeft % 60}s
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedBooking.from} → {selectedBooking.to}</span>
                  <span className="font-bold text-red-600">{selectedBooking.originalPrice || selectedBooking.routePrice}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p>{selectedBooking.routeAircraft} • {selectedBooking.routeOperator}</p>
                </div>
                
                {selectedBooking.discountRequested && (
                  <div className="border-t pt-3 mt-3">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span>${parseFloat(selectedBooking.originalPrice?.replace(/[$,]/g, '') || selectedBooking.routePrice?.replace(/[$,]/g, '') || '0').toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({selectedBooking.discountPercentage}%):</span>
                        <span>-${selectedBooking.discountAmount?.toFixed(2) || '0'}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Final Price:</span>
                        <span>${selectedBooking.finalPrice?.toFixed(2) || parseFloat(selectedBooking.originalPrice?.replace(/[$,]/g, '') || selectedBooking.routePrice?.replace(/[$,]/g, '') || '0').toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentInputChange}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
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
                        Pay ${selectedBooking.discountRequested && selectedBooking.finalPrice ? 
                          selectedBooking.finalPrice.toFixed(2) : 
                          parseFloat(selectedBooking.originalPrice?.replace(/[$,]/g, '') || selectedBooking.routePrice?.replace(/[$,]/g, '') || '0').toFixed(2)
                        }
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
      {showCancellationModal && selectedBooking && cancellationInfo && (
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
                  {selectedBooking.from} → {selectedBooking.to}
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

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Booking Details</h3>
                  <p className="text-blue-600 font-medium">{selectedBooking.bookingNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedBooking.isPaid && (
                    <button
                      onClick={() => handleDownloadConfirmation(selectedBooking)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Flight Information</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium text-gray-900">{selectedBooking.from} → {selectedBooking.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedBooking.departure).toLocaleDateString()} at {new Date(selectedBooking.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.return && (
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Return</p>
                            <p className="font-medium text-gray-900">
                              {new Date(selectedBooking.return).toLocaleDateString()} at {new Date(selectedBooking.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Passengers</p>
                          <p className="font-medium text-gray-900">{selectedBooking.passengers} people</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Plane className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Trip Type</p>
                          <p className="font-medium text-gray-900">
                            {selectedBooking.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h4>
                      <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Status and Pricing */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Status & Timeline</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Current Status:</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Request Date:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedBooking.requestDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Booking Type:</span>
                        <span className="text-sm text-gray-900">
                          {selectedBooking.type === 'route_booking' ? 'Route Booking' : 'Flight Request'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Original Price:</span>
                        <span className="font-medium text-gray-900">
                          {selectedBooking.originalPrice || selectedBooking.routePrice || 'TBD'}
                        </span>
                      </div>
                      
                      {selectedBooking.discountRequested && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Discount ({selectedBooking.discountPercentage}%):</span>
                            <span className="font-medium text-green-600">-${selectedBooking.discountAmount?.toFixed(2) || '0'}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                            <span className="text-gray-900">Final Price:</span>
                            <span className="text-green-600">${selectedBooking.finalPrice?.toFixed(2) || '0'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  {selectedBooking.isPaid && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Status:</span>
                          <span className="font-medium text-green-600">Paid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Date:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(selectedBooking.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.paymentMethod}</span>
                        </div>
                        {selectedBooking.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transaction ID:</span>
                            <span className="font-medium text-gray-900">{selectedBooking.transactionId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Route/Operator Information */}
                  {selectedBooking.routeAircraft && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Aircraft & Operator</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Aircraft:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeAircraft}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Operator:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeOperator}</span>
                        </div>
                        {selectedBooking.routeDuration && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium text-gray-900">{selectedBooking.routeDuration}</span>
                          </div>
                        )}
                        {selectedBooking.routeRating && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Rating:</span>
                            <span className="font-medium text-gray-900">{selectedBooking.routeRating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Booking</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this booking?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {deletingBooking.from} → {deletingBooking.to}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-amber-800 text-sm font-medium">Warning</p>
                    <p className="text-amber-700 text-sm">
                      This action cannot be undone. The booking will be permanently removed from your history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingBooking(null);
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmDeleteBooking}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookingHistory;
