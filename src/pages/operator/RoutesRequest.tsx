import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Users, DollarSign, Check, X, AlertCircle, Send, Lock, Crown, Shield, Eye, Download, FileText, Building, Plane, Ban, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateBookingConfirmationPDF } from '../../types/invoice';

const RoutesRequest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departureFilter, setDepartureFilter] = useState('');
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<any>(null);
  const [cancellationInfo, setCancellationInfo] = useState<any>(null);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [deletingBooking, setDeletingBooking] = useState<any>(null);
  const { user, bookingRequests, updateBookingRequest, approveRouteBooking, rejectRouteBooking } = useAuth();

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

  const canAccessBookings = () => {
    const hasMembershipApproval = operatorPayment?.status === 'approved';
    const hasAOCApproval = user?.hasUploadedAOC && user?.isApprovedByAdmin;
    return hasMembershipApproval && hasAOCApproval;
  };

  const hasAccess = canAccessBookings();

  const departureCities = ['New York', 'London', 'Miami', 'Paris', 'Los Angeles'];

  // Filter route booking requests for this operator
  const routeBookingRequests = bookingRequests.filter(request => {
    console.log('Checking booking:', request);
    console.log('User name:', user?.name);
    console.log('Route operator:', request.routeOperator);
    console.log('Selected route operator:', request.selectedRoute?.operator);
    
    return request.type === 'route_booking' && 
           (request.selectedRoute?.operator === user?.name || 
            request.routeOperator === user?.name ||
            request.selectedRoute?.operator === 'Demo Operator' ||
            request.routeOperator === 'Demo Operator' ||
            request.selectedRoute?.operator === 'Premium Aviation Ltd.' ||
            request.routeOperator === 'Premium Aviation Ltd.' ||
            request.selectedRoute?.operator === 'Elite Jets Inc.' ||
            request.routeOperator === 'Elite Jets Inc.' ||
            request.selectedRoute?.operator === 'Luxury Air Services' ||
            request.routeOperator === 'Luxury Air Services') &&
           !request.rejectedByOperators.includes(user?.id || '');
  });

  const filteredRequests = routeBookingRequests.filter(request => {
    const matchesSearch = 
      request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDeparture = departureFilter === '' || request.from === departureFilter;
    
    return matchesSearch && matchesDeparture;
  });

  const handleApprove = (requestId: string) => {
    const confirmApprove = window.confirm('Are you sure you want to approve this route booking? Customer will have 3 hours to complete payment.');
    
    if (confirmApprove) {
      approveRouteBooking(requestId);
      alert('Route booking approved! Customer has 3 hours to complete payment.');
    }
  };

  const handleReject = (requestId: string) => {
    const confirmReject = window.confirm('Are you sure you want to reject this route booking request?');
    
    if (confirmReject) {
      rejectRouteBooking(requestId);
      alert('Route booking request rejected.');
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
    
    setCancellingBooking(booking);
    setShowCancelModal(true);
  };

  const confirmOperatorCancellation = () => {
    if (!cancellingBooking || !cancellationInfo) return;
    
    // Check operator cancellation rights (10 for routes, not 25)
    const operatorCancellationCount = user?.operatorCancellationCount || 0;
    if (operatorCancellationCount >= 10) {
      alert('You have reached your cancellation limit (10/10). Please contact admin to reset your rights.');
      return;
    }
    
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
    alert(`Booking cancelled successfully. Customer refund: $${cancellationInfo.refundAmount}. This used 1 of your 10 cancellation rights. Remaining: ${9 - (user?.operatorCancellationCount || 0)}/10`);
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
   setShowBookingDetailModal(false);
   alert('Booking deleted successfully!');
 };

  const handleViewBookingDetail = (request: any) => {
    setSelectedBookingDetail(request);
    setShowBookingDetailModal(true);
  };

  const handleDownloadBookingPDF = (booking: any) => {
    generateBookingConfirmationPDF(booking, user);
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
      case 'cancelled by operator':
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
        return Check;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
      case 'cancelled by operator':
      case 'rejected by operator':
        return XCircle;
      case 'expired':
        return Clock;
      default:
        return Clock;
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
                  You need approved membership and AOC license to access route booking requests.
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
          <h2 className="text-2xl font-bold text-gray-900">Route Booking Requests</h2>
          {hasAccess ? (
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredRequests.filter(r => r.status === 'Pending Operator Approval').length} Pending
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
                  placeholder="Search route booking requests..."
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

            {/* Route Booking Requests */}
            <div className="space-y-4">
              {filteredRequests.map((routeRequest, index) => {
                const StatusIcon = getStatusIcon(routeRequest.status);
                
                return (
                  <motion.div
                    key={routeRequest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-red-600">{routeRequest.bookingNumber}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(routeRequest.status)}`}>
                            <StatusIcon className="h-3 w-3 inline mr-1" />
                            {routeRequest.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{routeRequest.customer}</h4>
                        <p className="text-gray-600">{routeRequest.email}</p>
                        <p className="text-sm text-gray-500">
                          Requested on {new Date(routeRequest.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {routeRequest.status === 'Pending Operator Approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(routeRequest.id)}
                              className="px-4 py-2 rounded-lg transition-colors flex items-center bg-green-600 text-white hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(routeRequest.id)}
                              className="px-4 py-2 rounded-lg transition-colors flex items-center bg-red-600 text-white hover:bg-red-700"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {/* Delete Button - Always Available */}
                        <button
                          onClick={() => handleDeleteBooking(selectedBookingDetail)}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                        
                        <button
                          onClick={() => handleViewBookingDetail(routeRequest)}
                          className="px-4 py-2 rounded-lg transition-colors flex items-center bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium">{routeRequest.from} → {routeRequest.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">
                            {new Date(routeRequest.departure).toLocaleDateString()} at {new Date(routeRequest.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Passengers</p>
                          <p className="font-medium">{routeRequest.passengers} people</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium text-green-600">
                            {routeRequest.discountRequested ? 
                              `$${routeRequest.finalPrice?.toFixed(2)} (${routeRequest.discountPercentage}% off)` : 
                              routeRequest.originalPrice
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {routeRequest.isPaid && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">Payment Completed</p>
                            <p className="text-green-700 text-xs">
                              Paid on {new Date(routeRequest.paidAt).toLocaleDateString()} • {routeRequest.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Discount Information */}
                    {routeRequest.discountRequested && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-green-800 font-medium text-sm">
                              Customer Used {routeRequest.discountPercentage}% Discount
                            </p>
                            <p className="text-green-700 text-xs">
                              Original: {routeRequest.originalPrice} → Final: ${routeRequest.finalPrice?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {routeRequest.specialRequests && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Special Requests:</span> {routeRequest.specialRequests}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No route booking requests found</p>
              </div>
            )}
          </>
        )}
      </div>

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
                  <h3 className="text-2xl font-bold text-gray-900">Route Booking Details</h3>
                  <p className="text-blue-600 font-medium">{selectedBookingDetail.bookingNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedBookingDetail.isPaid && (
                    <button
                      onClick={() => handleDownloadBookingPDF(selectedBookingDetail)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Booking Confirmation
                    </button>
                  )}
                  
                  {/* Delete Button - Red Color */}
                  {(selectedBookingDetail.isPaid || selectedBookingDetail.status === 'Confirmed') && (
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

                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Passengers</p>
                          <p className="font-medium text-gray-900">{selectedBookingDetail.passengers} people</p>
                        </div>
                      </div>
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
                          <span className="text-red-700">Reason:</span>
                          <span className="font-medium">{selectedBookingDetail.cancellationInfo.reason}</span>
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

                {/* Booking Status and Payment */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Status</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBookingDetail.status)}`}>
                          <StatusIcon className="h-3 w-3 inline mr-1" />
                          {selectedBookingDetail.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Request Date:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedBookingDetail.requestDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Route Type:</span>
                        <span className="text-sm text-gray-900">Route Booking</span>
                      </div>

                      {selectedBookingDetail.operatorApprovalDeadline && selectedBookingDetail.status === 'Pending Operator Approval' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Approval Deadline:</span>
                          <span className="text-sm text-red-600 font-medium">
                            {new Date(selectedBookingDetail.operatorApprovalDeadline).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {selectedBookingDetail.paymentDeadline && selectedBookingDetail.status === 'Approved' && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Payment Deadline:</span>
                          <span className="text-sm text-red-600 font-medium">
                            {new Date(selectedBookingDetail.paymentDeadline).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Route Details</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Aircraft:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBookingDetail.routeAircraft}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBookingDetail.routeDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Rating:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBookingDetail.routeRating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Original Price:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedBookingDetail.originalPrice}</span>
                      </div>
                      
                      {selectedBookingDetail.discountRequested && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Discount ({selectedBookingDetail.discountPercentage}%):</span>
                            <span className="text-sm font-medium text-green-600">-${selectedBookingDetail.discountAmount?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                            <span className="text-gray-900">Final Price:</span>
                            <span className="text-green-600">${selectedBookingDetail.finalPrice?.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Information */}
                  {selectedBookingDetail.isPaid && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Payment Status:</span>
                          <span className="text-sm font-medium text-green-600">Paid</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Payment Date:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(selectedBookingDetail.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Payment Method:</span>
                          <span className="text-sm text-gray-900">{selectedBookingDetail.paymentMethod}</span>
                        </div>
                        {selectedBookingDetail.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Transaction ID:</span>
                            <span className="text-sm text-gray-900">{selectedBookingDetail.transactionId}</span>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Route Booking</h3>
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

export default RoutesRequest;