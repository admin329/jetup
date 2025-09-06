import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Users, MapPin, Gauge, AlertCircle, Upload, Lock, Crown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AircraftManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<any>(null);
  const [aircraftList, setAircraftList] = useState([
    {
      id: '1',
      name: 'Gulfstream G650',
      type: 'Heavy Jet',
      capacity: 14,
      range: '7000 nm',
      speed: '516 kts',
      image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'Active',
      totalFlights: 156
    },
    {
      id: '2',
      name: 'Cessna Citation X+',
      type: 'Super Mid-size',
      capacity: 9,
      range: '3408 nm',
      speed: '527 kts',
      image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'Active',
      totalFlights: 89
    },
  ]);
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
  
  const accessStatus = {
    hasMembership: operatorPayment?.status === 'approved',
    hasAOC: user?.hasUploadedAOC && user?.isApprovedByAdmin,
    cancellationLimitReached: (user?.operatorCancellationCount || 0) >= 25,
    membershipStatus: operatorPayment?.status || 'pending',
    hasFullAccess: operatorPayment?.status === 'approved' && user?.hasUploadedAOC && user?.isApprovedByAdmin,
    paymentInfo: operatorPayment
  };

  // Check if operator can manage aircraft
  const canManageAircraft = () => {
    // Must have approved membership payment
    const hasMembershipApproval = operatorPayment?.status === 'approved';
    
    // Must have approved AOC
    const hasAOCApproval = user?.hasUploadedAOC && user?.isApprovedByAdmin;
    
    return hasMembershipApproval && hasAOCApproval;
  };

  const hasAccess = canManageAircraft();

  const handleEditAircraft = (aircraft: any) => {
    if (!hasAccess) return;
    setEditingAircraft(aircraft);
    setShowEditModal(true);
  };

  const handleDeleteAircraft = (aircraftId: string) => {
    if (!hasAccess) return;
    if (window.confirm('Are you sure you want to delete this aircraft?')) {
      setAircraftList(prev => prev.filter(aircraft => aircraft.id !== aircraftId));
    }
  };

  const handleSaveEdit = () => {
    if (!hasAccess) return;
    if (editingAircraft) {
      setAircraftList(prev => 
        prev.map(aircraft => 
          aircraft.id === editingAircraft.id ? editingAircraft : aircraft
        )
      );
      setShowEditModal(false);
      setEditingAircraft(null);
    }
  };

  const filteredAircraft = aircraftList.filter(plane =>
    plane.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plane.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  ? 'Aircraft management disabled due to cancellation limit reached (25/25). Contact admin to reset.'
                  : 'You need approved membership and AOC license to manage aircraft.'
                }
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <Crown className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    Membership Status: {accessStatus.hasMembership ? '✅ Approved' : '❌ Required'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    AOC License: {accessStatus.hasAOC ? '✅ Approved' : '❌ Required'}
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
        <h2 className="text-2xl font-bold text-gray-900">Aircraft Management</h2>
        {hasAccess ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Aircraft
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
              placeholder="Search aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Aircraft Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAircraft.map((plane, index) => (
              <motion.div
                key={plane.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={plane.image}
                    alt={plane.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {plane.status}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plane.name}</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditAircraft(plane)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAircraft(plane.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{plane.type}</p>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-blue-600 mr-1" />
                      <div>
                        <p className="text-gray-500">Capacity</p>
                        <p className="font-semibold">{plane.capacity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                      <div>
                        <p className="text-gray-500">Range</p>
                        <p className="font-semibold">{plane.range}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 text-blue-600 mr-1" />
                      <div>
                        <p className="text-gray-500">Speed</p>
                        <p className="font-semibold">{plane.speed}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      Total Flights: <span className="font-medium">{plane.totalFlights}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Add Aircraft Modal */}
      {showAddModal && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Aircraft</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Name</label>
                <input
                  type="text"
                  placeholder="e.g., Gulfstream G650"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Helicopter</option>
                  <option>Turboprop</option>
                  <option>Light jets</option>
                  <option>Mide Size</option>
                  <option>Long Range</option>
                  <option>Airline</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    placeholder="14"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Range (nm)</label>
                  <input
                    type="text"
                    placeholder="7000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed (kts)</label>
                <input
                  type="text"
                  placeholder="516"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    className="hidden"
                    id="aircraft-photo"
                  />
                  <label htmlFor="aircraft-photo" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">Click to upload aircraft photo</p>
                    <p className="text-xs text-gray-500">JPEG only, min 1000px, 300 DPI</p>
                    <p className="text-xs text-gray-500 mt-1">This will be the main display photo</p>
                  </label>
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
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Add Aircraft
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Aircraft Modal */}
      {showEditModal && editingAircraft && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Aircraft</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Name</label>
                <input
                  type="text"
                  value={editingAircraft.name}
                  onChange={(e) => setEditingAircraft({...editingAircraft, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aircraft Type</label>
                <select 
                  value={editingAircraft.type}
                  onChange={(e) => setEditingAircraft({...editingAircraft, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Helicopter</option>
                  <option>Turboprop</option>
                  <option>Light jets</option>
                  <option>Mide Size</option>
                  <option>Long Range</option>
                  <option>Airline</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    value={editingAircraft.capacity}
                    onChange={(e) => setEditingAircraft({...editingAircraft, capacity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Range (nm)</label>
                  <input
                    type="text"
                    value={editingAircraft.range}
                    onChange={(e) => setEditingAircraft({...editingAircraft, range: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed (kts)</label>
                <input
                  type="text"
                  value={editingAircraft.speed}
                  onChange={(e) => setEditingAircraft({...editingAircraft, speed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAircraft(null);
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

export default AircraftManagement;