/**
 * Customer Verification (KYC) System
 * ID verification, phone/email verification, SMS OTP, trust score
 */

export interface VerificationStatus {
  userId: string;
  userType: 'customer' | 'driver';
  
  // Verification levels
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  addressVerified: boolean;
  
  // Verification details
  emailVerificationDate?: Date;
  phoneVerificationDate?: Date;
  idVerificationDate?: Date;
  addressVerificationDate?: Date;
  
  // ID verification
  idType?: 'passport' | 'driving_license' | 'national_id';
  idNumber?: string; // Encrypted/hashed
  idExpiryDate?: Date;
  idDocumentUrl?: string;
  
  // Phone verification
  phoneNumber?: string;
  phoneCountryCode?: string;
  
  // Address verification
  addressLine1?: string;
  city?: string;
  postcode?: string;
  proofOfAddressUrl?: string;
  
  // Trust score
  trustScore: number; // 0-100
  trustLevel: 'unverified' | 'basic' | 'standard' | 'verified' | 'trusted';
  
  // Verification attempts
  verificationAttempts: {
    type: string;
    timestamp: Date;
    success: boolean;
    reason?: string;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPSession {
  id: string;
  userId: string;
  type: 'email' | 'sms';
  destination: string; // Email or phone number
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

/**
 * Get or create verification status
 */
export function getVerificationStatus(userId: string, userType: 'customer' | 'driver' = 'customer'): VerificationStatus {
  const stored = localStorage.getItem(`verification_${userId}`);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Create new verification status
  const status: VerificationStatus = {
    userId,
    userType,
    emailVerified: false,
    phoneVerified: false,
    idVerified: false,
    addressVerified: false,
    trustScore: 0,
    trustLevel: 'unverified',
    verificationAttempts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  saveVerificationStatus(status);
  return status;
}

/**
 * Save verification status
 */
export function saveVerificationStatus(status: VerificationStatus): void {
  status.updatedAt = new Date();
  status.trustScore = calculateTrustScore(status);
  status.trustLevel = getTrustLevel(status.trustScore);
  
  localStorage.setItem(`verification_${status.userId}`, JSON.stringify(status));
}

/**
 * Send email verification
 */
export async function sendEmailVerification(userId: string, email: string): Promise<string> {
  const code = generateOTPCode();
  
  const session: OTPSession = {
    id: `otp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'email',
    destination: email,
    code,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    verified: false,
    attempts: 0,
    createdAt: new Date(),
  };
  
  saveOTPSession(session);
  
  // In production, send actual email
  console.log(`Email OTP sent to ${email}: ${code}`);
  
  // Mock email sending
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return session.id;
}

/**
 * Send SMS verification
 */
export async function sendSMSVerification(userId: string, phoneNumber: string): Promise<string> {
  const code = generateOTPCode();
  
  const session: OTPSession = {
    id: `otp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'sms',
    destination: phoneNumber,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    verified: false,
    attempts: 0,
    createdAt: new Date(),
  };
  
  saveOTPSession(session);
  
  // In production, integrate with Twilio, AWS SNS, etc.
  console.log(`SMS OTP sent to ${phoneNumber}: ${code}`);
  
  // Mock SMS sending
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return session.id;
}

/**
 * Verify OTP code
 */
export function verifyOTPCode(sessionId: string, code: string): { success: boolean; message: string } {
  const session = getOTPSession(sessionId);
  
  if (!session) {
    return { success: false, message: 'Invalid session' };
  }
  
  if (session.verified) {
    return { success: false, message: 'Code already verified' };
  }
  
  if (new Date() > new Date(session.expiresAt)) {
    return { success: false, message: 'Code expired' };
  }
  
  if (session.attempts >= 3) {
    return { success: false, message: 'Too many attempts' };
  }
  
  session.attempts += 1;
  
  if (session.code !== code) {
    saveOTPSession(session);
    return { success: false, message: 'Invalid code' };
  }
  
  // Code is correct
  session.verified = true;
  saveOTPSession(session);
  
  // Update verification status
  const status = getVerificationStatus(session.userId);
  
  if (session.type === 'email') {
    status.emailVerified = true;
    status.emailVerificationDate = new Date();
  } else if (session.type === 'sms') {
    status.phoneVerified = true;
    status.phoneVerificationDate = new Date();
    status.phoneNumber = session.destination;
  }
  
  status.verificationAttempts.push({
    type: session.type,
    timestamp: new Date(),
    success: true,
  });
  
  saveVerificationStatus(status);
  
  return { success: true, message: 'Verification successful' };
}

/**
 * Submit ID verification
 */
export async function submitIDVerification(
  userId: string,
  idType: VerificationStatus['idType'],
  idNumber: string,
  idExpiryDate: Date,
  idDocumentFile: File
): Promise<{ success: boolean; message: string }> {
  // In production, upload to secure storage and verify with ID verification service
  // Examples: Stripe Identity, Onfido, Jumio, etc.
  
  // Simulate file upload and verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock ID document URL (in production, upload to S3/Cloud Storage)
  const idDocumentUrl = `storage://id-documents/${userId}/${Date.now()}.pdf`;
  
  const status = getVerificationStatus(userId);
  status.idType = idType;
  status.idNumber = hashIDNumber(idNumber);
  status.idExpiryDate = idExpiryDate;
  status.idDocumentUrl = idDocumentUrl;
  status.idVerified = true;
  status.idVerificationDate = new Date();
  
  status.verificationAttempts.push({
    type: 'id_verification',
    timestamp: new Date(),
    success: true,
  });
  
  saveVerificationStatus(status);
  
  return { success: true, message: 'ID verification submitted successfully' };
}

/**
 * Submit address verification
 */
export async function submitAddressVerification(
  userId: string,
  addressLine1: string,
  city: string,
  postcode: string,
  proofOfAddressFile: File
): Promise<{ success: boolean; message: string }> {
  // In production, verify address and upload proof
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const proofOfAddressUrl = `storage://address-proofs/${userId}/${Date.now()}.pdf`;
  
  const status = getVerificationStatus(userId);
  status.addressLine1 = addressLine1;
  status.city = city;
  status.postcode = postcode;
  status.proofOfAddressUrl = proofOfAddressUrl;
  status.addressVerified = true;
  status.addressVerificationDate = new Date();
  
  status.verificationAttempts.push({
    type: 'address_verification',
    timestamp: new Date(),
    success: true,
  });
  
  saveVerificationStatus(status);
  
  return { success: true, message: 'Address verification submitted successfully' };
}

/**
 * Calculate trust score (0-100)
 */
function calculateTrustScore(status: VerificationStatus): number {
  let score = 0;
  
  // Email verification: 20 points
  if (status.emailVerified) score += 20;
  
  // Phone verification: 25 points
  if (status.phoneVerified) score += 25;
  
  // ID verification: 35 points
  if (status.idVerified) score += 35;
  
  // Address verification: 20 points
  if (status.addressVerified) score += 20;
  
  // Penalty for failed attempts
  const failedAttempts = status.verificationAttempts.filter(a => !a.success).length;
  score -= Math.min(failedAttempts * 5, 20);
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Get trust level from score
 */
function getTrustLevel(score: number): VerificationStatus['trustLevel'] {
  if (score >= 90) return 'trusted';
  if (score >= 70) return 'verified';
  if (score >= 40) return 'standard';
  if (score >= 20) return 'basic';
  return 'unverified';
}

/**
 * Generate OTP code
 */
function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash ID number for security
 */
function hashIDNumber(idNumber: string): string {
  // In production, use proper encryption/hashing
  return `***${idNumber.slice(-4)}`;
}

/**
 * Save OTP session
 */
function saveOTPSession(session: OTPSession): void {
  const sessions = getAllOTPSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  
  localStorage.setItem('otp_sessions', JSON.stringify(sessions));
}

/**
 * Get all OTP sessions
 */
function getAllOTPSessions(): OTPSession[] {
  const stored = localStorage.getItem('otp_sessions');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get OTP session by ID
 */
function getOTPSession(sessionId: string): OTPSession | null {
  const sessions = getAllOTPSessions();
  return sessions.find(s => s.id === sessionId) || null;
}

/**
 * Check if user can book jobs
 */
export function canUserBookJobs(userId: string): { allowed: boolean; reason?: string } {
  const status = getVerificationStatus(userId);
  
  // Minimum requirements: email verified
  if (!status.emailVerified) {
    return { allowed: false, reason: 'Email verification required' };
  }
  
  // For high-value jobs, require more verification
  return { allowed: true };
}

/**
 * Get verification requirements for job value
 */
export function getVerificationRequirements(jobValue: number): string[] {
  const requirements: string[] = [];
  
  if (jobValue > 0) {
    requirements.push('Email verification');
  }
  
  if (jobValue > 500) {
    requirements.push('Phone verification');
  }
  
  if (jobValue > 1000) {
    requirements.push('ID verification');
  }
  
  if (jobValue > 5000) {
    requirements.push('Address verification');
  }
  
  return requirements;
}

/**
 * Get verification progress percentage
 */
export function getVerificationProgress(status: VerificationStatus): number {
  const total = 4; // email, phone, ID, address
  let completed = 0;
  
  if (status.emailVerified) completed++;
  if (status.phoneVerified) completed++;
  if (status.idVerified) completed++;
  if (status.addressVerified) completed++;
  
  return (completed / total) * 100;
}
