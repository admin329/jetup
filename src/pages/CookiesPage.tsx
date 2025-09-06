import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Settings, Eye, BarChart3 } from 'lucide-react';
import Header from '../components/Header';

const CookiesPage: React.FC = () => {
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
              Cookies Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              How JETUP uses cookies to enhance your browsing experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cookies Content */}
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
                <Cookie className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Cookies Policy</h2>
                <p className="text-gray-600 mt-2">Last updated: January 2025</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">What Are Cookies?</h3>
                    <p className="text-blue-800 leading-relaxed">
                      Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and improving our services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-6 w-6 text-blue-600 mr-3" />
                    Types of Cookies We Use
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        Essential Cookies
                      </h4>
                      <p className="text-gray-700 text-sm mb-3">
                        These cookies are necessary for the website to function properly and cannot be disabled.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• User authentication and login sessions</li>
                        <li>• Security and fraud prevention</li>
                        <li>• Website functionality and navigation</li>
                        <li>• Form data preservation</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                        Analytics Cookies
                      </h4>
                      <p className="text-gray-700 text-sm mb-3">
                        These cookies help us understand how visitors interact with our website.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Website traffic analysis</li>
                        <li>• User behavior tracking</li>
                        <li>• Performance monitoring</li>
                        <li>• Feature usage statistics</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Settings className="h-5 w-5 text-purple-600 mr-2" />
                        Functional Cookies
                      </h4>
                      <p className="text-gray-700 text-sm mb-3">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Language preferences</li>
                        <li>• User interface customization</li>
                        <li>• Booking form data retention</li>
                        <li>• Search preferences</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Eye className="h-5 w-5 text-orange-600 mr-2" />
                        Marketing Cookies
                      </h4>
                      <p className="text-gray-700 text-sm mb-3">
                        These cookies are used to deliver relevant advertisements and track campaign effectiveness.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Targeted advertising</li>
                        <li>• Social media integration</li>
                        <li>• Campaign tracking</li>
                        <li>• Remarketing activities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      JETUP uses cookies to enhance your experience on our private flight booking platform:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Authentication:</strong> To keep you logged in securely across sessions</li>
                      <li><strong>Preferences:</strong> To remember your booking preferences and settings</li>
                      <li><strong>Performance:</strong> To analyze website performance and optimize user experience</li>
                      <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
                      <li><strong>Communication:</strong> To provide relevant information about our services</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We may use third-party services that set their own cookies:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Analytics Services</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Google Analytics</li>
                            <li>• Website performance monitoring</li>
                            <li>• User behavior analysis</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Instagram integration</li>
                            <li>• YouTube video embedding</li>
                            <li>• Social sharing features</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      You have control over how cookies are used on your device:
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Browser Settings</h4>
                      <p className="text-blue-800 mb-3">
                        Most web browsers allow you to control cookies through their settings:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Block all cookies</li>
                        <li>• Block third-party cookies only</li>
                        <li>• Delete cookies when you close your browser</li>
                        <li>• Get notifications when cookies are set</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                          <p className="text-amber-700">
                            Disabling certain cookies may affect the functionality of our booking platform. Essential cookies are required for basic website operations and cannot be disabled.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Cookie Retention</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Session Cookies</h4>
                        <p className="text-gray-600 text-sm">
                          Temporary cookies that are deleted when you close your browser. Used for essential website functionality.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Persistent Cookies</h4>
                        <p className="text-gray-600 text-sm">
                          Stored on your device for a specific period (typically 1-2 years) to remember your preferences across visits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      If you have any questions about our use of cookies, please contact us:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                        <p className="text-blue-600">support@jetup.aero</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                        <p className="text-blue-600">+1 888 565 6090</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                        <p className="text-gray-700">
                          27 Old Gloucester Street<br />
                          London, United Kingdom<br />
                          WC1N 3AX
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Company</h4>
                        <p className="text-gray-700">
                          JETUP LTD (UK)<br />
                          Company ID: 16643231
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Your Privacy Matters</h4>
                      <p className="text-green-700">
                        We are committed to protecting your privacy and being transparent about our data practices. 
                        This cookies policy is part of our comprehensive privacy framework designed to give you 
                        control over your personal information.
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
              <a href="/legal/cookies" className="text-white hover:text-red-500 transition-colors underline">
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

export default CookiesPage;