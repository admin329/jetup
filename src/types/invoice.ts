export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'membership' | 'booking' | 'commission';
  direction: 'incoming' | 'outgoing';
  amount: string;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  operatorName?: string;
  operatorEmail?: string;
  items: InvoiceItem[];
  taxAmount?: string;
  totalAmount: string;
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp.slice(-6)}-${random}`;
};

export const generateInvoicePDF = (invoice: Invoice): void => {
  // Check if this is an operator invoice (has operatorId field)
  const isOperatorInvoice = invoice.operatorId || invoice.type === 'operator_invoice';
  
  if (isOperatorInvoice) {
    generateOperatorInvoicePDF(invoice);
    return;
  }
  
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { margin-bottom: 40px; }
        .company-info { float: left; width: 50%; }
        .company-name { font-size: 24px; font-weight: bold; color: #0B1733; margin-bottom: 8px; }
        .company-address { font-size: 16px; color: #666; line-height: 1.5; }
        .invoice-title { float: right; width: 50%; text-align: right; padding-top: 20px; }
        .invoice-title h1 { font-size: 28px; color: #0B1733; margin: 0; }
        .invoice-title h2 { font-size: 20px; color: #666; margin: 5px 0 0 0; }
        .contact-info { margin-top: 20px; font-size: 12px; color: #666; line-height: 1.4; }
        .contact-info strong { color: #0B1733; }
        .clearfix::after { content: ""; display: table; clear: both; }
        .invoice-details { margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; }
        .total { text-align: right; font-weight: bold; font-size: 18px; }
        .status { padding: 4px 8px; border-radius: 4px; color: white; }
        .status.paid { background-color: #10b981; }
        .status.pending { background-color: #f59e0b; }
        .status.overdue { background-color: #ef4444; }
      </style>
    </head>
    <body>
      <div class="header clearfix">
        <div class="company-info">
          <div style="font-size: 24px; font-weight: bold; color: #0B1733; margin-bottom: 8px;">JETUP LTD</div>
          <div class="company-address">
            27 Old Gloucester Street<br>
            London, United Kingdom<br>
            WC1N 3AX<br>
            <strong>VAT ID:</strong> 16643231
          </div>
        </div>
        <div class="invoice-title">
          <h1>INVOICE</h1>
          <h2>${invoice.invoiceNumber}</h2>
          <div class="contact-info">
            <p><strong>For all your general requests:</strong><br>support@jetup.aero</p>
            <p><strong>Global call center:</strong><br>+1 888 565 6090</p>
          </div>
        </div>
      </div>
      
      <div class="invoice-details">
        <p><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span class="status ${invoice.status}">${invoice.status.toUpperCase()}</span></p>
        <p><strong>Description:</strong> ${invoice.description}</p>
        ${invoice.customerName ? `<p><strong>Customer:</strong> ${invoice.customerName} (${invoice.customerEmail})</p>` : ''}
        ${invoice.customerName ? `<p><strong>Customer ID:</strong> CID00001</p>` : ''}
        ${invoice.operatorName ? `<p><strong>Operator:</strong> ${invoice.operatorName} (${invoice.operatorEmail})</p>` : ''}
        ${invoice.operatorName ? `<p><strong>Operator ID:</strong> OID00001</p>` : ''}
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price (VAT 20% included)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${item.unitPrice} (VAT 20% included)</td>
              <td>${item.totalPrice}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total">
        ${invoice.taxAmount ? `<p>Subtotal (excl. VAT): ${invoice.amount}</p>` : ''}
        ${invoice.taxAmount ? `<p>VAT (20%): ${invoice.taxAmount}</p>` : ''}
        <p>Total Amount: ${invoice.totalAmount}</p>
      </div>
      
      ${invoice.paymentMethod ? `
      <div style="margin-top: 30px;">
        <h3 style="color: #0B1733; margin-bottom: 10px;">Payment Details</h3>
        <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
        ${invoice.paidDate ? `<p><strong>Payment Date:</strong> ${new Date(invoice.paidDate).toLocaleDateString()}</p>` : ''}
        <p><strong>Currency:</strong> ${invoice.currency}</p>
      </div>
      ` : ''}
      
      ${invoice.notes ? `<div style="margin-top: 30px;"><p><strong>Notes:</strong> ${invoice.notes}</p></div>` : ''}
      
      <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
        <p>JETUP LTD (UK) - Private Flight Network</p>
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

export const generateBookingConfirmationPDF = (booking: any, user: any): void => {
  // Determine if booking is cancelled
  const isCancelled = booking.isCancelled || false;
  const cancellationInfo = booking.cancellationInfo || null;
  
  // Calculate original amount and penalty if cancelled
  let originalAmount = 0;
  let penaltyAmount = 0;
  let refundAmount = 0;
  
  if (booking.acceptedOffer?.price) {
    originalAmount = parseFloat(booking.acceptedOffer.price.replace(/[$,]/g, ''));
  } else if (booking.routePrice) {
    originalAmount = parseFloat(booking.routePrice.replace(/[$,]/g, ''));
  }
  
  if (isCancelled && cancellationInfo) {
    penaltyAmount = parseFloat(cancellationInfo.penaltyAmount?.replace(/[$,]/g, '') || '0');
    refundAmount = parseFloat(cancellationInfo.refundAmount?.replace(/[$,]/g, '') || '0');
  }
  
  // Check if discount was used
  const discountUsed = booking.discountUsed || false;
  const discountPercentage = booking.discountPercentage || 0;
  const discountAmount = booking.discountAmount || 0;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Confirmation - ${booking.bookingNumber}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          border-bottom: 3px solid #0B1733; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .company-info { 
          float: left; 
          width: 50%; 
        }
        .company-name { 
          font-size: 28px; 
          font-weight: bold; 
          color: #0B1733; 
          margin-bottom: 8px; 
        }
        .company-address { 
          font-size: 14px; 
          color: #666; 
          line-height: 1.5; 
        }
        .confirmation-title { 
          float: right; 
          width: 50%; 
          text-align: right; 
          padding-top: 10px; 
        }
        .confirmation-title h1 { 
          font-size: 28px; 
          color: ${isCancelled ? '#dc2626' : '#0B1733'}; 
          margin: 0; 
          font-weight: bold;
        }
        .confirmation-title h2 { 
          font-size: 18px; 
          color: #666; 
          margin: 5px 0 0 0; 
        }
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
          ${isCancelled 
            ? 'background-color: #fee2e2; color: #dc2626;' 
            : 'background-color: #dcfce7; color: #16a34a;'
          }
        }
        .clearfix::after { 
          content: ""; 
          display: table; 
          clear: both; 
        }
        .section { 
          background-color: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 20px; 
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #0B1733;
          margin-bottom: 15px;
          border-bottom: 2px solid #0B1733;
          padding-bottom: 8px;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .detail-item {
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .detail-label { 
          font-weight: bold; 
          color: #0B1733; 
          display: block;
          margin-bottom: 5px;
        }
        .detail-value { 
          color: #333; 
        }
        .flight-route {
          text-align: center;
          background-color: #0B1733;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .route-text {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .route-details {
          font-size: 14px;
          opacity: 0.9;
        }
        .pricing-section {
          background-color: ${isCancelled ? '#fee2e2' : '#dcfce7'};
          border: 2px solid ${isCancelled ? '#dc2626' : '#16a34a'};
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .pricing-title {
          font-size: 18px;
          font-weight: bold;
          color: ${isCancelled ? '#dc2626' : '#16a34a'};
          margin-bottom: 15px;
          text-align: center;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid ${isCancelled ? '#fca5a5' : '#86efac'};
        }
        .price-row:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
          padding-top: 15px;
          border-top: 2px solid ${isCancelled ? '#dc2626' : '#16a34a'};
        }
        .cancellation-section {
          background-color: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .cancellation-title {
          font-size: 18px;
          font-weight: bold;
          color: #92400e;
          margin-bottom: 15px;
          text-align: center;
        }
        .discount-section {
          background-color: #dbeafe;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .discount-title {
          font-size: 16px;
          font-weight: bold;
          color: #1d4ed8;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          margin-top: 40px;
        }
        .important-note {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header clearfix">
        <div class="company-info">
          <div class="company-name">JETUP LTD</div>
          <div class="company-address">
            27 Old Gloucester Street<br>
            London, United Kingdom<br>
            WC1N 3AX<br>
            <strong>Company ID:</strong> 16643231
          </div>
        </div>
        <div class="confirmation-title">
          <h1>${isCancelled ? 'CANCELLED BOOKING' : 'BOOKING CONFIRMATION'}</h1>
          <h2>${booking.bookingNumber}</h2>
          <div class="status-badge">
            ${isCancelled ? 'CANCELLED' : 'CONFIRMED'}
          </div>
        </div>
      </div>
      
      <div class="flight-route">
        <div class="route-text">${booking.from} → ${booking.to}</div>
        <div class="route-details">
          ${booking.type === 'route_booking' ? 'Route Booking' : 'Flight Request'} | 
          ${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${booking.customer}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${booking.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Customer ID:</span>
            <span class="detail-value">${booking.email === 'demo@customer.com' ? 'CID00001' : 'CID00002'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Booking Date:</span>
            <span class="detail-value">${new Date(booking.requestDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Flight Details</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Departure:</span>
            <span class="detail-value">${new Date(booking.departure).toLocaleDateString()} at ${new Date(booking.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Route:</span>
            <span class="detail-value">${booking.from} → ${booking.to}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Passengers:</span>
            <span class="detail-value">${booking.passengers} people</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Trip Type:</span>
            <span class="detail-value">${booking.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}</span>
          </div>
        </div>
        ${booking.return ? `
        <div class="detail-item">
          <span class="detail-label">Return Flight:</span>
          <span class="detail-value">${new Date(booking.return).toLocaleDateString()} at ${new Date(booking.return).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        ` : ''}
        ${booking.specialRequests ? `
        <div class="detail-item">
          <span class="detail-label">Special Requests:</span>
          <span class="detail-value">${booking.specialRequests}</span>
        </div>
        ` : ''}
        <div class="important-note">
          <strong>⚠️ Important:</strong> Departure location is determined as LTC (Local Time Coordination)
        </div>
      </div>
      
      ${booking.acceptedOffer || booking.routeOperator ? `
      <div class="section">
        <div class="section-title">Operator Information</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Operator:</span>
            <span class="detail-value">${booking.acceptedOffer?.operatorName || booking.routeOperator || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Aircraft:</span>
            <span class="detail-value">${booking.acceptedOffer?.aircraft || booking.routeAircraft || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Operator ID:</span>
            <span class="detail-value">OID00001</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Contact:</span>
            <span class="detail-value">operator@jetup.aero</span>
          </div>
        </div>
        ${booking.acceptedOffer?.message ? `
        <div class="detail-item">
          <span class="detail-label">Operator Message:</span>
          <span class="detail-value">${booking.acceptedOffer.message}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${discountUsed ? `
      <div class="discount-section">
        <div class="discount-title">🎉 Membership Discount Applied</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Membership Type:</span>
            <span class="detail-value">${user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1) || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Discount Rate:</span>
            <span class="detail-value">${discountPercentage}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Discount Amount:</span>
            <span class="detail-value">$${discountAmount.toLocaleString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Original Price:</span>
            <span class="detail-value">$${(originalAmount + discountAmount).toLocaleString()}</span>
          </div>
        </div>
      </div>
      ` : ''}
      
      <div class="pricing-section">
        <div class="pricing-title">${isCancelled ? '💸 Cancellation & Refund Details' : '💰 Payment Summary'}</div>
        
        ${!isCancelled ? `
        <div class="price-row">
          <span>Flight Cost:</span>
          <span>$${originalAmount.toLocaleString()}</span>
        </div>
        ${discountUsed ? `
        <div class="price-row">
          <span>Membership Discount (${discountPercentage}%):</span>
          <span>-$${discountAmount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div class="price-row">
          <span>Total Amount Paid:</span>
          <span>$${(originalAmount - discountAmount).toLocaleString()}</span>
        </div>
        ` : `
        <div class="price-row">
          <span>Original Amount Paid:</span>
          <span>$${originalAmount.toLocaleString()}</span>
        </div>
        <div class="price-row">
          <span>Cancellation Penalty (${cancellationInfo?.penaltyPercentage || 0}%):</span>
          <span>-$${penaltyAmount.toLocaleString()}</span>
        </div>
        <div class="price-row">
          <span>Refund Amount:</span>
          <span>$${refundAmount.toLocaleString()}</span>
        </div>
        `}
      </div>
      
      ${booking.isPaid ? `
      <div class="section">
        <div class="section-title">Payment Information</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Payment Status:</span>
            <span class="detail-value" style="color: #16a34a; font-weight: bold;">✅ PAID</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Date:</span>
            <span class="detail-value">${new Date(booking.paidAt).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${booking.paymentMethod || 'Credit Card'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${booking.transactionId || 'TXN-' + Date.now().toString().slice(-8)}</span>
          </div>
        </div>
      </div>
      ` : ''}
      
      ${isCancelled && cancellationInfo ? `
      <div class="cancellation-section">
        <div class="cancellation-title">❌ Cancellation Details</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Cancellation Date:</span>
            <span class="detail-value">${new Date(cancellationInfo.cancellationDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Cancelled By:</span>
            <span class="detail-value">Customer</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Cancellation Reason:</span>
            <span class="detail-value">${cancellationInfo.reason || 'Customer cancellation'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Time Before Flight:</span>
            <span class="detail-value">${cancellationInfo.timeBeforeFlight || 'N/A'}</span>
          </div>
        </div>
        <div style="margin-top: 15px; padding: 10px; background-color: #fbbf24; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">
            ⚠️ This cancellation used 1 of your 10 cancellation rights.
          </p>
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Important Notes</div>
        <ul style="margin: 0; padding-left: 20px;">
          <li>This confirmation serves as your official booking receipt</li>
          <li>Please arrive at the departure location 30 minutes before scheduled time</li>
          <li>Departure location coordinates will be provided 24 hours before flight</li>
          <li>All prices are in USD and do not include VAT</li>
          ${isCancelled ? '<li style="color: #dc2626; font-weight: bold;">This booking has been cancelled and refund processed</li>' : ''}
          <li>For any changes or inquiries, contact: support@jetup.aero</li>
        </ul>
      </div>
      
      <div class="footer">
        <p><strong>JETUP LTD (UK) - Private Flight Network</strong></p>
        <p>27 Old Gloucester Street, London, United Kingdom, WC1N 3AX</p>
        <p>Email: support@jetup.aero | Phone: +1 888 565 6090</p>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        ${isCancelled ? '<p style="color: #dc2626; font-weight: bold;">⚠️ CANCELLED BOOKING CONFIRMATION</p>' : '<p style="color: #16a34a; font-weight: bold;">✅ CONFIRMED BOOKING</p>'}
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

export const generateOperatorInvoicePDF = (invoice: any): void => {
  // Create operator-specific invoice template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Operator Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          border-bottom: 3px solid #0B1733; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .operator-info { 
          float: left; 
          width: 50%; 
        }
        .operator-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: #0B1733; 
          margin-bottom: 8px; 
        }
        .operator-details { 
          font-size: 14px; 
          color: #666; 
          line-height: 1.5; 
        }
        .invoice-title { 
          float: right; 
          width: 50%; 
          text-align: right; 
          padding-top: 10px; 
        }
        .invoice-title h1 { 
          font-size: 32px; 
          color: #0B1733; 
          margin: 0; 
          font-weight: bold;
        }
        .invoice-title h2 { 
          font-size: 18px; 
          color: #666; 
          margin: 5px 0 0 0; 
        }
        .clearfix::after { 
          content: ""; 
          display: table; 
          clear: both; 
        }
        .invoice-details { 
          background-color: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px; 
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 10px; 
          padding: 5px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label { 
          font-weight: bold; 
          color: #0B1733; 
        }
        .detail-value { 
          color: #333; 
        }
        .product-section {
          background-color: #fff;
          border: 2px solid #0B1733;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .product-title {
          font-size: 18px;
          font-weight: bold;
          color: #0B1733;
          margin-bottom: 15px;
          border-bottom: 1px solid #0B1733;
          padding-bottom: 10px;
        }
        .amount-section {
          background-color: #0B1733;
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 30px;
        }
        .amount-title {
          font-size: 16px;
          margin-bottom: 10px;
          opacity: 0.9;
        }
        .amount-value {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .currency {
          font-size: 14px;
          opacity: 0.8;
        }
        .payment-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .notes-section {
          background-color: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
          margin-bottom: 30px;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-approved {
          background-color: #d4edda;
          color: #155724;
        }
        .status-rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="header clearfix">
        <div class="operator-info">
          <div class="operator-name">${invoice.operatorName || 'Operator Name'}</div>
          <div class="operator-details">
            <strong>Operator ID:</strong> ${invoice.operatorId || 'N/A'}<br>
            <strong>Email:</strong> ${invoice.operatorEmail || 'N/A'}<br>
            <strong>Date:</strong> ${new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div class="invoice-title">
          <h1>OPERATOR INVOICE</h1>
          <h2>${invoice.invoiceNumber}</h2>
        </div>
      </div>
      
      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Date:</span>
          <span class="detail-value">${new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking ID:</span>
          <span class="detail-value">${invoice.bookingId || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value">
            <span class="status-badge status-${invoice.status || 'pending'}">
              ${(invoice.status || 'pending').toUpperCase()}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted:</span>
          <span class="detail-value">${new Date(invoice.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div class="product-section">
        <div class="product-title">Service/Product Description</div>
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
          ${invoice.productDescription || invoice.description || 'No description provided'}
        </p>
      </div>
      
      <div class="amount-section">
        <div class="amount-title">Invoice Amount</div>
        <div class="amount-value">${invoice.amount || '$0'}</div>
        <div class="currency">${invoice.currency || 'USD'}</div>
      </div>
      
      ${invoice.paymentMethod || invoice.paymentDetails ? `
      <div class="payment-section">
        <h3 style="color: #0B1733; margin-bottom: 15px; margin-top: 0;">Payment Information</h3>
        ${invoice.paymentMethod ? `<p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>` : ''}
        ${invoice.paymentDetails ? `<p><strong>Payment Details:</strong><br>${invoice.paymentDetails}</p>` : ''}
      </div>
      ` : ''}
      
      ${invoice.notes ? `
      <div class="notes-section">
        <h3 style="color: #2196f3; margin-bottom: 15px; margin-top: 0;">Additional Notes</h3>
        <p style="margin: 0; font-size: 14px; line-height: 1.6;">
          ${invoice.notes}
        </p>
      </div>
      ` : ''}
      
      <div class="footer">
        <p><strong>JETUP Private Flight Network</strong></p>
        <p>Operator Invoice - Submitted for Admin Review</p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};