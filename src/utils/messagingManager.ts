/**
 * In-App Messaging System
 * Real-time chat between customers and drivers
 */

import { jobStatusManager } from './jobStatusManager';

export interface Message {
  id: string;
  conversationId: string; // jobId
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver' | 'admin';
  recipientId: string;
  recipientName: string;
  content: string;
  type: 'text' | 'quick_message' | 'photo' | 'location';
  photoUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: string;
  read: boolean;
  readAt?: string;
}

export interface Conversation {
  id: string; // Same as jobId
  jobId: string;
  jobReference: string;
  customerId: string;
  customerName: string;
  driverId: string;
  driverName: string;
  lastMessage?: Message;
  unreadCount: number; // For current user
  createdAt: string;
  updatedAt: string;
}

export interface QuickMessage {
  id: string;
  text: string;
  category: 'eta' | 'delay' | 'arrival' | 'parking' | 'completion' | 'other';
}

class MessagingManager {
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map(); // conversationId -> messages

  // Pre-defined quick messages
  private quickMessages: QuickMessage[] = [
    { id: 'qm1', text: "I'm on my way!", category: 'eta' },
    { id: 'qm2', text: "I'll be there in 10 minutes", category: 'eta' },
    { id: 'qm3', text: "I'll be there in 20 minutes", category: 'eta' },
    { id: 'qm4', text: "Running 15 minutes late due to traffic", category: 'delay' },
    { id: 'qm5', text: "I'm stuck in traffic, will update soon", category: 'delay' },
    { id: 'qm6', text: "I've arrived at the pickup location", category: 'arrival' },
    { id: 'qm7', text: "I'm at the delivery location", category: 'arrival' },
    { id: 'qm8', text: "Where should I park?", category: 'parking' },
    { id: 'qm9', text: "I'm parked outside, ready when you are", category: 'parking' },
    { id: 'qm10', text: "All items loaded, heading to delivery", category: 'completion' },
    { id: 'qm11', text: "Delivery complete! Please check everything", category: 'completion' },
  ];

  // ==================== CONVERSATION MANAGEMENT ====================

