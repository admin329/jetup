import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Plane, X, Save, Upload, Users, MapPin, Gauge, Clock, Fuel, Star } from 'lucide-react';

interface AircraftSpec {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  image: string;
  specifications: {
    capacity: string;
    range: string;
    maxSpeed: string;
    cruiseSpeed: string;
    maxAltitude: string;
    fuelCapacity: string;
    cabinLength: string;
    cabinWidth: string;
    cabinHeight: string;
    baggage: string;
  };
  features: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AircraftGuideManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<AircraftSpec | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  const [aircraftData, setAircraftData] = useState({
    name: '',
    manufacturer: '',
    category: '',
    image: '',
    specifications: {
      capacity: '',
      range: '',
      maxSpeed: '',
      cruiseSpeed: '',
      maxAltitude: '',
      fuelCapacity: '',
      cabinLength: '',
      cabinWidth: '',
      cabinHeight: '',
      baggage: ''
    },
    features: [''],
    description: ''
  });

  // Load aircraft from localStorage
  const [aircraftList, setAircraftList] = useState<AircraftSpec[]>(() => {
    try {
      const saved = localStorage.getItem('aircraftGuideData');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: 'Gulfstream G650ER',
          manufacturer: 'Gulfstream',
          category: 'Ultra Long Range',
          image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
          specifications: {
            capacity: '14-19 passengers',
            range: '7,500 nm (13,890 km)',
            maxSpeed: '516 kts (956 km/h)',
            cruiseSpeed: '488 kts (904 km/h)',
            maxAltitude: '51,000 ft (15,545 m)',
            fuelCapacity: '4,810 gal (18,200 L)',
            cabinLength: '46.8 ft (14.3 m)',
            cabinWidth: '8.2 ft (2.5 m)',
            cabinHeight: '6.3 ft (1.9 m)',
            baggage: '195 cu ft (5.5 m³)'
          },
          features: [
            'Panoramic windows',
            'Advanced cabin management system',
            'High-speed internet connectivity',
            'Full galley and bar',
            'Private lavatory with shower',
            'Noise reduction technology'
          ],
          description: 'The pinnacle of luxury and performance in private aviation, offering unmatched range and comfort for global travel.',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error loading aircraft data:', error);
      return [];
    }
  });

  const categories = ['Helicopter', 'Turboprop', 'Light Jet', 'Mid-Size Jet', 'Super Mid-Size', 'Heavy Jet', 'Ultra Long Range', 'Airline'];
  const manufacturers = ['Bell', 'Airbus Helicopters', 'Leonardo', 'Robinson', 'King Air', 'TBM', 'Pilatus', 'Gulfstream', 'Bombardier', 'Cessna', 'Dassault', 'Embraer', 'Hawker Beechcraft', 'Boeing', 'Airbus'];

