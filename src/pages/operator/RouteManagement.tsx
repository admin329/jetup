import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, MapPin, Clock, DollarSign, AlertCircle, Lock, Crown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AirportSelector from '../../components/AirportSelector';

const RouteManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [routeData, setRouteData] = useState({
    from: '',
    to: '',
    duration: '',
    price: '',
    aircraft: ''
  });
  const [addRouteData, setAddRouteData] = useState({
    from: '',
    to: '',
    duration: '',
    price: '',
    aircraft: ''
  });
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
  
  // Check if operator can manage routes
  const canManageRoutes = () => {
    // Must have approved membership payment
    const hasMembershipApproval = operatorPayment?.status === 'approved';
    
    // Must have approved AOC
    const hasAOCApproval = user?.hasUploadedAOC && user?.isApprovedByAdmin;
    
    return hasMembershipApproval && hasAOCApproval;
  };

  const hasAccess = canManageRoutes();

  const accessStatus = {
    hasMembership: operatorPayment?.status === 'approved',
    hasAOC: user?.hasUploadedAOC && user?.isApprovedByAdmin,
    cancellationLimitReached: (user?.operatorCancellationCount || 0) >= 25,
    membershipStatus: operatorPayment?.status || 'none'
  };

  const [routes, setRoutes] = useState([
    {
      id: '1',
      from: 'New York',
      to: 'Los Angeles',
      duration: '6h 30m',
      price: '$25,000',
      aircraft: 'Gulfstream G650',
      status: 'Active',
      bookings: 12
    },
    {
      id: '2',
      from: 'London',
      to: 'Dubai',
      duration: '7h 15m',
      price: '$32,000',
      aircraft: 'Global 7500',
      status: 'Active',
      bookings: 8
    },
  ]);

  const filteredRoutes = routes.filter(route =>
    route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.aircraft.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRoute = (route: any) => {
    if (!hasAccess) return;
    setEditingRoute(route);
    setRouteData({
      from: route.from,
      to: route.to,
      duration: route.duration,
      price: route.price,
      aircraft: route.aircraft
    });
    setShowEditModal(true);
  };

  const handleDeleteRoute = (routeId: string) => {
    if (!hasAccess) return;
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
      alert('Route deleted successfully!');
    }
  };

  const handleSaveEdit = () => {
    if (!hasAccess) return;
    if (editingRoute) {
      setRoutes(prevRoutes => 
        prevRoutes.map(route => 
          route.id === editingRoute.id 
            ? { ...route, ...routeData }
            : route
        )
      );
      setShowEditModal(false);
      setEditingRoute(null);
      setRouteData({
        from: '',
        to: '',
        duration: '',
        price: '',
        aircraft: ''
      });
      alert('Route updated successfully!');
    }
  };

  const handleAddRoute = () => {
    if (!hasAccess) return;
    if (!addRouteData.from || !addRouteData.to || !addRouteData.aircraft || !addRouteData.duration || !addRouteData.price) {
      alert('Please fill in all fields');
      return;
    }

    const newRoute = {
      id: Date.now().toString(),
      from: addRouteData.from,
      to: addRouteData.to,
      duration: addRouteData.duration,
      price: addRouteData.price,
      aircraft: addRouteData.aircraft,
      status: 'Active',
      bookings: 0
    };

    setRoutes(prev => [...prev, newRoute]);
    setShowAddModal(false);
    setAddRouteData({
      from: '',
      to: '',
      duration: '',
      price: '',
      aircraft: ''
    });
    alert('Route created successfully!');
  };

  const handleAddRouteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddRouteData({
      ...addRouteData,
      [e.target.name]: e.target.value
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRouteData({
      ...routeData,
      [e.target.name]: e.target.value
    });
  };

  return (
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
                {accessStatus.cancellationLimitReached 
                  ? 'Route management disabled due to cancellation limit reached (25/25). Contact admin to reset.'
                  : 'You need approved membership and AOC license to manage routes.'
                }
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <Crown className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    Membership Status: {accessStatus.membershipStatus === 'approved' ? '✅ Approved' : 
                                      accessStatus.membershipStatus === 'pending_admin_approval' ? '⏳ Pending' : 
                                      accessStatus.hasMembership ? '✅ Approved' : '❌ Required'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    AOC License: {accessStatus.hasAOC ? '✅ Approved' : 
                                 user?.hasUploadedAOC ? '⏳ Pending' : '❌ Not Uploaded'}
                  </span>
                </div>
                {accessStatus.cancellationLimitReached && (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      Cancellation Rights: {user?.operatorCancellationCount || 0}/25 (Limit Reached)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
        {hasAccess ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Route
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center"
          >
            <Lock className="h-5 w-5 mr-2" />
            {accessStatus.cancellationLimitReached ? 'Limit Reached' : 'Access Restricted'}
          </button>
        )}
      </div>

      {hasAccess && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Routes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{route.from}</p>
                    </div>
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{route.to}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditRoute(route)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRoute(route.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{route.duration}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      route.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-lg font-bold text-blue-900">{route.price}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-600 mb-2">Aircraft: {route.aircraft}</p>
                    <p className="text-sm text-gray-600">Total Bookings: {route.bookings}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Create Route Modal */}
      {showAddModal && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Popular Route</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <AirportSelector
                      value={addRouteData.from}
                      onChange={(value) => setAddRouteData({ ...addRouteData, from: value })}
                      placeholder="Select departure airport"
                      name="from"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <AirportSelector
                      value={addRouteData.to}
                      onChange={(value) => setAddRouteData({ ...addRouteData, to: value })}
                      placeholder="Select destination airport"
                      name="to"
                      required
                      excludeAirport={addRouteData.from}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
                <select 
                  name="aircraft"
                  value={addRouteData.aircraft}
                  onChange={handleAddRouteInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select Aircraft</option>
                  <option>Gulfstream G650</option>
                  <option>Cessna Citation X+</option>
                  <option>Bombardier Global 7500</option>
                  <option>Embraer Phenom 300E</option>
                  <option>Dassault Falcon 7X</option>
                  <option>Hawker 4000</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={addRouteData.duration}
                    onChange={handleAddRouteInputChange}
                    placeholder="6h 30m"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={addRouteData.price}
                    onChange={handleAddRouteInputChange}
                    placeholder="$25,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoute}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Create Route
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Route Modal */}
      {showEditModal && editingRoute && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Route</h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    name="from"
                    value={routeData.from}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <input
                    type="text"
                    name="to"
                    value={routeData.to}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft</label>
                <select 
                  name="aircraft"
                  value={routeData.aircraft}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Select Aircraft</option>
                  <option>Gulfstream G650</option>
                  <option>Cessna Citation X+</option>
                  <option>Bombardier Global 7500</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={routeData.duration}
                    onChange={handleInputChange}
                    placeholder="6h 30m"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={routeData.price}
                    onChange={handleInputChange}
                    placeholder="$25,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRoute(null);
                  setRouteData({
                    from: '',
                    to: '',
                    duration: '',
                    price: '',
                    aircraft: ''
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;