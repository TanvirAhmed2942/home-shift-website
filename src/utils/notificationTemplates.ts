
// --- TYPES ---

export type Channel = 'email' | 'sms' | 'push';
export type Recipient = 'customer' | 'driver' | 'admin';

export interface NotificationTrigger {
  id: string;
  name: string;
  category: 'payment' | 'journey' | 'job' | 'feedback' | 'system';
  recipient: Recipient;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  emailTemplate: {
    subject: string;
    body: string; // HTML allowed
  };
  smsTemplate: {
    text: string; // Max 160 chars recommended
  };
  enabled: boolean;
  delay?: number; // minutes
}

export interface NotificationLog {
  id: string;
  date: string;
  event: string;
  recipient: string; // "Driver - John Doe"
  channel: Channel;
  status: 'sent' | 'delivered' | 'failed' | 'opened';
  metadata?: any;
}

export interface DeallocationRule {
  id: string;
  minHoursBefore: number;
  maxHoursBefore: number | null; // null = infinity
  feeType: 'fixed' | 'percent';
  value: number;
}

// --- VARIABLES CHEATSHEET ---
export const AVAILABLE_VARIABLES = [
  { name: 'customer_name', desc: 'Full name of the customer' },
  { name: 'driver_name', desc: 'Full name of the driver' },
  { name: 'job_id', desc: 'Unique Job Reference ID' },
  { name: 'journey_id', desc: 'Journey Reference ID' },
  { name: 'pickup_address', desc: 'Full pickup address' },
  { name: 'dropoff_address', desc: 'Full dropoff address' },
  { name: 'job_date', desc: 'Formatted date of the job' },
  { name: 'start_time', desc: 'Scheduled start time' },
  { name: 'amount', desc: 'Total job amount or payout' },
  { name: 'tip_amount', desc: 'Tip amount if applicable' },
  { name: 'deallocation_reason', desc: 'Reason for removal' },
  { name: 'fee_amount', desc: 'Calculated fee' },
  { name: 'total_jobs_in_journey', desc: 'Count of jobs in journey' },
];

// --- DEFAULT TEMPLATES (FROM SPECIFICATION) ---

