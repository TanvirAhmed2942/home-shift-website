/**
 * Email & Invoice Service
 * Handles automated emails and PDF invoice generation
 */

import { Job } from './jobStatusManager';

export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
  attachments?: { name: string; url: string }[];
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  job: Job;
  tipAmount: number;
  subtotal: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

class EmailService {
  // Send job completion email with tip & feedback request
  sendJobCompletionEmail(job: Job): void {
    const email: EmailTemplate = {
      to: job.customerEmail,
      subject: `✅ Job Completed - ${job.title} | ShiftMyHome`,
      body: this.getJobCompletionEmailBody(job),
    };

    console.log('📧 Sending Job Completion Email:', email);
    
    // Simulate email sending
    this.mockSendEmail(email);
    
    // Show browser notification (in production, this would be a real email)
    this.showNotification('Job Completed!', `Your move is complete. Please rate your experience.`);
  }

  // Send invoice email with PDF attachment
  sendInvoiceEmail(invoiceData: InvoiceData): void {
    const pdfUrl = this.generateInvoicePDF(invoiceData);
    
    const email: EmailTemplate = {
      to: invoiceData.customerEmail,
      subject: `Invoice #${invoiceData.invoiceNumber} - ShiftMyHome`,
      body: this.getInvoiceEmailBody(invoiceData),
      attachments: [
        { name: `Invoice-${invoiceData.invoiceNumber}.pdf`, url: pdfUrl }
      ],
    };

    console.log('📧 Sending Invoice Email:', email);
    
    // Simulate email sending
    this.mockSendEmail(email);
    
    // Show browser notification
    this.showNotification('Invoice Sent!', `Invoice #${invoiceData.invoiceNumber} has been sent to your email.`);
    
    // Auto-download PDF
    this.downloadPDF(pdfUrl, `Invoice-${invoiceData.invoiceNumber}.pdf`);
  }

  // Send feedback thank you email
  sendFeedbackThankYouEmail(job: Job, rating: number, tipAmount: number): void {
    const email: EmailTemplate = {
      to: job.customerEmail,
      subject: `Thank You for Your Feedback! | ShiftMyHome`,
      body: this.getFeedbackThankYouEmailBody(job, rating, tipAmount),
    };

    console.log('📧 Sending Thank You Email:', email);
    
    // Simulate email sending
    this.mockSendEmail(email);
  }

  // Email Templates
  private getJobCompletionEmailBody(job: Job): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .job-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Job Completed!</h1>
      <p>Your move is complete</p>
    </div>
    
    <div class="content">
      <h2>Hi ${job.customerName},</h2>
      
      <p>Great news! Your move has been completed successfully.</p>
      
      <div class="job-details">
        <h3>${job.title}</h3>
        <p><strong>Reference:</strong> ${job.id}</p>
        <p><strong>Date:</strong> ${job.date}</p>
        <p><strong>Driver:</strong> ${job.driverName}</p>
        <p><strong>Total Paid:</strong> £${job.customerPrice.toFixed(2)}</p>
      </div>
      
      <h3>📝 How was your experience?</h3>
      <p>We'd love to hear your feedback! Please take a moment to rate your driver and share your experience.</p>
      
      <div style="text-align: center;">
        <a href="#" class="button">Rate Your Experience ⭐</a>
      </div>
      
      <h3>💰 Leave a Tip for ${job.driverName}</h3>
      <p>If you were happy with the service, consider leaving a tip for your driver. 100% of tips go directly to them.</p>
      
      <div style="text-align: center;">
        <a href="#" class="button">Add a Tip 💵</a>
      </div>
      
      <p style="margin-top: 30px;">Your invoice will be sent to you shortly.</p>
      
      <p>Thank you for choosing ShiftMyHome!</p>
    </div>
    
