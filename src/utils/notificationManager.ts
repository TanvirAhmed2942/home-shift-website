/**
 * PUSH NOTIFICATION MANAGER
 * Web Push API integration for real-time notifications
 * Supports: Job updates, messages, driver alerts, customer notifications
 */

// ==================== TYPES ====================

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: any;
}

export type NotificationType =
  | 'job-assigned'
  | 'job-started'
  | 'job-completed'
  | 'driver-approaching'
  | 'driver-arrived'
  | 'payment-received'
  | 'new-message'
  | 'review-request'
  | 'booking-confirmed';

export interface NotificationTemplate {
  type: NotificationType;
  config: (data: any) => NotificationConfig;
}

// ==================== NOTIFICATION TEMPLATES ====================

const notificationTemplates: Record<NotificationType, (data: any) => NotificationConfig> = {
  'job-assigned': (data) => ({
    title: '🚚 New Job Assigned!',
    body: `Job ${data.reference} has been assigned to you. Pickup at ${data.pickupTime}.`,
    icon: '/icon-truck.png',
    tag: `job-${data.jobId}`,
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    data: { jobId: data.jobId, type: 'job-assigned' },
  }),

  'job-started': (data) => ({
    title: '📦 Job Started',
    body: `Driver ${data.driverName} has started your move. Track in real-time!`,
    icon: '/icon-box.png',
    tag: `job-${data.jobId}`,
    actions: [
      { action: 'track', title: 'Track Now' },
      { action: 'call', title: 'Call Driver' },
    ],
    data: { jobId: data.jobId, type: 'job-started' },
  }),

  'job-completed': (data) => ({
    title: '✅ Move Completed!',
    body: `Your move is complete! Total: £${data.amount}. Please rate your experience.`,
    icon: '/icon-check.png',
    tag: `job-${data.jobId}`,
    requireInteraction: true,
    actions: [
      { action: 'rate', title: 'Rate & Tip' },
      { action: 'dismiss', title: 'Later' },
    ],
    data: { jobId: data.jobId, type: 'job-completed' },
  }),

  'driver-approaching': (data) => ({
    title: '🚗 Driver Approaching',
    body: `${data.driverName} will arrive in ${data.eta} minutes!`,
    icon: '/icon-location.png',
    tag: `driver-${data.driverId}`,
    requireInteraction: false,
    actions: [
      { action: 'track', title: 'Track' },
    ],
    data: { jobId: data.jobId, driverId: data.driverId, type: 'driver-approaching' },
  }),

  'driver-arrived': (data) => ({
    title: '📍 Driver Has Arrived',
    body: `${data.driverName} is here! Vehicle: ${data.vehicle}`,
    icon: '/icon-arrived.png',
    tag: `driver-${data.driverId}`,
    requireInteraction: true,
    data: { jobId: data.jobId, driverId: data.driverId, type: 'driver-arrived' },
  }),

  'payment-received': (data) => ({
    title: '💰 Payment Received',
    body: `You earned £${data.amount} for job ${data.reference}. ${data.breakdown}`,
    icon: '/icon-money.png',
    tag: `payment-${data.paymentId}`,
    data: { paymentId: data.paymentId, type: 'payment-received' },
  }),

  'new-message': (data) => ({
    title: `💬 ${data.senderName}`,
    body: data.message,
    icon: data.senderAvatar || '/icon-message.png',
    tag: `message-${data.conversationId}`,
    actions: [
      { action: 'reply', title: 'Reply' },
      { action: 'view', title: 'View' },
    ],
    data: { conversationId: data.conversationId, type: 'new-message' },
  }),

  'review-request': (data) => ({
    title: '⭐ How was your move?',
    body: `Please rate your experience with ${data.driverName}`,
    icon: '/icon-star.png',
    tag: `review-${data.jobId}`,
    requireInteraction: true,
    actions: [
      { action: 'rate', title: 'Rate Now' },
      { action: 'later', title: 'Maybe Later' },
    ],
    data: { jobId: data.jobId, type: 'review-request' },
  }),

  'booking-confirmed': (data) => ({
    title: '✨ Booking Confirmed!',
    body: `Your move is scheduled for ${data.date} at ${data.time}. Ref: ${data.reference}`,
    icon: '/icon-calendar.png',
    tag: `booking-${data.bookingId}`,
    requireInteraction: false,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'calendar', title: 'Add to Calendar' },
    ],
    data: { bookingId: data.bookingId, type: 'booking-confirmed' },
  }),
};

// ==================== NOTIFICATION MANAGER ====================

class NotificationManager {
  private permission: NotificationPermission = 'default';
  private listeners: Array<(notification: NotificationConfig) => void> = [];

  constructor() {
    this.init();
  }

  // ==================== INITIALIZATION ====================

