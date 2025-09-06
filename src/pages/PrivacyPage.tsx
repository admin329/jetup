import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Phone } from 'lucide-react';
import Header from '../components/Header';

const PrivacyPage: React.FC = () => {
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
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              How JETUP protects and manages your personal information
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-gray-600 mt-2">Last updated: January 2025</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Our Commitment to Privacy</h3>
                    <p className="text-blue-800 leading-relaxed">
                      JETUP LTD (UK) is committed to protecting your privacy and personal information. This Privacy Policy 
                      explains how we collect, use, store, and protect your data when you use our private flight booking platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Database className="h-6 w-6 text-blue-600 mr-3" />
                    Information We Collect
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                        Personal Information
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Full name and contact details</li>
                        <li>• Email address and phone number</li>
                        <li>• Billing and shipping addresses</li>
                        <li>• Government-issued ID documents</li>
                        <li>• Payment and financial information</li>
                        <li>• Travel preferences and requirements</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Globe className="h-5 w-5 text-blue-600 mr-2" />
                        Technical Information
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• IP address and device information</li>
                        <li>• Browser type and version</li>
                        <li>• Operating system details</li>
                        <li>• Website usage and navigation data</li>
                        <li>• Cookies and tracking technologies</li>
                        <li>• Location data (with permission)</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Eye className="h-5 w-5 text-purple-600 mr-2" />
                        Booking Information
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Flight routes and destinations</li>
                        <li>• Travel dates and passenger counts</li>
                        <li>• Special requests and preferences</li>
                        <li>• Booking history and patterns</li>
                        <li>• Communication with operators</li>
                        <li>• Payment transaction records</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Lock className="h-5 w-5 text-red-600 mr-2" />
                        Operator Information
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Company registration details</li>
                        <li>• AOC license documentation</li>
                        <li>• Aircraft specifications and photos</li>
                        <li>• Financial and banking information</li>
                        <li>• Insurance and certification records</li>
                        <li>• Business performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We use your personal information for the following purposes:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Service Delivery</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Processing flight booking requests</li>
                          <li>• Facilitating communication with operators</li>
                          <li>• Managing membership subscriptions</li>
                          <li>• Processing payments and invoices</li>
                          <li>• Providing customer support</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3">Security & Compliance</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Identity verification for aviation security</li>
                          <li>• Fraud prevention and detection</li>
                          <li>• Regulatory compliance requirements</li>
                          <li>• Account security and authentication</li>
                          <li>• Risk assessment and management</li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-900 mb-3">Platform Improvement</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Website performance optimization</li>
                          <li>• User experience enhancement</li>
                          <li>• Feature development and testing</li>
                          <li>• Analytics and usage statistics</li>
                          <li>• Personalization of services</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-6">
                        <h4 className="font-semibold text-orange-900 mb-3">Communication</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Booking confirmations and updates</li>
                          <li>• Marketing and promotional materials</li>
                          <li>• Service announcements</li>
                          <li>• Newsletter subscriptions</li>
                          <li>• Customer satisfaction surveys</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h4 className="font-semibold text-amber-800 mb-3">When We Share Information</h4>
                      <p className="text-amber-700 mb-3">
                        We may share your information in the following circumstances:
                      </p>
                      <ul className="text-sm text-amber-700 space-y-2">
                        <li>• <strong>With Flight Operators:</strong> To process your booking requests and facilitate flight services</li>
                        <li>• <strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                        <li>• <strong>Payment Processors:</strong> Secure payment processing and fraud prevention</li>
                        <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">We Never Share</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Personal information for marketing purposes without consent</li>
                        <li>• Financial details with unauthorized parties</li>
                        <li>• ID documents except for aviation security compliance</li>
                        <li>• Private communications between users</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Security and Protection</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                          <Lock className="h-5 w-5 text-green-600 mr-2" />
                          Security Measures
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• SSL/TLS encryption for data transmission</li>
                          <li>• Secure data storage with encryption</li>
                          <li>• Regular security audits and updates</li>
                          <li>• Access controls and authentication</li>
                          <li>• 24/7 security monitoring</li>
                          <li>• GDPR compliance measures</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <Database className="h-5 w-5 text-blue-600 mr-2" />
                          Data Retention
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Account data: Retained while account is active</li>
                          <li>• Booking records: 7 years for legal compliance</li>
                          <li>• Payment data: As required by financial regulations</li>
                          <li>• ID documents: Securely stored for aviation security</li>
                          <li>• Analytics data: Anonymized after 2 years</li>
                          <li>• Marketing data: Until unsubscribe request</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Under applicable privacy laws (including GDPR), you have the following rights:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-900 mb-3">Access and Control</h4>
                        <ul className="text-sm text-purple-800 space-y-2">
                          <li>• <strong>Right to Access:</strong> Request copies of your personal data</li>
                          <li>• <strong>Right to Rectification:</strong> Correct inaccurate information</li>
                          <li>• <strong>Right to Erasure:</strong> Request deletion of your data</li>
                          <li>• <strong>Right to Portability:</strong> Transfer data to another service</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-6">
                        <h4 className="font-semibold text-indigo-900 mb-3">Processing Control</h4>
                        <ul className="text-sm text-indigo-800 space-y-2">
                          <li>• <strong>Right to Object:</strong> Object to certain data processing</li>
                          <li>• <strong>Right to Restrict:</strong> Limit how we process your data</li>
                          <li>• <strong>Right to Withdraw Consent:</strong> Revoke previously given consent</li>
                          <li>• <strong>Right to Complain:</strong> File complaints with supervisory authorities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Aviation Security Requirements</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">Mandatory Data Collection</h4>
                      <p className="text-red-700 mb-3">
                        Due to aviation security regulations, we are required to collect and verify certain information:
                      </p>
                      <ul className="text-sm text-red-700 space-y-2">
                        <li>• <strong>Identity Verification:</strong> Government-issued photo ID for all passengers</li>
                        <li>• <strong>Passenger Manifests:</strong> Complete passenger information for flight operators</li>
                        <li>• <strong>Security Screening:</strong> Background checks as required by aviation authorities</li>
                        <li>• <strong>Travel Documentation:</strong> Passport and visa information for international flights</li>
                        <li>• <strong>Regulatory Reporting:</strong> Sharing data with aviation authorities when required</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We work with trusted third-party service providers to deliver our services:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Payment Processing</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Secure payment gateways</li>
                          <li>• Credit card processing</li>
                          <li>• Fraud detection services</li>
                          <li>• Banking integrations</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Communication</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Email service providers</li>
                          <li>• SMS notification services</li>
                          <li>• Customer support platforms</li>
                          <li>• Marketing automation tools</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Analytics & Security</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Website analytics services</li>
                          <li>• Security monitoring tools</li>
                          <li>• Performance optimization</li>
                          <li>• Error tracking systems</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Global Operations</h4>
                      <p className="text-blue-800 mb-3">
                        As a global private flight network, we may transfer your data internationally:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• To flight operators in different countries for booking fulfillment</li>
                        <li>• To our service providers with adequate data protection measures</li>
                        <li>• For compliance with international aviation security requirements</li>
                        <li>• All transfers are protected by appropriate safeguards and contracts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Marketing and Communications</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Communication Preferences</h4>
                      <p className="text-green-800 mb-3">
                        You can control how we communicate with you:
                      </p>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• <strong>Essential Communications:</strong> Booking confirmations, security alerts (cannot opt-out)</li>
                        <li>• <strong>Marketing Emails:</strong> Promotional offers, newsletters (opt-out available)</li>
                        <li>• <strong>SMS Notifications:</strong> Flight updates, reminders (opt-out available)</li>
                        <li>• <strong>Push Notifications:</strong> Mobile app alerts (device settings control)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-800 mb-3">Age Restrictions</h4>
                    <p className="text-yellow-700">
                      JETUP services are intended for adults (18+ years). We do not knowingly collect personal information 
                      from children under 18. If you believe we have collected information from a child, please contact us 
                      immediately so we can delete such information.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                      We will notify you of significant changes through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Email notifications to registered users</li>
                      <li>Prominent notices on our website</li>
                      <li>In-app notifications for mobile users</li>
                      <li>Updates to the "Last updated" date at the top of this policy</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Mail className="h-5 w-5 text-blue-600 mr-2" />
                          Email
                        </h4>
                        <p className="text-blue-600">support@jetup.aero</p>
                        <p className="text-sm text-gray-600">For privacy-related inquiries</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Phone className="h-5 w-5 text-blue-600 mr-2" />
                          Phone
                        </h4>
                        <p className="text-blue-600">+1 888 565 6090</p>
                        <p className="text-sm text-gray-600">24/7 customer support</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-2">Postal Address</h4>
                        <p className="text-gray-700">
                          JETUP LTD (UK)<br />
                          Data Protection Officer<br />
                          27 Old Gloucester Street<br />
                          London, United Kingdom<br />
                          WC1N 3AX
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Your Trust Matters</h4>
                      <p className="text-green-700">
                        We are committed to maintaining the highest standards of data protection and privacy. 
                        Your trust is essential to our business, and we continuously work to earn and maintain it 
                        through transparent practices and robust security measures.
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

export default PrivacyPage;