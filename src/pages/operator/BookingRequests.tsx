import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Users, DollarSign, Check, X, AlertCircle, Send, Lock, Crown, Shield, Eye, Download, FileText, Building, Plane, Ban, Trash2, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateInvoicePDF } from '../../types/invoice';

const BookingRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departureFilter, setDepartureFilter] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [priceOffer, setPriceOffer] = useState('');
 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [deletingBooking, setDeletingBooking] = useState<any>(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<any>(null);
  const [cancellationInfo, setCancellationInfo] = useState<any>(null);
  const { user, bookingRequests, updateBookingRequest } = useAuth();

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
    cancellationLimitReached: (user?.operatorCancellationCount || 0) >= 10,
    membershipStatus: operatorPayment?.status || 'pending',
    hasFullAccess: operatorPayment?.status === 'approved' && user?.hasUploadedAOC && user?.isApprovedByAdmin,
    paymentInfo: operatorPayment
  };

  // Check if operator can access booking requests
  const canAccessBookings = () => {
    const hasMembershipApproval = operatorPayment?.status === 'approved';
    const hasAOCApproval = user?.hasUploadedAOC && user?.isApprovedByAdmin;
    return hasMembershipApproval && hasAOCApproval;
  };

  const hasAccess = canAccessBookings();

  const departureCities = ['New York', 'London', 'Miami', 'Paris', 'Los Angeles'];

  // Available aircraft for the operator
  const availableAircraft = [
    'Gulfstream G650',
    'Cessna Citation X+',
    'Bombardier Global 7500',
    'Embraer Phenom 300E',
    'Dassault Falcon 7X',
    'Hawker 4000'
  ];

  // Monitor payment deadlines and auto-expire
  useEffect(() => {
    const checkPaymentDeadlines = () => {
      bookingRequests.forEach(booking => {
        if (booking.acceptedOffer && !booking.isPaid && booking.paymentDeadline) {
          const deadline = new Date(booking.paymentDeadline);
          const now = new Date();
          
          if (now > deadline && booking.status !== 'Payment Expired') {
            // Auto-expire booking
            updateBookingRequest(booking.id, {
              status: 'Payment Expired',
              paymentExpired: true,
              expiredAt: new Date().toISOString()
            });
          }
        }
      });
    };

    checkPaymentDeadlines();
    const interval = setInterval(checkPaymentDeadlines, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [bookingRequests, updateBookingRequest]);

  // Filter flight requests for this operator (not rejected by this operator)
  const flightRequests = bookingRequests.filter(request => 
    request.type === 'flight_request' && 
    !request.rejectedByOperators.includes(user?.id || '')
  );

  const filteredRequests = flightRequests.filter(request => {
    const matchesSearch = 
      request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDeparture = departureFilter === '' || request.from === departureFilter;
    
    return matchesSearch && matchesDeparture;
  });

  const handleReject = (requestId: string) => {
    const confirmReject = window.confirm('Are you sure you want to reject this flight request? You will no longer see this request, but other operators can still view it.');
    
    if (confirmReject) {
      const currentOperatorId = user?.id || '';
      
      // Add this operator to rejected list
      const updatedRequests = bookingRequests.map(request =>
        request.id === requestId
          ? { 
              ...request, 
              rejectedByOperators: [...request.rejectedByOperators, currentOperatorId]
            }
          : request
      );
      
      // Update global state
      localStorage.setItem('bookingRequests', JSON.stringify(updatedRequests));
      
      alert('Flight request rejected. You will no longer see this request, but other operators can still view it.');
      
      // Refresh page to update view
      window.location.reload();
    }
  };

  const handleSendPriceOffer = (request: any) => {
    setSelectedRequest(request);
    setPriceOffer('');
    setOfferMessage('');
    setSelectedAircraft('');
    setShowPriceModal(true);
  };

  const handleSendOffer = async () => {
    if (!selectedRequest || !priceOffer || !selectedAircraft) {
      alert('Please fill in all required fields (price and aircraft)');
      return;
    }
    
    // Check if customer requested discount
    const customerRequestedDiscount = selectedRequest.discountRequested || false;
    const customerMembershipType = selectedRequest.customerMembershipType || 'basic';
    let discountPercentage = 0;
    
    if (customerRequestedDiscount) {
      if (customerMembershipType === 'standard') {
        discountPercentage = 5;
      } else if (customerMembershipType === 'premium') {
        discountPercentage = 10;
      }
    }
    
    // Calculate discounted price if applicable
    const originalPrice = parseFloat(priceOffer.replace(/[$,]/g, ''));
    const discountAmount = customerRequestedDiscount ? (originalPrice * discountPercentage / 100) : 0;
    const finalPrice = originalPrice - discountAmount;
    
    try {
      const newOffer = {
        operatorId: user?.id,
        operatorName: user?.name || 'Premium Aviation Ltd.',
        aircraft: selectedAircraft,
        price: `$${finalPrice.toLocaleString()}`,
        originalPrice: `$${originalPrice.toLocaleString()}`,
        discountApplied: customerRequestedDiscount,
        discountPercentage: discountPercentage,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        message: offerMessage,
        offerDate: new Date().toISOString(),
        status: 'Sent',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      // Update the request with the new offer
      updateBookingRequest(selectedRequest.id, {
        offers: [...selectedRequest.offers, newOffer],
        status: selectedRequest.offers.length === 0 ? 'Offers Received' : selectedRequest.status
      });
      
      setShowPriceModal(false);
      setPriceOffer('');
      setOfferMessage('');
      setSelectedAircraft('');
      setSelectedRequest(null);
      
      alert('Price offer sent successfully!');
    } catch (error) {
      console.error('Error sending offer:', error);
      alert('Failed to send offer. Please try again.');
    }
  };

  const handleViewBookingDetail = (request: any) => {
    setSelectedBookingDetail(request);
    setShowBookingDetailModal(true);
  };

  const handleDownloadBookingPDF = (booking: any) => {
    generateInvoicePDF({
      id: booking.id,
      invoiceNumber: `BOOKING-${booking.bookingNumber}`,
      type: 'booking',
      direction: 'outgoing',
      amount: booking.acceptedOffer?.price || '$0',
      currency: 'USD',
      status: booking.isPaid ? 'paid' : 'pending',
      issueDate: booking.createdAt,
      dueDate: booking.paymentDeadline || booking.createdAt,
      paidDate: booking.paidAt || undefined,
      description: `Flight Request - ${booking.from} to ${booking.to}`,
      customerName: booking.customer,
      customerEmail: booking.email,
      operatorName: user?.name || 'Premium Aviation Ltd.',
      operatorEmail: user?.email || '',
      items: [
        {
          id: '1',
          description: `Private Jet Charter - ${booking.acceptedOffer?.aircraft || 'Aircraft TBD'} - ${booking.from} to ${booking.to}`,
          quantity: 1,
          unitPrice: booking.acceptedOffer?.price || '$0',
          totalPrice: booking.acceptedOffer?.price || '$0'
        }
      ],
      totalAmount: booking.acceptedOffer?.price || '$0',
      paymentMethod: booking.paymentMethod || 'Pending',
      notes: `Booking Number: ${booking.bookingNumber}\nPassengers: ${booking.passengers}\nDeparture: ${new Date(booking.departure).toLocaleString()}\n${booking.specialRequests ? 'Special Requests: ' + booking.specialRequests : ''}`
    });
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

  const handleCancelBooking = (booking: any) => {
    if (!booking.isPaid) {
      // Free cancellation for unpaid bookings
      const confirmCancel = window.confirm('Are you sure you want to cancel this unpaid booking? This will not use your cancellation rights.');
      
      if (confirmCancel) {
        updateBookingRequest(booking.id, {
          status: 'Cancelled by Operator',
          isCancelled: true,
          cancellationDate: new Date().toISOString(),
          cancellationInfo: {
            cancellationDate: new Date().toISOString(),
            reason: 'Operator cancellation - unpaid booking',
            penaltyAmount: '0',
            refundAmount: '0',
            penaltyPercentage: 0
          }
        });
        
        alert('Unpaid booking cancelled successfully. No cancellation rights used.');
        setShowBookingDetailModal(false);
      }
      return;
    }
    
    // Paid booking cancellation with penalty
    const operatorCancellationCount = user?.operatorCancellationCount || 0;
    if (operatorCancellationCount >= 10) {
      alert('You have reached your cancellation limit (10/10). Please contact admin to reset your rights.');
      return;
    }
    
    const penalty = calculateCancellationPenalty(booking.departure);
    const originalAmount = booking.acceptedOffer?.finalPrice || parseFloat(booking.acceptedOffer?.price.replace(/[$,]/g, '') || '0');
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
    
    setCancellingBooking(booking);
    setShowCancelModal(true);
  };

  const confirmOperatorCancellation = () => {
    if (!cancellingBooking || !cancellationInfo) return;
    
    // Update booking with cancellation info
    updateBookingRequest(cancellingBooking.id, {
      status: 'Cancelled by Operator',
      isCancelled: true,
      cancellationDate: new Date().toISOString(),
      cancellationInfo: {
        ...cancellationInfo,
        cancellationDate: new Date().toISOString(),
        reason: 'Operator cancellation'
      }
    });
    
    // Update operator cancellation count
    if (user) {
      const updatedUser = {
        ...user,
        operatorCancellationCount: (user.operatorCancellationCount || 0) + 1
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    setShowCancelModal(false);
    setShowBookingDetailModal(false);
    alert(`Booking cancelled successfully. Customer refund: $${cancellationInfo.refundAmount}. This used 1 of your 10 cancellation rights.`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'priceOffer') {
      setPriceOffer(value);
    } else if (name === 'offerMessage') {
      setOfferMessage(value);
    } else if (name === 'selectedAircraft') {
      setSelectedAircraft(value);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Access Restriction Notice */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4">
              <Lock className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Access Restricted</h3>
                <p className="text-red-700 mt-1">
                  You need approved membership and AOC license to access flight requests.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      Membership Status: {accessStatus.membershipStatus === 'approved' ? '✅ Approved' : 
                                        accessStatus.membershipStatus === 'pending_admin_approval' ? '⏳ Pending' : 
                                        accessStatus.membershipStatus === 'rejected' ? '❌ Rejected' : '❌ Not Submitted'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      AOC License: {accessStatus.hasAOC ? '✅ Approved' : 
                                   user?.hasUploadedAOC ? '⏳ Pending' : '❌ Not Uploaded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Flight Requests</h2>
          {hasAccess ? (
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredRequests.filter(r => r.status === 'Pending').length} Pending
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredRequests.filter(r => r.isPaid).length} Paid
              </span>
            </div>
          ) : (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Access Restricted
            </span>
          )}
        </div>

        {hasAccess && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search flight requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={departureFilter}
                onChange={(e) => setDepartureFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Departure Cities</option>
                {departureCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Flight Requests */}
            <div className="space-y-4">
              {filteredRequests.map((flightRequest, index) => {
                // Check if this operator has an offer for this request
                const operatorOffer = flightRequest.offers?.find((offer: any) => offer.operatorId === user?.id);
                const isOfferAccepted = flightRequest.acceptedOffer?.operatorId === user?.id;
                const isOfferRejected = operatorOffer && flightRequest.acceptedOffer && flightRequest.acceptedOffer.operatorId !== user?.id;
                
                return (
                  <motion.div
                    key={flightRequest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow ${
                      isOfferAccepted ? 'ring-2 ring-green-500' : 
                      isOfferRejected ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-red-600">{flightRequest.bookingNumber}</h3>
                          {isOfferAccepted && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Your Offer Accepted
                            </span>
                          )}
                          {isOfferRejected && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Offer Not Selected
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{flightRequest.customer}</h4>
                        <p className="text-gray-600">{flightRequest.email}</p>
                        <p className="text-sm text-gray-500">
                          Requested on {new Date(flightRequest.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {/* Show different buttons based on status */}
                        {!operatorOffer && flightRequest.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleSendPriceOffer(flightRequest)}
                              className="px-4 py-2 rounded-lg transition-colors flex items-center bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Offer
                            </button>
                            <button
                              onClick={() => handleReject(flightRequest.id)}
                              className="px-4 py-2 rounded-lg transition-colors flex items-center bg-red-600 text-white hover:bg-red-700"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {operatorOffer && !isOfferRejected && (
                          <button
                            onClick={() => handleViewBookingDetail(flightRequest)}
                            className="px-4 py-2 rounded-lg transition-colors flex items-center bg-green-600 text-white hover:bg-green-700"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                        )}
                        
                        {isOfferRejected && (
                          <span className="px-4 py-2 text-sm text-gray-500 italic">
                            Customer selected another offer
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium">{flightRequest.from} → {flightRequest.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <div>
                            <p className="font-medium">
                              {new Date(flightRequest.departure).toLocaleDateString()} at {new Date(flightRequest.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="text-xs text-red-600">Departure location is determined as LTC</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Passengers</p>
                          <p className="font-medium">{flightRequest.passengers} people</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div>
                          <p className="text-sm text-gray-500">Trip Type</p>
                          <p className="font-medium capitalize">{flightRequest.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}</p>
                        </div>
                      </div>
                    </div>

                    {flightRequest.return && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Return:</span> {new Date(flightRequest.return).toLocaleDateString()} at {new Date(flightRequest.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    )}

                    {/* Customer Discount Request Info */}
                    {flightRequest.discountRequested && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Crown className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Customer Requested Discount</span>
                        </div>
                        <p className="text-xs text-green-700">
                          Customer has {flightRequest.customerMembershipType} membership and requested{' '}
                          {flightRequest.customerMembershipType === 'premium' ? '10%' : '5%'} discount
                        </p>
                      </div>
                    )}

                    {/* Your Offer Status */}
                    {operatorOffer && (
                      <div className={`border-t border-gray-200 pt-4 ${isOfferAccepted ? 'bg-green-50' : isOfferRejected ? 'bg-red-50' : 'bg-blue-50'} rounded-lg p-3`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Your Offer</p>
                            <p className="text-sm text-gray-600">{operatorOffer.aircraft} - {operatorOffer.price}</p>
                            {operatorOffer.discountApplied && (
                              <p className="text-xs text-green-600">
                                {operatorOffer.discountPercentage}% discount applied
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {isOfferAccepted && (
                              <span className="text-green-600 font-medium text-sm">✅ Accepted</span>
                            )}
                            {isOfferRejected && (
                              <span className="text-red-600 font-medium text-sm">❌ Not Selected</span>
                            )}
                            {!isOfferAccepted && !isOfferRejected && (
                              <span className="text-blue-600 font-medium text-sm">⏳ Waiting</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Status for Accepted Offers */}
                    {isOfferAccepted && flightRequest.isPaid && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">Payment Completed ✅</p>
                            <p className="text-green-700 text-xs">
                              Paid on {new Date(flightRequest.paidAt).toLocaleDateString()} • {flightRequest.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Deadline Warning */}
                    {isOfferAccepted && !flightRequest.isPaid && flightRequest.paymentDeadline && (() => {
                      const deadline = new Date(flightRequest.paymentDeadline);
                      const now = new Date();
                      const timeLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));
                      
                      if (timeLeft > 0) {
                        return (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-5 w-5 text-yellow-600" />
                              <div>
                                <p className="text-yellow-800 font-medium text-sm">Waiting for Customer Payment</p>
                                <p className="text-yellow-700 text-xs">
                                  Customer has {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {timeLeft % 60}s to pay
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (flightRequest.status !== 'Payment Expired') {
                        return (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                            <div className="flex items-center space-x-2">
                              <XCircle className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-red-800 font-medium text-sm">Payment Deadline Expired</p>
                                <p className="text-red-700 text-xs">
                                  Customer did not complete payment within 3 hours
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Special Requests:</span> {flightRequest.specialRequests || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Total Offers:</span> {flightRequest.offers?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No flight requests found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Price Offer Modal */}
      {showPriceModal && selectedRequest && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Send Price Offer</h3>
                <button
                  onClick={() => setShowPriceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Request Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedRequest.from} → {selectedRequest.to}</span>
                  <span className="text-sm text-blue-600 font-bold">{selectedRequest.bookingNumber}</span>
                </div>
                <p className="text-sm text-gray-600">Customer: {selectedRequest.customer}</p>
                <p className="text-sm text-gray-600">Passengers: {selectedRequest.passengers}</p>
                <p className="text-sm text-gray-600">Date: {new Date(selectedRequest.departure).toLocaleDateString()}</p>
                
                {/* Customer Discount Request Info */}
                {selectedRequest.discountRequested && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Customer Requested Discount</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Customer has {selectedRequest.customerMembershipType || 'standard'} membership and requested{' '}
                      {selectedRequest.customerMembershipType === 'premium' ? '10%' : '5%'} discount.
                      Please adjust your offer price accordingly.
                    </p>
                  </div>
                )}
              </div>

              <form className="space-y-4">
                {/* Aircraft Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Aircraft <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectedAircraft"
                    value={selectedAircraft}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Choose aircraft...</option>
                    {availableAircraft.map((aircraft) => (
                      <option key={aircraft} value={aircraft}>
                        {aircraft}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Offer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Offer <span className="text-red-500">*</span>
                  </label>
                  {selectedRequest.discountRequested && (
                    <div className="mb-2 text-xs text-blue-600">
                      💡 Customer requested {selectedRequest.customerMembershipType === 'premium' ? '10%' : '5%'} discount. 
                      Enter your base price - discount will be calculated automatically.
                    </div>
                  )}
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="priceOffer"
                      value={priceOffer}
                      onChange={handleInputChange}
                      placeholder="25,000"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter amount without $ symbol</p>
                  
                  {/* Price Preview */}
                  {selectedRequest.discountRequested && priceOffer && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Your Price:</span>
                          <span>${parseFloat(priceOffer.replace(/[$,]/g, '') || '0').toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Customer Discount ({selectedRequest.customerMembershipType === 'premium' ? '10%' : '5%'}):</span>
                          <span>-${(parseFloat(priceOffer.replace(/[$,]/g, '') || '0') * (selectedRequest.customerMembershipType === 'premium' ? 10 : 5) / 100).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1">
                          <span>Final Price to Customer:</span>
                          <span>${(parseFloat(priceOffer.replace(/[$,]/g, '') || '0') * (1 - (selectedRequest.customerMembershipType === 'premium' ? 10 : 5) / 100)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    name="offerMessage"
                    value={offerMessage}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Any additional information for the customer..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPriceModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOffer}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Offer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {showBookingDetailModal && selectedBookingDetail && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Flight Request Details</h3>
                  <p className="text-blue-600 font-medium">{selectedBookingDetail.bookingNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedBookingDetail.isPaid && (
                    <button
                      onClick={() => handleDownloadBookingPDF(selectedBookingDetail)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                  )}
                  
                  {/* Cancel Button for Paid Bookings */}
                  {selectedBookingDetail.isPaid && selectedBookingDetail.acceptedOffer?.operatorId === user?.id && (
                    <button
                      onClick={() => handleCancelBooking(selectedBookingDetail)}
                      disabled={(user?.operatorCancellationCount || 0) >= 10}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        (user?.operatorCancellationCount || 0) >= 10
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {(user?.operatorCancellationCount || 0) >= 10 ? 'Limit Reached' : 'Cancel Booking'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowBookingDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-medium text-gray-900">{selectedBookingDetail.customer}</p>
                          <p className="text-sm text-gray-600">{selectedBookingDetail.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium text-gray-900">{selectedBookingDetail.from} → {selectedBookingDetail.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedBookingDetail.departure).toLocaleDateString()} at {new Date(selectedBookingDetail.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>

                      {selectedBookingDetail.return && (
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Return</p>
                            <p className="font-medium text-gray-900">
                              {new Date(selectedBookingDetail.return).toLocaleDateString()} at {new Date(selectedBookingDetail.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Passengers</p>
                          <p className="font-medium text-gray-900">{selectedBookingDetail.passengers} people</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Plane className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Trip Type</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {selectedBookingDetail.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.flightType && (
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Flight Type</p>
                            <p className="font-medium text-gray-900">{selectedBooking.flightType}</p>
                          </div>
                        </div>
                      )}

                      {selectedBooking.aircraftRequest && (
                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Aircraft Request</p>
                            <p className="font-medium text-gray-900">{selectedBooking.aircraftRequest}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBookingDetail.specialRequests && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h4>
                      <p className="text-gray-700">{selectedBookingDetail.specialRequests}</p>
                    </div>
                  )}

                  {/* Cancellation Information */}
                  {selectedBookingDetail.isCancelled && selectedBookingDetail.cancellationInfo && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-red-800 mb-4">Cancellation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-700">Cancellation Date:</span>
                          <span className="font-medium">{new Date(selectedBookingDetail.cancellationInfo.cancellationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Cancelled By:</span>
                          <span className="font-medium">
                            {selectedBookingDetail.cancellationInfo.reason?.includes('Operator') ? 'Operator' : 'Customer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Penalty:</span>
                          <span className="font-medium">${selectedBookingDetail.cancellationInfo.penaltyAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Refund:</span>
                          <span className="font-medium text-green-600">${selectedBookingDetail.cancellationInfo.refundAmount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Offer and Payment Status */}
                <div className="space-y-6">
                  {/* Your Offer Status */}
                  {(() => {
                    const operatorOffer = selectedBookingDetail.offers?.find((offer: any) => offer.operatorId === user?.id);
                    const isOfferAccepted = selectedBookingDetail.acceptedOffer?.operatorId === user?.id;
                    
                    if (operatorOffer) {
                      return (
                        <div className={`rounded-lg p-6 ${isOfferAccepted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Your Offer Status</h4>
                          
                          {/* Delete Button - Always Available */}
                          <button
                            onClick={() => handleDeleteBooking(selectedRequest)}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Aircraft:</span>
                              <span className="font-medium text-gray-900">{operatorOffer.aircraft}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Price:</span>
                              <span className="font-bold text-green-600">{operatorOffer.price}</span>
                            </div>
                            {operatorOffer.discountApplied && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Discount Applied:</span>
                                <span className="font-medium text-green-600">{operatorOffer.discountPercentage}%</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span className={`font-medium ${isOfferAccepted ? 'text-green-600' : 'text-blue-600'}`}>
                                {isOfferAccepted ? '✅ Accepted by Customer' : '⏳ Waiting for Customer'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Payment Information */}
                  {selectedBookingDetail.isPaid && selectedBookingDetail.acceptedOffer?.operatorId === user?.id && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Status:</span>
                          <span className="font-medium text-green-600">✅ Paid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Date:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(selectedBookingDetail.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium text-gray-900">{selectedBookingDetail.paymentMethod}</span>
                        </div>
                        {selectedBookingDetail.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Transaction ID:</span>
                            <span className="font-medium text-gray-900">{selectedBookingDetail.transactionId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* All Offers Overview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      All Offers ({selectedBookingDetail.offers?.length || 0})
                    </h4>
                    
                    {selectedBookingDetail.offers && selectedBookingDetail.offers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBookingDetail.offers.map((offer: any, index: number) => (
                          <div key={index} className={`p-3 rounded border ${
                            selectedBookingDetail.acceptedOffer?.operatorId === offer.operatorId
                              ? 'border-green-500 bg-green-50'
                              : offer.operatorId === user?.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{offer.operatorName}</p>
                                <p className="text-sm text-gray-600">{offer.aircraft} - {offer.price}</p>
                              </div>
                              <div>
                                {selectedBookingDetail.acceptedOffer?.operatorId === offer.operatorId && (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Accepted
                                  </span>
                                )}
                                {offer.operatorId === user?.id && selectedBookingDetail.acceptedOffer?.operatorId !== offer.operatorId && (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Your Offer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No offers yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Operator Cancellation Modal */}
      {showCancelModal && cancellingBooking && cancellationInfo && (
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Flight Request</h3>
                <p className="text-gray-600">
                  {cancellingBooking.from} → {cancellingBooking.to}
                </p>
              </div>

              {/* Cancellation Details */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-red-800 mb-3">Cancellation Penalty</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Customer Paid:</span>
                    <span className="font-medium">${cancellationInfo.originalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Penalty ({cancellationInfo.penaltyPercentage}%):</span>
                    <span className="font-medium">-${cancellationInfo.penaltyAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-red-300 pt-2">
                    <span className="text-red-800">Customer Refund:</span>
                    <span className="text-green-600">${cancellationInfo.refundAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Time Before Flight:</span>
                    <span className="font-medium">{cancellationInfo.timeBeforeFlight}</span>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-xs">
                    ⚠️ This will use 1 of your 10 cancellation rights.
                    Remaining: {9 - (user?.operatorCancellationCount || 0)}/10
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellingBooking(null);
                    setCancellationInfo(null);
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmOperatorCancellation}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Cancellation
                </button>
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
                      This action cannot be undone. The booking will be permanently removed.
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
                  Cancel
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

export default BookingRequests;
