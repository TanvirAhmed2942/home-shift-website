/**
 * Customer Feedback & Tips Management System
 * Handles ratings, reviews, tips, and email notifications
 */

import { jobStatusManager, Job } from './jobStatusManager';
import { paymentManager } from './paymentManager';

export interface CustomerReview {
  id: string;
  jobId: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  driverUsername: string;
  
  // Ratings (1-5 stars)
  overallRating: number;
  punctualityRating: number;
  professionalismRating: number;
  careOfItemsRating: number;
  communicationRating: number;
  
  // Review
  reviewText?: string;
  wouldRecommend: boolean;
  
  // Tips
  tipAmount: number; // £
  tipPercentage?: number; // % of job price
  
  // Photos (optional - customer can upload photos of completed move)
  photos?: string[];
  
  // Metadata
  createdAt: string;
  isPublic: boolean; // Show on driver profile
  verified: boolean; // Verified by admin
  helpful: number; // Number of people who found this helpful
}

export interface EmailNotification {
  id: string;
  type: 'feedback_request' | 'thank_you' | 'driver_rated';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  opened?: boolean;
  openedAt?: string;
  clicked?: boolean;
  clickedAt?: string;
  jobId?: string;
  reviewId?: string;
}

export interface TipSuggestion {
  percentage: number;
  amount: number;
  label: string;
}

class FeedbackManager {
  private reviews: Map<string, CustomerReview> = new Map();
  private emails: Map<string, EmailNotification> = new Map();

  // Tip suggestions based on job price
  private tipSuggestions = [
    { percentage: 10, label: 'Good' },
    { percentage: 15, label: 'Great' },
    { percentage: 20, label: 'Excellent' },
  ];

  // ==================== REVIEW SUBMISSION ====================

