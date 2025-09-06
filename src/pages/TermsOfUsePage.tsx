import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Shield, Users, CreditCard, Plane, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';

const TermsOfUsePage: React.FC = () => {
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
              Terms of Use
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Terms and conditions for using JETUP Private Flight Network
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
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
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Terms of Use</h2>
                <p className="text-gray-600 mt-2">Last updated: January 2025</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Acceptance Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Acceptance of Terms</h3>
                    <p className="text-blue-800 leading-relaxed">
                      By accessing and using the JETUP Private Flight Network platform, you acknowledge that you have read, 
                      understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, 
                      please do not use our services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    Platform Description and Services
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4 text-gray-700">
                      <p>
                        <strong>JETUP Private Flight Network</strong> is a digital booking platform that connects customers 
                        seeking private aviation services with verified flight operators. Our services include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Flight booking request facilitation</li>
                        <li>Operator and customer communication platform</li>
                        <li>Membership management system</li>
                        <li>Payment processing coordination</li>
                        <li>Aircraft and route information display</li>
                        <li>Customer support and assistance</li>
                      </ul>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                        <p className="text-amber-800 text-sm">
                          <strong>Important:</strong> JETUP is not a direct charter flight operator and does not own or operate aircraft. 
                          All flight services are provided by independent, certified operators.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    User Accounts and Registration
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Customer Accounts</h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                          <li>• Must provide accurate personal information</li>
                          <li>• Required to upload government-issued ID</li>
                          <li>• Profile must be approved by admin team</li>
                          <li>• Responsible for account security</li>
                          <li>• Must comply with membership terms</li>
                          <li>• Limited to 10 cancellation rights</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3">Operator Accounts</h4>
                        <ul className="text-sm text-green-800 space-y-2">
                          <li>• Must provide valid AOC license</li>
                          <li>• Required to maintain insurance coverage</li>
                          <li>• Subject to admin verification process</li>
                          <li>• Must pay membership fees</li>
                          <li>• Limited to 25 cancellation rights</li>
                          <li>• Responsible for aircraft information accuracy</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Plane className="h-6 w-6 text-blue-600 mr-3" />
                    Booking Terms and Conditions
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-semibold text-yellow-800 mb-3">Booking Process</h4>
                      <ul className="text-sm text-yellow-700 space-y-2">
                        <li>• All bookings are subject to operator approval and aircraft availability</li>
                        <li>• Minimum 4-hour advance booking required for domestic flights</li>
                        <li>• Minimum 12-hour advance booking required for international flights</li>
                        <li>• Departure location coordinates provided 24 hours before flight</li>
                        <li>• Passengers must arrive 30 minutes before scheduled departure</li>
                        <li>• Valid travel documents required for all passengers</li>
                        <li>• Special requests subject to operator capabilities</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">Cancellation Policy</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-red-800 mb-2">Customer Cancellations:</p>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• Standard: No cancellation rights</li>
                            <li>• Basic/Premium: 10 cancellation rights</li>
                            <li>• Cancellation penalties may apply</li>
                            <li>• Refund amounts vary by timing</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800 mb-2">Operator Cancellations:</p>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 25 cancellation rights per operator</li>
                            <li>• Account restrictions after limit reached</li>
                            <li>• Must provide alternative solutions</li>
                            <li>• Full refund for operator cancellations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                    Payment Terms and Membership
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-900 mb-3">Customer Membership</h4>
                        <ul className="text-sm text-purple-800 space-y-2">
                          <li>• <strong>Standard:</strong> Free 30 days, 10 booking limit</li>
                          <li>• <strong>Basic:</strong> $950/year, 5% discount, unlimited bookings</li>
                          <li>• <strong>Premium:</strong> $1,450/year, 10% discount, unlimited bookings</li>
                          <li>• Membership fees are non-refundable</li>
                          <li>• Auto-renewal unless cancelled</li>
                          <li>• Discount usage: 2 per operator, 20 total limit</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-6">
                        <h4 className="font-semibold text-indigo-900 mb-3">Operator Membership</h4>
                        <ul className="text-sm text-indigo-800 space-y-2">
                          <li>• <strong>Monthly:</strong> $2,450/month, 0% commission</li>
                          <li>• <strong>Yearly:</strong> $14,700/year, 0% commission, 50% savings</li>
                          <li>• AOC license verification required</li>
                          <li>• Admin approval for all memberships</li>
                          <li>• Access to booking requests and fleet management</li>
                          <li>• Invoice submission capabilities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses and Conduct</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">Prohibited Activities</h4>
                      <p className="text-red-700 mb-3">
                        Users are prohibited from:
                      </p>
                      <ul className="text-sm text-red-700 space-y-2">
                        <li>• Providing false or misleading information</li>
                        <li>• Using the platform for illegal activities</li>
                        <li>• Attempting to circumvent security measures</li>
                        <li>• Interfering with platform operations</li>
                        <li>• Violating aviation regulations or laws</li>
                        <li>• Harassing other users or operators</li>
                        <li>• Reverse engineering or copying platform code</li>
                        <li>• Creating multiple accounts to circumvent limits</li>
                        <li>• Using automated systems without permission</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">JETUP Intellectual Property</h4>
                      <p className="text-blue-800 mb-3">
                        All content, features, and functionality of the JETUP platform are owned by JETUP LTD and protected by:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Copyright laws and international treaties</li>
                        <li>• Trademark protections for JETUP brand</li>
                        <li>• Trade secret protections for proprietary technology</li>
                        <li>• Database rights for compiled information</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">User-Generated Content</h4>
                      <p className="text-green-800 mb-3">
                        By submitting content to JETUP, you grant us:
                      </p>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Non-exclusive license to use, display, and distribute your content</li>
                        <li>• Right to modify content for platform compatibility</li>
                        <li>• Permission to use content for marketing purposes</li>
                        <li>• You retain ownership of your original content</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Availability and Modifications</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h4 className="font-semibold text-amber-800 mb-3">Service Availability</h4>
                      <p className="text-amber-700 mb-3">
                        JETUP strives to maintain continuous service availability, however:
                      </p>
                      <ul className="text-sm text-amber-700 space-y-2">
                        <li>• We do not guarantee uninterrupted access to the platform</li>
                        <li>• Scheduled maintenance may temporarily affect availability</li>
                        <li>• Technical issues may cause service disruptions</li>
                        <li>• We reserve the right to modify or discontinue features</li>
                        <li>• Emergency maintenance may occur without prior notice</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Data Handling</h4>
                      <p className="text-green-800 mb-3">
                        Your privacy is important to us. Our data practices include:
                      </p>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• Secure encryption of all personal data</li>
                        <li>• Compliance with GDPR and international privacy laws</li>
                        <li>• Limited data sharing only with flight operators for booking purposes</li>
                        <li>• Regular security audits and updates</li>
                        <li>• User control over marketing communications</li>
                        <li>• Right to data access, correction, and deletion</li>
                      </ul>
                      <p className="text-green-700 text-sm mt-3">
                        For complete details, please review our <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">JETUP Liability Limitations</h4>
                      <p className="text-red-700 mb-3">
                        JETUP's liability is limited to the maximum extent permitted by law. We are not liable for:
                      </p>
                      <ul className="text-sm text-red-700 space-y-2">
                        <li>• Flight delays, cancellations, or operational issues</li>
                        <li>• Operator service quality or performance</li>
                        <li>• Aircraft safety or maintenance issues</li>
                        <li>• Weather-related flight disruptions</li>
                        <li>• Third-party service provider failures</li>
                        <li>• Loss of data due to technical issues</li>
                        <li>• Indirect, incidental, or consequential damages</li>
                        <li>• Business losses or opportunity costs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution and Governing Law</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-purple-50 rounded-lg p-6">
                        <h4 className="font-semibold text-purple-900 mb-3">Dispute Resolution</h4>
                        <ul className="text-sm text-purple-800 space-y-2">
                          <li>• First contact customer support for resolution</li>
                          <li>• Mediation preferred for complex disputes</li>
                          <li>• Arbitration may be required for certain claims</li>
                          <li>• Class action lawsuits are prohibited</li>
                          <li>• 30-day notice required before legal action</li>
                        </ul>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-6">
                        <h4 className="font-semibold text-indigo-900 mb-3">Governing Law</h4>
                        <ul className="text-sm text-indigo-800 space-y-2">
                          <li>• Governed by laws of the United Kingdom</li>
                          <li>• UK courts have exclusive jurisdiction</li>
                          <li>• International aviation laws may apply</li>
                          <li>• Local regulations respected where applicable</li>
                          <li>• English language version controls</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Termination</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Termination Conditions</h4>
                      <p className="text-gray-700 mb-3">
                        JETUP reserves the right to terminate or suspend accounts for:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Violation of these Terms of Use</li>
                        <li>• Fraudulent or illegal activities</li>
                        <li>• Providing false information</li>
                        <li>• Exceeding cancellation limits</li>
                        <li>• Non-payment of membership fees</li>
                        <li>• Harassment of other users or staff</li>
                        <li>• Security breaches or unauthorized access attempts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Force Majeure</h3>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Unforeseeable Circumstances</h4>
                    <p className="text-blue-800 mb-3">
                      JETUP shall not be liable for delays or failures in performance due to:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Natural disasters, severe weather conditions</li>
                      <li>• Government actions, regulations, or restrictions</li>
                      <li>• War, terrorism, or civil unrest</li>
                      <li>• Pandemic or health emergencies</li>
                      <li>• Internet or telecommunications failures</li>
                      <li>• Other circumstances beyond our reasonable control</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      For questions about these Terms of Use or any legal matters, please contact us:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">General Support</h4>
                        <p className="text-blue-600 mb-1">support@jetup.aero</p>
                        <p className="text-blue-600">+1 888 565 6090</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                        <p className="text-gray-700">
                          JETUP LTD (UK)<br />
                          Legal Department<br />
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
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Agreement Acknowledgment</h4>
                      <p className="text-green-700">
                        By continuing to use JETUP services, you confirm that you have read, understood, and agree to these Terms of Use. 
                        These terms constitute a legally binding agreement between you and JETUP LTD (UK).
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
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

export default TermsOfUsePage;