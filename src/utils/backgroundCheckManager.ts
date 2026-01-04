/**
 * Background Check Manager
 * Driver verification & vetting with third-party integration
 */

export interface BackgroundCheck {
  id: string;
  driverId: string;
  driverName: string;
  driverEmail: string;
  type: 'basic' | 'standard' | 'enhanced';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'flagged';
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  results: {
    identityCheck: CheckResult;
    criminalRecord: CheckResult;
    drivingRecord: CheckResult;
    rightToWork: CheckResult;
    creditCheck?: CheckResult;
    references?: ReferenceCheck[];
  };
  flags: BackgroundFlag[];
  overallRisk: 'low' | 'medium' | 'high';
  approved: boolean;
  approvedBy?: string;
  notes: string;
  provider: 'checkr' | 'onfido' | 'sterling' | 'internal';
  providerId?: string;
  cost: number;
}

export interface CheckResult {
  status: 'pending' | 'clear' | 'flagged' | 'failed';
  completedAt?: Date;
  details: string;
  documents?: {
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
  flags?: string[];
}

export interface ReferenceCheck {
  id: string;
  referenceeName: string;
  referenceeContact: string;
  relationship: string;
  company: string;
  status: 'pending' | 'contacted' | 'completed' | 'unresponsive';
  rating?: number; // 1-5
  feedback?: string;
  contactedAt?: Date;
  completedAt?: Date;
}

export interface BackgroundFlag {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'criminal' | 'driving' | 'employment' | 'identity' | 'financial' | 'other';
  description: string;
  details: string;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
}

export interface DriverVerificationStatus {
  driverId: string;
  checks: {
    backgroundCheck: boolean;
    drivingLicense: boolean;
    insurance: boolean;
    rightToWork: boolean;
    references: boolean;
  };
  overallStatus: 'verified' | 'pending' | 'incomplete' | 'rejected';
  lastCheckDate?: Date;
  nextCheckDue?: Date;
  verificationLevel: 'basic' | 'standard' | 'enhanced';
  canDrive: boolean;
}

// ==================== CONFIGURATION ====================

const CHECK_TYPES = {
  basic: {
    name: 'Basic Check',
    includes: ['identity', 'driving_record'],
    cost: 25,
    duration: 1, // days
    validityPeriod: 180, // days
  },
  standard: {
    name: 'Standard Check',
    includes: ['identity', 'driving_record', 'criminal_record', 'right_to_work'],
    cost: 50,
    duration: 3,
    validityPeriod: 365,
  },
  enhanced: {
    name: 'Enhanced Check',
    includes: ['identity', 'driving_record', 'criminal_record', 'right_to_work', 'credit_check', 'references'],
    cost: 100,
    duration: 7,
    validityPeriod: 365,
  },
};

// ==================== BACKGROUND CHECK MANAGEMENT ====================

export function getAllBackgroundChecks(): BackgroundCheck[] {
  const stored = localStorage.getItem('background_checks');
  return stored ? JSON.parse(stored) : [];
}

export function getBackgroundCheck(checkId: string): BackgroundCheck | undefined {
  return getAllBackgroundChecks().find(c => c.id === checkId);
}

export function getDriverBackgroundChecks(driverId: string): BackgroundCheck[] {
  return getAllBackgroundChecks().filter(c => c.driverId === driverId);
}

export function requestBackgroundCheck(data: {
  driverId: string;
  driverName: string;
  driverEmail: string;
  type: BackgroundCheck['type'];
  requestedBy: string;
}): BackgroundCheck {
  const config = CHECK_TYPES[data.type];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.validityPeriod);

