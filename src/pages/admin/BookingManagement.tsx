import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Plane, Users, Clock, CheckCircle, XCircle, Eye, X, AlertTriangle, Building, DollarSign, Download, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateBookingConfirmationPDF } from '../../types/invoice';

const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { bookingRequests } = useAuth();

  // Mock additional bookings for demonstration
  const mockBookings = [
    {
      id: '3',
      bookingNumber: 'BID00003',
      type: 'route_booking',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      from: 'Miami',
      to: 'Aspen',
      departure: '2024-02-15T10:00',
      passengers: 8,
      tripType: 'oneWay',
      specialRequests: 'VIP service required',
      status: 'Completed',
      requestDate: '2024-02-10',
      createdAt: '2024-02-10T08:30:00Z',
      offers: [],
      rejectedByOperators: []
    },
    {
      id: '4',
      bookingNumber: 'BID00004',
      type: 'route_booking',
      customer: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      from: 'London',
      to: 'Paris',
      departure: '2024-01-20T16:00',
      passengers: 12,
      tripType: 'roundTrip',
      return: '2024-01-22T18:00',
      specialRequests: 'Business meeting',
      status: 'Cancelled',
      requestDate: '2024-01-15',
      createdAt: '2024-01-15T12:00:00Z',
      offers: [],
      rejectedByOperators: []
    },
  ];

  // Combine real booking requests with mock bookings
  const allBookings = [...bookingRequests, ...mockBookings];
  
  // Sort by creation time (newest first)
  const sortedBookings = allBookings.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredBookings = sortedBookings.filter(request => {
    const matchesSearch = 
      request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || request.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    pending: allBookings.filter(b => b.status === 'Pending').length,
    active: allBookings.filter(b => b.status === 'Active' || b.status === 'Confirmed').length,
    completed: allBookings.filter(b => b.status === 'Completed').length,
    cancelled: allBookings.filter(b => b.status === 'Cancelled').length
  };

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowDetailModal(true);
  };

  const handleDownloadBookingPDF = (booking: any) => {
    // Get user data for PDF generation
    const userData = {
      membershipType: 'premium', // Mock data for admin view
      email: booking.email
    };
    
    generateBookingConfirmationPDF(booking, userData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending operator approval':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;
    
    setIsUpdatingStatus(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call to update booking status
      console.log(`Updating booking ${selectedBooking.bookingNumber} status to: ${newStatus}`);
      
      // Update the booking in the list
      setSelectedBooking({
        ...selectedBooking,
        status: newStatus
      });
      
      alert(`Booking status updated to: ${newStatus}`);
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                <p className="text-xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Number
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passengers
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">{booking.bookingNumber}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">{booking.customer}</div>
                      <div className="text-xs text-gray-500 max-w-[120px] truncate">{booking.email}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className="max-w-[60px] truncate">{booking.from}</span>
                        <MapPin className="h-3 w-3 mx-1 text-gray-400" />
                        <span className="max-w-[60px] truncate">{booking.to}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.departure).toLocaleDateString()} at {new Date(booking.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {booking.passengers}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(booking.isPaid || booking.status === 'Confirmed' || booking.status === 'Completed') && (
                          <button
                            onClick={() => handleDownloadBookingPDF(booking)}
                            className="text-purple-600 hover:text-purple-800"
                            title="Download Booking Confirmation"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

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
                  {(selectedBooking.isPaid || selectedBooking.status === 'Confirmed' || selectedBooking.status === 'Completed') && (
                    <button
                      onClick={() => handleDownloadBookingPDF(selectedBooking)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Booking Confirmation
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
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-medium text-gray-900">{selectedBooking.customer}</p>
                          <p className="text-sm text-gray-600">{selectedBooking.email}</p>
                        </div>
                      </div>

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
                            <div>
                              <p className="font-medium text-gray-900">
                                {new Date(selectedBooking.return).toLocaleDateString()} at {new Date(selectedBooking.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
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
                          <p className="font-medium text-gray-900 capitalize">
                            {selectedBooking.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Booking Type</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {selectedBooking.type === 'route_booking' ? 'Route Booking' : 'Flight Request'}
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

                  {/* Operator Information - Only for completed/confirmed bookings */}
                  {(selectedBooking.status === 'Completed' || selectedBooking.status === 'Confirmed') && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Operator & Pricing</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Operator</p>
                            <p className="font-medium text-gray-900">
                              {selectedBooking.type === 'route_booking' 
                                ? (selectedBooking.from === 'Miami' && selectedBooking.to === 'Aspen' 
                                    ? 'Luxury Air Services' 
                                    : selectedBooking.from === 'London' && selectedBooking.to === 'Paris'
                                    ? 'Elite Jets Inc.'
                                    : 'Premium Aviation Ltd.')
                                : 'Awaiting Selection'
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium text-green-600 text-lg">
                              {selectedBooking.type === 'route_booking' 
                                ? (selectedBooking.from === 'Miami' && selectedBooking.to === 'Aspen' 
                                    ? '$18,500' 
                                    : selectedBooking.from === 'London' && selectedBooking.to === 'Paris'
                                    ? '$28,000'
                                    : '$25,000')
                                : 'Pending Quote'
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Plane className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Aircraft</p>
                            <p className="font-medium text-gray-900">
                              {selectedBooking.type === 'route_booking' 
                                ? (selectedBooking.from === 'Miami' && selectedBooking.to === 'Aspen' 
                                    ? 'Cessna Citation X+' 
                                    : selectedBooking.from === 'London' && selectedBooking.to === 'Paris'
                                    ? 'Gulfstream G650'
                                    : 'Pending Selection')
                                : 'Pending Selection'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Route Booking Specific Information */}
                  {selectedBooking.type === 'route_booking' && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Route Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Aircraft:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeAircraft || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Operator:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeOperator || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeDuration || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rating:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeRating || 'N/A'}/5</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Original Price:</span>
                        <span className="font-medium text-gray-900">
                          {selectedBooking.originalPrice || selectedBooking.routePrice || 'N/A'}
                        </span>
                      </div>
                      
                      {selectedBooking.discountRequested && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Discount ({selectedBooking.discountPercentage}%):</span>
                            <span className="font-medium text-green-600">-${selectedBooking.discountAmount?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                            <span className="text-gray-900">Final Price:</span>
                            <span className="text-green-600">${selectedBooking.finalPrice?.toFixed(2)}</span>
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

                  {/* Cancellation Information */}
                  {selectedBooking.isCancelled && selectedBooking.cancellationInfo && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-red-800 mb-4">Cancellation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-700">Cancellation Date:</span>
                          <span className="font-medium">{new Date(selectedBooking.cancellationInfo.cancellationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Cancelled By:</span>
                          <span className="font-medium">
                            {selectedBooking.cancellationInfo.reason?.includes('Operator') ? 'Operator' : 'Customer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Penalty:</span>
                          <span className="font-medium">${selectedBooking.cancellationInfo.penaltyAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-700">Refund:</span>
                          <span className="font-medium text-green-600">${selectedBooking.cancellationInfo.refundAmount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Special Requests</h4>
                      <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {/* Status Update Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Update Status</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Booking Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleStatusUpdate}
                        disabled={isUpdatingStatus || newStatus === selectedBooking.status}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isUpdatingStatus ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          'Update Status'
                        )}
                      </button>
                      
                      {newStatus !== selectedBooking.status && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 text-sm">
                            Status will change from <strong>{selectedBooking.status}</strong> to <strong>{newStatus}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and Timeline */}
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
                        <span className="text-sm font-medium text-gray-700">Created:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedBooking.createdAt).toLocaleDateString()} at {new Date(selectedBooking.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Booking Type:</span>
                        <span className="text-sm text-gray-900 capitalize">
                          {selectedBooking.type === 'flight_request' ? 'Flight Request' : 'Route Booking'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.discountRequested && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Discount Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount Requested:</span>
                          <span className="font-medium text-green-600">Yes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Membership Type:</span>
                          <span className="font-medium text-gray-900 capitalize">{selectedBooking.customerMembershipType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount Rate:</span>
                          <span className="font-medium text-green-600">{selectedBooking.discountPercentage}%</span>
                        </div>
                        {selectedBooking.discountAmount && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Discount Amount:</span>
                            <span className="font-medium text-green-600">${selectedBooking.discountAmount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {selectedBooking.type === 'flight_request' ? 'Operator Offers' : 'Route Details'} ({selectedBooking.offers?.length || 0})
                    </h4>
                    
                    {selectedBooking.type === 'flight_request' && selectedBooking.offers && selectedBooking.offers.length > 0 ? (
                      <div className="space-y-3">
                        {selectedBooking.offers.map((offer, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{offer.operatorName}</span>
                              <span className="font-bold text-green-600">{offer.price}</span>
                            </div>
                            {offer.discountApplied && (
                              <p className="text-xs text-green-600">
                                {offer.discountPercentage}% discount applied
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mb-2">{offer.aircraft}</p>
                            {offer.message && (
                              <p className="text-sm text-gray-600">{offer.message}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Offered on: {new Date(offer.offerDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : selectedBooking.type === 'flight_request' ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                          <p className="text-yellow-800 text-sm">
                            No operator offers yet. Waiting for responses.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Aircraft:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeAircraft || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Operator:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeOperator || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeDuration || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rating:</span>
                          <span className="font-medium text-gray-900">{selectedBooking.routeRating || 'N/A'}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Delete Confirmation Modal */}
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Booking (Admin)</h3>
                <p className="text-gray-600">
                  Are you sure you want to permanently delete this booking?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {deletingBooking.from} → {deletingBooking.to}
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-red-800 text-sm font-medium">Admin Action</p>
                    <p className="text-red-700 text-sm">
                      This is an administrative deletion. The booking will be permanently removed from all systems.
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

export default BookingManagement;
