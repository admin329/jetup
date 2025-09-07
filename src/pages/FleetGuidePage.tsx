import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Users, MapPin, Gauge, Fuel, Clock, Search, Filter, Star, Shield, Award, MessageCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';

const FleetGuidePage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');

  // Load aircraft from localStorage (admin managed data)
  const [aircraftFleet] = useState(() => {
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
          description: 'The pinnacle of luxury and performance in private aviation, offering unmatched range and comfort for global travel.'
        }
      ];
    } catch (error) {
      console.error('Error loading aircraft data:', error);
      return [];
    }
  });

  // Real-time update from localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('aircraftGuideData');
        if (saved) {
          const newData = JSON.parse(saved);
          // Force re-render by updating state
          window.location.reload();
        }
      } catch (error) {
        console.error('Error updating aircraft data:', error);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 2 seconds
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('aircraftGuideData');
        if (saved) {
          const newData = JSON.parse(saved);
          if (JSON.stringify(newData) !== JSON.stringify(aircraftFleet)) {
            window.location.reload();
          }
        }
      } catch (error) {
        // Silent error handling
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [aircraftFleet]);

  const oldAircraftFleet = [
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
      description: 'The pinnacle of luxury and performance in private aviation, offering unmatched range and comfort for global travel.'
    },
    {
      id: '2',
      name: 'Bombardier Global 7500',
      manufacturer: 'Bombardier',
      category: 'Ultra Long Range',
      image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
      specifications: {
        capacity: '14-19 passengers',
        range: '7,700 nm (14,260 km)',
        maxSpeed: '516 kts (956 km/h)',
        cruiseSpeed: '488 kts (904 km/h)',
        maxAltitude: '51,000 ft (15,545 m)',
        fuelCapacity: '4,850 gal (18,355 L)',
        cabinLength: '54.4 ft (16.6 m)',
        cabinWidth: '8.2 ft (2.5 m)',
        cabinHeight: '6.3 ft (1.9 m)',
        baggage: '220 cu ft (6.2 m³)'
      },
      features: [
        'Four distinct living spaces',
        'Master suite with full bed',
        'Entertainment lounge',
        'Conference area',
        'Full kitchen',
        'Crew rest area'
      ],
      description: 'The world\'s largest and longest-range business jet, featuring four distinct living spaces and unmatched comfort.'
    },
    {
      id: '3',
      name: 'Cessna Citation X+',
      manufacturer: 'Cessna',
      category: 'Super Mid-Size',
      image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
      specifications: {
        capacity: '9-12 passengers',
        range: '3,408 nm (6,312 km)',
        maxSpeed: '527 kts (976 km/h)',
        cruiseSpeed: '515 kts (954 km/h)',
        maxAltitude: '51,000 ft (15,545 m)',
        fuelCapacity: '2,040 gal (7,725 L)',
        cabinLength: '25.3 ft (7.7 m)',
        cabinWidth: '5.6 ft (1.7 m)',
        cabinHeight: '5.8 ft (1.8 m)',
        baggage: '80 cu ft (2.3 m³)'
      },
      features: [
        'Fastest civilian aircraft',
        'Advanced avionics suite',
        'Spacious cabin design',
        'High-speed connectivity',
        'Premium leather seating',
        'LED lighting system'
      ],
      description: 'The fastest civilian aircraft in the world, combining speed with luxury for efficient business travel.'
    },
    {
      id: '4',
      name: 'Dassault Falcon 7X',
      manufacturer: 'Dassault',
      category: 'Heavy Jet',
      image: 'https://images.pexels.com/photos/1906794/pexels-photo-1906794.jpeg?auto=compress&cs=tinysrgb&w=800',
      specifications: {
        capacity: '12-16 passengers',
        range: '5,950 nm (11,019 km)',
        maxSpeed: '488 kts (904 km/h)',
        cruiseSpeed: '459 kts (850 km/h)',
        maxAltitude: '51,000 ft (15,545 m)',
        fuelCapacity: '3,350 gal (12,680 L)',
        cabinLength: '39.1 ft (11.9 m)',
        cabinWidth: '7.8 ft (2.4 m)',
        cabinHeight: '6.2 ft (1.9 m)',
        baggage: '140 cu ft (4.0 m³)'
      },
      features: [
        'Three-engine reliability',
        'Exceptional fuel efficiency',
        'Large cabin windows',
        'Advanced flight deck',
        'Quiet cabin environment',
        'Flexible seating configurations'
      ],
      description: 'Three-engine reliability combined with exceptional fuel efficiency and spacious cabin design.'
    },
    {
      id: '5',
      name: 'Embraer Phenom 300E',
      manufacturer: 'Embraer',
      category: 'Light Jet',
      image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
      specifications: {
        capacity: '7-9 passengers',
        range: '2,010 nm (3,724 km)',
        maxSpeed: '464 kts (859 km/h)',
        cruiseSpeed: '453 kts (839 km/h)',
        maxAltitude: '45,000 ft (13,716 m)',
        fuelCapacity: '1,160 gal (4,390 L)',
        cabinLength: '17.2 ft (5.2 m)',
        cabinWidth: '5.1 ft (1.6 m)',
        cabinHeight: '4.9 ft (1.5 m)',
        baggage: '74 cu ft (2.1 m³)'
      },
      features: [
        'Single-pilot certified',
        'Advanced avionics',
        'Spacious cabin for class',
        'Large baggage compartment',
        'Excellent short runway performance',
        'Low operating costs'
      ],
      description: 'Perfect for short to medium-range flights, offering excellent performance and value in the light jet category.'
    },
    {
      id: '6',
      name: 'Hawker 4000',
      manufacturer: 'Hawker Beechcraft',
      category: 'Mid-Size Jet',
      image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=800',
      specifications: {
        capacity: '8-10 passengers',
        range: '3,190 nm (5,908 km)',
        maxSpeed: '464 kts (859 km/h)',
        cruiseSpeed: '450 kts (833 km/h)',
        maxAltitude: '45,000 ft (13,716 m)',
        fuelCapacity: '1,650 gal (6,246 L)',
        cabinLength: '21.3 ft (6.5 m)',
        cabinWidth: '6.0 ft (1.8 m)',
        cabinHeight: '5.9 ft (1.8 m)',
        baggage: '105 cu ft (3.0 m³)'
      },
      features: [
        'Spacious stand-up cabin',
        'Advanced composite construction',
        'Quiet cabin environment',
        'Large windows',
        'Flexible seating arrangements',
        'Excellent fuel efficiency'
      ],
      description: 'Spacious cabin with advanced avionics and comfort, ideal for medium-range business travel.'
    }
  ];

  const categories = ['Helicopter', 'Turboprop', 'Light Jet', 'Mid-Size Jet', 'Super Mid-Size', 'Heavy Jet', 'Ultra Long Range', 'Airline'];
  const manufacturers = ['Bell', 'Airbus Helicopters', 'Leonardo', 'Robinson', 'King Air', 'TBM', 'Pilatus', 'Gulfstream', 'Bombardier', 'Cessna', 'Dassault', 'Embraer', 'Hawker Beechcraft', 'Boeing', 'Airbus'];

  const filteredAircraft = aircraftFleet.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || aircraft.category === selectedCategory;
    const matchesManufacturer = selectedManufacturer === '' || aircraft.manufacturer === selectedManufacturer;
    
    return matchesSearch && matchesCategory && matchesManufacturer;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16" style={{backgroundColor: '#0B1733'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 mt-12">
              Fleet Network Guide
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Comprehensive technical specifications and features of our premium aircraft fleet
            </p>
            <Link
              to="/aircrafts"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              Aircraft Offers
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="/JETUP-Photo-08.jpeg"
                alt="Premium Aircraft Fleet"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Global Fleet Options
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our carefully curated fleet represents the finest in private aviation, featuring aircraft from the world's leading manufacturers. Each aircraft is maintained to the highest standards and operated by certified professionals.
              </p>
              <div className="flex justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const filtersSection = document.querySelector('.py-8.bg-gray-50');
                    if (filtersSection) {
                      filtersSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
                >
                  Aircraft Specifications
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Aircraft Specifications Guide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             These specifications are prepared according to data published by aircraft manufacturers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Aircraft</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Aircraft
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by name or manufacturer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Categories
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manufacturer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Manufacturers
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select Manufacturers</option>
                    {manufacturers.map((manufacturer) => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedCategory || selectedManufacturer) && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                      setSelectedManufacturer('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aircraft Fleet Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Show aircraft only when filters are applied */}
          {(searchTerm || selectedCategory || selectedManufacturer) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredAircraft.map((aircraft, index) => (
                <motion.div
                  key={aircraft.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Aircraft Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={aircraft.image}
                      alt={aircraft.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {aircraft.category}
                    </div>
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                      {aircraft.manufacturer}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{aircraft.name}</h3>
                    <p className="text-gray-600 mb-6">{aircraft.description}</p>
                    
                    {/* Key Specifications */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-semibold text-gray-900">{aircraft.specifications.capacity}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Range</p>
                          <p className="font-semibold text-gray-900">{aircraft.specifications.range}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Max Speed</p>
                          <p className="font-semibold text-gray-900">{aircraft.specifications.maxSpeed}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Cruise Speed</p>
                          <p className="font-semibold text-gray-900">{aircraft.specifications.cruiseSpeed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Specifications */}
                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h4>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Altitude:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.maxAltitude}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Capacity:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.fuelCapacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cabin Length:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.cabinLength}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cabin Width:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.cabinWidth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cabin Height:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.cabinHeight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Baggage:</span>
                          <span className="font-medium text-gray-900">{aircraft.specifications.baggage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {aircraft.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Default message when no filters are applied */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Filters to View Aircraft</h3>
              <p className="text-gray-600 mb-6">
                Use the filters above to explore our premium aircraft fleet
              </p>
            </motion.div>
          )}

          {/* No Results Message - only show when filters are applied but no results */}
          {(searchTerm || selectedCategory || selectedManufacturer) && filteredAircraft.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Aircraft Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedManufacturer('');
                }}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Safety & Certification Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Safety & Certification Standards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every aircraft in our fleet meets the highest international safety and certification standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600">
                All aircraft undergo rigorous safety inspections and maintenance protocols to ensure passenger safety
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Certified Operators</h3>
              <p className="text-gray-600">
                Every operator in our network holds valid Air Operator Certificates and meets international standards
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                Only the finest aircraft with proven track records and exceptional maintenance histories
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Explore Our Fleet?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Discover our premium aircraft network and get expert support for your aviation needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/aircrafts"
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg inline-flex items-center justify-center"
              >
                Aircraft Offers
              </Link>
              <Link
                to="/support"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center justify-center"
              >
                Get Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="text-white py-12" style={{backgroundColor: '#0B1733'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div>
              <img 
                src="/Up-app-logo.png" 
                alt="JETUP" 
                className="h-12 w-auto mb-2"
              />
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start space-x-4 lg:space-x-6 text-sm lg:text-base">
              <a href="/about-us" className="text-white hover:text-red-500 transition-colors underline">
                About Us
              </a>
              <a href="/legal" className="text-white hover:text-red-500 transition-colors underline">
                Legal
              </a>
              <a href="/disclaimer" className="text-white hover:text-red-500 transition-colors underline">
                Disclaimer
              </a>
              <a href="/cookies" className="text-white hover:text-red-500 transition-colors underline">
                Cookies
              </a>
              <a href="/privacy" className="text-white hover:text-red-500 transition-colors underline">
                Privacy
              </a>
              <a href="/terms-of-use" className="text-white hover:text-red-500 transition-colors underline">
                Terms of Use
              </a>
              <a href="/charter-terms" className="text-white hover:text-red-500 transition-colors underline">
                Charter Terms
              </a>
            </div>
            
            <div className="flex space-x-2 lg:space-x-3">
              <a
                href="https://wa.me/18885656090"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/jetupaero/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com/jetupaero/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@jetupaero"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <Link
                  to="/operators"
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 transition-colors w-40 text-center text-sm"
                  style={{backgroundColor: '#0B1733'}}
                >
                  FOR OPERATORS
                </Link>
                <Link
                  to="/fleet"
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 transition-colors w-40 text-center text-sm"
                  style={{backgroundColor: '#0B1733'}}
                >
                  FLEET GUIDE
                </Link>
              </div>
              <p className="text-center lg:text-right text-white text-sm lg:text-base">&copy; 2025 JETUP LTD (UK)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FleetGuidePage;