export const DEFAULT_TRIGGERS: NotificationTrigger[] = [
  // 1. PAYMENT RECEIVED
  {
    id: 'payment_received',
    name: 'Customer Payment Completed',
    category: 'payment',
    recipient: 'customer',
    channels: { email: true, sms: true, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Payment received – ShiftMyHome',
      body: `<p>Hi {{customer_name}},</p>
<p>We’ve received your payment of £{{amount}} for job {{job_id}}.</p>
<p><strong>Your job is now confirmed.</strong><br>
Pickup: {{pickup_address}}<br>
Drop-off: {{dropoff_address}}<br>
Date: {{job_date}}</p>
<p>Thank you for choosing ShiftMyHome.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: Payment of £{{amount}} received for your job {{job_id}}.'
    }
  },

  // 2. JOURNEY ACCEPTED
  {
    id: 'journey_accepted',
    name: 'Journey Accepted',
    category: 'journey',
    recipient: 'driver',
    channels: { email: true, sms: true, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Journey accepted – {{journey_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>You have successfully accepted Journey {{journey_id}}.</p>
<ul>
<li>Date: {{job_date}}</li>
<li>Start time: {{start_time}}</li>
<li>Route: {{pickup_address}} → {{dropoff_address}}</li>
</ul>
<p>Total jobs: {{total_jobs_in_journey}}<br>
Total payout: £{{amount}}</p>
<p>Please make sure you arrive on time and use the ShiftMyHome Driver App.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: Journey {{journey_id}} accepted. Start {{start_time}}. Check app for details.'
    }
  },

  // 2.1 JOURNEY ALLOCATED (NEW)
  {
    id: 'journey_allocated',
    name: 'Journey Allocated',
    category: 'journey',
    recipient: 'driver',
    channels: { email: true, sms: false, push: true },
    enabled: true,
    emailTemplate: {
      subject: 'New Journey Allocation – {{journey_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>You have been allocated a new journey: <strong>{{journey_id}}</strong>.</p>
<p>Please log in to your dashboard to view details and accept or reject this route.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: You have been allocated Journey {{journey_id}}. Please check your app.'
    }
  },

  // 3. JOB COMPLETED (FEEDBACK REQUEST)
  {
    id: 'job_completed',
    name: 'Job Completed (Feedback Request)',
    category: 'feedback',
    recipient: 'customer',
    channels: { email: true, sms: false, push: false },
    enabled: true,
    delay: 60, // 1 hour delay
    emailTemplate: {
      subject: 'How was your move? Leave a review & tip your driver',
      body: `<p>Hi {{customer_name}},</p>
<p>Your job {{job_id}} has now been completed.</p>
<p>⭐ <strong>Please take a moment to leave feedback for your driver.</strong></p>
<p>💸 If you were happy with the service, you can also leave a tip – 100% goes directly to the driver.</p>
<p><a href="#">[Leave Review]</a> &nbsp; <a href="#">[Leave a Tip]</a></p>
<p>Thank you for choosing ShiftMyHome.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: Your job is complete. Leave a review or tip your driver in your account.'
    }
  },

  // 4. REVIEW LEFT
  {
    id: 'review_left',
    name: 'Customer Left Review',
    category: 'feedback',
    recipient: 'driver',
    channels: { email: true, sms: false, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Customer left you a review – Job {{job_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>Your customer has left you a review for job {{job_id}}.</p>
<p><strong>Rating:</strong><br>
Punctuality: ⭐⭐⭐⭐☆<br>
Communication: ⭐⭐⭐⭐⭐<br>
Care of goods: ⭐⭐⭐⭐☆<br>
Presentation: ⭐⭐⭐⭐☆</p>
<p>Thank you for delivering a great service.</p>`
    },
    smsTemplate: {
      text: ''
    }
  },

  // 5. TIP RECEIVED
  {
    id: 'tip_received',
    name: 'Tip Received',
    category: 'payment',
    recipient: 'driver',
    channels: { email: true, sms: false, push: true },
    enabled: true,
    emailTemplate: {
      subject: 'Congrats, you got a tip!',
      body: `<p>🎉 Great news {{driver_name}}!</p>
<p>{{customer_name}} sent you a tip of £{{tip_amount}} for a great job.</p>
<p>100% of your tip goes to you.<br>
The amount will be included in your next payout.</p>
<p>View payments in your dashboard.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: You received a £{{tip_amount}} tip from {{customer_name}}!'
    }
  },

  // 6. JOB CANCELLED (DRIVER)
  {
    id: 'job_cancelled_driver',
    name: 'Job Cancelled (To Driver)',
    category: 'job',
    recipient: 'driver',
    channels: { email: true, sms: true, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Job {{job_id}} has been cancelled – ShiftMyHome',
      body: `<p>Hi {{driver_name}},</p>
<p>Unfortunately, job {{job_id}} has been cancelled.</p>
<p><strong>Job details:</strong><br>
Service: {{service_type}}<br>
Pickup: {{pickup_address}}<br>
Drop-off: {{dropoff_address}}<br>
Date: {{job_date}}<br>
Time window: {{time_window}}</p>
<p>We apologise for any inconvenience caused.</p>
<p>If you now have spare capacity, please log in to your ShiftMyHome account to view available work.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: Job {{job_id}} has been cancelled. Check your account for available work.'
    }
  },

  // 7. JOB CANCELLED (CUSTOMER)
  {
    id: 'job_cancelled_customer',
    name: 'Job Cancelled (To Customer)',
    category: 'job',
    recipient: 'customer',
    channels: { email: true, sms: false, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Your job {{job_id}} has been cancelled – ShiftMyHome',
      body: `<p>Hi {{customer_name}},</p>
<p>Your job {{job_id}} has been cancelled.</p>
<p>If a refund is due, it will be processed according to our cancellation policy.<br>
You can view details in your account.</p>
<p>– ShiftMyHome</p>`
    },
    smsTemplate: {
      text: ''
    }
  },

  // 8. JOB DEALLOCATED
  {
    id: 'job_deallocated',
    name: 'Job Deallocated',
    category: 'job',
    recipient: 'driver',
    channels: { email: true, sms: true, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'You have been deallocated from job {{job_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>You have been deallocated from job {{job_id}}.</p>
<p><strong>Reason:</strong> {{deallocation_reason}}</p>
<p>Please note that deallocation fees may apply depending on how close this is to the scheduled start time.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: You have been deallocated from job {{job_id}}. Check email for details.'
    }
  },

  // 9. DEALLOCATION FEE APPLIED
  {
    id: 'deallocation_fee',
    name: 'Deallocation Fee Applied',
    category: 'payment',
    recipient: 'driver',
    channels: { email: true, sms: false, push: false },
    enabled: true,
    emailTemplate: {
      subject: 'Deallocation fee applied – Job {{job_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>A deallocation fee has been applied for job {{job_id}}.</p>
<ul>
<li>Fee amount: £{{fee_amount}}</li>
<li>Reason: {{deallocation_reason}}</li>
<li>Time before job: {{hours_before_start}} hours</li>
</ul>
<p>This amount will be deducted from your next payout.</p>`
    },
    smsTemplate: {
      text: ''
    }
  },

  // 10. JOURNEY ALLOCATED (SYSTEM)
  {
    id: 'journey_allocated',
    name: 'Journey Allocated',
    category: 'journey',
    recipient: 'driver',
    channels: { email: true, sms: true, push: true },
    enabled: true,
    emailTemplate: {
      subject: 'New Journey Allocated – {{journey_id}}',
      body: `<p>Hi {{driver_name}},</p>
<p>You have been allocated a new journey: <strong>{{journey_id}}</strong>.</p>
<p>Please log in to the driver app to view details and accept or reject this journey.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: New journey {{journey_id}} allocated to you. Please check app.'
    }
  },

  // 11. JOB ADDED TO JOURNEY
  {
    id: 'job_added_to_journey',
    name: 'Job Added to Journey',
    category: 'journey',
    recipient: 'driver',
    channels: { email: true, sms: false, push: true },
    enabled: true,
    emailTemplate: {
      subject: 'Update: Job added to Journey {{journey_id}}',
      body: `<p>A new job ({{job_id}}) has been added to your journey {{journey_id}}.</p>
<p>Your route has been updated. Please check the new schedule.</p>`
    },
    smsTemplate: {
      text: 'ShiftMyHome: Job {{job_id}} added to journey {{journey_id}}. Route updated.'
    }
  }
];

// --- DEFAULT RULES (EXACTLY FROM DIAGRAM) ---
export const DEFAULT_DEALLOCATION_RULES: DeallocationRule[] = [
  { id: 'rule-1', minHoursBefore: 120, maxHoursBefore: null, feeType: 'fixed', value: 10 }, // >120h -> £10
  { id: 'rule-2', minHoursBefore: 72, maxHoursBefore: 120, feeType: 'percent', value: 25 }, // 72-120h -> 25%
  { id: 'rule-3', minHoursBefore: 24, maxHoursBefore: 72, feeType: 'percent', value: 50 }, // 24-72h -> 50%
  { id: 'rule-4', minHoursBefore: 0, maxHoursBefore: 24, feeType: 'percent', value: 100 }, // <24h -> 100%
];

// --- MOCK LOGS ---
export const MOCK_LOGS: NotificationLog[] = [
  { id: 'log-1', date: '2023-12-01 14:30', event: 'Tip Received', recipient: 'Driver - Mike Brown', channel: 'email', status: 'sent', metadata: { jobId: 'JOB-123', journeyId: 'J-99' } },
  { id: 'log-2', date: '2023-12-01 12:00', event: 'Job Started', recipient: 'Customer - Sarah J', channel: 'sms', status: 'delivered', metadata: { jobId: 'JOB-456' } },
  { id: 'log-3', date: '2023-11-30 09:15', event: 'Job Cancelled', recipient: 'Driver - John Smith', channel: 'email', status: 'opened', metadata: { jobId: 'JOB-789' } },
  { id: 'log-4', date: '2023-11-30 09:15', event: 'Job Cancelled', recipient: 'Customer - Alex D', channel: 'email', status: 'sent', metadata: { jobId: 'JOB-789' } },
  { id: 'log-5', date: '2023-11-29 18:00', event: 'Deallocation Fee', recipient: 'Driver - Mike Brown', channel: 'email', status: 'sent', metadata: { fee: 25, jobId: 'JOB-101' } },
];
