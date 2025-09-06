import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Clock, Shield, CreditCard, Users, MapPin, AlertTriangle, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import Header from '../components/Header';

const CharterTermsPage: React.FC = () => {
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
              Charter Terms & Conditions
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Private jet charter rules and regulations for JETUP flight network
            </p>
          </motion.div>
        </div>
      </section>

      {/* Charter Terms Content */}
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
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Charter Terms & Conditions</h2>
                <p className="text-gray-600 mt-2">Private Jet Charter Rules - Effective January 2025</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Plane className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Charter Service Agreement</h3>
                    <p className="text-blue-800 leading-relaxed">
                      These Charter Terms govern all private jet charter services booked through the JETUP platform. 
                      By booking a charter flight, you agree to these terms and conditions in addition to our general Terms of Use.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                    Booking and Reservation Terms
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Clock className="h-5 w-5 text-green-600 mr-2" />
                        Advance Booking Requirements
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• <strong>Domestic Flights:</strong> Minimum 4 hours advance booking</li>
                        <li>• <strong>International Flights:</strong> Minimum 12 hours advance booking</li>
                        <li>• <strong>Peak Season:</strong> 24-48 hours recommended</li>
                        <li>• <strong>Last-Minute Requests:</strong> Subject to availability and surcharges</li>
                        <li>• <strong>Holiday Periods:</strong> Extended advance booking required</li>
                        <li>• <strong>Route Bookings:</strong> 1 hour operator approval deadline</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                        Booking Confirmation Process
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Booking request submitted to operators</li>
                        <li>• Operator quotes received within 24 hours</li>
                        <li>• Customer selects preferred offer</li>
                        <li>• Payment required for confirmation</li>
                        <li>• Final confirmation sent within 2 hours</li>
                        <li>• Flight details provided 24 hours before departure</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Users className="h-5 w-5 text-purple-600 mr-2" />
                        Passenger Requirements
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Valid government-issued photo ID required</li>
                        <li>• Passport required for international flights</li>
                        <li>• Visa requirements customer responsibility</li>
                        <li>• Children under 18 must be accompanied</li>
                        <li>• Special assistance needs must be declared</li>
                        <li>• Weight and baggage restrictions apply</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                        Departure Procedures
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• Arrive 30 minutes before scheduled departure</li>
                        <li>• Departure location coordinates provided 24h prior</li>
                        <li>• LTC (Local Time Coordination) determines departure</li>
                        <li>• Security screening may be required</li>
                        <li>• Weather delays beyond operator control</li>
                        <li>• Alternative arrangements for delays</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                    Pricing and Payment Terms
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-semibold text-green-800 mb-3">Pricing Structure</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-2">Included in Charter Price:</p>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Aircraft rental and crew</li>
                            <li>• Fuel and standard catering</li>
                            <li>• Basic ground handling</li>
                            <li>• Standard insurance coverage</li>
                            <li>• Flight planning and permits</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-2">Additional Charges May Apply:</p>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Premium catering and beverages</li>
                            <li>• Ground transportation</li>
                            <li>• Overnight crew expenses</li>
                            <li>• De-icing and hangar fees</li>
                            <li>• International permits and taxes</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-800 mb-3">Payment Terms</h4>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• <strong>Payment Due:</strong> Full payment required upon booking confirmation</li>
                        <li>• <strong>Accepted Methods:</strong> Credit cards (Visa, MasterCard, Amex), bank transfers</li>
                        <li>• <strong>Currency:</strong> All prices quoted in USD unless specified</li>
                        <li>• <strong>Membership Discounts:</strong> Basic 5%, Premium 10% (2 per operator, 20 total limit)</li>
                        <li>• <strong>Price Validity:</strong> Quotes valid for 24 hours unless extended</li>
                        <li>• <strong>Fuel Surcharges:</strong> May apply for significant fuel price increases</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <XCircle className="h-6 w-6 text-blue-600 mr-3" />
                    Cancellation and Refund Policy
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">Customer Cancellation Rights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h5 className="font-medium text-red-800 mb-2">Standard Membership</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• <strong>Rights:</strong> No cancellation rights</li>
                            <li>• <strong>Penalty:</strong> 100% forfeit</li>
                            <li>• <strong>Refund:</strong> No refund available</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h5 className="font-medium text-red-800 mb-2">Basic/Premium Membership</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• <strong>Rights:</strong> 10 cancellation rights</li>
                            <li>• <strong>Penalty:</strong> 25-50% based on timing</li>
                            <li>• <strong>Refund:</strong> 50-75% refund available</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h5 className="font-medium text-red-800 mb-2">Operator Cancellation</h5>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• <strong>Rights:</strong> 25 cancellation rights</li>
                            <li>• <strong>Penalty:</strong> Account restrictions after limit</li>
                            <li>• <strong>Customer:</strong> Full refund guaranteed</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-semibold text-yellow-800 mb-3">Cancellation Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">More than 72 hours before departure</span>
                          <span className="text-sm text-yellow-700">25% penalty, 75% refund</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">48-72 hours before departure</span>
                          <span className="text-sm text-yellow-700">35% penalty, 65% refund</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">24-48 hours before departure</span>
                          <span className="text-sm text-yellow-700">50% penalty, 50% refund</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">Less than 24 hours before departure</span>
                          <span className="text-sm text-yellow-700">100% penalty, no refund</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    Safety and Security Requirements
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Passenger Security</h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                          <li>• Government-issued photo ID mandatory</li>
                          <li>• Security screening at departure location</li>
                          <li>• Prohibited items list compliance</li>
                          <li>• Background checks for international flights</li>
                          <li>• TSA PreCheck/Global Entry accepted</li>
                          <li>• Special clearance for restricted areas</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-3">Aircraft Safety Standards</h4>
                        <ul className="text-sm text-green-800 space-y-2">
                          <li>• All aircraft meet FAA/EASA certification</li>
                          <li>• Regular maintenance and inspection records</li>
                          <li>• Certified professional flight crews</li>
                          <li>• Comprehensive insurance coverage</li>
                          <li>• Emergency equipment and procedures</li>
                          <li>• Weather monitoring and safety protocols</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="h-6 w-6 text-blue-600 mr-3" />
                    Passenger Responsibilities and Conduct
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-800 mb-3">Pre-Flight Requirements</h4>
                      <ul className="text-sm text-purple-700 space-y-2">
                        <li>• Arrive at departure location 30 minutes early</li>
                        <li>• Provide accurate passenger manifest information</li>
                        <li>• Declare any medical conditions or special needs</li>
                        <li>• Comply with baggage weight and size restrictions</li>
                        <li>• Present valid travel documents</li>
                        <li>• Follow crew instructions and safety briefings</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">Prohibited Conduct</h4>
                      <p className="text-red-700 mb-3">
                        The following behaviors are strictly prohibited and may result in flight termination:
                      </p>
                      <ul className="text-sm text-red-700 space-y-2">
                        <li>• Intoxication or substance abuse</li>
                        <li>• Disruptive or threatening behavior</li>
                        <li>• Smoking or vaping on aircraft</li>
                        <li>• Interference with flight operations</li>
                        <li>• Violation of aviation security regulations</li>
                        <li>• Damage to aircraft or equipment</li>
                        <li>• Non-compliance with crew instructions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Plane className="h-6 w-6 text-blue-600 mr-3" />
                    Baggage and Cargo Policies
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Light Jets</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>Cabin Bags:</strong> 2 per passenger</li>
                          <li>• <strong>Weight Limit:</strong> 15 lbs each</li>
                          <li>• <strong>Checked Baggage:</strong> 50 lbs per passenger</li>
                          <li>• <strong>Total Capacity:</strong> 50-80 cu ft</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Mid-Size Jets</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>Cabin Bags:</strong> 2 per passenger</li>
                          <li>• <strong>Weight Limit:</strong> 20 lbs each</li>
                          <li>• <strong>Checked Baggage:</strong> 75 lbs per passenger</li>
                          <li>• <strong>Total Capacity:</strong> 80-120 cu ft</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Heavy Jets</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>Cabin Bags:</strong> 3 per passenger</li>
                          <li>• <strong>Weight Limit:</strong> 25 lbs each</li>
                          <li>• <strong>Checked Baggage:</strong> 100 lbs per passenger</li>
                          <li>• <strong>Total Capacity:</strong> 150-220 cu ft</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h4 className="font-semibold text-amber-800 mb-3">Special Cargo and Restrictions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-amber-800 mb-2">Permitted Special Items:</p>
                          <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Golf clubs and sports equipment</li>
                            <li>• Musical instruments (with advance notice)</li>
                            <li>• Artwork and fragile items (properly packaged)</li>
                            <li>• Business equipment and samples</li>
                            <li>• Pet transportation (with health certificates)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 mb-2">Prohibited Items:</p>
                          <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Hazardous materials and chemicals</li>
                            <li>• Weapons and ammunition</li>
                            <li>• Flammable liquids and gases</li>
                            <li>• Illegal substances</li>
                            <li>• Items exceeding weight/size limits</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-6 w-6 text-blue-600 mr-3" />
                    Flight Operations and Weather Policy
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Weather and Safety Delays</h4>
                      <p className="text-blue-800 mb-3">
                        Flight safety is our top priority. Flights may be delayed or cancelled due to:
                      </p>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• Severe weather conditions (thunderstorms, fog, ice)</li>
                        <li>• Air traffic control restrictions</li>
                        <li>• Airport closures or operational issues</li>
                        <li>• Aircraft technical requirements</li>
                        <li>• Crew duty time limitations</li>
                        <li>• Security or emergency situations</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="font-semibold text-green-900 mb-3">Alternative Arrangements</h4>
                      <p className="text-green-800 mb-3">
                        In case of delays or cancellations beyond operator control:
                      </p>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li>• Alternative aircraft may be provided</li>
                        <li>• Rescheduling at no additional cost</li>
                        <li>• Ground transportation assistance</li>
                        <li>• Hotel accommodation if overnight delay</li>
                        <li>• Meal allowances for extended delays</li>
                        <li>• Full refund if no alternative available</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    Insurance and Liability Coverage
                  </h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                      <h4 className="font-semibold text-indigo-800 mb-3">Operator Insurance Requirements</h4>
                      <p className="text-indigo-700 mb-3">
                        All operators in our network maintain comprehensive insurance coverage:
                      </p>
                      <ul className="text-sm text-indigo-700 space-y-2">
                        <li>• <strong>Hull Insurance:</strong> Full aircraft value coverage</li>
                        <li>• <strong>Liability Insurance:</strong> Minimum $100 million per occurrence</li>
                        <li>• <strong>Passenger Liability:</strong> Coverage for injury and baggage loss</li>
                        <li>• <strong>War Risk Insurance:</strong> Coverage for conflict zones</li>
                        <li>• <strong>Ground Risk Insurance:</strong> Airport and ground operations</li>
                        <li>• <strong>Crew Insurance:</strong> Professional liability coverage</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="font-semibold text-purple-900 mb-3">Additional Protection Options</h4>
                      <ul className="text-sm text-purple-800 space-y-2">
                        <li>• <strong>Trip Protection Insurance:</strong> Available for purchase</li>
                        <li>• <strong>Medical Emergency Coverage:</strong> International medical assistance</li>
                        <li>• <strong>Baggage Protection:</strong> Enhanced coverage for valuable items</li>
                        <li>• <strong>Trip Interruption:</strong> Coverage for unexpected changes</li>
                        <li>• <strong>Cancel for Any Reason:</strong> Premium protection option</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">International Flight Requirements</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h4 className="font-semibold text-orange-800 mb-3">Documentation and Permits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-orange-800 mb-2">Required Documents:</p>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• Valid passport (6+ months validity)</li>
                            <li>• Appropriate visas and permits</li>
                            <li>• Health certificates if required</li>
                            <li>• Customs declaration forms</li>
                            <li>• Travel insurance documentation</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-800 mb-2">Additional Fees:</p>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• International departure taxes</li>
                            <li>• Customs and immigration fees</li>
                            <li>• Overflight and landing permits</li>
                            <li>• Handling charges at international airports</li>
                            <li>• Currency conversion fees</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution and Claims</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Claims Process</h4>
                      <p className="text-gray-700 mb-3">
                        For any issues or claims related to charter services:
                      </p>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li><strong>Immediate Issues:</strong> Contact operator directly during travel</li>
                        <li><strong>Post-Flight Claims:</strong> Submit written claim within 7 days</li>
                        <li><strong>JETUP Mediation:</strong> We facilitate resolution between parties</li>
                        <li><strong>Insurance Claims:</strong> Direct filing with operator's insurance</li>
                        <li><strong>Legal Action:</strong> 30-day notice required before litigation</li>
                        <li><strong>Arbitration:</strong> Binding arbitration for disputes over $10,000</li>
                      </ol>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Compensation Guidelines</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-2">Operator-Caused Issues:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Full refund for operator cancellations</li>
                            <li>• Alternative aircraft at no extra cost</li>
                            <li>• Accommodation for overnight delays</li>
                            <li>• Meal and transportation allowances</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-2">Force Majeure Events:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Rescheduling without penalty</li>
                            <li>• Credit for future flights</li>
                            <li>• Partial refund based on circumstances</li>
                            <li>• Travel insurance claim assistance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Information for Charter Issues</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 mb-4">
                      For charter-specific questions, issues, or emergency assistance:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">24/7 Charter Support</h4>
                        <p className="text-blue-600 mb-1">support@jetup.aero</p>
                        <p className="text-blue-600">+1 888 565 6090</p>
                        <p className="text-sm text-gray-600">Available 24/7 for charter emergencies</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Charter Operations</h4>
                        <p className="text-gray-700">
                          JETUP LTD (UK)<br />
                          Charter Operations Department<br />
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
                      <h4 className="font-semibold text-green-800 mb-2">Charter Agreement Acceptance</h4>
                      <p className="text-green-700">
                        By booking a charter flight through JETUP, you acknowledge that you have read, understood, and agree to these Charter Terms & Conditions. 
                        These terms supplement our general Terms of Use and form part of your charter agreement.
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

export default CharterTermsPage;