    <div class="footer">
      <p>ShiftMyHome - Making moves easier</p>
      <p>Questions? Reach us at support@shiftmyhome.com</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getInvoiceEmailBody(invoiceData: InvoiceData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .invoice-table th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db; }
    .invoice-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    .total { background: #10b981; color: white; font-size: 18px; font-weight: bold; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📄 Invoice</h1>
      <p>Invoice #${invoiceData.invoiceNumber}</p>
    </div>
    
    <div class="content">
      <h2>Hi ${invoiceData.customerName},</h2>
      
      <p>Thank you for using ShiftMyHome. Please find your invoice attached.</p>
      
      <table class="invoice-table">
        <tr>
          <th>Invoice Number</th>
          <td>${invoiceData.invoiceNumber}</td>
        </tr>
        <tr>
          <th>Date</th>
          <td>${invoiceData.date}</td>
        </tr>
        <tr>
          <th>Job Reference</th>
          <td>${invoiceData.job.id}</td>
        </tr>
        <tr>
          <th>Service</th>
          <td>${invoiceData.job.title}</td>
        </tr>
      </table>
      
      <table class="invoice-table">
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
        <tr>
          <td>${invoiceData.job.service}</td>
          <td style="text-align: right;">£${invoiceData.subtotal.toFixed(2)}</td>
        </tr>
        ${invoiceData.tipAmount > 0 ? `
        <tr>
          <td>Driver Tip</td>
          <td style="text-align: right;">£${invoiceData.tipAmount.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr class="total">
          <td>TOTAL</td>
          <td style="text-align: right;">£${invoiceData.total.toFixed(2)}</td>
        </tr>
      </table>
      
      <p style="margin-top: 30px;"><strong>Payment Status:</strong> <span style="color: #10b981;">✓ PAID</span></p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="#" class="button">Download PDF Invoice</a>
      </div>
      
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
        This invoice has been automatically generated and sent to ${invoiceData.customerEmail}.
      </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
      <p>ShiftMyHome Ltd | Registered in England & Wales</p>
      <p>Questions? Email us at billing@shiftmyhome.com</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getFeedbackThankYouEmailBody(job: Job, rating: number, tipAmount: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .rating { text-align: center; font-size: 48px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You! 🎉</h1>
      <p>Your feedback means the world to us</p>
    </div>
    
    <div class="content">
      <h2>Hi ${job.customerName},</h2>
      
      <p>Thank you so much for taking the time to rate your experience!</p>
      
      <div class="rating">${'⭐'.repeat(rating)}</div>
      
      ${tipAmount > 0 ? `
        <p style="background: #fef3c7; border: 2px solid #fbbf24; padding: 15px; border-radius: 8px; text-align: center;">
          <strong>💰 Tip of £${tipAmount.toFixed(2)} has been sent to ${job.driverName}</strong>
        </p>
      ` : ''}
      
      <p>Your feedback helps us improve our service and ensures we continue providing excellent customer experiences.</p>
      
      <p>We look forward to helping you with your next move!</p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>The ShiftMyHome Team</strong></p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
      <p>ShiftMyHome - Making moves easier</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // Generate Invoice PDF (Mock)
  private generateInvoicePDF(invoiceData: InvoiceData): string {
    console.log('📄 Generating Invoice PDF:', invoiceData);
    
    // In production, this would use a PDF library like jsPDF or PDFKit
    // For now, we'll create a data URL that represents a PDF
    
    const pdfContent = this.createInvoicePDFContent(invoiceData);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return url;
  }

  private createInvoicePDFContent(invoiceData: InvoiceData): string {
    // This is a simplified text representation
    // In production, use proper PDF generation
    return `
INVOICE
=====================================

Invoice Number: ${invoiceData.invoiceNumber}
Date: ${invoiceData.date}

BILL TO:
${invoiceData.customerName}
${invoiceData.customerEmail}

JOB DETAILS:
Reference: ${invoiceData.job.id}
Service: ${invoiceData.job.service}
Title: ${invoiceData.job.title}

FROM: ${invoiceData.job.pickup.address}
TO: ${invoiceData.job.delivery.address}

ITEMS:
${invoiceData.job.items.map(item => `- ${item.name} x${item.quantity}`).join('\n')}

CHARGES:
Service Fee: £${invoiceData.subtotal.toFixed(2)}
${invoiceData.tipAmount > 0 ? `Driver Tip: £${invoiceData.tipAmount.toFixed(2)}` : ''}

TOTAL: £${invoiceData.total.toFixed(2)}

Payment Status: PAID
Payment Method: Card ending in ****1234

Thank you for choosing ShiftMyHome!
www.shiftmyhome.com
support@shiftmyhome.com
    `.trim();
  }

  // Mock email sending (in production, use SendGrid, AWS SES, etc.)
  private mockSendEmail(email: EmailTemplate): void {
    console.log('✅ Email sent successfully!');
    console.log('To:', email.to);
    console.log('Subject:', email.subject);
    console.log('Attachments:', email.attachments?.map(a => a.name).join(', ') || 'None');
  }

  // Browser notification
  private showNotification(title: string, message: string): void {
    // Check if notifications are supported
    if ('Notification' in window) {
      // Request permission if not granted
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message, icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body: message, icon: '/favicon.ico' });
          }
        });
      }
    }
    
    // Fallback: Browser alert
    console.log(`🔔 ${title}: ${message}`);
  }

  // Download PDF
  private downloadPDF(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`📥 PDF Downloaded: ${filename}`);
  }

  // Generate invoice number
  generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }
}

// Singleton instance
export const emailService = new EmailService();