import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useInvoices } from '../../contexts/InvoiceContext';
import { generateInvoicePDF } from '../../types/invoice';

const Invoices: React.FC = () => {
  const { user } = useAuth();
  const { getInvoicesByUser } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const userInvoices = getInvoicesByUser(user?.email || '', user?.role || '');

  const filteredInvoices = userInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return XCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleDownloadPDF = (invoice: any) => {
    generateInvoicePDF(invoice);
  };

  // Calculate stats
  const stats = {
    total: userInvoices.length,
    paid: userInvoices.filter(i => i.status === 'paid').length,
    pending: userInvoices.filter(i => i.status === 'pending').length,
    totalAmount: userInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.totalAmount.replace(/[$,]/g, '')), 0)
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
          <div className="text-sm text-gray-600">
            Total: {stats.total} | Paid: {stats.paid} | Pending: {stats.pending}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Invoices</p>
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
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Paid</p>
                <p className="text-xl font-bold text-gray-900">{stats.paid}</p>
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
              <div className="flex-shrink-0 p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
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
              <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                <p className="text-xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Invoices Table */}
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
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-500 capitalize">{invoice.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{invoice.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.totalAmount}</div>
                        <div className="text-sm text-gray-500">{invoice.currency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-green-600 hover:text-green-800"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No invoices found</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Invoice Details</h3>
                  <p className="text-blue-600 font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invoice Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Information</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="font-medium text-gray-900">{selectedInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{selectedInvoice.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedInvoice.paidDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid Date:</span>
                          <span className="font-medium text-green-600">
                            {new Date(selectedInvoice.paidDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                          {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedInvoice.paymentMethod && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium text-gray-900">{selectedInvoice.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium text-gray-900">{selectedInvoice.currency}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items and Totals */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h4>
                    
                    <div className="space-y-3">
                      {selectedInvoice.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-medium text-gray-900">{item.description}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × {item.unitPrice}</p>
                          </div>
                          <span className="font-medium text-gray-900">{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Total Calculation</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">{selectedInvoice.amount}</span>
                      </div>
                      {selectedInvoice.taxAmount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium text-gray-900">{selectedInvoice.taxAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-green-600">{selectedInvoice.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {selectedInvoice.notes && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-700">{selectedInvoice.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Invoices;