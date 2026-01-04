/**
 * Recurring & Scheduled Jobs System
 * Handles weekly/monthly recurring moves, auto-pricing, subscriptions, and calendar integration
 */

export interface RecurringJobSchedule {
  id: string;
  customerId: string;
  customerName: string;
  
  // Schedule details
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate?: Date; // Optional - if not set, runs indefinitely
  
  // Custom frequency (if frequency === 'custom')
  customDays?: number; // Repeat every X days
  
  // Day preferences
  preferredDayOfWeek?: number; // 0 = Sunday, 1 = Monday, etc.
  preferredDayOfMonth?: number; // 1-31
  
  // Time preferences
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening' | 'flexible';
  preferredTime?: string; // HH:MM format
  
  // Job template
  serviceType: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: any[];
  notes?: string;
  
  // Pricing
  basePrice: number;
  recurringDiscount: number; // Percentage discount for recurring jobs
  finalPrice: number;
  
  // Status
  status: 'active' | 'paused' | 'cancelled' | 'completed';
  isPaid: boolean;
  paymentMethod: string;
  
  // Auto-booking
  autoBooking: boolean; // Auto-create jobs without approval
  notifyBeforeBooking: boolean; // Send notification X days before
  notificationDays: number; // Days before to notify
  
  // Statistics
  totalJobs: number;
  completedJobs: number;
  upcomingJobs: string[]; // Array of job IDs
  lastJobDate?: Date;
  nextJobDate?: Date;
  
