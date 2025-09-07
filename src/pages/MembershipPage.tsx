import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Shield, Clock, Plane, Crown, Users, MapPin, Award, MessageCircle, Check, CreditCard, X, Phone, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';

const MembershipPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const membershipPlans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 'Free',
      period: '30 days!',
      description: 'Perfect for first-time users exploring private aviation',
      image: '/JETUP-Photo-01.jpg',
      features: [
        'Access to booking platform',
        'Standard customer support',
        'Basic aircraft selection',
        'Mobile app access',
        'No discount on bookings'
      ],
      buttonText: 'Get Started Free',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      id: 'basic',
      name: 'Basic Membership',
      price: '$950',
      period: 'per month',
      description: 'Great for regular travelers who value convenience and savings',
      image: '/JETUP-Photo-04.jpeg',
      features: [
        'Everything in Standard',
        'Priority booking access',
        'Extended aircraft selection',
        'Email support within 24h',
        '5% discount on all bookings',
        'Flexible cancellation policy'
      ],
      buttonText: 'Choose Basic',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'premium',
      name: 'Premium Membership',
      price: '$1,450',
      period: 'per month',
      description: 'Ideal for frequent flyers seeking luxury and exclusive benefits',
      image: '/JETUP-Photo-05.jpeg',
      features: [
        'Everything in Basic',
        'Premium aircraft access',
        '24/7 concierge support',
        '10% discount on all bookings',
        'Priority customer service',
        'Exclusive deals and offers',
        'Complimentary upgrades',
        'VIP lounge access'
      ],
      buttonText: 'Choose Premium',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      popular: true
    },
    {
      id: 'corporate',
      name: 'Corporate Membership',
      price: 'Custom',
      period: 'Contact us',
      description: 'Tailored solutions for businesses and corporate travel needs',
      image: '/JETUP-Photo-06.jpg',
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        'Custom pricing negotiations',
        'Corporate billing solutions',
        'Multi-user account access',
        'Advanced reporting dashboard',
        'Custom contract terms',
        'Volume discounts available'
      ],
      buttonText: 'Contact Sales',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Premium Service',
      description: 'Highest quality service standards with attention to every detail'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Rigorous safety protocols and certified professional crews'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Save valuable time with direct flights and flexible scheduling'
    },
    {
      icon: Crown,
      title: 'Luxury Comfort',
      description: 'Experience unmatched comfort in our premium aircraft cabins'
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Dedicated team focused on your individual needs and preferences'
    },
    {
      icon: Award,
      title: 'Excellence Award',
      description: 'Recognized for outstanding service in private aviation industry'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'standard') {
      setShowAuthModal(true);
    } else if (planId === 'corporate') {
      // Redirect to contact page
      window.location.href = '/support';
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="JETUP Membership Plans | Private Jet Discounts & Benefits"
        description="Join JETUP membership for exclusive private jet discounts, priority booking, and premium benefits. Standard (Free), Basic ($950/year), Premium ($1,450/year)."
        keywords="private jet membership, aviation membership, flight discounts, premium membership, private jet benefits, luxury travel membership"
        url="/membership"
        image="/JETUP-Photo-02.jpeg"
      />
      
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
              Explore Membership
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Choose the perfect membership plan for your private aviation needs
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  const compareSection = document.getElementById('compare-membership-plans');
                  if (compareSection) {
                    compareSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Compare Plans
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Section with Image and Content */}
      <section className="py-20 bg-white">
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
                src="/JETUP-Photo-02.jpeg"
                alt="The Easy Way to Private Flight"
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
                Join to Private Flight Network
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                The JETUP global private flight network offers its customers and flight operators a seamless private flight booking platform. With a premium customer portfolio, over 1,000 verified aircraft, and hundreds of approved flight operators, it provides all users with an unparalleled flight experience.
              </p>
              <div className="flex justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const compareSection = document.getElementById('compare-membership-plans');
                    if (compareSection) {
                      compareSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
                >
                  Compare
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                <img 
                  src="/Up-app-logo.png" 
                  alt="JETUP" 
                  className="h-8 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Unlimited Experience</h3>
              <p className="text-gray-600 mb-6">
                Limitless private aviation possibilities with
                premium service standards
              </p>
              <a
                href="/experience"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Learn More
              </a>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Check className="h-4 w-4 mr-2" />
                100% Satisfaction
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
                <img 
                  src="/Up-app-logo.png" 
                  alt="JETUP" 
                  className="h-8 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Aircrafts</h3>
              <p className="text-gray-600 mb-6">
                Explore our premium fleet of verified aircraft operated by certified professionals
              </p>
              <Link
                to="/experience"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Learn More
              </Link>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Plane className="h-4 w-4 mr-2" />
                1000+ Verified Aircraft
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
                <img 
                  src="/Up-app-logo.png" 
                  alt="JETUP" 
                  className="h-8 w-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Approved Operators</h3>
              <p className="text-gray-600 mb-6">
                Connect with our network of certified and approved flight operators
              </p>
              <a
                href="/experience"
                className="inline-flex items-center justify-center w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Learn More
              </a>
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                500+ Approved Operators
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="compare-membership-plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare Membership Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect plan that matches your travel frequency and needs
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-base font-medium text-gray-900"></th>
                    <th className="px-6 py-4 text-center text-base font-medium text-gray-900">Standard</th>
                    <th className="px-6 py-4 text-center text-base font-medium text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-base font-medium text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Membership Program</td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">30 days free!</td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">$950 per year</td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">$1,450 per year</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Booking Access</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <span className="text-base text-gray-900">10 Booking access</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="h-6 w-6 text-green-500" />
                        <span className="text-base text-gray-900">Unlimited</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="h-6 w-6 text-green-500" />
                        <span className="text-base text-gray-900">Unlimited</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Booking Management</td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Discounted Booking<sup>1</sup></td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">0%</td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">5%</td>
                    <td className="px-6 py-4 text-center text-base text-gray-900">10%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Cancellations<sup>2</sup></td>
                    <td className="px-6 py-4 text-center"><X className="h-6 w-6 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Bonus Flight Hours<sup>3</sup></td>
                    <td className="px-6 py-4 text-center"><X className="h-6 w-6 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-6 w-6 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Verified Fleet Access</td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">Airport Transfer</td>
                    <td className="px-6 py-4 text-center"><X className="h-6 w-6 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-6 w-6 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-base text-gray-900">24/7 Expert Support</td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-6 w-6 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose JETUP Membership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the benefits that set us apart in private aviation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#0B1733'}}>
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Ready to Join JETUP?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied members who trust JETUP for their private flight needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              GET STARTED
            </motion.button>
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



export default MembershipPage