  // Submit customer review
  submitReview(review: Omit<CustomerReview, 'id' | 'createdAt' | 'verified' | 'helpful'>): CustomerReview {
    const newReview: CustomerReview = {
      ...review,
      id: `REV${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: true, // Auto-verify (only real customers can review)
      helpful: 0,
    };

    this.reviews.set(newReview.id, newReview);

    // Update driver rating
    this.updateDriverRating(review.driverId);

    // Process tip payment if provided
    if (review.tipAmount > 0) {
      this.processTip(review.jobId, review.driverId, review.tipAmount);
    }

    // Send thank you email to customer
    this.sendThankYouEmail(review.customerId, review.customerName, review.driverName);

    // Notify driver about review
    this.notifyDriverAboutReview(review.driverId, newReview);

    return newReview;
  }

  // Update driver's overall rating
  private updateDriverRating(driverId: string): void {
    const driverReviews = this.getDriverReviews(driverId);
    if (driverReviews.length === 0) return;

    const avgRating = driverReviews.reduce((sum, r) => sum + r.overallRating, 0) / driverReviews.length;
    
    // Update driver profile (in real app, update database)
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (driver) {
      driver.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      jobStatusManager['driverProfiles'].set(driverId, driver);
    }
  }

  // Get reviews for driver
  getDriverReviews(driverId: string): CustomerReview[] {
    return Array.from(this.reviews.values()).filter(r => r.driverId === driverId);
  }

  // Get reviews for job
  getJobReview(jobId: string): CustomerReview | undefined {
    return Array.from(this.reviews.values()).find(r => r.jobId === jobId);
  }

  // Get public reviews for driver (for driver profile page)
  getPublicDriverReviews(driverId: string): CustomerReview[] {
    return Array.from(this.reviews.values())
      .filter(r => r.driverId === driverId && r.isPublic)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ==================== TIPS SYSTEM ====================

  // Calculate tip suggestions based on job price
  getTipSuggestions(jobPrice: number): TipSuggestion[] {
    return this.tipSuggestions.map(suggestion => ({
      ...suggestion,
      amount: Math.round(jobPrice * (suggestion.percentage / 100) * 100) / 100,
    }));
  }

  // Process tip payment
  private processTip(jobId: string, driverId: string, amount: number): void {
    const job = jobStatusManager.getJob(jobId);
    if (!job) return;

    // Create tip payment (100% goes to driver, no platform fee)
    const tipPayment = {
      id: `TIP${Date.now()}`,
      jobId,
      jobReference: job.reference,
      customerId: job.customerId || '',
      customerName: job.customerName,
      type: 'tip' as const,
      amount,
      totalAmount: amount,
      status: 'completed' as const,
      paymentMethod: 'card' as const,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // In production, process payment via Stripe
    // await stripe.paymentIntents.create({ amount: amount * 100, ... })

    // Update driver earnings
    const driver = jobStatusManager['driverProfiles'].get(driverId);
    if (driver) {
      driver.earnings += amount;
      jobStatusManager['driverProfiles'].set(driverId, driver);
    }

    // Notify driver
    jobStatusManager.addNotification(driverId, {
      id: `notif_${Date.now()}`,
      type: 'payment',
      title: '💰 Tip Received!',
      message: `You received a £${amount.toFixed(2)} tip from ${job.customerName}`,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: job.id,
    });
  }

  // Get total tips for driver
  getDriverTips(driverId: string): number {
    return Array.from(this.reviews.values())
      .filter(r => r.driverId === driverId)
      .reduce((sum, r) => sum + r.tipAmount, 0);
  }

  // ==================== EMAIL NOTIFICATIONS ====================

  // Send feedback request email after job completion
  sendFeedbackRequestEmail(job: Job): void {
    if (!job.customerEmail) return;

    const feedbackUrl = `https://shiftmyhome.com/feedback/${job.id}`;
    
    const email: EmailNotification = {
      id: `EMAIL${Date.now()}`,
      type: 'feedback_request',
      recipientEmail: job.customerEmail,
      recipientName: job.customerName,
      subject: `How was your move with ${job.driverName}? 🚚`,
      body: this.generateFeedbackEmailBody(job, feedbackUrl),
      sentAt: new Date().toISOString(),
      jobId: job.id,
    };

    this.emails.set(email.id, email);

    // In production, send via email service (SendGrid, Mailgun, AWS SES)
    this.sendEmail(email);

    console.log(`📧 Feedback request sent to ${job.customerName} (${job.customerEmail})`);
  }

  // Generate feedback email HTML
  private generateFeedbackEmailBody(job: Job, feedbackUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
          p { color: #666; line-height: 1.6; margin-bottom: 20px; }
          .driver-info { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
          .stars { font-size: 32px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ShiftMyHome</div>
          </div>
          
          <h1>How was your move? ⭐</h1>
          <p>Hi ${job.customerName},</p>
          <p>We hope your move went smoothly! We'd love to hear about your experience with <strong>${job.driverName}</strong>.</p>
          
          <div class="driver-info">
            <strong>Job Reference:</strong> ${job.reference}<br>
            <strong>Driver:</strong> ${job.driverName}<br>
            <strong>Date:</strong> ${new Date(job.completedAt || '').toLocaleDateString()}<br>
            <strong>Service:</strong> ${job.service}
          </div>
          
          <div class="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
          
          <p style="text-align: center;">
            <a href="${feedbackUrl}" class="button">Leave Feedback & Tip</a>
          </p>
          
          <p style="font-size: 14px; color: #999;">Your feedback helps us maintain high standards and helps other customers make informed decisions.</p>
          
          <div class="footer">
            <p>ShiftMyHome - Professional Removals & Logistics</p>
            <p>If you have any concerns, please contact us at support@shiftmyhome.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send thank you email after review submission
  private sendThankYouEmail(customerId: string, customerName: string, driverName: string): void {
    const email: EmailNotification = {
      id: `EMAIL${Date.now()}`,
      type: 'thank_you',
      recipientEmail: `${customerId}@email.com`, // In production, fetch from customer profile
      recipientName: customerName,
      subject: 'Thank you for your feedback! 🙏',
      body: this.generateThankYouEmailBody(customerName, driverName),
      sentAt: new Date().toISOString(),
    };

    this.emails.set(email.id, email);
    this.sendEmail(email);

    console.log(`📧 Thank you email sent to ${customerName}`);
  }

  // Generate thank you email HTML
  private generateThankYouEmailBody(customerName: string, driverName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
          h1 { color: #333; font-size: 28px; margin-bottom: 10px; }
          p { color: #666; line-height: 1.6; margin-bottom: 20px; }
          .emoji { font-size: 64px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">ShiftMyHome</div>
          <div class="emoji">🙏</div>
          <h1>Thank You!</h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for taking the time to share your experience with ${driverName}. Your feedback helps us maintain high standards and improve our service.</p>
          <p>We hope to help you with your next move!</p>
          <p style="margin-top: 40px; color: #999; font-size: 14px;">
            The ShiftMyHome Team
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // Notify driver about new review
  private notifyDriverAboutReview(driverId: string, review: CustomerReview): void {
    const starsEmoji = '⭐'.repeat(review.overallRating);
    
    jobStatusManager.addNotification(driverId, {
      id: `notif_${Date.now()}`,
      type: 'message',
      title: '⭐ New Review!',
      message: `${review.customerName} rated you ${starsEmoji} (${review.overallRating}/5)${review.tipAmount > 0 ? ` and tipped £${review.tipAmount.toFixed(2)}!` : ''}`,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: review.jobId,
    });

    // Send email to driver (optional)
    const email: EmailNotification = {
      id: `EMAIL${Date.now()}`,
      type: 'driver_rated',
      recipientEmail: `${driverId}@email.com`, // In production, fetch from driver profile
      recipientName: review.driverName,
      subject: `⭐ You received a ${review.overallRating}-star review!`,
      body: this.generateDriverReviewEmailBody(review),
      sentAt: new Date().toISOString(),
      reviewId: review.id,
    };

    this.emails.set(email.id, email);
    this.sendEmail(email);
  }

  // Generate driver review notification email
  private generateDriverReviewEmailBody(review: CustomerReview): string {
    const stars = '⭐'.repeat(review.overallRating);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; margin-bottom: 20px; }
          h1 { color: #333; font-size: 24px; margin-bottom: 10px; text-align: center; }
          .stars { font-size: 48px; text-align: center; margin: 20px 0; }
          .review-box { background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .tip { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">ShiftMyHome</div>
          <h1>You got a new review! 🎉</h1>
          
          <div class="stars">${stars}</div>
          
          <div class="review-box">
            <strong>From:</strong> ${review.customerName}<br>
            <strong>Job:</strong> ${review.jobReference}<br>
            <strong>Rating:</strong> ${review.overallRating}/5 stars<br>
            ${review.reviewText ? `<br><strong>Review:</strong><br>"${review.reviewText}"` : ''}
          </div>
          
          ${review.tipAmount > 0 ? `
          <div class="tip">
            <h2 style="margin: 0 0 10px 0;">💰 Tip Received!</h2>
            <p style="font-size: 32px; font-weight: bold; margin: 0;">£${review.tipAmount.toFixed(2)}</p>
          </div>
          ` : ''}
          
          <p style="text-align: center; color: #666; margin-top: 30px;">
            Keep up the great work!<br>
            The ShiftMyHome Team
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // Mock email sending (in production, use SendGrid/Mailgun/AWS SES)
  private sendEmail(email: EmailNotification): void {
    // MOCK: In production, integrate with email service
    console.log(`📧 Sending email: ${email.subject} to ${email.recipientEmail}`);
    
    // Simulate email service
    setTimeout(() => {
      email.opened = Math.random() > 0.3; // 70% open rate
      if (email.opened) {
        email.openedAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour later
        email.clicked = Math.random() > 0.5; // 50% click rate
        if (email.clicked) {
          email.clickedAt = new Date(Date.now() + 3700000).toISOString();
        }
      }
      this.emails.set(email.id, email);
    }, 1000);
  }

  // ==================== STATISTICS ====================

  // Get driver statistics
  getDriverStatistics(driverId: string): {
    averageRating: number;
    totalReviews: number;
    recommendationRate: number;
    totalTips: number;
    ratingBreakdown: Record<number, number>;
  } {
    const reviews = this.getDriverReviews(driverId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        recommendationRate: 0,
        totalTips: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
    const recommendCount = reviews.filter(r => r.wouldRecommend).length;
    const totalTips = reviews.reduce((sum, r) => sum + r.tipAmount, 0);
    
    const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      ratingBreakdown[r.overallRating]++;
    });

    return {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      recommendationRate: Math.round((recommendCount / reviews.length) * 100),
      totalTips,
      ratingBreakdown,
    };
  }

  // Get email statistics
  getEmailStatistics(): {
    totalSent: number;
    openRate: number;
    clickRate: number;
  } {
    const emails = Array.from(this.emails.values());
    const opened = emails.filter(e => e.opened).length;
    const clicked = emails.filter(e => e.clicked).length;

    return {
      totalSent: emails.length,
      openRate: emails.length > 0 ? Math.round((opened / emails.length) * 100) : 0,
      clickRate: emails.length > 0 ? Math.round((clicked / emails.length) * 100) : 0,
    };
  }
}

// Singleton instance
export const feedbackManager = new FeedbackManager();