  const check: BackgroundCheck = {
    id: `bgc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    driverId: data.driverId,
    driverName: data.driverName,
    driverEmail: data.driverEmail,
    type: data.type,
    status: 'pending',
    requestedBy: data.requestedBy,
    requestedAt: new Date(),
    expiresAt,
    results: {
      identityCheck: { status: 'pending', details: '', documents: [] },
      criminalRecord: { status: 'pending', details: '', documents: [] },
      drivingRecord: { status: 'pending', details: '', documents: [] },
      rightToWork: { status: 'pending', details: '', documents: [] },
    },
    flags: [],
    overallRisk: 'medium',
    approved: false,
    notes: '',
    provider: 'checkr', // Default provider
    cost: config.cost,
  };

  // Add references if enhanced
  if (data.type === 'enhanced') {
    check.results.references = [];
  }

  const checks = getAllBackgroundChecks();
  checks.push(check);
  localStorage.setItem('background_checks', JSON.stringify(checks));

  // Initiate check with provider
  initiateProviderCheck(check);

  // Notify driver
  notifyDriverOfBackgroundCheck(check);

  return check;
}

function initiateProviderCheck(check: BackgroundCheck): void {
  // In production, this would call third-party API
  console.log(`🔍 Initiating ${check.type} background check for ${check.driverName} via ${check.provider}`);

  // Simulate API call
  check.status = 'in_progress';
  check.providerId = `${check.provider.toUpperCase()}-${Date.now()}`;

  // Simulate completion after delay
  setTimeout(() => {
    completeAutomatedChecks(check.id);
  }, 5000); // 5 seconds for demo
}

function completeAutomatedChecks(checkId: string): void {
  const checks = getAllBackgroundChecks();
  const check = checks.find(c => c.id === checkId);

  if (!check) return;

  // Simulate check results (in production, these come from provider API)
  check.results.identityCheck = {
    status: 'clear',
    completedAt: new Date(),
    details: 'Identity verified through government database',
    documents: [
      {
        name: 'Passport Verification',
        url: '/documents/passport-verified.pdf',
        uploadedAt: new Date(),
      },
    ],
  };

  check.results.drivingRecord = {
    status: 'clear',
    completedAt: new Date(),
    details: 'DVLA check complete. Clean driving record. 6 points available.',
    documents: [
      {
        name: 'DVLA Record',
        url: '/documents/dvla-record.pdf',
        uploadedAt: new Date(),
      },
    ],
  };

  check.results.criminalRecord = {
    status: 'clear',
    completedAt: new Date(),
    details: 'DBS check complete. No criminal convictions found.',
  };

  check.results.rightToWork = {
    status: 'clear',
    completedAt: new Date(),
    details: 'Verified right to work in the UK. Valid until 2028.',
  };

  // Simulate occasional flag (10% chance)
  if (Math.random() < 0.1) {
    const flag: BackgroundFlag = {
      id: `flag-${Date.now()}`,
      severity: 'low',
      category: 'driving',
      description: 'Minor driving infraction',
      details: 'Speeding ticket from 2 years ago (resolved)',
      requiresReview: false,
    };
    check.flags.push(flag);
  }

  // Determine overall risk
  check.overallRisk = check.flags.length === 0 ? 'low' : 
                      check.flags.some(f => f.severity === 'high') ? 'high' : 'medium';

  // Auto-approve if low risk and no critical flags
  if (check.overallRisk === 'low' || check.overallRisk === 'medium') {
    check.approved = true;
    check.approvedBy = 'auto-system';
  }

  check.status = 'completed';
  check.completedAt = new Date();

  localStorage.setItem('background_checks', JSON.stringify(checks));

  // Notify completion
  notifyCheckComplete(check);
}

function notifyDriverOfBackgroundCheck(check: BackgroundCheck): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: check.driverId,
    type: 'background_check_requested',
    title: 'Background Check Initiated',
    message: `A ${check.type} background check has been requested. Expected completion: ${CHECK_TYPES[check.type].duration} days.`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));

  // Send email (mock)
  console.log(`📧 Email sent to ${check.driverEmail}: Background check initiated`);
}

function notifyCheckComplete(check: BackgroundCheck): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Notify driver
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: check.driverId,
    type: 'background_check_complete',
    title: 'Background Check Complete',
    message: `Your background check has been completed. Status: ${check.approved ? '✅ Approved' : '⚠️ Under Review'}`,
    timestamp: new Date(),
    read: false,
  });

  // Notify admin if flagged
  if (check.flags.length > 0 || !check.approved) {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: 'admin',
      type: 'background_check_flagged',
      title: '⚠️ Background Check Requires Review',
      message: `${check.driverName}'s background check has ${check.flags.length} flag(s) and needs manual review.`,
      timestamp: new Date(),
      read: false,
    });
  }

  localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ==================== MANUAL REVIEW ====================

