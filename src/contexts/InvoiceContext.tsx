import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Invoice, generateInvoiceNumber } from '../types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  getInvoicesByUser: (userEmail: string, userRole: string) => Invoice[];
  getAllInvoices: () => Invoice[];
  getIncomingInvoices: () => Invoice[];
  getOutgoingInvoices: () => Invoice[];
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    // Sample customer membership invoice
    {
      id: '1',
      invoiceNumber: 'INV-240315-001',
      type: 'membership',
      direction: 'outgoing',
      amount: '$950.00',
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-03-15T10:00:00Z',
      dueDate: '2024-03-30T23:59:59Z',
      paidDate: '2024-03-15T10:05:00Z',
      description: 'Basic Membership - Annual Subscription',
      customerName: 'John Smith',
      customerEmail: 'customer@jetup.aero',
      items: [
        {
          id: '1',
          description: 'Basic Membership - Annual Plan',
          quantity: 1,
          unitPrice: '$950.00',
          totalPrice: '$950.00'
        }
      ],
      totalAmount: '$950.00',
      paymentMethod: 'Credit Card (**** 1234)',
      notes: 'Thank you for choosing JETUP Basic Membership!'
    },
    // Sample operator membership invoice
    {
      id: '2',
      invoiceNumber: 'INV-240320-002',
      type: 'membership',
      direction: 'outgoing',
      amount: '$14,700.00',
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-03-20T14:30:00Z',
      dueDate: '2024-04-04T23:59:59Z',
      paidDate: '2024-03-20T14:35:00Z',
      description: 'Yearly Operator Membership - 0% Commission',
      operatorName: 'Premium Aviation Ltd.',
      operatorEmail: 'operator@jetup.aero',
      items: [
        {
          id: '1',
          description: 'Yearly Operator Membership',
          quantity: 1,
          unitPrice: '$14,700.00',
          totalPrice: '$14,700.00'
        }
      ],
      totalAmount: '$14,700.00',
      paymentMethod: 'Bank Transfer',
      notes: 'Welcome to JETUP Operator Network! 0% commission rate activated.'
    },
    // Sample booking invoice (incoming for admin)
    {
      id: '3',
      invoiceNumber: 'INV-240325-003',
      type: 'booking',
      direction: 'incoming',
      amount: '$25,000.00',
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-03-25T09:15:00Z',
      dueDate: '2024-03-25T23:59:59Z',
      paidDate: '2024-03-25T09:20:00Z',
      description: 'Private Jet Booking - NYC to LAX',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@company.com',
      operatorName: 'Elite Jets Inc.',
      operatorEmail: 'contact@elitejets.com',
      items: [
        {
          id: '1',
          description: 'Private Jet Charter - Gulfstream G650',
          quantity: 1,
          unitPrice: '$25,000.00',
          totalPrice: '$25,000.00'
        }
      ],
      taxAmount: '$2,500.00',
      totalAmount: '$27,500.00',
      paymentMethod: 'Credit Card (**** 5678)',
      notes: 'Flight completed successfully. Thank you for choosing JETUP!'
    }
  ]);

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber()
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const getInvoicesByUser = (userEmail: string, userRole: string): Invoice[] => {
    return invoices.filter(invoice => {
      if (userRole === 'customer') {
        return invoice.customerEmail === userEmail;
      } else if (userRole === 'operator') {
        return invoice.operatorEmail === userEmail;
      }
      return false;
    });
  };

  const getAllInvoices = (): Invoice[] => {
    return invoices;
  };

  const getIncomingInvoices = (): Invoice[] => {
    return invoices.filter(invoice => invoice.direction === 'incoming');
  };

  const getOutgoingInvoices = (): Invoice[] => {
    return invoices.filter(invoice => invoice.direction === 'outgoing');
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      getInvoicesByUser,
      getAllInvoices,
      getIncomingInvoices,
      getOutgoingInvoices
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};