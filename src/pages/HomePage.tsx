import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Star, Shield, Clock, Crown, Users, MapPin, Award, MessageCircle, ArrowRight, Filter, Phone, Search, Mail, CheckCircle, Globe, Building, DollarSign, Calendar, Eye, Download, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import Header from '../components/Header';
import BookingForm from '../components/BookingForm';
import AircraftCard from '../components/AircraftCard';
import RouteCard from '../components/RouteCard';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [routeSearchTerm, setRouteSearchTerm] = useState('');
  const [selectedDepartureCity, setSelectedDepartureCity] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Check if user is operator or admin
  const isOperatorOrAdmin = user?.role === 'operator' || user?.role === 'admin';

  const handleRequestQuote = () => {
    // Prevent operators and admins from booking
    if (isOperatorOrAdmin) {
      return;
    }
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      // Redirect to booking page for authenticated users
      window.location.href = '/booking';
    }
  };

  const aircraftData = [
    {
      id: '1',
      name: 'Gulfstream G650',
      type: 'Heavy Jet',
      capacity: 14,
      range: '7000 nm',
      speed: '516 kts',
      image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=800',
      operator: 'Premium Aviation Ltd.',
      country: 'United States'
    },
    {
      id: '2',
      name: 'Cessna Citation X+',
      type: 'Super Mid-size',
      capacity: 9,
      range: '3408 nm',
      speed: '527 kts',
      image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=800',
      operator: 'Elite Jets Inc.',
      country: 'United Kingdom'
    },
    {
      id: '3',
      name: 'Bombardier Global 7500',
      type: 'Ultra Long Range',
      capacity: 19,
      range: '7700 nm',
      speed: '516 kts',
      image: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800',
      operator: 'Luxury Air Services',
      country: 'Canada'
    }
  ];

  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France'];
  const categories = ['Light Jet', 'Super Mid-size', 'Heavy Jet', 'Ultra Long Range'];

  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === '' || aircraft.country === selectedCountry;
    const matchesCategory = selectedCategory === '' || aircraft.type === selectedCategory;
    
    return matchesSearch && matchesCountry && matchesCategory;
  });

  const departureCities = ['New York', 'London', 'Miami'];
  const priceRanges = ['Under $20,000', '$20,000 - $30,000', '$30,000 - $40,000', 'Over $40,000'];

  const popularRoutes = [
    {
      id: '1',
      from: 'New York',
      to: 'Los Angeles',
      duration: '6h 30m',
      price: '$25,000',
      aircraft: 'Gulfstream G650',
      operator: 'Premium Aviation Ltd.',
      rating: 4.9
    },
    {
      id: '2',
      from: 'London',
      to: 'Dubai',
      duration: '7h 15m',
      price: '$32,000',
      aircraft: 'Bombardier Global 7500',
      operator: 'Elite Jets Inc.',
      rating: 4.8
    },
    {
      id: '3',
      from: 'Miami',
      to: 'Aspen',
      duration: '4h 45m',
      price: '$18,500',
      aircraft: 'Cessna Citation X+',
      operator: 'Luxury Air Services',
      rating: 4.7
    }
  ];

  const filteredRoutes = popularRoutes.filter(route => {
    const matchesSearch = route.from.toLowerCase().includes(routeSearchTerm.toLowerCase()) ||
                         route.to.toLowerCase().includes(routeSearchTerm.toLowerCase()) ||
                         route.aircraft.toLowerCase().includes(routeSearchTerm.toLowerCase());
    const matchesDeparture = selectedDepartureCity === '' || route.from === selectedDepartureCity;
    
    let matchesPrice = true;
    if (selectedPriceRange) {
      const price = parseInt(route.price.replace(/[$,]/g, ''));
      switch (selectedPriceRange) {
        case 'Under $20,000':
          matchesPrice = price < 20000;
          break;
        case '$20,000 - $30,000':
          matchesPrice = price >= 20000 && price <= 30000;
          break;
        case '$30,000 - $40,000':
          matchesPrice = price >= 30000 && price <= 40000;
          break;
        case 'Over $40,000':
          matchesPrice = price > 40000;
          break;
      }
    }
    
    return matchesSearch && matchesDeparture && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="JETUP - Private Flight Network"
        description="JETUP - The official private flight network connecting premium customers with verified operators worldwide. JETUP offers luxury private jet charter with 0% commission, 1000+ aircraft, and 24/7 expert support."
        keywords="JETUP, JETUP private jets, JETUP aviation, JETUP flight network, JETUP charter, private jet charter, luxury flights, business aviation, private aircraft, jet rental"
        url="/"
        image="/JETUP-Photo-01.jpg"
      />
      
      <StructuredData type="organization" data={{}} />
      <StructuredData type="service" data={{}} />
      
      <Header showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-[55rem] sm:pb-60 lg:pb-0">
        {/* Mobile Gradient Background */}
        <div className="absolute inset-0 z-10 lg:hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"></div>
        
        {/* Desktop Video Background */}
        <div className="hidden lg:block absolute inset-0 z-10" style={{backgroundColor: 'rgba(11, 23, 51, 0.5)'}}></div>
        <video
          className="hidden lg:block absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://video.wixstatic.com/video/6c67ce_9bd85eca8a30490db18a24d100f7be01/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        
        <div 
          className="absolute inset-0 z-15 pointer-events-none hidden lg:block" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            backgroundRepeat: 'repeat',
            opacity: 0.5
          }}
        ></div>
        
        <div className="absolute z-20 text-white left-4 sm:left-8 lg:left-28 top-1/4 lg:top-1/2 transform -translate-y-1/2 lg:transform-none lg:top-80">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 lg:mb-6">
              <span className="text-3xl sm:text-4xl md:text-5xl">Private Flight Network</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 lg:mb-8 font-light -mt-4 sm:-mt-0">
              More Than Flight Experience
            </p>
            {/* Mobile - Text with Arrow */}
            <div className="block sm:hidden">
              <button
                onClick={() => {
                  const easyWaySection = document.getElementById('easy-way-section');
                  if (easyWaySection) {
                    easyWaySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center text-red-600 font-semibold text-lg hover:text-red-700 transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
            
            {/* Desktop - Button */}
            <div className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const easyWaySection = document.getElementById('easy-way-section');
                  if (easyWaySection) {
                    easyWaySection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Explore
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Booking Form Overlay */}
        {!isOperatorOrAdmin && (
          <div className="absolute right-8 xl:right-28 top-[55%] transform -translate-y-1/2 z-20 hidden lg:block">
            <BookingForm onOpenAuthModal={() => setShowAuthModal(true)} />
          </div>
        )}
        
        {/* Mobile Booking Form */}
        {!isOperatorOrAdmin && (
          <div className="absolute bottom-32 left-3 right-3 z-30 lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center relative z-30"
            >
              <BookingForm onOpenAuthModal={() => setShowAuthModal(true)} />
            </motion.div>
          </div>
        )}
      </section>

      {/* New Section with Image and Content */}
      <section id="easy-way-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/JETUP-Photo-01.jpg"
                alt="Luxury Private Jet"
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h2 className="text-4xl font-bold text-gray-900">
                The Easy Way to Private Flight
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                JETUP global private flight network offers customers and flight operators a seamless booking platform. JETUP provides premium customer portfolio, over 1,000 verified aircraft, and hundreds of approved flight operators for an unparalleled flight experience.
              </p>
              <div className="flex justify-center lg:justify-start">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isOperatorOrAdmin || (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved')}
                onClick={() => {
                  if (isOperatorOrAdmin || (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved')) return;
                  const aircraftSection = document.getElementById('available-aircraft');
                  if (aircraftSection) {
                    aircraftSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg ${
                  isOperatorOrAdmin || (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved')
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isOperatorOrAdmin ? (
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    <span>Access Restricted</span>
                  </div>
                ) : (user?.role === 'customer' && user?.profileCompletionStatus !== 'approved') ? (
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    <span>Profile Approval Required</span>
                  </div>
                ) : (
                  'Find aircrafts'
                )}
              </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discover JETUP's Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover JETUP Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get exclusive booking opportunities on JETUP's official private flight network.
            </p>
          </motion.div>

          {/* For Customers and For Operators - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
            {/* For Customers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer text-center md:text-left"
            >
              {/* Image */}
              <div className="relative -m-8 mb-2">
                <img
                  src="/JETUP-Photo-04.jpeg"
                  alt="For Customers"
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 text-center md:text-left">For Customers</h3>
                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                  JETUP Private Flight booking platform provides customers with special discounted and privileged booking opportunities through JETUP's global verified aircraft fleet network and approved flight operator partners.
                </p>
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.href = '/membership';
                }}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg w-full"
              >
                Learn More
              </motion.button>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative -m-8 mb-2">
                <img
                  src="/JETUP-Photo-06.jpg"
                  alt="Experience"
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 text-center md:text-left">For Experience</h3>
                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                  JETUP continues to offer a unique flight experience to registered users and verified flight operators. JETUP makes private flight experience advantageous for users, whether for personal or business flights.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.location.href = '/experience';
                  }}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg w-full"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            {/* For Operators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 space-y-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative -m-8 mb-2">
                <img
                  src="/JETUP-Photo-05.jpeg"
                  alt="For Operators"
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 text-center md:text-left">For Operators</h3>
                <p className="text-gray-700 leading-relaxed text-center md:text-left">
                  JETUP Private flight network portal provides partner flight operators with technologically advanced and user-friendly booking infrastructure. JETUP helps operators market their services and reach qualified customers as the connecting point for users and flight operators.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    window.location.href = '/operators';
                  }}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg w-full"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Aircraft Section */}
      <section id="available-aircraft" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              JETUP Global Aircraft Offers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from JETUP's premium fleet of verified aircraft operated by certified professionals
            </p>
            <Link
              to="/aircrafts"
              className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium underline transition-colors"
            >
              See More
            </Link>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                      placeholder="Search by name or operator..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aircraft Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedCountry || selectedCategory) && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCountry('');
                      setSelectedCategory('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAircraft.map((aircraft, index) => (
              <motion.div
                key={aircraft.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              >
                <AircraftCard 
                  aircraft={aircraft} 
                  showOperator={true}
                  isAuthenticated={isAuthenticated}
                  onRequestQuote={handleRequestQuote}
                />
              </motion.div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredAircraft.length === 0 && (
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
                  setSelectedCountry('');
                  setSelectedCategory('');
                }}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              JETUP Popular Routes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              JETUP pre-planned flights on the most popular destinations with competitive pricing
            </p>
            <Link
              to="/routes"
              className="inline-block mt-4 text-red-600 hover:text-red-700 font-medium underline transition-colors"
            >
              See More
            </Link>
          </motion.div>

          {/* Route Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Routes</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Routes
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search by city or aircraft..."
                      value={routeSearchTerm}
                      onChange={(e) => setRouteSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Departure City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure City
                  </label>
                  <select
                    value={selectedDepartureCity}
                    onChange={(e) => setSelectedDepartureCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Cities</option>
                    {departureCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">All Prices</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(routeSearchTerm || selectedDepartureCity || selectedPriceRange) && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setRouteSearchTerm('');
                      setSelectedDepartureCity('');
                      setSelectedPriceRange('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <RouteCard route={route} onOpenAuthModal={() => setShowAuthModal(true)} />
              </motion.div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredRoutes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Routes Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={() => {
                  setRouteSearchTerm('');
                  setSelectedDepartureCity('');
                  setSelectedPriceRange('');
                }}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Do you need help?
            </h2>
            <p className="text-xl text-gray-600">
              Our aviation experts are available 24/7 for your request.
            </p>
          </motion.div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Phone Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Support</h3>
              <p className="text-gray-600 mb-6">
                Speak directly with our aviation experts for immediate assistance
              </p>
              <a
                href="tel:+18885656090"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Call Center
              </a>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Available
              </div>
            </motion.div>

            {/* Email Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
              <p className="text-gray-600 mb-6">
                Send us detailed questions and we'll respond within 2 hours
              </p>
              <a
                href="mailto:support@jetup.aero?subject=JETUP SUPPORT"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Email Us
              </a>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Response within 2 hours
              </div>
            </motion.div>

            {/* Live Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat</h3>
              <p className="text-gray-600 mb-6">
                Chat with our support team for quick answers to your questions
              </p>
              <a
                href="https://wa.me/18885656090"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                WhatsApp
              </a>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Available
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, flight deals, and aviation news
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form className="space-y-6 lg:space-y-0">
                <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4 space-y-6 lg:space-y-0">
                  <div className="flex-1">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full lg:w-auto bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg whitespace-nowrap"
                    >
                      Subscribe to Newsletter
                    </motion.button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  By subscribing, you agree to receive marketing emails. You can{' '}
                  <button className="text-blue-600 hover:text-blue-800 underline">
                    unsubscribe at any time
                  </button>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Statement
            </h2>
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-500 leading-relaxed text-base">
                JETUP Private is a booking system portal for its flight network, connecting premium customers with a globally approved fleet of aircraft and verified flight operators. JETUP is not a direct charter flight operator. It is not directly affiliated with an aircraft fleet and does not directly sell or market charter flights on its own behalf. JETUP operates a booking portal through a membership system for users and flight operators. For more disclaimers and legal status, please visit the{' '}
                <a href="/disclaimer" className="text-blue-500 hover:text-blue-700 underline">
                  disclaimers
                </a>
                {' '}and{' '}
                <a href="/legal" className="text-blue-500 hover:text-blue-700 underline">
                  legal status
                </a>
                , please visit the respective pages
                .
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <Link
                  to="/operators"
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors w-40 text-center text-sm"
                  style={{backgroundColor: '#0B1733'}}
                >
                  FOR OPERATORS
                </Link>
                <Link
                  to="/fleet"
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors w-40 text-center text-sm"
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

export default HomePage;
