/**
 * Invoice Generator & PDF Export System
 * Handles automatic invoice generation, PDF export, VAT breakdown, and email delivery
 */

import { format } from 'date-fns';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobReference: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
    vatNumber?: string;
  };
  
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    vatNumber: string;
    registrationNumber: string;
    logo?: string;
  };
  
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency?: string;
  
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  paidDate?: Date;
  
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  layout: 'standard' | 'modern' | 'compact';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  showLogo: boolean;
  showBankDetails: boolean;
  customFooter?: string;
}

// ==================== INVOICE GENERATION ====================

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function createInvoiceFromJob(job: any, customer: any): Invoice {
  const invoiceNumber = generateInvoiceNumber();
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);

  const items: InvoiceItem[] = [
    {
      description: `Moving Service - ${job.serviceType || 'Standard Move'}`,
      quantity: 1,
      unitPrice: job.totalPrice || 0,
      total: job.totalPrice || 0,
      category: 'service',
    },
  ];

  if (job.extras && Array.isArray(job.extras)) {
    job.extras.forEach((extra: any) => {
      items.push({
        description: extra.name || extra.description,
        quantity: 1,
        unitPrice: extra.price,
        total: extra.price,
        category: 'extra',
      });
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatRate = 20;
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const invoice: Invoice = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    invoiceNumber,
    jobReference: job.reference || job.id,
    issueDate,
    dueDate,
    status: 'sent',
    customer: {
      id: customer.id,
      name: customer.name || customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: job.pickupAddress || customer.address || '',
    },
    company: {
      name: 'ShiftMyHome Ltd',
      address: '123 Business Street, London, UK',
      phone: '+44 20 1234 5678',
      email: 'info@shiftmyhome.com',
      vatNumber: 'GB123456789',
      registrationNumber: '12345678',
    },
    items,
    subtotal,
    vatRate,
    vatAmount,
    total,
    currency: 'GBP',
    notes: 'Thank you for choosing ShiftMyHome. Payment due within 14 days.',
  };

  saveInvoice(invoice);
  return invoice;
}

export function getAllInvoices(): Invoice[] {
  const stored = localStorage.getItem('all_invoices');
  return stored ? JSON.parse(stored) : [];
}

export function getInvoiceById(id: string): Invoice | null {
  const invoices = getAllInvoices();
  return invoices.find(inv => inv.id === id) || null;
}

export function saveInvoice(invoice: Invoice): void {
  const allInvoices = getAllInvoices();
  const existingIndex = allInvoices.findIndex(inv => inv.id === invoice.id);
  
  if (existingIndex >= 0) {
    allInvoices[existingIndex] = invoice;
  } else {
    allInvoices.push(invoice);
  }
  
  localStorage.setItem('all_invoices', JSON.stringify(allInvoices));
}

export function getDefaultTemplate(): InvoiceTemplate {
  return {
    id: 'default',
    name: 'ShiftMyHome Standard',
    description: 'Professional invoice template',
    layout: 'standard',
    colorScheme: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#f59e0b',
    },
    showLogo: true,
    showBankDetails: false,
  };
}

// ==================== INVOICE STATISTICS ====================

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  averageInvoiceValue: number;
  totalPaid: number;
  totalUnpaid: number;
}

export function calculateInvoiceStats(invoices: Invoice[]): InvoiceStats {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const draftInvoices = invoices.filter(inv => inv.status === 'draft').length;
  const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalUnpaid = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + inv.total, 0);

  return {
    totalInvoices,
    totalRevenue,
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    draftInvoices,
    averageInvoiceValue,
    totalPaid,
    totalUnpaid
  };
}

// ==================== INVOICE ACTIONS ====================

export function markInvoiceAsPaid(invoiceId: string): void {
  const invoices = getAllInvoices();
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (invoice) {
    invoice.status = 'paid';
    invoice.paidDate = new Date();
    invoice.updatedAt = new Date();
    saveInvoice(invoice);
  }
}

export function downloadInvoicePDF(invoice: Invoice): void {
  // Generate PDF content as HTML
  const pdfContent = generateInvoiceHTML(invoice);
  
  // Create a blob and download
  const blob = new Blob([pdfContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function sendInvoiceEmail(invoice: Invoice): Promise<boolean> {
  // Simulate sending email
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customer.email}`);
      
      // Update invoice status to sent if it was draft
      if (invoice.status === 'draft') {
        invoice.status = 'sent';
        invoice.updatedAt = new Date();
        saveInvoice(invoice);
      }
      
      resolve(true);
    }, 1000);
  });
}

// ==================== PDF GENERATION ====================

function generateInvoiceHTML(invoice: Invoice): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .company-info h1 {
      margin: 0;
      color: #8b5cf6;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
    }
    .addresses {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .address-block h3 {
      margin: 0 0 10px 0;
      color: #555;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals tr td {
      padding: 8px;
    }
    .total-row {
      font-weight: bold;
      font-size: 18px;
      color: #8b5cf6;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${invoice.company.name}</h1>
      <p>${invoice.company.address}</p>
      <p>Phone: ${invoice.company.phone}</p>
      <p>Email: ${invoice.company.email}</p>
      <p>VAT: ${invoice.company.vatNumber}</p>
    </div>
    <div class="invoice-details">
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <p>Issue Date: ${format(new Date(invoice.issueDate), 'dd/MM/yyyy')}</p>
      <p>Due Date: ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</p>
      <p>Status: <strong>${invoice.status.toUpperCase()}</strong></p>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>Bill To:</h3>
      <p><strong>${invoice.customer.name}</strong></p>
      ${invoice.customer.companyName ? `<p>${invoice.customer.companyName}</p>` : ''}
      <p>${invoice.customer.address}</p>
      <p>${invoice.customer.email}</p>
      <p>${invoice.customer.phone}</p>
      ${invoice.customer.vatNumber ? `<p>VAT: ${invoice.customer.vatNumber}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>£${item.unitPrice.toFixed(2)}</td>
          <td>£${item.total.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <table class="totals">
    <tr>
      <td>Subtotal:</td>
      <td style="text-align: right;">£${invoice.subtotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td>VAT (${invoice.vatRate}%):</td>
      <td style="text-align: right;">£${invoice.vatAmount.toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td>Total:</td>
      <td style="text-align: right;">£${invoice.total.toFixed(2)}</td>
    </tr>
  </table>

  ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
  ${invoice.terms ? `<p><strong>Terms:</strong> ${invoice.terms}</p>` : ''}

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>${invoice.company.name} - ${invoice.company.registrationNumber}</p>
  </div>
</body>
</html>
  `;
}