  const filteredAircraft = aircraftList.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || aircraft.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setAircraftData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setAircraftData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...aircraftData.features];
    newFeatures[index] = value;
    setAircraftData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setAircraftData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (aircraftData.features.length > 1) {
      const newFeatures = aircraftData.features.filter((_, i) => i !== index);
      setAircraftData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }
      setUploadedImage(file);
      // In a real app, you would upload to a server and get a URL
      const imageUrl = URL.createObjectURL(file);
      setAircraftData(prev => ({
        ...prev,
        image: imageUrl
      }));
    } else {
      alert('Please upload an image file (JPG, PNG, etc.)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!aircraftData.name.trim() || !aircraftData.manufacturer || !aircraftData.category || !aircraftData.description.trim()) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate specifications
      const requiredSpecs = ['capacity', 'range', 'maxSpeed', 'cruiseSpeed', 'maxAltitude'];
      for (const spec of requiredSpecs) {
        if (!aircraftData.specifications[spec as keyof typeof aircraftData.specifications].trim()) {
          alert(`Please fill in ${spec} specification`);
          setIsSubmitting(false);
          return;
        }
      }

      // Validate features
      const validFeatures = aircraftData.features.filter(f => f.trim() !== '');
      if (validFeatures.length === 0) {
        alert('Please add at least one feature');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingAircraft) {
        // Update existing aircraft
        const updatedAircraft = {
          ...editingAircraft,
          ...aircraftData,
          features: validFeatures,
          updatedAt: new Date().toISOString()
        };
        
        const updatedList = aircraftList.map(aircraft => 
          aircraft.id === editingAircraft.id ? updatedAircraft : aircraft
        );
        
        setAircraftList(updatedList);
        localStorage.setItem('aircraftGuideData', JSON.stringify(updatedList));
        
        setShowEditModal(false);
        setEditingAircraft(null);
        alert('Aircraft updated successfully!');
      } else {
        // Add new aircraft
        const newAircraft: AircraftSpec = {
          id: Date.now().toString(),
          ...aircraftData,
          features: validFeatures,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const updatedList = [newAircraft, ...aircraftList];
        setAircraftList(updatedList);
        localStorage.setItem('aircraftGuideData', JSON.stringify(updatedList));
        
        setShowAddModal(false);
        alert('Aircraft added successfully!');
      }

      // Reset form
      setAircraftData({
        name: '',
        manufacturer: '',
        category: '',
        image: '',
        specifications: {
          capacity: '',
          range: '',
          maxSpeed: '',
          cruiseSpeed: '',
          maxAltitude: '',
          fuelCapacity: '',
          cabinLength: '',
          cabinWidth: '',
          cabinHeight: '',
          baggage: ''
        },
        features: [''],
        description: ''
      });
      setUploadedImage(null);

    } catch (error) {
      console.error('Error saving aircraft:', error);
      alert('Failed to save aircraft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (aircraft: AircraftSpec) => {
    setEditingAircraft(aircraft);
    setAircraftData({
      name: aircraft.name,
      manufacturer: aircraft.manufacturer,
      category: aircraft.category,
      image: aircraft.image,
      specifications: aircraft.specifications,
      features: aircraft.features,
      description: aircraft.description
    });
    setShowEditModal(true);
  };

  const handleDelete = (aircraftId: string) => {
    if (window.confirm('Are you sure you want to delete this aircraft?')) {
      const updatedList = aircraftList.filter(aircraft => aircraft.id !== aircraftId);
      setAircraftList(updatedList);
      localStorage.setItem('aircraftGuideData', JSON.stringify(updatedList));
      alert('Aircraft deleted successfully!');
    }
  };

  const handleCancel = () => {
    setAircraftData({
      name: '',
      manufacturer: '',
      category: '',
      image: '',
      specifications: {
        capacity: '',
        range: '',
        maxSpeed: '',
        cruiseSpeed: '',
        maxAltitude: '',
        fuelCapacity: '',
        cabinLength: '',
        cabinWidth: '',
        cabinHeight: '',
        baggage: ''
      },
      features: [''],
      description: ''
    });
    setEditingAircraft(null);
    setUploadedImage(null);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  // Calculate stats
  const stats = {
    total: aircraftList.length,
    helicopter: aircraftList.filter(a => a.category === 'Helicopter').length,
    turboprop: aircraftList.filter(a => a.category === 'Turboprop').length,
    jets: aircraftList.filter(a => a.category.includes('Jet')).length,
    airline: aircraftList.filter(a => a.category === 'Airline').length
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Aircraft Guide Management</h2>
          <button
            onClick={() => {
              setEditingAircraft(null);
              setAircraftData({
                name: '',
                manufacturer: '',
                category: '',
                image: '',
                specifications: {
                  capacity: '',
                  range: '',
                  maxSpeed: '',
                  cruiseSpeed: '',
                  maxAltitude: '',
                  fuelCapacity: '',
                  cabinLength: '',
                  cabinWidth: '',
                  cabinHeight: '',
                  baggage: ''
                },
                features: [''],
                description: ''
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Aircraft
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                <Plane className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Aircraft</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
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
                <Plane className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Helicopters</p>
                <p className="text-xl font-bold text-gray-900">{stats.helicopter}</p>
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
                <p className="text-sm font-medium text-gray-500">Turboprops</p>
                <p className="text-xl font-bold text-gray-900">{stats.turboprop}</p>
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
              <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg">
                <Plane className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Jets</p>
                <p className="text-xl font-bold text-gray-900">{stats.jets}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                <Plane className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Airlines</p>
                <p className="text-xl font-bold text-gray-900">{stats.airline}</p>
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
              placeholder="Search aircraft..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Aircraft List */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aircraft
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAircraft.map((aircraft) => (
                  <tr key={aircraft.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={aircraft.image}
                            alt={aircraft.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{aircraft.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {aircraft.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {aircraft.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aircraft.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aircraft.specifications.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {aircraft.specifications.range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(aircraft.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(aircraft)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(aircraft.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredAircraft.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No aircraft found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Aircraft Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aircraft Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={aircraftData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Gulfstream G650ER"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="manufacturer"
                      value={aircraftData.manufacturer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Manufacturer</option>
                      {manufacturers.map((manufacturer) => (
                        <option key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={aircraftData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aircraft Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="aircraft-image"
                      />
                      <label htmlFor="aircraft-image" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">
                          {aircraftData.image ? 'Change Image' : 'Upload Image'}
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                      </label>
                      {aircraftData.image && (
                        <div className="mt-2">
                          <img
                            src={aircraftData.image}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-lg mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={aircraftData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of the aircraft..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specifications.capacity"
                        value={aircraftData.specifications.capacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 14-19 passengers"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Range <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specifications.range"
                        value={aircraftData.specifications.range}
                        onChange={handleInputChange}
                        placeholder="e.g., 7,500 nm (13,890 km)"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Speed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specifications.maxSpeed"
                        value={aircraftData.specifications.maxSpeed}
                        onChange={handleInputChange}
                        placeholder="e.g., 516 kts (956 km/h)"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cruise Speed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specifications.cruiseSpeed"
                        value={aircraftData.specifications.cruiseSpeed}
                        onChange={handleInputChange}
                        placeholder="e.g., 488 kts (904 km/h)"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Altitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="specifications.maxAltitude"
                        value={aircraftData.specifications.maxAltitude}
                        onChange={handleInputChange}
                        placeholder="e.g., 51,000 ft (15,545 m)"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Capacity
                      </label>
                      <input
                        type="text"
                        name="specifications.fuelCapacity"
                        value={aircraftData.specifications.fuelCapacity}
                        onChange={handleInputChange}
                        placeholder="e.g., 4,810 gal (18,200 L)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cabin Length
                      </label>
                      <input
                        type="text"
                        name="specifications.cabinLength"
                        value={aircraftData.specifications.cabinLength}
                        onChange={handleInputChange}
                        placeholder="e.g., 46.8 ft (14.3 m)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cabin Width
                      </label>
                      <input
                        type="text"
                        name="specifications.cabinWidth"
                        value={aircraftData.specifications.cabinWidth}
                        onChange={handleInputChange}
                        placeholder="e.g., 8.2 ft (2.5 m)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cabin Height
                      </label>
                      <input
                        type="text"
                        name="specifications.cabinHeight"
                        value={aircraftData.specifications.cabinHeight}
                        onChange={handleInputChange}
                        placeholder="e.g., 6.3 ft (1.9 m)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Baggage Capacity
                      </label>
                      <input
                        type="text"
                        name="specifications.baggage"
                        value={aircraftData.specifications.baggage}
                        onChange={handleInputChange}
                        placeholder="e.g., 195 cu ft (5.5 m³)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Key Features</h4>
                  <div className="space-y-3">
                    {aircraftData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="Enter aircraft feature..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {aircraftData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : (editingAircraft ? 'Update Aircraft' : 'Add Aircraft')}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AircraftGuideManagement;