  private async init() {
    if (!('Notification' in window)) {
      console.warn('[Notifications] Not supported in this browser');
      return;
    }

    this.permission = Notification.permission;

    // Unregister any existing service workers (cleanup)
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
        if (registrations.length > 0) {
          console.log('[Notifications] ✅ Cleaned up old service workers');
        }
      } catch (error) {
        // Silently ignore cleanup errors (security restrictions, etc.)
      }
    }

    // Using Web Notification API (no service worker needed)
    console.log('[Notifications] ✅ Ready - using Web Notification API');
  }

  // ==================== REQUEST PERMISSION ====================

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[Notifications] Not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('[Notifications] Permission:', this.permission);
      return this.permission === 'granted';
    } catch (error) {
      console.error('[Notifications] Permission request failed:', error);
      return false;
    }
  }

  // ==================== SHOW NOTIFICATION ====================

  async show(type: NotificationType, data: any): Promise<void> {
    // Check permission
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('[Notifications] Permission denied');
        return;
      }
    }

    // Get template
    const template = notificationTemplates[type];
    if (!template) {
      console.error('[Notifications] Unknown type:', type);
      return;
    }

    const config = template(data);

    // Use Web Notification API (works without service worker)
    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/logo.png',
        tag: config.tag,
        requireInteraction: config.requireInteraction || false,
        data: config.data,
      });

      // Handle click
      notification.onclick = () => {
        this.handleNotificationClick(config.data);
        notification.close();
      };

      // Auto-close after 10 seconds if not required interaction
      if (!config.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }
    } catch (error) {
      console.error('[Notifications] Failed to show notification:', error);
    }

    // Notify listeners (for in-app notification center)
    this.notifyListeners(config);

    console.log('[Notifications] Shown:', type, data);
  }

  // ==================== NOTIFICATION HANDLERS ====================

  private handleNotificationClick(data: any) {
    console.log('[Notifications] Clicked:', data);

    // Handle different notification types
    switch (data.type) {
      case 'job-assigned':
      case 'job-started':
        // Navigate to job details
        window.location.hash = `#/driver/job/${data.jobId}`;
        break;

      case 'job-completed':
      case 'review-request':
        // Navigate to feedback page
        window.location.hash = `#/feedback/${data.jobId}`;
        break;

      case 'driver-approaching':
      case 'driver-arrived':
        // Navigate to tracking page
        window.location.hash = `#/tracking/${data.jobId}`;
        break;

      case 'new-message':
        // Navigate to messages
        window.location.hash = `#/messaging`;
        break;

      case 'payment-received':
        // Navigate to payments
        window.location.hash = `#/payments`;
        break;

      case 'booking-confirmed':
        // Navigate to customer dashboard
        window.location.hash = `#/customer`;
        break;
    }

    // Focus window
    if (window.focus) {
      window.focus();
    }
  }

  // ==================== PRESET NOTIFICATIONS ====================

  async notifyJobAssigned(jobId: string, reference: string, pickupTime: string) {
    await this.show('job-assigned', { jobId, reference, pickupTime });
  }

  async notifyJobStarted(jobId: string, driverName: string) {
    await this.show('job-started', { jobId, driverName });
  }

  async notifyJobCompleted(jobId: string, amount: number) {
    await this.show('job-completed', { jobId, amount });
  }

  async notifyDriverApproaching(jobId: string, driverId: string, driverName: string, eta: number) {
    await this.show('driver-approaching', { jobId, driverId, driverName, eta });
  }

  async notifyDriverArrived(jobId: string, driverId: string, driverName: string, vehicle: string) {
    await this.show('driver-arrived', { jobId, driverId, driverName, vehicle });
  }

  async notifyPaymentReceived(paymentId: string, amount: number, reference: string, breakdown: string) {
    await this.show('payment-received', { paymentId, amount, reference, breakdown });
  }

  async notifyNewMessage(conversationId: string, senderName: string, message: string, senderAvatar?: string) {
    await this.show('new-message', { conversationId, senderName, message, senderAvatar });
  }

  async notifyReviewRequest(jobId: string, driverName: string) {
    await this.show('review-request', { jobId, driverName });
  }

  async notifyBookingConfirmed(bookingId: string, reference: string, date: string, time: string) {
    await this.show('booking-confirmed', { bookingId, reference, date, time });
  }

  // ==================== SUBSCRIBE TO PUSH (Disabled - Service Worker not available) ====================

  async subscribeToPush(): Promise<null> {
    console.log('[Notifications] Push subscriptions require a service worker (not available in this environment)');
    console.log('[Notifications] Using Web Notification API instead');
    return null;
  }

  // ==================== UNSUBSCRIBE (Disabled - Service Worker not available) ====================

  async unsubscribe(): Promise<boolean> {
    console.log('[Notifications] Push subscriptions not active');
    return false;
  }

  // ==================== LISTENERS ====================

  onNotification(callback: (notification: NotificationConfig) => void): () => void {
    this.listeners.push(callback);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(notification: NotificationConfig) {
    this.listeners.forEach(listener => listener(notification));
  }

  // ==================== UTILS ====================

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  hasPermission(): boolean {
    return this.permission === 'granted';
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }

  // ==================== CLEAR ALL ====================

  async clearAll(): Promise<void> {
    // Web Notification API doesn't support getting all notifications
    // Notifications are automatically cleared when clicked or after timeout
    console.log('[Notifications] Clear all (notifications auto-clear on click/timeout)');
  }
}

// ==================== SINGLETON INSTANCE ====================

export const notificationManager = new NotificationManager();

// ==================== IN-APP NOTIFICATION SYSTEM ====================

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

class InAppNotificationManager {
  private notifications: InAppNotification[] = [];
  private listeners: Array<(notifications: InAppNotification[]) => void> = [];

  // Add notification
  add(type: NotificationType, title: string, message: string, data?: any): string {
    const notification: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      data,
    };

    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();
    
    return notification.id;
  }

  // Get all notifications
  getAll(): InAppNotification[] {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Delete notification
  delete(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all
  clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Subscribe
  subscribe(callback: (notifications: InAppNotification[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.notifications); // Initial call

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

export const inAppNotificationManager = new InAppNotificationManager();