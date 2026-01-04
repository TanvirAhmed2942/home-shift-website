/**
 * Dispute Resolution System
 * Handles dispute filing, admin mediation, evidence upload, and automatic refunds
 */

export interface Dispute {
  id: string;
  disputeNumber: string;
  jobReference: string;
  
  // Parties involved
  reportedBy: 'customer' | 'driver';
  reporterId: string;
  reporterName: string;
  respondentId: string;
  respondentName: string;
  
  // Dispute details
  category: 'pricing' | 'service_quality' | 'damage' | 'no_show' | 'late_arrival' | 'behavior' | 'other';
  subject: string;
  description: string;
  
  // Evidence
  evidence: {
    photos: string[];
    documents: string[];
    messages: string[];
    videos?: string[];
  };
  
  // Financial
  disputedAmount?: number;
  requestedRefund?: number;
  approvedRefund?: number;
  
  // Status & Priority
  status: 'submitted' | 'under_review' | 'mediation' | 'resolved' | 'escalated' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Resolution
  mediatorId?: string;
  mediatorName?: string;
  mediatorNotes?: string;
  resolution?: string;
  resolutionDate?: Date;
  
  // Refund processing
  refundStatus?: 'pending' | 'processing' | 'completed' | 'rejected';
  refundDate?: Date;
  refundTransactionId?: string;
  
  // Timeline
  timeline: DisputeEvent[];
  
  // Metadata
  submittedDate: Date;
  updatedAt: Date;
  closedDate?: Date;
}

export interface DisputeEvent {
  id: string;
  timestamp: Date;
  type: 'submitted' | 'reviewed' | 'evidence_added' | 'mediation_started' | 'message_sent' | 'resolved' | 'refund_processed';
  userId: string;
  userName: string;
  description: string;
  details?: any;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver' | 'admin';
  message: string;
  attachments?: string[];
  timestamp: Date;
  read: boolean;
}

/**
 * Generate dispute number
 */
export function generateDisputeNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `DIS-${year}${month}-${random}`;
}

/**
 * Create a new dispute
 */
