/**
 * Job Status Manager
 * Centralized system for tracking job status across Admin Panel and Driver Dashboard
 * NOW WITH BACKEND PERSISTENCE via Supabase KV Store
 */

import { notificationService, NotificationMessage } from './notificationService';
import { projectId, publicAnonKey } from './supabase/info';

// API Configuration
const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

// Export Notification interface aliased to NotificationMessage from service
export type Notification = NotificationMessage;

export type JobStatus = 
  | 'pending'        // Customer submitted, waiting for admin
  | 'draft'          // Admin drafting
  | 'assigned'       // Admin assigned to driver
  | 'available'      // Published to driver marketplace
  | 'accepted'       // Driver accepted
  | 'in-progress'    // Driver started the job
  | 'completed'      // Job finished
  | 'cancelled'      // Job cancelled
  | 'failed'         // Job failed
  | 'disputed';      // Issue reported

export type StopType = 'collection' | 'dropoff';

export interface JobLocation {
  address: string;
  postcode: string;
  city?: string;
  lat?: number;
  lng?: number;
  details?: string; // Access details like "3rd floor, no lift"
}

export interface Stop {
  id: string; // e.g. "STOP-001"
  jobId: string;
  journeyId?: string;
  type: StopType; // EXPLICIT TYPE
  address: JobLocation;
  status: 'pending' | 'arrived' | 'completed' | 'skipped';
  scheduledTime?: string;
  completedAt?: string;
  photos?: JobPhoto[];
  notes?: string;
  order: number; // Sequence in journey (1, 2, 3...)
}

export interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'pending' | 'called' | 'converted' | 'archived';
  date: string;
  notes?: string;
}

export interface JobItem {
  id: string;
  name: string;
  quantity: number;
  volume: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'driver' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Job {
  id: string;
  reference: string; // SMH-XXXXXX format
  journeyId?: string; // Linked Journey
  title: string;
  service: string;
  description: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  // Legacy fields kept for compatibility, but stops[] is the source of truth for routing
  pickup: JobLocation;
  delivery: JobLocation;
  
  stops: Stop[]; // MANDATORY: Must contain at least 1 collection + 1 dropoff

  date: string;
  time: string;
  distance: number;
  duration: string;
  totalVolume: number;
  vehicle: string;
  crew: number;
  items: Array<{ name: string; quantity: number; volume: number }>;
  customerPrice: number;
  driverPrice: number;
  platformFee: number;
  status: JobStatus;
  driverId?: string;
  driverName?: string;
  driverUsername?: string; 
  driverPhone?: string;
  assignedAt?: number;
  acceptedAt?: number;
  startedAt?: number;
  completedAt?: number;
  // ... other fields
  photos?: JobPhoto[]; // Aggregated photos from stops
  customerNotes?: string;
  interestOnly?: boolean; // If true, drivers can only express interest, not instant accept
  
  // Proof of Delivery Data
  proofOfDelivery?: {
    signature: string; // Base64 string of the signature
    photos: string[]; // Array of photo URLs
    signedBy: string;
    signedAt: string;
    notes?: string;
  };

  // Rating & Review
  rating?: number; // 1-5
  review?: string;
  reviewDate?: string;

  // Messages
  messages?: ChatMessage[];

  // Persistence fields
  interestedDriverIds?: string[]; // Stored in DB to persist interests
  customerId?: string; // Link to customer
  
  // Monitoring
  smsAlertSent?: boolean;
  
  // Issue Tracking
  issue?: {
    type: string;
    description: string;
    reportedBy: string;
    reportedAt: string;
    status: 'open' | 'resolved';
  };
}

export interface JobPhoto {
  id: string;
  jobId: string;
  stopId?: string; // Linked to specific stop
  type: 'pickup' | 'dropoff'; 
  url: string; 
  uploadedBy: string; 
  uploadedByName: string; 
  uploadedByUsername: string; 
  uploadedAt: string; 
  location?: {
    lat: number;
    lng: number;
  };
}

// In-memory storage with Background Persistence
class JobStatusManager {
  private jobs: Map<string, Job> = new Map();
  private stops: Map<string, Stop> = new Map(); // Global registry of stops
  private jobInterests: Map<string, Set<string>> = new Map(); // jobId -> Set<driverId>
  private callbackRequests: CallbackRequest[] = []; // Leads from website
  private listeners: Map<string, Function[]> = new Map(); 
  private nextReferenceNumber: number = 5;
  public version: string = '1.1.0';
  private isSyncing = false;