  // Create conversation (when job is assigned/accepted)
  createConversation(jobId: string): Conversation | null {
    const job = jobStatusManager.getJob(jobId);
    if (!job || !job.driverId) return null;

    const conversation: Conversation = {
      id: jobId,
      jobId: jobId,
      jobReference: job.reference,
      customerId: job.customerId || '',
      customerName: job.customerName,
      driverId: job.driverId,
      driverName: job.driverName || '',
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.set(jobId, conversation);
    this.messages.set(jobId, []);
    return conversation;
  }

  // Get conversation
  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  // Get all conversations for user
  getUserConversations(userId: string, role: 'customer' | 'driver'): Conversation[] {
    return Array.from(this.conversations.values()).filter(conv => {
      if (role === 'customer') return conv.customerId === userId;
      if (role === 'driver') return conv.driverId === userId;
      return false;
    });
  }

  // ==================== MESSAGE MANAGEMENT ====================

  // Send message
  sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'customer' | 'driver' | 'admin',
    content: string,
    type: 'text' | 'quick_message' | 'photo' | 'location' = 'text',
    extraData?: {
      photoUrl?: string;
      location?: { lat: number; lng: number; address?: string };
    }
  ): Message | null {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    // Determine recipient
    const recipientId = senderRole === 'customer' ? conversation.driverId : conversation.customerId;
    const recipientName = senderRole === 'customer' ? conversation.driverName : conversation.customerName;

    const message: Message = {
      id: `MSG${Date.now()}_${Math.random().toString(36).substring(7)}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      recipientId,
      recipientName,
      content,
      type,
      photoUrl: extraData?.photoUrl,
      location: extraData?.location,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Add to messages
    const messages = this.messages.get(conversationId) || [];
    messages.push(message);
    this.messages.set(conversationId, messages);

    // Update conversation
    conversation.lastMessage = message;
    conversation.updatedAt = new Date().toISOString();
    this.conversations.set(conversationId, conversation);

    // Send notification to recipient
    this.notifyRecipient(message);

    return message;
  }

  // Send quick message
  sendQuickMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'customer' | 'driver',
    quickMessageId: string
  ): Message | null {
    const quickMessage = this.quickMessages.find(qm => qm.id === quickMessageId);
    if (!quickMessage) return null;

    return this.sendMessage(
      conversationId,
      senderId,
      senderName,
      senderRole,
      quickMessage.text,
      'quick_message'
    );
  }

  // Send photo message
  sendPhotoMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'customer' | 'driver',
    photoUrl: string,
    caption?: string
  ): Message | null {
    return this.sendMessage(
      conversationId,
      senderId,
      senderName,
      senderRole,
      caption || 'Photo',
      'photo',
      { photoUrl }
    );
  }

  // Send location message
  sendLocationMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'customer' | 'driver',
    location: { lat: number; lng: number; address?: string }
  ): Message | null {
    return this.sendMessage(
      conversationId,
      senderId,
      senderName,
      senderRole,
      'Shared location',
      'location',
      { location }
    );
  }

  // Get messages for conversation
  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  // Mark message as read
  markMessageAsRead(messageId: string): boolean {
    for (const [conversationId, messages] of this.messages.entries()) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.read = true;
        message.readAt = new Date().toISOString();
        this.messages.set(conversationId, messages);
        return true;
      }
    }
    return false;
  }

  // Mark all messages in conversation as read
  markConversationAsRead(conversationId: string, userId: string): boolean {
    const messages = this.messages.get(conversationId);
    if (!messages) return false;

    messages.forEach(msg => {
      if (msg.recipientId === userId && !msg.read) {
        msg.read = true;
        msg.readAt = new Date().toISOString();
      }
    });

    this.messages.set(conversationId, messages);

    // Update conversation unread count
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.conversations.set(conversationId, conversation);
    }

    return true;
  }

  // Get unread count for conversation
  getUnreadCount(conversationId: string, userId: string): number {
    const messages = this.messages.get(conversationId) || [];
    return messages.filter(m => m.recipientId === userId && !m.read).length;
  }

  // Get total unread messages for user
  getTotalUnreadMessages(userId: string, role: 'customer' | 'driver'): number {
    const conversations = this.getUserConversations(userId, role);
    return conversations.reduce((sum, conv) => {
      return sum + this.getUnreadCount(conv.id, userId);
    }, 0);
  }

  // ==================== QUICK MESSAGES ====================

  getQuickMessages(category?: string): QuickMessage[] {
    if (category) {
      return this.quickMessages.filter(qm => qm.category === category);
    }
    return this.quickMessages;
  }

  // ==================== CALL MASKING (Privacy) ====================

  // Generate masked phone number for privacy
  getMaskedPhoneNumber(userId: string, role: 'customer' | 'driver'): string {
    // MOCK: In production, use Twilio or similar service to generate a proxy number
    // This would allow customer and driver to call each other without revealing real numbers
    const masked = `+44 7700 XXX ${userId.slice(-3)}`;
    return masked;
  }

  // ==================== NOTIFICATIONS ====================

  private notifyRecipient(message: Message): void {
    const conversation = this.conversations.get(message.conversationId);
    if (!conversation) return;

    const job = jobStatusManager.getJob(conversation.jobId);
    if (!job) return;

    // Determine notification type based on message type
    let title = 'New Message';
    let notificationMessage = message.content;

    if (message.type === 'quick_message') {
      title = `${message.senderName} sent a quick message`;
    } else if (message.type === 'photo') {
      title = `${message.senderName} sent a photo`;
      notificationMessage = message.content || 'Photo';
    } else if (message.type === 'location') {
      title = `${message.senderName} shared their location`;
      notificationMessage = 'View location on map';
    } else {
      title = `${message.senderName}`;
    }

    // Notify recipient
    jobStatusManager.addNotification(message.recipientId, {
      id: `notif_${Date.now()}`,
      type: 'message',
      title,
      message: notificationMessage,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: conversation.jobId,
      actionUrl: `/messages/${conversation.id}`,
    });

    // In production, also send:
    // - Push notification (if enabled)
    // - SMS notification (if critical)
    // - Email notification (if user is offline for >30 min)
  }

  // ==================== TYPING INDICATORS (Real-time) ====================

  private typingUsers: Map<string, Set<string>> = new Map(); // conversationId -> Set of userIds typing

  setTyping(conversationId: string, userId: string, isTyping: boolean): void {
    if (!this.typingUsers.has(conversationId)) {
      this.typingUsers.set(conversationId, new Set());
    }

    const typing = this.typingUsers.get(conversationId)!;
    if (isTyping) {
      typing.add(userId);
    } else {
      typing.delete(userId);
    }

    // In production, emit WebSocket event to other users in conversation
  }

  getTypingUsers(conversationId: string): string[] {
    return Array.from(this.typingUsers.get(conversationId) || []);
  }
}

// Singleton instance
export const messagingManager = new MessagingManager();