export function reviewBackgroundCheck(checkId: string, reviewedBy: string, approved: boolean, notes: string): void {
  const checks = getAllBackgroundChecks();
  const check = checks.find(c => c.id === checkId);

  if (!check) return;

  check.approved = approved;
  check.approvedBy = reviewedBy;
  check.notes = notes;

  // Review all flags
  check.flags.forEach(flag => {
    flag.reviewedBy = reviewedBy;
    flag.reviewedAt = new Date();
    flag.resolution = approved ? 'Approved despite flag' : 'Rejected due to flag';
  });

  localStorage.setItem('background_checks', JSON.stringify(checks));

  // Update driver status
  updateDriverVerificationStatus(check.driverId);

  // Notify driver
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: check.driverId,
    type: 'background_check_reviewed',
    title: approved ? '✅ Background Check Approved' : '❌ Background Check Not Approved',
    message: approved 
      ? 'Congratulations! Your background check has been approved. You can now start accepting jobs.'
      : 'Your background check could not be approved at this time. Please contact support for details.',
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

// ==================== REFERENCES ====================

export function addReference(checkId: string, reference: Omit<ReferenceCheck, 'id' | 'status' | 'contactedAt'>): void {
  const checks = getAllBackgroundChecks();
  const check = checks.find(c => c.id === checkId);

  if (!check || !check.results.references) return;

  const ref: ReferenceCheck = {
    id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    ...reference,
  };

  check.results.references.push(ref);
  localStorage.setItem('background_checks', JSON.stringify(checks));

  // Send reference request email (mock)
  console.log(`📧 Reference request sent to ${ref.referenceeName} at ${ref.referenceeContact}`);
}

export function completeReference(checkId: string, referenceId: string, rating: number, feedback: string): void {
  const checks = getAllBackgroundChecks();
  const check = checks.find(c => c.id === checkId);

  if (!check || !check.results.references) return;

  const ref = check.results.references.find(r => r.id === referenceId);
  if (!ref) return;

  ref.status = 'completed';
  ref.rating = rating;
  ref.feedback = feedback;
  ref.completedAt = new Date();

  localStorage.setItem('background_checks', JSON.stringify(checks));

  // Check if all references complete
  const allComplete = check.results.references.every(r => r.status === 'completed');
  if (allComplete) {
    const avgRating = check.results.references.reduce((sum, r) => sum + (r.rating || 0), 0) / check.results.references.length;
    
    if (avgRating < 3) {
      // Add flag if poor references
      check.flags.push({
        id: `flag-${Date.now()}`,
        severity: 'medium',
        category: 'employment',
        description: 'Poor reference ratings',
        details: `Average rating: ${avgRating.toFixed(1)}/5`,
        requiresReview: true,
      });
    }
  }

  localStorage.setItem('background_checks', JSON.stringify(checks));
}

// ==================== DRIVER VERIFICATION STATUS ====================

export function getDriverVerificationStatus(driverId: string): DriverVerificationStatus {
  const checks = getDriverBackgroundChecks(driverId);
  const latestCheck = checks.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

  const driver = JSON.parse(localStorage.getItem('drivers') || '[]').find((d: any) => d.id === driverId);

  const status: DriverVerificationStatus = {
    driverId,
    checks: {
      backgroundCheck: latestCheck?.approved || false,
      drivingLicense: driver?.hasValidLicense || false,
      insurance: driver?.hasInsurance || false,
      rightToWork: latestCheck?.results.rightToWork.status === 'clear' || false,
      references: latestCheck?.results.references ? latestCheck.results.references.every(r => r.status === 'completed') : false,
    },
    overallStatus: 'pending',
    verificationLevel: latestCheck?.type || 'basic',
    canDrive: false,
  };

  // Determine overall status
  const requiredChecks = ['backgroundCheck', 'drivingLicense', 'rightToWork'];
  const allRequired = requiredChecks.every(check => status.checks[check as keyof typeof status.checks]);

  if (allRequired && status.checks.insurance) {
    status.overallStatus = 'verified';
    status.canDrive = true;
  } else if (allRequired) {
    status.overallStatus = 'incomplete';
  } else if (latestCheck?.status === 'failed' || (latestCheck && !latestCheck.approved)) {
    status.overallStatus = 'rejected';
  }

  if (latestCheck) {
    status.lastCheckDate = latestCheck.completedAt;
    if (latestCheck.expiresAt) {
      status.nextCheckDue = latestCheck.expiresAt;
    }
  }

  return status;
}

export function updateDriverVerificationStatus(driverId: string): void {
  const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
  const driver = drivers.find((d: any) => d.id === driverId);

  if (!driver) return;

  const status = getDriverVerificationStatus(driverId);
  driver.verificationStatus = status.overallStatus;
  driver.canAcceptJobs = status.canDrive;

  localStorage.setItem('drivers', JSON.stringify(drivers));
}

// ==================== ANALYTICS ====================

export function getBackgroundCheckAnalytics() {
  const checks = getAllBackgroundChecks();

  const byStatus = checks.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byRisk = checks.reduce((acc, c) => {
    acc[c.overallRisk] = (acc[c.overallRisk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCost = checks.reduce((sum, c) => sum + c.cost, 0);
  const approvalRate = (checks.filter(c => c.approved).length / (checks.length || 1)) * 100;

  return {
    totalChecks: checks.length,
    byStatus,
    byRisk,
    approvalRate,
    totalCost,
    averageCost: totalCost / (checks.length || 1),
    flaggedChecks: checks.filter(c => c.flags.length > 0).length,
  };
}

// ==================== COMPLIANCE ====================

export function checkExpiredVerifications(): BackgroundCheck[] {
  const checks = getAllBackgroundChecks();
  const now = new Date();

  return checks.filter(check => 
    check.approved && 
    check.expiresAt && 
    new Date(check.expiresAt) < now
  );
}

export function sendExpiryReminders(): void {
  const checks = getAllBackgroundChecks();
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  checks.forEach(check => {
    if (check.expiresAt && new Date(check.expiresAt) < thirtyDaysFromNow && new Date(check.expiresAt) > now) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: check.driverId,
        type: 'verification_expiring',
        title: '⚠️ Background Check Expiring Soon',
        message: `Your background check expires on ${new Date(check.expiresAt).toLocaleDateString()}. Please renew to continue driving.`,
        timestamp: new Date(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  });
}

// ==================== THIRD-PARTY INTEGRATION ====================

export function integrateWithCheckr(apiKey: string): void {
  // Placeholder for Checkr API integration
  console.log('🔗 Checkr integration configured');
}

export function integrateWithOnfido(apiKey: string): void {
  // Placeholder for Onfido API integration
  console.log('🔗 Onfido integration configured');
}
