/**
 * Payment & Invoice Management System
 * Handles Stripe payments, deposits, payouts, and PDF invoice generation
 */

import { jobStatusManager, Job, DriverProfile } from './jobStatusManager';
import { partnerManager } from './partnerManager';
import { notificationService } from './notificationService';

export interface Payment {
  id: string;
  jobId: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  type: 'deposit' | 'final' | 'full';
  amount: number;
  vatAmount?: number; // If driver is VAT registered
  totalAmount: number; // amount + VAT
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash';
  stripePaymentIntentId?: string;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: {
    cardLast4?: string;
    cardBrand?: string;
  };
}

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  jobs: string[]; // Job IDs included in payout
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledFor: string; // ISO date
  completedAt?: string;
  failureReason?: string;
  bankAccount?: {
    accountNumber: string;
    sortCode: string;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-XXXXXX
  jobId: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;
  driverVATNumber?: string; // If VAT registered
  isVATInvoice: boolean; // True if driver is VAT registered
  
  // Line items
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  
  // Original quote
  originalSubtotal: number;
  originalVAT?: number;
  originalTotal: number;
  
  // Extra items (if any)
  extraItemsSubtotal?: number;
  extraItemsVAT?: number;
  extraItemsTotal?: number;
  
  // Final totals
  subtotal: number; // Excluding VAT
  vatAmount?: number; // 20% if VAT registered
  total: number; // Including VAT
  
  // Metadata
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  pdfUrl?: string; // Generated PDF URL
  sentToCustomer: boolean;
  createdAt: string;
}

export interface CancellationPolicy {
  timeBeforeJob: number; // hours
  refundPercentage: number; // 0-100
  driverCompensationPercentage: number; // 0-100
}

class PaymentManager {
  private payments: Map<string, Payment> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private nextInvoiceNumber: number = 1;

  // Cancellation policy tiers
  private cancellationPolicies: CancellationPolicy[] = [
    { timeBeforeJob: 24, refundPercentage: 100, driverCompensationPercentage: 0 }, // 24+ hours: Full refund
    { timeBeforeJob: 12, refundPercentage: 50, driverCompensationPercentage: 25 }, // 12-24 hours: 50% refund, 25% to driver
    { timeBeforeJob: 0, refundPercentage: 0, driverCompensationPercentage: 50 }, // <12 hours: No refund, 50% to driver
  ];

  // ==================== PAYMENT PROCESSING ====================

