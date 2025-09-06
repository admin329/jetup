import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, FileText, Plane, Users, Building } from 'lucide-react';
import Header from '../components/Header';

const DisclaimerPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = React.useState(false);

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
              Disclaimer
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Important disclaimers and liability limitations for JETUP services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mr-6" style={{backgroundColor: '#0B1733'}}>
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Disclaimer</h2>
                <p className="text-gray-600 mt-2">JETUP Private Flight Network - Liability Disclaimers</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Important Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-3">Important Notice</h3>
                    <p className="text-red-800 leading-relaxed">
                      Please read this disclaimer carefully before using JETUP services. By accessing and using our platform, 
                      you acknowledge and agree to the terms and limitations outlined below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="h-6 w-6 text-blue-600 mr-3" />
                    Platform Role and Limitations
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4 text-gray-700">
                      <p>
                        <strong>JETUP acts solely as an intermediary platform</strong> that facilitates connections between customers 
                        and independent flight operators. We do not:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Own, operate, or control any aircraft</li>
                        <li>Provide direct charter flight services</li>
                        <li>Act as an air carrier, charter operator, or aviation service provider</li>
                        <li>Assume responsibility for flight operations, safety, or service quality</li>
                        <li>Guarantee aircraft availability, pricing, or flight schedules</li>
                        <li>Control or supervise flight operators' business practices</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Plane className="h-6 w-6 text-blue-600 mr-3" />
                    Flight Operations Disclaimer
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h4 className="font-semibold text-amber-800 mb-3">Independent Operator Responsibility</h4>
                      <p className="text-amber-700 mb-3">
                        All flight services are provided by independent, third-party operators who are solely responsible for:
                      </p>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Aircraft maintenance, safety, and airworthiness</li>
                        <li>• Flight crew certification, training, and competency</li>
                        <li>• Compliance with all applicable aviation regulations</li>
                        <li>• Insurance coverage and liability protection</li>
                        <li>• Flight execution, passenger safety, and service delivery</li>
                        <li>• Weather-related decisions and flight cancellations</li>
                        <li>• Ground services and airport operations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    Limitation of Liability
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">JETUP Liability Limitations</h4>
                      <p className="text-red-700 mb-3">
                        JETUP shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from:
                      </p>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Flight delays, cancellations, or schedule changes</li>
                        <li>• Aircraft mechanical issues or maintenance problems</li>
                        <li>• Weather-related flight disruptions</li>
                        <li>• Operator service quality or performance</li>
                        <li>• Lost, damaged, or delayed baggage</li>
                        <li>• Personal injury or property damage during flights</li>
                        <li>• Operator bankruptcy, business closure, or service discontinuation</li>
                        <li>• Third-party service provider failures</li>
                        <li>• Force majeure events beyond our control</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    User Responsibilities
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      By using JETUP services, users acknowledge and agree to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Customer Responsibilities</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Provide accurate personal and travel information</li>
                          <li>• Comply with aviation security requirements</li>
                          <li>• Arrive at departure locations on time</li>
                          <li>• Follow operator instructions and safety protocols</li>
                          <li>• Maintain valid travel documents</li>
                          <li>• Pay for services as agreed</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3">Operator Responsibilities</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Maintain valid operating certificates</li>
                          <li>• Ensure aircraft airworthiness</li>
                          <li>• Provide qualified flight crews</li>
                          <li>• Maintain adequate insurance coverage</li>
                          <li>• Comply with aviation regulations</li>
                          <li>• Deliver services as promised</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking and Payment Disclaimers</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-semibold text-yellow-800 mb-3">Booking Terms</h4>
                      <ul className="text-sm text-yellow-700 space-y-2">
                        <li>• All bookings are subject to operator approval and aircraft availability</li>
                        <li>• Prices are estimates and may vary based on final operator quotes</li>
                        <li>• Membership benefits are subject to terms and conditions</li>
                        <li>• Cancellation policies vary by operator and membership level</li>
                        <li>• Payment processing is handled by secure third-party providers</li>
                        <li>• Refunds are subject to operator policies and timing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Disclaimers</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Platform Availability</h4>
                      <p className="text-purple-800 mb-3">
                        While we strive to maintain continuous service, JETUP does not guarantee:
                      </p>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Uninterrupted platform availability</li>
                        <li>• Error-free operation of all features</li>
                        <li>• Compatibility with all devices and browsers</li>
                        <li>• Real-time accuracy of all displayed information</li>
                        <li>• Immediate response to technical issues</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Regulatory Compliance</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      JETUP operates in compliance with applicable laws and regulations, however:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <ul className="space-y-2">
                        <li>• Aviation regulations vary by jurisdiction and may change</li>
                        <li>• Operators are responsible for their own regulatory compliance</li>
                        <li>• International flights may be subject to additional restrictions</li>
                        <li>• Security requirements may affect booking and travel procedures</li>
                        <li>• JETUP cannot guarantee compliance with all local regulations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact and Dispute Resolution</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">For General Inquiries</h4>
                        <p className="text-blue-600 mb-1">support@jetup.aero</p>
                        <p className="text-blue-600">+1 888 565 6090</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Legal Address</h4>
                        <p className="text-gray-700">
                          JETUP LTD (UK)<br />
                          27 Old Gloucester Street<br />
                          London, United Kingdom<br />
                          WC1N 3AX
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Governing Law</h4>
                      <p className="text-blue-700">
                        This disclaimer and all JETUP services are governed by the laws of the United Kingdom. 
                        Any disputes shall be resolved in accordance with UK jurisdiction. For complete terms and conditions, 
                        please refer to our Terms of Use and Charter Terms.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Acknowledgment</h4>
                      <p className="text-amber-700">
                        By using JETUP services, you acknowledge that you have read, understood, and agree to this disclaimer. 
                        If you do not agree with any part of this disclaimer, please discontinue use of our services immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

export default DisclaimerPage;