import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle, X, ArrowUpRight, ArrowDownLeft, Plus, User, Building, Save, Trash2 } from 'lucide-react';
import { useInvoices } from '../../contexts/InvoiceContext';
import { generateInvoicePDF } from '../../types/invoice';
import { useAuth } from '../../contexts/AuthContext';

const InvoiceManagement: React.FC = () => {
  const { getAllInvoices, getIncomingInvoices, getOutgoingInvoices, addInvoice } = useInvoices();
  const { operatorInvoices, updateOperatorInvoiceStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  
  // Mock users data for recipient selection
  const mockUsers = [
    { id: '1', name: 'John Smith', email: 'customer@jetup.aero', type: 'customer', customerId: 'CID00001' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@company.com', type: 'customer', customerId: 'CID00002' },
    { id: '3', name: 'Premium Aviation Ltd.', email: 'operator@jetup.aero', type: 'operator', operatorId: 'OID00001' },
    { id: '4', name: 'Elite Jets Inc.', email: 'info@elitejets.com', type: 'operator', operatorId: 'OID00002' }
  ];
  
  const [invoiceData, setInvoiceData] = useState({
    type: 'booking' as 'membership' | 'booking' | 'commission',
    description: '',
    dueDate: '',
    paymentMethod: '',
    notes: '',
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: '',
        totalPrice: ''
      }
    ]
  });

  // Combine regular invoices with operator invoices
  const regularInvoices = getAllInvoices();
  const convertedOperatorInvoices = operatorInvoices.map(opInv => ({
    id: opInv.id,
    invoiceNumber: opInv.invoiceNumber,
    type: 'operator_invoice' as const,
    direction: 'incoming' as const,
    amount: opInv.amount,
    currency: opInv.currency,
    status: opInv.status,
    issueDate: opInv.createdAt,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: opInv.productDescription,
    operatorName: opInv.operatorName,
    operatorEmail: opInv.operatorEmail,
    items: [
      {
        id: '1',
        description: opInv.productDescription,
        quantity: 1,
        unitPrice: opInv.amount,
        totalPrice: opInv.amount
      }
    ],
    totalAmount: opInv.amount,
    paymentMethod: opInv.paymentMethod,
    notes: opInv.notes,
    bookingId: opInv.bookingId,
    attachedFile: opInv.attachedFile
  }));
  
  const allInvoices = [...regularInvoices, ...convertedOperatorInvoices];
  const incomingInvoices = getIncomingInvoices();
  const outgoingInvoices = getOutgoingInvoices();

  const filteredRecipients = mockUsers.filter(user => 
    user.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    (user.customerId && user.customerId.toLowerCase().includes(recipientSearch.toLowerCase())) ||
    (user.operatorId && user.operatorId.toLowerCase().includes(recipientSearch.toLowerCase()))
  );

  const filteredInvoices = allInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.operatorName && invoice.operatorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    const matchesDirection = directionFilter === '' || invoice.direction === directionFilter;
    const matchesType = typeFilter === '' || invoice.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesDirection && matchesType;
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

  const getDirectionIcon = (direction: string) => {
    return direction === 'incoming' ? ArrowDownLeft : ArrowUpRight;
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'incoming' 
      ? 'text-green-600 bg-green-50' 
      : 'text-blue-600 bg-blue-50';
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.status);
    setShowDetailModal(true);
  };

  const handleDownloadPDF = (invoice: any) => {
    generateInvoicePDF(invoice);
  };

  const handleDownloadOperatorPDF = (invoice: any) => {
    // For operator invoices, simulate PDF download
    if (invoice.attachedFile) {
      // In a real application, this would download the actual PDF file
      // For demo purposes, we'll show an alert
      alert(`Downloading operator PDF: ${invoice.attachedFile}\n\nIn a real application, this would download the PDF file that the operator uploaded.`);
      
      // You could also open a new window with PDF content or trigger actual download
      // window.open(`/api/invoices/${invoice.id}/download`, '_blank');
    } else {
      alert('No PDF attachment found for this invoice.');
    }
  };

  const handleRecipientSelect = (recipient: any) => {
    setSelectedRecipient(recipient);
    setRecipientSearch(`${recipient.name} (${recipient.email})`);
    setShowRecipientDropdown(false);
  };

  const handleInvoiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = invoiceData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate total price when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? parseInt(value) || 0 : item.quantity;
          const unitPrice = field === 'unitPrice' ? parseFloat(value.replace(/[$,]/g, '')) || 0 : parseFloat(item.unitPrice.replace(/[$,]/g, '')) || 0;
          updatedItem.totalPrice = `$${(quantity * unitPrice).toLocaleString()}`;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setInvoiceData({
      ...invoiceData,
      items: updatedItems
    });
  };

  const addInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: Date.now().toString(),
          description: '',
          quantity: 1,
          unitPrice: '',
          totalPrice: ''
        }
      ]
    });
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter((_, i) => i !== index)
      });
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice.replace(/[$,]/g, '')) || 0);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.20; // 20% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleCreateInvoice = async () => {
    if (!selectedRecipient) {
      alert('Please select a recipient');
      return;
    }
    
    if (!invoiceData.description.trim()) {
      alert('Please enter invoice description');
      return;
    }
    
    if (!invoiceData.dueDate) {
      alert('Please select due date');
      return;
    }
    
    // Validate items
    const hasValidItems = invoiceData.items.some(item => 
      item.description.trim() && item.unitPrice.trim()
    );
    
    if (!hasValidItems) {
      alert('Please add at least one valid item with description and price');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const subtotal = calculateSubtotal();
      const tax = calculateTax(subtotal);
      const total = calculateTotal();
      
      const newInvoice = {
        type: invoiceData.type,
        direction: 'outgoing' as const,
        amount: `$${subtotal.toLocaleString()}`,
        currency: 'USD',
        status: 'pending' as const,
        issueDate: new Date().toISOString(),
        dueDate: new Date(invoiceData.dueDate).toISOString(),
        description: invoiceData.description,
        customerName: selectedRecipient.type === 'customer' ? selectedRecipient.name : undefined,
        customerEmail: selectedRecipient.type === 'customer' ? selectedRecipient.email : undefined,
        operatorName: selectedRecipient.type === 'operator' ? selectedRecipient.name : undefined,
        operatorEmail: selectedRecipient.type === 'operator' ? selectedRecipient.email : undefined,
        items: invoiceData.items.filter(item => item.description.trim() && item.unitPrice.trim()),
        taxAmount: `$${tax.toLocaleString()}`,
        totalAmount: `$${total.toLocaleString()}`,
        paymentMethod: invoiceData.paymentMethod || undefined,
        notes: invoiceData.notes || undefined
      };
      
      // Add to invoice system
      addInvoice(newInvoice);
      
      // Reset form
      setInvoiceData({
        type: 'booking',
        description: '',
        dueDate: '',
        paymentMethod: '',
        notes: '',
        items: [
          {
            id: '1',
            description: '',
            quantity: 1,
            unitPrice: '',
            totalPrice: ''
          }
        ]
      });
      setSelectedRecipient(null);
      setRecipientSearch('');
      setShowCreateModal(false);
      
      alert(`Invoice created successfully and sent to ${selectedRecipient.name}!`);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Calculate stats
  const stats = {
    total: allInvoices.length,
    incoming: incomingInvoices.length,
    outgoing: outgoingInvoices.length,
    paid: allInvoices.filter(i => i.status === 'paid').length,
    pending: allInvoices.filter(i => i.status === 'pending').length,
    totalRevenue: incomingInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.totalAmount.replace(/[$,]/g, '')), 0),
    totalExpenses: outgoingInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + parseFloat(i.totalAmount.replace(/[$,]/g, '')), 0)
  };

  const handleStatusUpdate = async () => {
    if (!selectedInvoice || !newStatus) return;
    
    setIsUpdatingStatus(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update operator invoice status if it's an operator invoice
      if (selectedInvoice.operatorId) {
        updateOperatorInvoiceStatus(selectedInvoice.id, newStatus);
        
        // Update the selected invoice for immediate UI feedback
        setSelectedInvoice({
          ...selectedInvoice,
          status: newStatus
        });
        
        alert(`Invoice status updated to: ${newStatus}`);
      } else {
        // Handle system invoices (if needed in future)
        console.log(`Updating system invoice ${selectedInvoice.invoiceNumber} status to: ${newStatus}`);
        alert(`Invoice status updated to: ${newStatus}`);
      }
      
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Total: {stats.total} | Incoming: {stats.incoming} | Outgoing: {stats.outgoing}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
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
                <p className="text-sm font-medium text-gray-500">Total</p>
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
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Incoming</p>
                <p className="text-xl font-bold text-gray-900">{stats.incoming}</p>
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
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Outgoing</p>
                <p className="text-xl font-bold text-gray-900">{stats.outgoing}</p>
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-lg font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Expenses</p>
                <p className="text-lg font-bold text-gray-900">${stats.totalExpenses.toLocaleString()}</p>
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
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Directions</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Types</option>
            <option value="membership">Membership</option>
            <option value="booking">Booking</option>
            <option value="commission">Commission</option>
          </select>
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
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer/Operator
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="relative px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const StatusIcon = getStatusIcon(invoice.status);
                  const DirectionIcon = getDirectionIcon(invoice.direction);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-xs font-medium text-gray-900">{invoice.invoiceNumber}</div>
                            <div className="text-xs text-gray-500 capitalize">{invoice.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-xs text-gray-900 max-w-[120px] truncate">
                          {invoice.customerName || invoice.operatorName || 'N/A'}
                        </div>
                        {(invoice.customerEmail || invoice.operatorEmail) && (
                          <div className="text-xs text-gray-500 max-w-[120px] truncate">
                            {invoice.customerEmail || invoice.operatorEmail}
                          </div>
                        )}
                        {invoice.bookingId && (
                          <div className="text-xs text-blue-600 font-medium">
                            {invoice.bookingId}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-xs text-gray-900 max-w-[150px] truncate">{invoice.description}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getDirectionColor(invoice.direction)}`}>
                          <DirectionIcon className="h-3 w-3 mr-1" />
                          {invoice.direction === 'incoming' ? 'In' : 'Out'}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{invoice.totalAmount}</div>
                        <div className="text-xs text-gray-500">{invoice.currency}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {invoice.status === 'paid' ? 'Paid' : invoice.status === 'pending' ? 'Pending' : invoice.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                          {/* PDF Download for Operator Invoices */}
                          {(invoice.type === 'operator_invoice' || invoice.attachedFile) && (
                            <button
                              onClick={() => handleDownloadOperatorPDF(invoice)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Download Operator PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
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
                        <span className="text-gray-600">Direction:</span>
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getDirectionColor(selectedInvoice.direction)}`}>
                          {React.createElement(getDirectionIcon(selectedInvoice.direction), { className: "h-3 w-3 mr-1" })}
                          {selectedInvoice.direction.charAt(0).toUpperCase() + selectedInvoice.direction.slice(1)}
                        </div>
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

                  {/* Customer/Operator Information */}
                  {(selectedInvoice.customerName || selectedInvoice.operatorName) && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        {selectedInvoice.customerName ? 'Customer' : 'Operator'} Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">
                            {selectedInvoice.customerName || selectedInvoice.operatorName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">
                            {selectedInvoice.customerEmail || selectedInvoice.operatorEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

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

                  {/* Status Update Section - Only for operator invoices */}
                  {selectedInvoice.operatorId && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Update Invoice Status</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invoice Status
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={handleStatusUpdate}
                          disabled={isUpdatingStatus || newStatus === selectedInvoice.status}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isUpdatingStatus ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Updating Status...
                            </>
                          ) : (
                            'Update Invoice Status'
                          )}
                        </button>
                        
                        {newStatus !== selectedInvoice.status && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-blue-800 text-sm">
                              Status will change from <strong>{selectedInvoice.status}</strong> to <strong>{newStatus}</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PDF Attachment for Operator Invoices */}
                  {(selectedInvoice.type === 'operator_invoice' || selectedInvoice.attachedFile) && (
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Attached Document</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-purple-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedInvoice.attachedFile}</p>
                            <p className="text-sm text-gray-600">PDF Document uploaded by operator</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadOperatorPDF(selectedInvoice)}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Invoice</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedRecipient(null);
                    setRecipientSearch('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  {/* Recipient Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send To (Customer or Operator) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={recipientSearch}
                        onChange={(e) => {
                          setRecipientSearch(e.target.value);
                          setShowRecipientDropdown(true);
                        }}
                        onFocus={() => setShowRecipientDropdown(true)}
                        placeholder="Search by name, email, or ID..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      
                      {showRecipientDropdown && filteredRecipients.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredRecipients.map((recipient) => (
                            <button
                              key={recipient.id}
                              type="button"
                              onClick={() => handleRecipientSelect(recipient)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center">
                                {recipient.type === 'customer' ? (
                                  <User className="h-5 w-5 text-blue-600 mr-3" />
                                ) : (
                                  <Building className="h-5 w-5 text-purple-600 mr-3" />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{recipient.name}</p>
                                  <p className="text-sm text-gray-600">{recipient.email}</p>
                                  <p className="text-xs text-blue-600">
                                    {recipient.customerId || recipient.operatorId} • {recipient.type}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {selectedRecipient && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          {selectedRecipient.type === 'customer' ? (
                            <User className="h-5 w-5 text-blue-600 mr-2" />
                          ) : (
                            <Building className="h-5 w-5 text-purple-600 mr-2" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{selectedRecipient.name}</p>
                            <p className="text-sm text-gray-600">{selectedRecipient.email}</p>
                            <p className="text-xs text-blue-600">
                              {selectedRecipient.customerId || selectedRecipient.operatorId}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Invoice Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={invoiceData.type}
                      onChange={handleInvoiceInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="booking">Booking</option>
                      <option value="membership">Membership</option>
                      <option value="commission">Commission</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={invoiceData.description}
                      onChange={handleInvoiceInputChange}
                      placeholder="e.g., Premium Membership - Annual Subscription"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={invoiceData.dueDate}
                      onChange={handleInvoiceInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method (Optional)
                    </label>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={invoiceData.paymentMethod}
                      onChange={handleInvoiceInputChange}
                      placeholder="e.g., Credit Card, Bank Transfer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={invoiceData.notes}
                      onChange={handleInvoiceInputChange}
                      rows={3}
                      placeholder="Additional notes or terms..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                </div>

                {/* Right Column - Items */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Invoice Items</h4>
                      <button
                        type="button"
                        onClick={addInvoiceItem}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {invoiceData.items.map((item, index) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                            {invoiceData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                              placeholder="Item description"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            
                            <div className="grid grid-cols-3 gap-3">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder="Qty"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              <input
                                type="text"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                placeholder="Unit Price"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              <input
                                type="text"
                                value={item.totalPrice}
                                readOnly
                                placeholder="Total"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invoice Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">${calculateSubtotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">VAT (20%):</span>
                        <span className="font-medium text-gray-900">${calculateTax(calculateSubtotal()).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-3">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedRecipient(null);
                    setRecipientSearch('');
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvoice}
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating...' : 'Create & Send Invoice'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default InvoiceManagement;