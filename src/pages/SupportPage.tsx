import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';

const SupportPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How far in advance should I book a private jet?",
      answer: "We recommend booking at least 4-6 hours in advance for domestic flights and 12-24 hours for international flights. However, we can often accommodate last-minute requests."
    },
    {
      question: "What's included in the charter price?",
      answer: "Our charter prices include the aircraft, crew, fuel, and standard catering. Additional services like ground transportation, special catering, or overnight crew expenses may incur extra charges."
    },
    {
      question: "Can I change or cancel my booking?",
      answer: "Yes, changes and cancellations are possible depending on your membership level and timing. Premium members enjoy more flexible cancellation policies."
    },
    {
      question: "What airports can you fly to?",
      answer: "We can access over 5,000 airports worldwide, including smaller regional airports that commercial airlines don't serve."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Full Name: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Message:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:support@jetup.aero?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="JETUP Support Center | 24/7 Aviation Expert Help"
        description="24/7 support for all your private aviation needs. Expert assistance, FAQ, and customer service for JETUP members and operators."
        keywords="aviation support, private jet help, customer service, aviation experts, flight assistance, booking help"
        url="/support"
        image="/JETUP-Photo-07.jpg"
      />
      
      <Header />
      
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
              Support Center
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              We're here to help you with all your private jet booking needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-
