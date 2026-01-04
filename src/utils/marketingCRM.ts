/**
 * Automated Marketing & CRM System
 * Email campaigns, SMS marketing, push notifications, customer segmentation, win-back automation
 */

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    totalJobs?: { min?: number; max?: number };
    totalSpent?: { min?: number; max?: number };
    lastJobDate?: { before?: Date; after?: Date };
    status?: ('active' | 'inactive' | 'churned')[];
    trustLevel?: string[];
  };
  customerIds: string[];
  size: number;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'multi-channel';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  
  // Targeting
  segmentIds: string[];
  targetCount: number;
  
  // Content
  subject?: string;
  message: string;
  template?: string;
  callToAction?: string;
  
  // Scheduling
  scheduledDate?: Date;
  sentDate?: Date;
  
  // Performance
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  
  // Automation
  automated: boolean;
  trigger?: 'abandoned_quote' | 'job_completed' | 'inactive_user' | 'birthday' | 'custom';
  triggerConfig?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create customer segment
 */
export function createCustomerSegment(
  name: string,
  description: string,
  criteria: CustomerSegment['criteria']
): CustomerSegment {
  // Get all customers
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  
  // Filter customers based on criteria
  const matchingCustomers = customers.filter((customer: any) => {
    // Calculate customer stats
    const customerJobs = jobs.filter((j: any) => j.customerId === customer.id);
    const totalJobs = customerJobs.length;
    const totalSpent = customerJobs.reduce((sum: number, j: any) => sum + (j.totalPrice || 0), 0);
    const lastJob = customerJobs.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    const lastJobDate = lastJob ? new Date(lastJob.date) : null;
    
    // Determine status
    let status = 'inactive';
    if (lastJobDate) {
      const daysSinceLastJob = (Date.now() - lastJobDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastJob < 30) status = 'active';
      else if (daysSinceLastJob > 180) status = 'churned';
    }
    
    // Apply criteria
    if (criteria.totalJobs) {
      if (criteria.totalJobs.min && totalJobs < criteria.totalJobs.min) return false;
      if (criteria.totalJobs.max && totalJobs > criteria.totalJobs.max) return false;
    }
    
    if (criteria.totalSpent) {
      if (criteria.totalSpent.min && totalSpent < criteria.totalSpent.min) return false;
      if (criteria.totalSpent.max && totalSpent > criteria.totalSpent.max) return false;
    }
    
    if (criteria.lastJobDate && lastJobDate) {
      if (criteria.lastJobDate.before && lastJobDate > criteria.lastJobDate.before) return false;
      if (criteria.lastJobDate.after && lastJobDate < criteria.lastJobDate.after) return false;
    }
    
    if (criteria.status && !criteria.status.includes(status as any)) return false;
    
    return true;
  });
  
  const segment: CustomerSegment = {
    id: `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    criteria,
    customerIds: matchingCustomers.map((c: any) => c.id),
    size: matchingCustomers.length,
    createdAt: new Date(),
  };
  
  saveCustomerSegment(segment);
  return segment;
}

/**
 * Create marketing campaign
 */
export function createCampaign(data: {
  name: string;
  type: Campaign['type'];
  segmentIds: string[];
  message: string;
  subject?: string;
  scheduledDate?: Date;
  automated?: boolean;
  trigger?: Campaign['trigger'];
}): Campaign {
  // Calculate target count
  const segments = data.segmentIds.map(id => getCustomerSegment(id)).filter(Boolean) as CustomerSegment[];
  const uniqueCustomerIds = new Set<string>();
  segments.forEach(seg => seg.customerIds.forEach(id => uniqueCustomerIds.add(id)));
  
  const campaign: Campaign = {
    id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    type: data.type,
    status: data.scheduledDate ? 'scheduled' : 'draft',
    segmentIds: data.segmentIds,
    targetCount: uniqueCustomerIds.size,
    message: data.message,
    subject: data.subject,
    scheduledDate: data.scheduledDate,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: 0,
    automated: data.automated || false,
    trigger: data.trigger,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  saveCampaign(campaign);
  return campaign;
}

/**
 * Send campaign
 */
export async function sendCampaign(campaignId: string): Promise<void> {
  const campaign = getCampaign(campaignId);
  if (!campaign) return;
  
  campaign.status = 'running';
  campaign.sentDate = new Date();
  saveCampaign(campaign);
  
  // Get all target customers
  const segments = campaign.segmentIds.map(id => getCustomerSegment(id)).filter(Boolean) as CustomerSegment[];
  const uniqueCustomerIds = new Set<string>();
  segments.forEach(seg => seg.customerIds.forEach(id => uniqueCustomerIds.add(id)));
  
  // Send messages
  for (const customerId of uniqueCustomerIds) {
    await sendCampaignMessage(campaign, customerId);
    campaign.sent++;
    
    // Simulate delivery and opens
    if (Math.random() > 0.05) campaign.delivered++;
    if (Math.random() > 0.6) campaign.opened++;
    if (Math.random() > 0.9) campaign.clicked++;
  }
  
  campaign.status = 'completed';
  saveCampaign(campaign);
}

/**
 * Send individual campaign message
 */
async function sendCampaignMessage(campaign: Campaign, customerId: string): Promise<void> {
  // In production, integrate with actual email/SMS/push services
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const customer = customers.find((c: any) => c.id === customerId);
  
  if (!customer) return;
  
  if (campaign.type === 'email') {
    console.log(`Email sent to ${customer.email}: ${campaign.subject}`);
  } else if (campaign.type === 'sms') {
    console.log(`SMS sent to ${customer.phone}: ${campaign.message}`);
  } else if (campaign.type === 'push') {
    // Send push notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: customerId,
      type: 'marketing',
      title: campaign.subject || 'Special Offer',
      message: campaign.message,
      timestamp: new Date(),
      read: false,
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
  
  await new Promise(resolve => setTimeout(resolve, 10));
}

/**
 * Automated campaigns - Abandoned Quote Follow-up
 */
export function checkAbandonedQuotes(): void {
  const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  const now = new Date();
  
  quotes.forEach((quote: any) => {
    if (quote.status === 'pending' || quote.status === 'quoted') {
      const quoteDate = new Date(quote.createdAt);
      const hoursSinceQuote = (now.getTime() - quoteDate.getTime()) / (1000 * 60 * 60);
      
      // Send follow-up after 24 hours
      if (hoursSinceQuote >= 24 && hoursSinceQuote < 25) {
        sendAbandonedQuoteEmail(quote);
      }
      
      // Send second follow-up after 72 hours
      if (hoursSinceQuote >= 72 && hoursSinceQuote < 73) {
        sendAbandonedQuoteEmail(quote, true);
      }
    }
  });
}

/**
 * Send abandoned quote email
 */
function sendAbandonedQuoteEmail(quote: any, secondReminder: boolean = false): void {
  const message = secondReminder
    ? `Hi! We noticed you haven't completed your booking for ${quote.serviceType}. Book now and get 10% off!`
    : `Hi! You have a pending quote for ${quote.serviceType}. Complete your booking today!`;
  
  console.log(`Abandoned quote email sent to ${quote.customerEmail}: ${message}`);
  
  // Add to notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: quote.customerId,
    type: 'abandoned_quote',
    title: secondReminder ? '10% Off Your Move!' : 'Complete Your Booking',
    message,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Automated campaigns - Win-back Inactive Customers
 */
export function winBackInactiveCustomers(): void {
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  const now = new Date();
  
  customers.forEach((customer: any) => {
    const customerJobs = jobs.filter((j: any) => j.customerId === customer.id);
    const lastJob = customerJobs.sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    if (lastJob) {
      const daysSinceLastJob = (now.getTime() - new Date(lastJob.date).getTime()) / (1000 * 60 * 60 * 24);
      
      // Win-back campaign after 90 days
      if (daysSinceLastJob >= 90 && daysSinceLastJob < 91) {
        sendWinBackEmail(customer);
      }
    }
  });
}

/**
 * Send win-back email
 */
function sendWinBackEmail(customer: any): void {
  const message = `We miss you! It's been a while since your last move. Come back and get 15% off your next booking!`;
  
  console.log(`Win-back email sent to ${customer.email}: ${message}`);
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: customer.id,
    type: 'win_back',
    title: 'We Miss You! 15% Off',
    message,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Storage functions
 */
function saveCustomerSegment(segment: CustomerSegment): void {
  const segments = getAllCustomerSegments();
  const index = segments.findIndex(s => s.id === segment.id);
  if (index >= 0) {
    segments[index] = segment;
  } else {
    segments.push(segment);
  }
  localStorage.setItem('customer_segments', JSON.stringify(segments));
}

function getAllCustomerSegments(): CustomerSegment[] {
  const stored = localStorage.getItem('customer_segments');
  return stored ? JSON.parse(stored) : [];
}

function getCustomerSegment(id: string): CustomerSegment | null {
  const segments = getAllCustomerSegments();
  return segments.find(s => s.id === id) || null;
}

function saveCampaign(campaign: Campaign): void {
  const campaigns = getAllCampaigns();
  const index = campaigns.findIndex(c => c.id === campaign.id);
  if (index >= 0) {
    campaigns[index] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem('marketing_campaigns', JSON.stringify(campaigns));
}

export function getAllCampaigns(): Campaign[] {
  const stored = localStorage.getItem('marketing_campaigns');
  return stored ? JSON.parse(stored) : [];
}

function getCampaign(id: string): Campaign | null {
  const campaigns = getAllCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

/**
 * Calculate campaign ROI
 */
export function calculateCampaignROI(campaign: Campaign): { roi: number; costPerConversion: number } {
  const cost = campaign.sent * (campaign.type === 'sms' ? 0.05 : 0.01); // Estimated costs
  const roi = campaign.revenue > 0 ? ((campaign.revenue - cost) / cost) * 100 : 0;
  const costPerConversion = campaign.converted > 0 ? cost / campaign.converted : 0;
  
  return { roi, costPerConversion };
}