  // Subscription info
  subscriptionId?: string;
  billingCycle: 'per-job' | 'monthly' | 'annual';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ScheduledJob {
  id: string;
  scheduleId: string;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  jobReference?: string; // Created when job is booked
  createdAt: Date;
}

/**
 * Create recurring job schedule
 */
export function createRecurringSchedule(data: {
  customerId: string;
  customerName: string;
  frequency: RecurringJobSchedule['frequency'];
  startDate: Date;
  endDate?: Date;
  serviceType: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: any[];
  basePrice: number;
  preferredTimeSlot: RecurringJobSchedule['preferredTimeSlot'];
  autoBooking?: boolean;
  paymentMethod: string;
}): RecurringJobSchedule {
  const recurringDiscount = calculateRecurringDiscount(data.frequency);
  const finalPrice = data.basePrice * (1 - recurringDiscount / 100);
  
  const schedule: RecurringJobSchedule = {
    id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId: data.customerId,
    customerName: data.customerName,
    frequency: data.frequency,
    startDate: data.startDate,
    endDate: data.endDate,
    serviceType: data.serviceType,
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    items: data.items,
    preferredTimeSlot: data.preferredTimeSlot,
    basePrice: data.basePrice,
    recurringDiscount,
    finalPrice,
    status: 'active',
    isPaid: false,
    paymentMethod: data.paymentMethod,
    autoBooking: data.autoBooking || false,
    notifyBeforeBooking: true,
    notificationDays: 3,
    totalJobs: 0,
    completedJobs: 0,
    upcomingJobs: [],
    billingCycle: data.frequency === 'monthly' ? 'monthly' : 'per-job',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: data.customerId,
  };
  
  // Calculate next job date
  schedule.nextJobDate = calculateNextJobDate(schedule);
  
  saveRecurringSchedule(schedule);
  
  // Create initial scheduled jobs
  generateUpcomingJobs(schedule.id);
  
  return schedule;
}

/**
 * Calculate recurring discount based on frequency
 */
export function calculateRecurringDiscount(frequency: RecurringJobSchedule['frequency']): number {
  const discounts: Record<RecurringJobSchedule['frequency'], number> = {
    daily: 25, // 25% discount
    weekly: 15, // 15% discount
    'bi-weekly': 10, // 10% discount
    monthly: 8, // 8% discount
    custom: 5, // 5% discount
  };
  return discounts[frequency] || 0;
}

/**
 * Calculate next job date based on schedule
 */
export function calculateNextJobDate(schedule: RecurringJobSchedule, fromDate?: Date): Date {
  const baseDate = fromDate || schedule.lastJobDate || schedule.startDate;
  const nextDate = new Date(baseDate);
  
  switch (schedule.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'bi-weekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'custom':
      if (schedule.customDays) {
        nextDate.setDate(nextDate.getDate() + schedule.customDays);
      }
      break;
  }
  
  // Check if next date exceeds end date
  if (schedule.endDate && nextDate > schedule.endDate) {
    return schedule.endDate;
  }
  
  return nextDate;
}

/**
 * Generate upcoming scheduled jobs (next 3 months)
 */
export function generateUpcomingJobs(scheduleId: string): void {
  const schedule = getRecurringScheduleById(scheduleId);
  if (!schedule || schedule.status !== 'active') return;
  
  const upcoming: ScheduledJob[] = [];
  let currentDate = new Date(schedule.startDate);
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  
  const endDate = schedule.endDate || threeMonthsLater;
  
  while (currentDate <= endDate && currentDate <= threeMonthsLater) {
    const scheduledJob: ScheduledJob = {
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      scheduleId: schedule.id,
      scheduledDate: new Date(currentDate),
      status: 'pending',
      createdAt: new Date(),
    };
    
    upcoming.push(scheduledJob);
    currentDate = calculateNextJobDate(schedule, currentDate);
  }
  
  // Save scheduled jobs
  saveScheduledJobs(scheduleId, upcoming);
  
  // Update schedule
  schedule.upcomingJobs = upcoming.map(j => j.id);
  schedule.nextJobDate = upcoming[0]?.scheduledDate;
  saveRecurringSchedule(schedule);
}

/**
 * Auto-create job from scheduled job
 */
export function autoCreateJobFromSchedule(scheduledJobId: string): string | null {
  const scheduledJob = getScheduledJobById(scheduledJobId);
  if (!scheduledJob) return null;
  
  const schedule = getRecurringScheduleById(scheduledJob.scheduleId);
  if (!schedule) return null;
  
  // Create actual job (integrate with booking system)
  const jobReference = `SMH-${Date.now().toString().slice(-6)}`;
  
  // In production, create actual job in booking system
  console.log('Creating job from schedule:', {
    jobReference,
    schedule: schedule.id,
    scheduledDate: scheduledJob.scheduledDate,
  });
  
  // Update scheduled job
  scheduledJob.status = 'confirmed';
  scheduledJob.jobReference = jobReference;
  saveScheduledJob(scheduledJob);
  
  // Update schedule stats
  schedule.totalJobs += 1;
  schedule.lastJobDate = scheduledJob.scheduledDate;
  schedule.upcomingJobs = schedule.upcomingJobs.filter(id => id !== scheduledJobId);
  
  // Calculate next job date
  schedule.nextJobDate = calculateNextJobDate(schedule, scheduledJob.scheduledDate);
  saveRecurringSchedule(schedule);
  
  // Generate new upcoming jobs if needed
  if (schedule.upcomingJobs.length < 3) {
    generateUpcomingJobs(schedule.id);
  }
  
  return jobReference;
}

/**
 * Pause recurring schedule
 */
export function pauseRecurringSchedule(scheduleId: string): void {
  const schedule = getRecurringScheduleById(scheduleId);
  if (schedule) {
    schedule.status = 'paused';
    schedule.updatedAt = new Date();
    saveRecurringSchedule(schedule);
  }
}

/**
 * Resume recurring schedule
 */
export function resumeRecurringSchedule(scheduleId: string): void {
  const schedule = getRecurringScheduleById(scheduleId);
  if (schedule) {
    schedule.status = 'active';
    schedule.updatedAt = new Date();
    saveRecurringSchedule(schedule);
    
    // Regenerate upcoming jobs
    generateUpcomingJobs(scheduleId);
  }
}

/**
 * Cancel recurring schedule
 */
export function cancelRecurringSchedule(scheduleId: string): void {
  const schedule = getRecurringScheduleById(scheduleId);
  if (schedule) {
    schedule.status = 'cancelled';
    schedule.updatedAt = new Date();
    saveRecurringSchedule(schedule);
    
    // Cancel all pending scheduled jobs
    const scheduledJobs = getScheduledJobsBySchedule(scheduleId);
    scheduledJobs.forEach(job => {
      if (job.status === 'pending') {
        job.status = 'cancelled';
        saveScheduledJob(job);
      }
    });
  }
}

/**
 * Save recurring schedule
 */
export function saveRecurringSchedule(schedule: RecurringJobSchedule): void {
  const schedules = getAllRecurringSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  
  if (index >= 0) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }
  
  localStorage.setItem('recurring_schedules', JSON.stringify(schedules));
}

/**
 * Get all recurring schedules
 */
