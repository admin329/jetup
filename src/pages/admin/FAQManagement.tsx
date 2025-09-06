import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, MessageCircle, X, Save, AlertCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Membership' | 'Booking' | 'Payment';
  createdAt: string;
  updatedAt: string;
}

const FAQManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [faqData, setFaqData] = useState({
    question: '',
    answer: '',
    category: 'Membership' as 'Membership' | 'Booking' | 'Payment'
  });

  // Mock FAQ data - replace with real API data
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: "How far in advance should I book a private jet?",
      answer: "We recommend booking at least 4-6 hours in advance for domestic flights and 12-24 hours for international flights. However, we can often accommodate last-minute requests.",
      category: "Booking",
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      question: "What's included in the charter price?",
      answer: "Our charter prices include the aircraft, crew, fuel, and standard catering. Additional services like ground transportation, special catering, or overnight crew expenses may incur extra charges.",
      category: "Payment",
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '3',
      question: "What are the different membership plans?",
      answer: "We offer Standard (free 30 days), Basic ($950/year), and Premium ($1,450/year) plans. Each plan offers different benefits including booking discounts and priority support.",
      category: "Membership",
      createdAt: '2024-01-17T09:15:00Z',
      updatedAt: '2024-01-17T09:15:00Z'
    },
    {
      id: '4',
      question: "Can I change or cancel my booking?",
      answer: "Yes, changes and cancellations are possible depending on your membership level and timing. Premium members enjoy more flexible cancellation policies.",
      category: "Booking",
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    },
    {
      id: '5',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and bank transfers. All payments are processed securely through encrypted channels.",
      category: "Payment",
      createdAt: '2024-01-19T11:30:00Z',
      updatedAt: '2024-01-19T11:30:00Z'
    }
  ]);

  const categories = ['Membership', 'Booking', 'Payment'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFaqData({
      ...faqData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!faqData.question.trim() || !faqData.answer.trim()) {
        alert('Please fill in both question and answer fields');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingFAQ) {
        // Update existing FAQ
        setFaqs(prev => 
          prev.map(faq => 
            faq.id === editingFAQ.id 
              ? {
                  ...faq,
                  question: faqData.question.trim(),
                  answer: faqData.answer.trim(),
                  category: faqData.category,
                  updatedAt: new Date().toISOString()
                }
              : faq
          )
        );
        setShowEditModal(false);
        setEditingFAQ(null);
        alert('FAQ updated successfully!');
      } else {
        // Add new FAQ
        const newFAQ: FAQ = {
          id: Date.now().toString(),
          question: faqData.question.trim(),
          answer: faqData.answer.trim(),
          category: faqData.category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setFaqs(prev => [newFAQ, ...prev]);
        setShowAddModal(false);
        alert('FAQ added successfully!');
      }

      // Reset form
      setFaqData({
        question: '',
        answer: '',
        category: 'Membership'
      });

    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setShowEditModal(true);
  };

  const handleDelete = (faqId: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== faqId));
      alert('FAQ deleted successfully!');
    }
  };

  const handleCancel = () => {
    setFaqData({
      question: '',
      answer: '',
      category: 'Membership'
    });
    setEditingFAQ(null);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Membership':
        return 'bg-purple-100 text-purple-800';
      case 'Booking':
        return 'bg-blue-100 text-blue-800';
      case 'Payment':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const stats = {
    total: faqs.length,
    membership: faqs.filter(f => f.category === 'Membership').length,
    booking: faqs.filter(f => f.category === 'Booking').length,
    payment: faqs.filter(f => f.category === 'Payment').length
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
          <button
            onClick={() => {
              setEditingFAQ(null);
              setFaqData({
                question: '',
                answer: '',
                category: 'Membership'
              });
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add FAQ
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total FAQs</p>
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
              <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Membership</p>
                <p className="text-xl font-bold text-gray-900">{stats.membership}</p>
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
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Booking</p>
                <p className="text-xl font-bold text-gray-900">{stats.booking}</p>
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
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="text-xl font-bold text-gray-900">{stats.payment}</p>
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
              placeholder="Search FAQs..."
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

        {/* FAQ List */}
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
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
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
                {filteredFAQs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {faq.question}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {faq.answer.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(faq.category)}`}>
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(faq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(faq.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
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

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No FAQs found</p>
          </div>
        )}
      </div>

      {/* Add/Edit FAQ Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={faqData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={faqData.question}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the frequently asked question"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="answer"
                    value={faqData.answer}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Enter the detailed answer to this question"
                  />
                </div>

                {/* Preview */}
                {faqData.question && faqData.answer && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Preview:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(faqData.category)}`}>
                          {faqData.category}
                        </span>
                      </div>
                      <h5 className="font-medium text-gray-900">{faqData.question}</h5>
                      <p className="text-sm text-gray-600">{faqData.answer}</p>
                    </div>
                  </div>
                )}

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
                    {isSubmitting ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Add FAQ')}
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

export default FAQManagement;