  // Create payment for job (deposit or full)
  createPayment(
    job: Job,
    type: 'deposit' | 'final' | 'full',
    paymentMethod: 'card' | 'bank_transfer' | 'cash' = 'card'
  ): Payment {
    // Calculate amount based on type
    let amount = 0;
    if (type === 'deposit') {
      amount = job.customerPrice * 0.5; // 50% deposit
    } else if (type === 'final') {
      amount = job.customerPrice * 0.5; // Remaining 50%
    } else {
      amount = job.customerPrice; // Full amount
    }

    // Check if driver is VAT registered
    const driver = partnerManager.getDriverProfile(job.driverId || '');
    let vatAmount = 0;
    let totalAmount = amount;

    if (driver?.isVATRegistered) {
      const vatRate = jobStatusManager.getExtraPricingConfig().vatRate / 100;
      vatAmount = amount * vatRate;
      totalAmount = amount + vatAmount;
    }

    const payment: Payment = {
      id: `PAY${Date.now()}`,
      jobId: job.id,
      jobReference: job.reference,
      customerId: job.customerId || '',
      customerName: job.customerName,
      type,
      amount,
      vatAmount: driver?.isVATRegistered ? vatAmount : undefined,
      totalAmount,
      status: 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    this.payments.set(payment.id, payment);
    return payment;
  }

  // Process Stripe payment
  async processStripePayment(paymentId: string, cardToken: string): Promise<boolean> {
    const payment = this.payments.get(paymentId);
    if (!payment) return false;

    try {
      // MOCK: In production, call Stripe API
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: Math.round(payment.totalAmount * 100), // Convert to pence
      //   currency: 'gbp',
      //   payment_method: cardToken,
      //   confirm: true,
      // });

      // Simulate Stripe payment
      payment.status = 'processing';
      payment.stripePaymentIntentId = `pi_${Date.now()}`;
      payment.metadata = {
        cardLast4: '4242',
        cardBrand: 'Visa',
      };

      // Simulate success after 1 second
      setTimeout(() => {
        payment.status = 'completed';
        payment.completedAt = new Date().toISOString();
        this.payments.set(paymentId, payment);

        // Generate invoice
        const job = jobStatusManager.getJob(payment.jobId);
        if (job) {
          this.generateInvoice(job);
        }

        // Notify customer
        if (job) {
          notificationService.sendJobNotification(job, 'payment_received');
        }
      }, 1000);

      this.payments.set(paymentId, payment);
      return true;
    } catch (error) {
      payment.status = 'failed';
      this.payments.set(paymentId, payment);
      return false;
    }
  }

  // Refund payment
  refundPayment(paymentId: string, amount: number, reason: string): boolean {
    const payment = this.payments.get(paymentId);
    if (!payment || payment.status !== 'completed') return false;

    payment.refundAmount = amount;
    payment.refundReason = reason;
    payment.refundedAt = new Date().toISOString();
    payment.status = 'refunded';

    this.payments.set(paymentId, payment);

    // Notify customer
    jobStatusManager.addNotification(payment.customerId, {
      id: `notif_${Date.now()}`,
      type: 'payment',
      title: 'Refund Processed',
      message: `Refund of £${amount.toFixed(2)} processed for ${payment.jobReference}. ${reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: payment.jobId,
    });

    return true;
  }

  // Get payments for job
  getJobPayments(jobId: string): Payment[] {
    return Array.from(this.payments.values()).filter(p => p.jobId === jobId);
  }

  // Get payments for customer
  getCustomerPayments(customerId: string): Payment[] {
    return Array.from(this.payments.values()).filter(p => p.customerId === customerId);
  }

  // ==================== DRIVER PAYOUTS ====================

  // Schedule payout for driver
  schedulePayout(driverId: string, jobIds: string[], scheduledFor: string): Payout {
    const driver = partnerManager.getDriverProfile(driverId);
    if (!driver) throw new Error('Driver not found');

    // Calculate total amount from completed jobs
    let amount = 0;
    jobIds.forEach(jobId => {
      const job = jobStatusManager.getJob(jobId);
      if (job && job.status === 'completed') {
        amount += job.driverPrice;

        // If driver is sub-driver, deduct partner's cut
        if (driver.partnerId) {
          const partner = partnerManager.getDriverProfile(driver.partnerId);
          const partnerCut = (partner?.partnerRevenueSplit || 15) / 100;
          amount -= job.driverPrice * partnerCut;
        }
      }
    });

    const payout: Payout = {
      id: `PAYOUT${Date.now()}`,
      driverId,
      driverName: driver.name,
      amount,
      jobs: jobIds,
      status: 'pending',
      scheduledFor,
      bankAccount: driver.bankAccount ? {
        accountNumber: driver.bankAccount.accountNumber,
        sortCode: driver.bankAccount.sortCode,
      } : undefined,
    };

    this.payouts.set(payout.id, payout);

    // Notify driver
    jobStatusManager.addNotification(driverId, {
      id: `notif_${Date.now()}`,
      type: 'payment',
      title: 'Payout Scheduled',
      message: `Payout of £${amount.toFixed(2)} scheduled for ${new Date(scheduledFor).toLocaleDateString()}`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    return payout;
  }

  // Process payout
  processPayout(payoutId: string): boolean {
    const payout = this.payouts.get(payoutId);
    if (!payout) return false;

    // MOCK: In production, integrate with Stripe Connect or bank transfer API
    payout.status = 'processing';
    this.payouts.set(payoutId, payout);

    // Simulate success
    setTimeout(() => {
      payout.status = 'completed';
      payout.completedAt = new Date().toISOString();
      this.payouts.set(payoutId, payout);

      // Notify driver
      jobStatusManager.addNotification(payout.driverId, {
        id: `notif_${Date.now()}`,
        type: 'payment',
        title: '💰 Payout Completed',
        message: `£${payout.amount.toFixed(2)} has been transferred to your bank account`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }, 2000);

    return true;
  }

  // Get driver payouts
  getDriverPayouts(driverId: string): Payout[] {
    return Array.from(this.payouts.values()).filter(p => p.driverId === driverId);
  }

  // Get pending payouts
  getPendingPayouts(): Payout[] {
    return Array.from(this.payouts.values()).filter(p => p.status === 'pending');
  }

  // ==================== INVOICE GENERATION ====================

  // Generate invoice for job
  generateInvoice(job: Job): Invoice {
    // Check if driver is VAT registered
    const driver = partnerManager.getDriverProfile(job.driverId || '');
    const isVATInvoice = driver?.isVATRegistered || false;
    const vatRate = jobStatusManager.getExtraPricingConfig().vatRate / 100;

    // Build line items
    const items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    // Add main service
    items.push({
      description: `${job.service} - ${job.title}`,
      quantity: 1,
      unitPrice: job.originalCustomerPrice || job.customerPrice,
      totalPrice: job.originalCustomerPrice || job.customerPrice,
    });

    // Add extra items if any
    if (job.extraItems && job.extraItems.length > 0) {
      job.extraItems.forEach(item => {
        items.push({
          description: `Extra: ${item.name}`,
          quantity: item.quantity,
          unitPrice: (job.extraItemsCustomerCharge || 0) / job.extraItems!.length,
          totalPrice: (job.extraItemsCustomerCharge || 0) / job.extraItems!.length,
        });
      });
    }

    // Calculate totals
    const originalSubtotal = job.originalCustomerPrice || job.customerPrice;
    const originalVAT = isVATInvoice ? originalSubtotal * vatRate : undefined;
    const originalTotal = isVATInvoice ? originalSubtotal + (originalVAT || 0) : originalSubtotal;

    const extraItemsSubtotal = job.extraItemsCustomerCharge || 0;
    const extraItemsVAT = isVATInvoice && extraItemsSubtotal > 0 ? extraItemsSubtotal * vatRate : undefined;
    const extraItemsTotal = isVATInvoice && extraItemsSubtotal > 0 ? extraItemsSubtotal + (extraItemsVAT || 0) : extraItemsSubtotal;

    const subtotal = originalSubtotal + extraItemsSubtotal;
    const vatAmount = isVATInvoice ? subtotal * vatRate : undefined;
    const total = isVATInvoice ? subtotal + (vatAmount || 0) : subtotal;

    const invoiceNumber = String(this.nextInvoiceNumber).padStart(6, '0');
    this.nextInvoiceNumber++;

    const invoice: Invoice = {
      id: `INV${Date.now()}`,
      invoiceNumber: `INV-${invoiceNumber}`,
      jobId: job.id,
      jobReference: job.reference,
      customerId: job.customerId || '',
      customerName: job.customerName,
      driverId: job.driverId,
      driverName: job.driverName,
      driverVATNumber: driver?.vatNumber,
      isVATInvoice,
      items,
      originalSubtotal,
      originalVAT,
      originalTotal,
      extraItemsSubtotal: extraItemsSubtotal > 0 ? extraItemsSubtotal : undefined,
      extraItemsVAT,
      extraItemsTotal: extraItemsTotal > 0 ? extraItemsTotal : undefined,
      subtotal,
      vatAmount,
      total,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'issued',
      sentToCustomer: false,
      createdAt: new Date().toISOString(),
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  // Mark invoice as paid
  markInvoicePaid(invoiceId: string): boolean {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) return false;

    invoice.status = 'paid';
    invoice.paidDate = new Date().toISOString();
    this.invoices.set(invoiceId, invoice);
    return true;
  }

  // Get invoice for job
  getJobInvoice(jobId: string): Invoice | undefined {
    return Array.from(this.invoices.values()).find(inv => inv.jobId === jobId);
  }

  // Get customer invoices
  getCustomerInvoices(customerId: string): Invoice[] {
    return Array.from(this.invoices.values()).filter(inv => inv.customerId === customerId);
  }

  // Get driver invoices
  getDriverInvoices(driverId: string): Invoice[] {
    return Array.from(this.invoices.values()).filter(inv => inv.driverId === driverId);
  }

  // ==================== CANCELLATION POLICY ====================

  // Cancel job and process refund
  cancelJob(jobId: string, reason: string): {
    success: boolean;
    refundAmount: number;
    driverCompensation: number;
    message: string;
  } {
    const job = jobStatusManager.getJob(jobId);
    if (!job) {
      return { success: false, refundAmount: 0, driverCompensation: 0, message: 'Job not found' };
    }

    // Calculate hours until job
    const jobDate = new Date(job.date);
    const hoursUntilJob = (jobDate.getTime() - Date.now()) / (1000 * 60 * 60);

    // Find applicable policy
    const policy = this.cancellationPolicies.find(p => hoursUntilJob >= p.timeBeforeJob) 
      || this.cancellationPolicies[this.cancellationPolicies.length - 1];

    const refundAmount = job.customerPrice * (policy.refundPercentage / 100);
    const driverCompensation = job.driverPrice * (policy.driverCompensationPercentage / 100);

    // Process refund
    const payments = this.getJobPayments(jobId);
    payments.forEach(payment => {
      if (payment.status === 'completed') {
        this.refundPayment(payment.id, refundAmount, reason);
      }
    });

    // Update job status
    jobStatusManager.updateJobStatus(jobId, 'cancelled');

    // Compensate driver if applicable
    if (driverCompensation > 0 && job.driverId) {
      jobStatusManager.addNotification(job.driverId, {
        id: `notif_${Date.now()}`,
        type: 'payment',
        title: 'Cancellation Compensation',
        message: `You received £${driverCompensation.toFixed(2)} for cancelled job ${job.reference}`,
        timestamp: new Date().toISOString(),
        read: false,
        jobId: job.id,
      });
    }

    return {
      success: true,
      refundAmount,
      driverCompensation,
      message: `Job cancelled. ${policy.refundPercentage}% refunded (£${refundAmount.toFixed(2)}). Driver compensated £${driverCompensation.toFixed(2)}.`,
    };
  }

  // Get cancellation policy for job
  getCancellationPolicy(jobId: string): CancellationPolicy | null {
    const job = jobStatusManager.getJob(jobId);
    if (!job) return null;

    const jobDate = new Date(job.date);
    const hoursUntilJob = (jobDate.getTime() - Date.now()) / (1000 * 60 * 60);

    return this.cancellationPolicies.find(p => hoursUntilJob >= p.timeBeforeJob) 
      || this.cancellationPolicies[this.cancellationPolicies.length - 1];
  }

  // ==================== FINANCIAL REPORTS ====================

  // Get revenue report
  getRevenueReport(startDate: string, endDate: string): {
    totalRevenue: number;
    totalPayments: number;
    totalRefunds: number;
    platformFees: number;
    driverPayouts: number;
    netRevenue: number;
  } {
    const payments = Array.from(this.payments.values()).filter(p => {
      const date = new Date(p.createdAt);
      return date >= new Date(startDate) && date <= new Date(endDate) && p.status === 'completed';
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalRefunds = payments.reduce((sum, p) => sum + (p.refundAmount || 0), 0);

    const jobs = jobStatusManager.getAllJobs().filter(j => {
      const date = new Date(j.createdAt || '');
      return date >= new Date(startDate) && date <= new Date(endDate) && j.status === 'completed';
    });

    const platformFees = jobs.reduce((sum, j) => sum + j.platformFee, 0);
    const driverPayouts = jobs.reduce((sum, j) => sum + j.driverPrice, 0);

    return {
      totalRevenue,
      totalPayments: payments.length,
      totalRefunds,
      platformFees,
      driverPayouts,
      netRevenue: platformFees - totalRefunds,
    };
  }

  // Get driver earnings report
  getDriverEarningsReport(driverId: string, startDate: string, endDate: string): {
    totalEarnings: number;
    totalJobs: number;
    averageJobValue: number;
    pendingPayouts: number;
    completedPayouts: number;
  } {
    const jobs = jobStatusManager.getDriverJobs(driverId).filter(j => {
      const date = new Date(j.completedAt || '');
      return date >= new Date(startDate) && date <= new Date(endDate) && j.status === 'completed';
    });

    const totalEarnings = jobs.reduce((sum, j) => sum + j.driverPrice, 0);
    const payouts = this.getDriverPayouts(driverId);
    const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const completedPayouts = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

    return {
      totalEarnings,
      totalJobs: jobs.length,
      averageJobValue: jobs.length > 0 ? totalEarnings / jobs.length : 0,
      pendingPayouts,
      completedPayouts,
    };
  }

  // ==================== ADMIN HELPERS ====================

  getAllPayments(): Payment[] {
    return Array.from(this.payments.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllInvoices(): Invoice[] {
    return Array.from(this.invoices.values()).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  getAllPayouts(): Payout[] {
    return Array.from(this.payouts.values()).sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
  }
}

// Singleton instance
export const paymentManager = new PaymentManager();
