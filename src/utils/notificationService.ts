/**
 * Complete Notification Service
 * Handles Email, SMS, Push, and In-App notifications
 */

import { Job } from './jobStatusManager';
import { inAppNotificationManager } from './notificationManager';

export type NotificationType = 
  | 'driver_assigned'
  | 'driver_started'
  | 'driver_arrived_pickup'
  | 'items_loaded'
  | 'driver_on_route'
  | 'driver_arrived_delivery'
  | 'job_completed'
  | 'payment_received'
  | 'tip_received';

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class NotificationService {
  // Removed internal Map, delegating to inAppNotificationManager

  // ============================================
  // MAIN NOTIFICATION DISPATCHER
  // ============================================
  
  sendJobNotification(job: Job, type: NotificationType): void {
    console.log(`🔔 Sending ${type} notification for job ${job.id}`);
    
    const notification = this.createNotification(job, type);
    
    // Send via all channels
    this.sendEmailNotification(job, notification);
    this.sendSMSNotification(job, notification);
    this.sendPushNotification(notification);
    this.addInAppNotification(job.customerId, notification);
    
    // Log for tracking
    this.logNotification(job, notification);
  }

  // ============================================
  // NOTIFICATION CREATORS
  // ============================================
  
  private createNotification(job: Job, type: NotificationType): NotificationMessage {
    const templates = this.getNotificationTemplates(job);
    const template = templates[type];
    
    return {
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: template.title,
      message: template.message,
      timestamp: new Date(),
      read: false,
      actionUrl: template.actionUrl,
      actionLabel: template.actionLabel,
      icon: template.icon,
      priority: template.priority,
    };
  }

  private getNotificationTemplates(job: Job): Record<NotificationType, any> {
    const trackingUrl = `/#/tracking/${job.id}`;
    const dashboardUrl = '/#/dashboard';
    
    return {
      driver_assigned: {
        title: '🚗 Driver Assigned!',
        message: `${job.driverName} has been assigned to your ${job.service}. They will contact you soon.`,
        icon: '🚗',
        priority: 'high' as const,
        actionUrl: dashboardUrl,
        actionLabel: 'View Details',
      },
      
      driver_started: {
        title: '🚀 Driver On The Way!',
        message: `${job.driverName} is on the way to collect your items from ${job.pickup.postcode}. ETA: 25 minutes.`,
        icon: '🚀',
        priority: 'urgent' as const,
        actionUrl: trackingUrl,
        actionLabel: 'Track Live',
      },
      
      driver_arrived_pickup: {
        title: '📍 Driver Arrived at Pickup',
        message: `${job.driverName} has arrived at ${job.pickup.address}. Please meet them to start loading.`,
        icon: '📍',
        priority: 'urgent' as const,
        actionUrl: trackingUrl,
        actionLabel: 'Track Live',
      },
      
      items_loaded: {
        title: '📦 Items Loaded Successfully',
        message: `All items have been loaded. ${job.driverName} is now heading to ${job.delivery.postcode}.`,
        icon: '📦',
        priority: 'high' as const,
        actionUrl: trackingUrl,
        actionLabel: 'Track Live',
      },
      
      driver_on_route: {
        title: '🛣️ On Route to Delivery',
        message: `Your items are on the way to ${job.delivery.address}. ETA: 35 minutes.`,
        icon: '🛣️',
        priority: 'medium' as const,
        actionUrl: trackingUrl,
        actionLabel: 'Track Live',
      },
      
      driver_arrived_delivery: {
        title: '🎯 Driver Arrived at Delivery Location',
        message: `${job.driverName} has arrived at ${job.delivery.address}. Unloading will begin shortly.`,
        icon: '🎯',
        priority: 'urgent' as const,
        actionUrl: trackingUrl,
        actionLabel: 'Track Live',
      },
      
      job_completed: {
        title: '✅ Job Completed!',
        message: `Your ${job.service} has been completed successfully. Thank you for choosing ShiftMyHome!`,
        icon: '✅',
        priority: 'high' as const,
        actionUrl: dashboardUrl,
        actionLabel: 'Rate Experience',
      },
      
      payment_received: {
        title: '💳 Payment Received',
        message: `Payment of £${job.customerPrice.toFixed(2)} has been processed successfully. Invoice sent to your email.`,
        icon: '💳',
        priority: 'medium' as const,
        actionUrl: dashboardUrl,
        actionLabel: 'View Invoice',
      },
      
      tip_received: {
        title: '💰 Tip Received',
        message: `Thank you for your generous tip! Your driver ${job.driverName} has been notified.`,
        icon: '💰',
        priority: 'low' as const,
        actionUrl: dashboardUrl,
        actionLabel: 'View Details',
      },
    };
  }

  // ============================================
  // EMAIL NOTIFICATIONS
  // ============================================
  
  private sendEmailNotification(job: Job, notification: NotificationMessage): void {
    const email = {
      to: job.customerEmail,
      subject: notification.title,
      body: this.getEmailBody(job, notification),
    };
    
    console.log('📧 Email Notification:', email.subject);
    this.mockSendEmail(email);
  }

  private getEmailBody(job: Job, notification: NotificationMessage): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { 
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
      color: white; 
      padding: 30px; 
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .icon { font-size: 48px; margin-bottom: 10px; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
    .message { font-size: 16px; margin: 20px 0; padding: 20px; background: #f3f4f6; border-radius: 8px; }
    .cta-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: bold; 
      margin: 20px 0;
      text-align: center;
    }
    .job-details { 
      background: #f9fafb; 
      border-left: 4px solid #3b82f6; 
      padding: 15px; 
      margin: 20px 0; 
      
    }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    .tracking-link { 
      display: block; 
      margin: 20px 0; 
      padding: 15px; 
      background: #dbeafe; 
      border-radius: 8px; 
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">${notification.icon}</div>
      <h1 style="margin: 0;">${notification.title}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Job Reference: ${job.id}</p>
    </div>
    
    <div class="content">
      <p>Hi ${job.customerName},</p>
      
      <div class="message">
        ${notification.message}
      </div>
      
      <div class="job-details">
        <h3 style="margin-top: 0; color: #1f2937;">📋 Job Details</h3>
        <p><strong>Service:</strong> ${job.service}</p>
        <p><strong>Reference:</strong> ${job.id}</p>
        <p><strong>From:</strong> ${job.pickup.address}, ${job.pickup.postcode}</p>
        <p><strong>To:</strong> ${job.delivery.address}, ${job.delivery.postcode}</p>
        ${job.driverName ? `<p><strong>Driver:</strong> ${job.driverName} | ${job.driverPhone}</p>` : ''}
      </div>
      
      ${notification.type === 'driver_started' || notification.type === 'driver_on_route' ? `
        <div class="tracking-link">
          <h3 style="margin-top: 0; color: #1e40af;">📍 Track Your Driver Live</h3>
          <p style="margin: 10px 0;">Click below to see real-time location and ETA</p>
          <a href="${notification.actionUrl}" class="cta-button">
            🗺️ Track Live Now
          </a>
        </div>
      ` : ''}
      
      ${notification.actionUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${notification.actionUrl}" class="cta-button">
            ${notification.actionLabel || 'View Details'}
          </a>
        </div>
      ` : ''}
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        ${this.getContextualMessage(notification.type, job)}
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p>Questions? We're here to help:</p>
      <p>
        📞 <strong>Phone:</strong> +44 1234 567 890<br>
        📧 <strong>Email:</strong> support@shiftmyhome.com<br>
        💬 <strong>Live Chat:</strong> Available on our website
      </p>
    </div>
    
    <div class="footer">
      <p><strong>ShiftMyHome</strong> - Making moves easier</p>
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p style="margin-top: 10px;">
        <a href="#" style="color: #6b7280; margin: 0 10px;">Unsubscribe</a> | 
        <a href="#" style="color: #6b7280; margin: 0 10px;">Preferences</a> | 
        <a href="#" style="color: #6b7280; margin: 0 10px;">Help</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private getContextualMessage(type: NotificationType, job: Job): string {
    const messages: Record<NotificationType, string> = {
      driver_assigned: `Your driver will contact you within the next 2 hours to confirm pickup details.`,
      driver_started: `Please ensure someone is available at ${job.pickup.address} to meet the driver.`,
      driver_arrived_pickup: `Your driver is waiting. Please proceed to the pickup location immediately.`,
      items_loaded: `All items have been secured and are being transported safely.`,
      driver_on_route: `Your items are being handled with care during transport.`,
      driver_arrived_delivery: `Please ensure someone is available to receive the delivery.`,
      job_completed: `We'd love to hear your feedback! Please rate your experience and leave a tip if you were satisfied.`,
      payment_received: `Your invoice has been sent to ${job.customerEmail}. Thank you for your payment.`,
      tip_received: `Your driver has been notified and is very grateful for your generosity!`,
    };
    
    return messages[type] || 'Thank you for choosing ShiftMyHome!';
  }

  // ============================================
  // SMS NOTIFICATIONS
  // ============================================
  
  private sendSMSNotification(job: Job, notification: NotificationMessage): void {
    const sms = {
      to: job.customerPhone,
      message: this.getSMSText(job, notification),
    };
    
    console.log('📱 SMS Notification:', sms.message);
    this.mockSendSMS(sms);
  }

  private getSMSText(job: Job, notification: NotificationMessage): string {
    const baseUrl = 'https://shiftmyhome.com';
    const trackUrl = notification.actionUrl ? `${baseUrl}${notification.actionUrl}` : '';
    
    const templates: Record<NotificationType, string> = {
      driver_assigned: `ShiftMyHome: ${job.driverName} assigned to your ${job.service} (${job.id}). They'll contact you soon.`,
      
      driver_started: `ShiftMyHome: ${job.driverName} is on the way to ${job.pickup.postcode}! Track live: ${trackUrl}`,
      
      driver_arrived_pickup: `ShiftMyHome: ${job.driverName} has arrived at ${job.pickup.address}. Please meet them now.`,
      
      items_loaded: `ShiftMyHome: Items loaded! Now heading to ${job.delivery.postcode}. Track: ${trackUrl}`,
      
      driver_on_route: `ShiftMyHome: Your items are on route to ${job.delivery.postcode}. ETA: 35 mins. Track: ${trackUrl}`,
      
      driver_arrived_delivery: `ShiftMyHome: ${job.driverName} arrived at delivery location. Please be ready to receive.`,
      
      job_completed: `ShiftMyHome: Job completed! Rate your experience: ${trackUrl}`,
      
      payment_received: `ShiftMyHome: Payment of £${job.customerPrice.toFixed(2)} received. Invoice sent to your email.`,
      
      tip_received: `ShiftMyHome: Thank you for your tip! ${job.driverName} has been notified.`,
    };
    
    return templates[notification.type] || `ShiftMyHome: ${notification.message}`;
  }

  // ============================================
  // PUSH NOTIFICATIONS
  // ============================================
  
  private sendPushNotification(notification: NotificationMessage): void {
    console.log('🔔 Push Notification:', notification.title);
    
    // Check if browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        this.showBrowserNotification(notification);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            this.showBrowserNotification(notification);
          }
        });
      }
    }
  }

  private showBrowserNotification(notification: NotificationMessage): void {
    const browserNotif = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
      vibrate: notification.priority === 'urgent' ? [200, 100, 200] : undefined,
    });

    browserNotif.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      browserNotif.close();
    };
  }

  // ============================================
  // IN-APP NOTIFICATIONS (Delegated)
  // ============================================
  
  private addInAppNotification(userId: string, notification: NotificationMessage): void {
    // Map NotificationMessage to InAppNotification format implicitly
    // We only need type, title, message, data
    inAppNotificationManager.add(
      notification.type as any, // Cast to any as types might differ slightly
      notification.title,
      notification.message,
      {
        jobId: userId, // Assuming userId is relevant context or job related
        originalNotifId: notification.id,
        actionUrl: notification.actionUrl
      }
    );
    
    console.log(`📬 In-App Notification delegated for user ${userId}`);
  }

  // Old methods kept for compatibility but redirecting to new manager
  getInAppNotifications(userId: string): NotificationMessage[] {
    // This is a partial shim. Real implementation would filter by user if manager supported it.
    // For now, we return all local notifications.
    const notifs = inAppNotificationManager.getAll();
    return notifs.map(n => ({
      id: n.id,
      type: n.type as NotificationType,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      read: n.read,
      actionUrl: n.data?.actionUrl,
      priority: 'medium'
    }));
  }

  markAsRead(userId: string, notificationId: string): void {
    inAppNotificationManager.markAsRead(notificationId);
  }

  markAllAsRead(userId: string): void {
    inAppNotificationManager.markAllAsRead();
  }

  getUnreadCount(userId: string): number {
    return inAppNotificationManager.getUnreadCount();
  }

  // ============================================
  // MOCK SERVICES (Production: use real APIs)
  // ============================================
  
  private mockSendEmail(email: { to: string; subject: string; body: string }): void {
    console.log('✅ Email sent successfully!');
    console.log(`   To: ${email.to}`);
    console.log(`   Subject: ${email.subject}`);
  }

  private mockSendSMS(sms: { to: string; message: string }): void {
    console.log('✅ SMS sent successfully!');
    console.log(`   To: ${sms.to}`);
    console.log(`   Message: ${sms.message}`);
  }

  private logNotification(job: Job, notification: NotificationMessage): void {
    console.log('📊 Notification Log:', {
      jobId: job.id,
      customerId: job.customerId,
      type: notification.type,
      priority: notification.priority,
      timestamp: notification.timestamp,
    });
  }
}

// Singleton instance
export const notificationService = new NotificationService();