export function createDispute(data: {
  jobReference: string;
  reportedBy: Dispute['reportedBy'];
  reporterId: string;
  reporterName: string;
  respondentId: string;
  respondentName: string;
  category: Dispute['category'];
  subject: string;
  description: string;
  disputedAmount?: number;
  requestedRefund?: number;
  evidence?: Dispute['evidence'];
}): Dispute {
  const disputeNumber = generateDisputeNumber();
  
  const dispute: Dispute = {
    id: `dispute-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    disputeNumber,
    jobReference: data.jobReference,
    reportedBy: data.reportedBy,
    reporterId: data.reporterId,
    reporterName: data.reporterName,
    respondentId: data.respondentId,
    respondentName: data.respondentName,
    category: data.category,
    subject: data.subject,
    description: data.description,
    evidence: data.evidence || { photos: [], documents: [], messages: [] },
    disputedAmount: data.disputedAmount,
    requestedRefund: data.requestedRefund,
    status: 'submitted',
    priority: data.requestedRefund && data.requestedRefund > 100 ? 'high' : 'medium',
    timeline: [
      {
        id: `event-${Date.now()}`,
        timestamp: new Date(),
        type: 'submitted',
        userId: data.reporterId,
        userName: data.reporterName,
        description: `Dispute submitted by ${data.reporterName}`,
      },
    ],
    submittedDate: new Date(),
    updatedAt: new Date(),
  };
  
  saveDispute(dispute);
  
  // Send notification to respondent
  notifyDisputeParty(dispute, 'respondent');
  
  return dispute;
}

/**
 * Save dispute
 */
export function saveDispute(dispute: Dispute): void {
  const disputes = getAllDisputes();
  const index = disputes.findIndex(d => d.id === dispute.id);
  
  if (index >= 0) {
    disputes[index] = dispute;
  } else {
    disputes.push(dispute);
  }
  
  localStorage.setItem('disputes', JSON.stringify(disputes));
}

/**
 * Get all disputes
 */
export function getAllDisputes(): Dispute[] {
  const stored = localStorage.getItem('disputes');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get dispute by ID
 */
export function getDisputeById(id: string): Dispute | null {
  const disputes = getAllDisputes();
  return disputes.find(d => d.id === id) || null;
}

/**
 * Get disputes for a user
 */
export function getUserDisputes(userId: string): Dispute[] {
  const disputes = getAllDisputes();
  return disputes.filter(d => d.reporterId === userId || d.respondentId === userId);
}

/**
 * Update dispute status
 */
export function updateDisputeStatus(
  disputeId: string,
  status: Dispute['status'],
  userId: string,
  userName: string,
  notes?: string
): void {
  const dispute = getDisputeById(disputeId);
  
  if (dispute) {
    dispute.status = status;
    dispute.updatedAt = new Date();
    
    if (status === 'resolved' || status === 'closed') {
      dispute.resolutionDate = new Date();
      dispute.closedDate = new Date();
    }
    
    // Add timeline event
    dispute.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'reviewed',
      userId,
      userName,
      description: `Status changed to ${status}${notes ? ': ' + notes : ''}`,
    });
    
    saveDispute(dispute);
  }
}

/**
 * Assign mediator to dispute
 */
export function assignMediator(
  disputeId: string,
  mediatorId: string,
  mediatorName: string
): void {
  const dispute = getDisputeById(disputeId);
  
  if (dispute) {
    dispute.mediatorId = mediatorId;
    dispute.mediatorName = mediatorName;
    dispute.status = 'mediation';
    dispute.updatedAt = new Date();
    
    dispute.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'mediation_started',
      userId: mediatorId,
      userName: mediatorName,
      description: `${mediatorName} assigned as mediator`,
    });
    
    saveDispute(dispute);
    
    // Notify both parties
    notifyDisputeParty(dispute, 'both');
  }
}

/**
 * Add evidence to dispute
 */
export function addDisputeEvidence(
  disputeId: string,
  userId: string,
  userName: string,
  evidenceType: 'photos' | 'documents' | 'messages' | 'videos',
  evidenceData: string[]
): void {
  const dispute = getDisputeById(disputeId);
  
  if (dispute) {
    dispute.evidence[evidenceType].push(...evidenceData);
    dispute.updatedAt = new Date();
    
    dispute.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'evidence_added',
      userId,
      userName,
      description: `${userName} added ${evidenceData.length} ${evidenceType}`,
    });
    
    saveDispute(dispute);
  }
}

/**
 * Resolve dispute
 */
export function resolveDispute(
  disputeId: string,
  mediatorId: string,
  mediatorName: string,
  resolution: string,
  approvedRefund?: number
): void {
  const dispute = getDisputeById(disputeId);
  
  if (dispute) {
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolutionDate = new Date();
    dispute.approvedRefund = approvedRefund;
    dispute.updatedAt = new Date();
    dispute.mediatorNotes = resolution;
    
    dispute.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'resolved',
      userId: mediatorId,
      userName: mediatorName,
      description: `Dispute resolved by ${mediatorName}`,
      details: { resolution, approvedRefund },
    });
    
    saveDispute(dispute);
    
    // Process refund if approved
    if (approvedRefund && approvedRefund > 0) {
      processDisputeRefund(disputeId, approvedRefund);
    }
    
    // Notify both parties
    notifyDisputeParty(dispute, 'both');
  }
}

/**
 * Process automatic refund
 */
export function processDisputeRefund(disputeId: string, amount: number): void {
  const dispute = getDisputeById(disputeId);
  
  if (dispute) {
    dispute.refundStatus = 'processing';
    
    // Simulate refund processing (in production, integrate with payment gateway)
    setTimeout(() => {
      const updatedDispute = getDisputeById(disputeId);
      if (updatedDispute) {
        updatedDispute.refundStatus = 'completed';
        updatedDispute.refundDate = new Date();
        updatedDispute.refundTransactionId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        updatedDispute.timeline.push({
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: 'refund_processed',
          userId: 'system',
          userName: 'System',
          description: `Refund of £${amount.toFixed(2)} processed successfully`,
          details: { 
            amount, 
            transactionId: updatedDispute.refundTransactionId 
          },
        });
        
        saveDispute(updatedDispute);
        
        // Notify customer
        notifyDisputeParty(updatedDispute, 'reporter');
      }
    }, 2000);
    
    saveDispute(dispute);
  }
}

/**
 * Add message to dispute
 */
export function addDisputeMessage(
  disputeId: string,
  senderId: string,
  senderName: string,
  senderRole: DisputeMessage['senderRole'],
  message: string,
  attachments?: string[]
): DisputeMessage {
  const disputeMessage: DisputeMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    disputeId,
    senderId,
    senderName,
    senderRole,
    message,
    attachments,
    timestamp: new Date(),
    read: false,
  };
  
  // Save message
  const messages = getDisputeMessages(disputeId);
  messages.push(disputeMessage);
  localStorage.setItem(`dispute_messages_${disputeId}`, JSON.stringify(messages));
  
  // Update dispute timeline
  const dispute = getDisputeById(disputeId);
  if (dispute) {
    dispute.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'message_sent',
      userId: senderId,
      userName: senderName,
      description: `${senderName} sent a message`,
    });
    
    dispute.updatedAt = new Date();
    saveDispute(dispute);
  }
  
  return disputeMessage;
}

/**
 * Get all messages for a dispute
 */
export function getDisputeMessages(disputeId: string): DisputeMessage[] {
  const stored = localStorage.getItem(`dispute_messages_${disputeId}`);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Mark messages as read
 */
export function markMessagesAsRead(disputeId: string, userId: string): void {
  const messages = getDisputeMessages(disputeId);
  const updated = messages.map(msg => {
    if (msg.senderId !== userId) {
      return { ...msg, read: true };
    }
    return msg;
  });
  localStorage.setItem(`dispute_messages_${disputeId}`, JSON.stringify(updated));
}

/**
 * Notify dispute party
 */
function notifyDisputeParty(dispute: Dispute, party: 'reporter' | 'respondent' | 'both'): void {
  // In production, send actual notifications (email, push, SMS)
  console.log(`Notification sent for dispute ${dispute.disputeNumber} to ${party}`);
  
  // Add to notification center
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  if (party === 'reporter' || party === 'both') {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: dispute.reporterId,
      type: 'dispute_update',
      title: `Dispute Update: ${dispute.disputeNumber}`,
      message: `Your dispute regarding job ${dispute.jobReference} has been updated.`,
      timestamp: new Date(),
      read: false,
    });
  }
  
  if (party === 'respondent' || party === 'both') {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: dispute.respondentId,
      type: 'dispute_update',
      title: `Dispute Filed: ${dispute.disputeNumber}`,
      message: `A dispute has been filed regarding job ${dispute.jobReference}.`,
      timestamp: new Date(),
      read: false,
    });
  }
  
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Calculate dispute statistics
 */
export function calculateDisputeStats(disputes: Dispute[]) {
  const total = disputes.length;
  const byStatus = {
    submitted: disputes.filter(d => d.status === 'submitted').length,
    underReview: disputes.filter(d => d.status === 'under_review').length,
    mediation: disputes.filter(d => d.status === 'mediation').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    escalated: disputes.filter(d => d.status === 'escalated').length,
    closed: disputes.filter(d => d.status === 'closed').length,
  };
  
  const totalRefundRequested = disputes.reduce((sum, d) => sum + (d.requestedRefund || 0), 0);
  const totalRefundApproved = disputes.reduce((sum, d) => sum + (d.approvedRefund || 0), 0);
  
  const avgResolutionTime = calculateAverageResolutionTime(disputes.filter(d => d.resolutionDate));
  
  return {
    total,
    byStatus,
    totalRefundRequested,
    totalRefundApproved,
    avgResolutionTime,
    resolutionRate: total > 0 ? ((byStatus.resolved + byStatus.closed) / total) * 100 : 0,
  };
}

/**
 * Calculate average resolution time
 */
function calculateAverageResolutionTime(resolvedDisputes: Dispute[]): number {
  if (resolvedDisputes.length === 0) return 0;
  
  const totalHours = resolvedDisputes.reduce((sum, d) => {
    if (d.resolutionDate) {
      const diff = d.resolutionDate.getTime() - new Date(d.submittedDate).getTime();
      return sum + (diff / (1000 * 60 * 60)); // Convert to hours
    }
    return sum;
  }, 0);
  
  return totalHours / resolvedDisputes.length;
}

/**
 * Get dispute category label
 */
export function getDisputeCategoryLabel(category: Dispute['category']): string {
  const labels: Record<Dispute['category'], string> = {
    pricing: 'Pricing Issue',
    service_quality: 'Service Quality',
    damage: 'Damage/Loss',
    no_show: 'No Show',
    late_arrival: 'Late Arrival',
    behavior: 'Behavior/Conduct',
    other: 'Other',
  };
  return labels[category];
}

/**
 * Auto-escalate old disputes
 */
export function autoEscalateDisputes(): void {
  const disputes = getAllDisputes();
  const now = new Date();
  
  disputes.forEach(dispute => {
    if (dispute.status === 'under_review' || dispute.status === 'mediation') {
      const daysSinceSubmission = (now.getTime() - new Date(dispute.submittedDate).getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceSubmission > 7) {
        dispute.status = 'escalated';
        dispute.priority = 'urgent';
        dispute.updatedAt = new Date();
        
        dispute.timeline.push({
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: 'reviewed',
          userId: 'system',
          userName: 'System',
          description: 'Dispute auto-escalated due to extended resolution time',
        });
        
        saveDispute(dispute);
      }
    }
  });
}