  private failureCount: number = 0;

  constructor() {
    console.log('JobStatusManager initialized v1.1.0 (Persistent)');
    // Initialize sample jobs immediately for instant UI
    this.initializeSampleJobs();
    
    // Initialize sample leads
    this.callbackRequests = [
      { id: 'cb1', name: 'John Visitor', phone: '07700 900123', status: 'pending', date: new Date().toISOString(), notes: 'Interested in house move' },
      { id: 'cb2', name: 'Alice Estate', phone: '07700 900456', status: 'called', date: new Date(Date.now() - 86400000).toISOString(), notes: 'Left voicemail' }
    ];

    // Then try to sync from backend (overwriting samples if real data exists)
    if (projectId) {
      this.syncFromBackend();
      // Poll for updates every 15 seconds
      setInterval(() => this.syncFromBackend(), 15000);
    } else {
      console.log('Running in standalone mode (no backend configured)');
    }
  }

  // ================= PERSISTENCE METHODS =================

  private async syncFromBackend() {
    if (this.isSyncing) return;
    // If we failed too many times, assume backend is down and stop spamming logs
    // We still try to sync, just silently
    
    this.isSyncing = true;
    
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (res.ok) {
        this.failureCount = 0; // Reset on success
        const remoteJobs: Job[] = await res.json();
        
        // If we got jobs, update our local cache
        if (Array.isArray(remoteJobs) && remoteJobs.length > 0) {
          remoteJobs.forEach(job => {
            this.jobs.set(job.id, job);
            
            // Sync interests
            if (job.interestedDriverIds && Array.isArray(job.interestedDriverIds)) {
              this.jobInterests.set(job.id, new Set(job.interestedDriverIds));
            }

            // Sync stops (if we had a separate stops table we'd fetch it, 
            // but here we assume stops are embedded in Job)
            if (job.stops) {
              job.stops.forEach(stop => this.stops.set(stop.id, stop));
            }
          });
          
          // Notify UI to refresh
          this.emit('job_created', {}); 
        }
      } else {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      this.failureCount++;
      // Only log the first 3 failures to avoid console spam
      if (this.failureCount <= 3) {
        console.warn('Background sync failed (backend unavailable):', error);
        if (this.failureCount === 3) {
          console.warn('Suppressing further background sync errors until connection is restored.');
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private async saveJobToBackend(job: Job) {
    try {
      // Ensure interests are saved
      const interests = this.jobInterests.get(job.id);
      if (interests) {
        job.interestedDriverIds = Array.from(interests);
      }

      // Optimistic UI update handled by caller
      
      // Fire and forget save
      fetch(`${API_URL}/jobs`, {
        method: 'POST', // or PUT, upsert handled by backend logic usually
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
      }).catch(err => console.warn('Failed to save job to backend:', err));
      
    } catch (error) {
      console.error('Error preparing job for save:', error);
    }
  }

  // ================= SUPPORT & LEADS METHODS =================

  requestCallback(name: string, phone: string, email?: string): boolean {
    const request: CallbackRequest = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      email,
      status: 'pending',
      date: new Date().toISOString()
    };
    this.callbackRequests.unshift(request);
    // Ideally save to backend here
    this.emit('leads_updated', this.callbackRequests);
    return true;
  }

  getCallbackRequests(): CallbackRequest[] {
    return this.callbackRequests;
  }

  // --- ALERTS & MONITORING ---
  
  /**
   * Returns jobs where the scheduled time has passed by > 15 mins
   * and the driver hasn't started the job yet.
   */
  getLateJobs(): { job: Job, minutesLate: number }[] {
    const now = new Date();
    const lateJobs: { job: Job, minutesLate: number }[] = [];
    const TOLERANCE_MINUTES = 15;

    this.jobs.forEach(job => {
      // Ignore completed, cancelled, or already started jobs
      if (['in-progress', 'completed', 'cancelled', 'failed', 'draft', 'pending'].includes(job.status)) {
        return;
      }

      // Construct job date object
      // job.date is YYYY-MM-DD, job.time is HH:MM
      try {
        const jobDateTimeString = `${job.date}T${job.time}:00`;
        const jobTime = new Date(jobDateTimeString);
        
        // Calculate difference in minutes
        const diffMs = now.getTime() - jobTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        // If late by more than tolerance
        if (diffMins > TOLERANCE_MINUTES) {
          lateJobs.push({ job, minutesLate: diffMins });
        }
      } catch (e) {
        // Invalid date format, ignore
      }
    });

    return lateJobs.sort((a, b) => b.minutesLate - a.minutesLate);
  }

  /**
   * Marks a job as having triggered an SMS alert to prevent duplicate messages.
   */
  async markJobAsAlerted(jobId: string) {
    const job = this.jobs.get(jobId);
    if (job && !job.smsAlertSent) {
      job.smsAlertSent = true;
      this.jobs.set(jobId, job);
      await this.saveJobToBackend(job);
    }
  }

  /**
   * Sends an SMS alert via the backend
   */
  async sendSmsAlert(to: string, message: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/send-sms`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to, message })
      });
      
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error('Failed to send SMS:', e);
      return false;
    }
  }

  updateCallbackStatus(id: string, status: CallbackRequest['status'], notes?: string): boolean {
    const req = this.callbackRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      if (notes) req.notes = notes;
      // Ideally save to backend here
      this.emit('leads_updated', this.callbackRequests);
      return true;
    }
    return false;
  }

  // ================= LOGIC METHODS =================

  // Helper to generate stops from pickup/delivery info
  private generateStopsForJob(jobId: string, pickup: JobLocation, delivery: JobLocation): Stop[] {
    const collectionStop: Stop = {
      id: `STOP-${jobId}-COL`,
      jobId: jobId,
      type: 'collection',
      address: pickup,
      status: 'pending',
      order: 1
    };

    const dropoffStop: Stop = {
      id: `STOP-${jobId}-DEL`,
      jobId: jobId,
      type: 'dropoff',
      address: delivery,
      status: 'pending',
      order: 2
    };

    this.stops.set(collectionStop.id, collectionStop);
    this.stops.set(dropoffStop.id, dropoffStop);

    return [collectionStop, dropoffStop];
  }

  private initializeSampleJobs() {
    // Initial sample data - serves as fallback and instant initial state
    const pickup1 = {
      address: 'Leith Walk, Edinburgh',
      postcode: 'EH6 8RG',
      city: 'Edinburgh',
      details: 'Ground floor'
    };
    const delivery1 = {
      address: 'Morningside, Edinburgh',
      postcode: 'EH10 4EP',
      city: 'Edinburgh',
      details: '2nd floor, no lift'
    };
    
    const job1: Job = {
      id: 'JOB001',
      reference: 'SMH-000001',
      title: 'Home Move - 2 Bedroom Flat',
      service: 'Home Removal',
      description: 'Standard move',
      customerName: 'Sarah Johnson',
      customerPhone: '+44 7700 900123',
      pickup: pickup1,
      delivery: delivery1,
      stops: [], 
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      distance: 5.7,
      duration: '3 hours',
      totalVolume: 15,
      vehicle: 'Luton Van',
      crew: 2,
      items: [],
      customerPrice: 350,
      driverPrice: 250,
      platformFee: 100,
      status: 'available',
      createdAt: new Date().toISOString(),
      customerId: 'CUST001'
    };
    job1.stops = this.generateStopsForJob(job1.id, pickup1, delivery1);
    this.jobs.set(job1.id, job1);

    // --- SIMULATED LATE JOB ---
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (120 * 60 * 1000));
    const hours = String(twoHoursAgo.getHours()).padStart(2, '0');
    const mins = String(twoHoursAgo.getMinutes()).padStart(2, '0');

    const job2: Job = {
      id: 'JOB-LATE-TEST',
      reference: 'SMH-LATE',
      title: 'TEST: Late Job Simulation',
      service: 'Urgent Delivery',
      description: 'This job simulates a driver being late.',
      customerName: 'Test Customer',
      customerPhone: '+44 7700 900000',
      pickup: pickup1, // Use same locations for simplicity
      delivery: delivery1,
      stops: [], 
      date: now.toISOString().split('T')[0], // Today
      time: `${hours}:${mins}`, // 2 hours ago
      distance: 5.7,
      duration: '3 hours',
      totalVolume: 15,
      vehicle: 'Luton Van',
      crew: 2,
      items: [],
      customerPrice: 350,
      driverPrice: 250,
      platformFee: 100,
      status: 'assigned', // Assigned but not started -> LATE
      driverId: '1',
      driverName: 'Mike Johnson',
      driverPhone: '+447123456789',
      createdAt: now.toISOString(),
      customerId: 'CUST-TEST'
    };
    job2.stops = this.generateStopsForJob(job2.id, pickup1, delivery1);
    this.jobs.set(job2.id, job2);
    // --------------------------
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  getAvailableJobs(): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.status === 'available');
  }

  getDriverJobs(driverId: string): Job[] {
    return Array.from(this.jobs.values()).filter(job => 
      job.driverId === driverId && 
      ['assigned', 'accepted', 'in-progress', 'completed'].includes(job.status)
    );
  }

  getInterestedJobs(driverId: string): Job[] {
    const interestedJobIds: string[] = [];
    this.jobInterests.forEach((drivers, jobId) => {
      if (drivers.has(driverId)) {
        interestedJobIds.push(jobId);
      }
    });
    
    return interestedJobIds
      .map(id => this.jobs.get(id))
      .filter((job): job is Job => job !== undefined);
  }

  hasExpressedInterest(jobId: string, driverId: string): boolean {
    const interests = this.jobInterests.get(jobId);
    return interests ? interests.has(driverId) : false;
  }

  expressInterest(jobId: string, driverDetails: any): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (!this.jobInterests.has(jobId)) {
      this.jobInterests.set(jobId, new Set());
    }
    
    this.jobInterests.get(jobId)?.add(driverDetails.id);
    
    // Notify admin or log
    console.log(`Driver ${driverDetails.id} expressed interest in job ${jobId}`);
    
    // SAVE TO BACKEND
    this.saveJobToBackend(job);

    // Emit event so UI updates
    this.emit('interest_updated', { jobId, driverId: driverDetails.id, interested: true });
    
    return true;
  }

  removeInterest(jobId: string, driverId: string): boolean {
    const interests = this.jobInterests.get(jobId);
    if (interests && interests.has(driverId)) {
      interests.delete(driverId);
      
      const job = this.jobs.get(jobId);
      if (job) this.saveJobToBackend(job);

      // Emit event so UI updates
      this.emit('interest_updated', { jobId, driverId, interested: false });
      
      return true;
    }
    return false;
  }

  acceptJob(jobId: string, driverId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'available') return false;

    job.driverId = driverId;
    // In a real app, fetch driver name/details here
    job.driverName = 'John Driver'; 
    job.driverUsername = 'johnd';
    
    return this.updateJobStatus(jobId, 'accepted');
  }

  assignJob(jobId: string, driver: { id: string; name: string; username: string; phone?: string }): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    job.driverId = driver.id;
    job.driverName = driver.name;
    job.driverUsername = driver.username;
    job.driverPhone = driver.phone;
    
    return this.updateJobStatus(jobId, 'assigned');
  }

  startJob(jobId: string): boolean {
    return this.updateJobStatus(jobId, 'in-progress');
  }

  completeJob(jobId: string, podData?: Job['proofOfDelivery']): boolean {
    const job = this.jobs.get(jobId);
    if (job && podData) {
      job.proofOfDelivery = podData;
    }
    return this.updateJobStatus(jobId, 'completed');
  }

  completeJobWithTracking(jobId: string, driverId: string, source: string, issueDetails?: { type: string, description: string }): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    if (issueDetails) {
      job.issue = {
        type: issueDetails.type,
        description: issueDetails.description,
        reportedBy: driverId,
        reportedAt: new Date().toISOString(),
        status: 'open'
      };
    }
    
    // Status becomes disputed instead of completed
    return this.updateJobStatus(jobId, 'disputed');
  }

  reportIssue(jobId: string, issueData: { type: string, description: string, reportedBy: string }): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    
    job.issue = {
      ...issueData,
      reportedAt: new Date().toISOString(),
      status: 'open'
    };
    
    this.saveJobToBackend(job);
    return this.updateJobStatus(jobId, 'disputed');
  }

  submitReview(jobId: string, rating: number, review: string): boolean {
    const job = this.jobs.get(jobId);
    if (job) {
      job.rating = rating;
      job.review = review;
      job.reviewDate = new Date().toISOString();
      this.saveToStorage(); // Persist
      return true;
    }
    return false;
  }

  sendMessage(jobId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): boolean {
    const job = this.jobs.get(jobId);
    if (job) {
      if (!job.messages) job.messages = [];
      
      const newMessage: ChatMessage = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      job.messages.push(newMessage);
      
      // Create notification for the recipient
      const recipientId = message.senderRole === 'customer' ? (job.driverId || 'ADMIN') : job.customerId;
      this.notifyUser(recipientId, {
        title: `New message from ${message.senderName}`,
        message: message.text,
        type: 'message',
        jobId: jobId
      });
      
      this.saveToStorage();
      this.notifyListeners('message_sent');
      return true;
    }
    return false;
  }

  getMessages(jobId: string): ChatMessage[] {
    return this.jobs.get(jobId)?.messages || [];
  }

  // Notification methods
  getNotifications(userId: string): any[] {
    // In memory mock
    return notificationService.getInAppNotifications(userId);
  }

  markNotificationAsRead(userId: string, notificationId: string) {
    notificationService.markAsRead(userId, notificationId);
  }

  // When creating a job, enforce stop creation
  createJob(jobData: Omit<Job, 'id' | 'reference' | 'stops' | 'createdAt'>): Job {
    const referenceNumber = String(this.nextReferenceNumber).padStart(6, '0');
    this.nextReferenceNumber++;
    
    const jobId = `JOB${Date.now()}`;
    const newJob: Job = {
      ...jobData,
      id: jobId,
      reference: `SMH-${referenceNumber}`,
      stops: [],
      createdAt: new Date().toISOString(),
      photos: [],
      interestedDriverIds: []
    };

    // AUTOMATICALLY CREATE STOPS
    newJob.stops = this.generateStopsForJob(newJob.id, newJob.pickup, newJob.delivery);

    this.jobs.set(newJob.id, newJob);
    
    // SAVE TO BACKEND
    this.saveJobToBackend(newJob);

    this.emit('job_created', newJob);
    return newJob;
  }

  // Update job status
  updateJobStatus(jobId: string, status: JobStatus): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    const oldStatus = job.status;
    job.status = status;
    
    // Update timestamps based on status
    const now = new Date().toISOString();
    if (status === 'assigned') job.assignedAt = Date.now();
    if (status === 'accepted') job.acceptedAt = Date.now();
    if (status === 'in-progress') job.startedAt = Date.now();
    if (status === 'completed') job.completedAt = Date.now();

    this.jobs.set(jobId, job);
    
    // SAVE TO BACKEND
    this.saveJobToBackend(job);

    this.emit('job_status_changed', { job, oldStatus, newStatus: status });
    return true;
  }
  
  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const jobStatusManager = new JobStatusManager();

/**
 * Helper to determine if personal data should be hidden (GDPR compliance)
 */
export function shouldHidePersonalData(job: Job, isAdmin: boolean = false): boolean {
  if (isAdmin) return false;
  
  if (job.status === 'completed' && job.completedAt) {
    const completionTime = new Date(job.completedAt).getTime();
    const currentTime = Date.now();
    const hoursSinceCompletion = (currentTime - completionTime) / (1000 * 60 * 60);
    
    return hoursSinceCompletion > 48;
  }
  
  return false;
}