export function getAllRecurringSchedules(): RecurringJobSchedule[] {
  const stored = localStorage.getItem('recurring_schedules');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get recurring schedule by ID
 */
export function getRecurringScheduleById(id: string): RecurringJobSchedule | null {
  const schedules = getAllRecurringSchedules();
  return schedules.find(s => s.id === id) || null;
}

/**
 * Get customer recurring schedules
 */
export function getCustomerRecurringSchedules(customerId: string): RecurringJobSchedule[] {
  const schedules = getAllRecurringSchedules();
  return schedules.filter(s => s.customerId === customerId);
}

/**
 * Save scheduled jobs
 */
export function saveScheduledJobs(scheduleId: string, jobs: ScheduledJob[]): void {
  localStorage.setItem(`scheduled_jobs_${scheduleId}`, JSON.stringify(jobs));
}

/**
 * Get scheduled jobs by schedule
 */
export function getScheduledJobsBySchedule(scheduleId: string): ScheduledJob[] {
  const stored = localStorage.getItem(`scheduled_jobs_${scheduleId}`);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save individual scheduled job
 */
export function saveScheduledJob(job: ScheduledJob): void {
  const jobs = getScheduledJobsBySchedule(job.scheduleId);
  const index = jobs.findIndex(j => j.id === job.id);
  
  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.push(job);
  }
  
  saveScheduledJobs(job.scheduleId, jobs);
}

/**
 * Get scheduled job by ID
 */
export function getScheduledJobById(jobId: string): ScheduledJob | null {
  const schedules = getAllRecurringSchedules();
  
  for (const schedule of schedules) {
    const jobs = getScheduledJobsBySchedule(schedule.id);
    const job = jobs.find(j => j.id === jobId);
    if (job) return job;
  }
  
  return null;
}

/**
 * Process scheduled jobs (run daily)
 */
export function processScheduledJobs(): void {
  const schedules = getAllRecurringSchedules().filter(s => s.status === 'active');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  schedules.forEach(schedule => {
    const scheduledJobs = getScheduledJobsBySchedule(schedule.id);
    
    scheduledJobs.forEach(job => {
      if (job.status === 'pending') {
        const jobDate = new Date(job.scheduledDate);
        jobDate.setHours(0, 0, 0, 0);
        
        // Check if should auto-create job
        if (schedule.autoBooking && jobDate <= today) {
          autoCreateJobFromSchedule(job.id);
        }
        
        // Send notification if needed
        if (schedule.notifyBeforeBooking) {
          const daysUntilJob = Math.floor((jobDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilJob === schedule.notificationDays) {
            sendScheduledJobNotification(schedule, job);
          }
        }
      }
    });
  });
}

/**
 * Send notification for upcoming scheduled job
 */
function sendScheduledJobNotification(schedule: RecurringJobSchedule, job: ScheduledJob): void {
  // In production, send actual notification
  console.log(`Notification: Upcoming job on ${job.scheduledDate.toLocaleDateString()}`);
  
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: schedule.customerId,
    type: 'scheduled_job_reminder',
    title: 'Upcoming Scheduled Move',
    message: `Your recurring ${schedule.serviceType} is scheduled for ${job.scheduledDate.toLocaleDateString()}`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

/**
 * Calculate recurring schedule statistics
 */
export function calculateRecurringStats(schedules: RecurringJobSchedule[]) {
  return {
    total: schedules.length,
    active: schedules.filter(s => s.status === 'active').length,
    paused: schedules.filter(s => s.status === 'paused').length,
    cancelled: schedules.filter(s => s.status === 'cancelled').length,
    totalJobs: schedules.reduce((sum, s) => sum + s.totalJobs, 0),
    totalRevenue: schedules.reduce((sum, s) => sum + (s.finalPrice * s.totalJobs), 0),
    avgJobsPerSchedule: schedules.length > 0 ? schedules.reduce((sum, s) => sum + s.totalJobs, 0) / schedules.length : 0,
  };
}

/**
 * Export schedule to calendar (iCal format)
 */
export function exportScheduleToCalendar(scheduleId: string): string {
  const schedule = getRecurringScheduleById(scheduleId);
  if (!schedule) return '';
  
  const scheduledJobs = getScheduledJobsBySchedule(scheduleId);
  
  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ShiftMyHome//Recurring Jobs//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ShiftMyHome Recurring Jobs',
    'X-WR-TIMEZONE:Europe/London',
  ];
  
  scheduledJobs.forEach(job => {
    const startDate = new Date(job.scheduledDate);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // Assume 2 hour duration
    
    ical.push(
      'BEGIN:VEVENT',
      `UID:${job.id}@shiftmyhome.com`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDate)}`,
      `DTEND:${formatICalDate(endDate)}`,
      `SUMMARY:${schedule.serviceType} - ShiftMyHome`,
      `DESCRIPTION:Recurring ${schedule.frequency} move from ${schedule.pickupAddress} to ${schedule.deliveryAddress}`,
      `LOCATION:${schedule.pickupAddress}`,
      `STATUS:${job.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}`,
      'END:VEVENT'
    );
  });
  
  ical.push('END:VCALENDAR');
  
  return ical.join('\r\n');
}

/**
 * Format date for iCal
 */
function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Download calendar file
 */
export function downloadCalendarFile(scheduleId: string): void {
  const ical = exportScheduleToCalendar(scheduleId);
  const blob = new Blob([ical], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `recurring-jobs-${scheduleId}.ics`;
  a.click();
  
  URL.revokeObjectURL(url);
}
