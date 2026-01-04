/**
 * SECURITY MANAGER
 * 2FA, Rate Limiting, Audit Logs, Session Management
 */

// ==================== TYPES ====================

export interface TwoFactorAuth {
  userId: string;
  secret: string;
  enabled: boolean;
  backupCodes: string[];
}

export interface RateLimitRule {
  key: string;
  maxRequests: number;
  windowMs: number;
  requests: number;
  resetAt: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'success' | 'failure';
}

export interface SecuritySession {
  sessionId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

// ==================== SECURITY MANAGER ====================

class SecurityManager {
  private twoFactorAccounts: Map<string, TwoFactorAuth> = new Map();
  private rateLimits: Map<string, RateLimitRule> = new Map();
  private auditLogs: AuditLog[] = [];
  private sessions: Map<string, SecuritySession> = new Map();
  private blacklistedIPs: Set<string> = new Set();

  // ==================== TWO-FACTOR AUTHENTICATION ====================

  enableTwoFactor(userId: string): { secret: string; qrCode: string; backupCodes: string[] } {
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();

    const twoFactor: TwoFactorAuth = {
      userId,
      secret,
      enabled: true,
      backupCodes,
    };

    this.twoFactorAccounts.set(userId, twoFactor);

    // In production, use a library like 'qrcode' to generate QR code
    const qrCode = `otpauth://totp/ShiftMyHome:${userId}?secret=${secret}&issuer=ShiftMyHome`;

    this.logAudit(userId, 'enable_2fa', 'security', { success: true });

    return { secret, qrCode, backupCodes };
  }

  disableTwoFactor(userId: string, code: string): boolean {
    const twoFactor = this.twoFactorAccounts.get(userId);
    if (!twoFactor) return false;

    if (!this.verifyTOTP(twoFactor.secret, code)) {
      this.logAudit(userId, 'disable_2fa', 'security', { success: false, reason: 'invalid_code' });
      return false;
    }

    this.twoFactorAccounts.delete(userId);
    this.logAudit(userId, 'disable_2fa', 'security', { success: true });

    return true;
  }

  verifyTwoFactor(userId: string, code: string): boolean {
    const twoFactor = this.twoFactorAccounts.get(userId);
    if (!twoFactor || !twoFactor.enabled) return true; // 2FA not enabled

    // Try TOTP code
    if (this.verifyTOTP(twoFactor.secret, code)) {
      return true;
    }

    // Try backup code
    const backupIndex = twoFactor.backupCodes.indexOf(code);
    if (backupIndex !== -1) {
      twoFactor.backupCodes.splice(backupIndex, 1); // Use once
      this.logAudit(userId, 'use_backup_code', 'security', { codesRemaining: twoFactor.backupCodes.length });
      return true;
    }

    this.logAudit(userId, 'failed_2fa', 'security', { code });
    return false;
  }

  private generateSecret(): string {
    // Generate 32-character base32 secret
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  private verifyTOTP(secret: string, code: string): boolean {
    // Simplified TOTP verification (in production, use 'otplib' or similar)
    // This is a mock implementation
    return code.length === 6 && /^\d+$/.test(code);
  }

  // ==================== RATE LIMITING ====================

  checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    let rule = this.rateLimits.get(key);

    if (!rule || now > rule.resetAt) {
      // Create new window
      rule = {
        key,
        maxRequests,
        windowMs,
        requests: 0,
        resetAt: now + windowMs,
      };
      this.rateLimits.set(key, rule);
    }

    rule.requests++;

    if (rule.requests > maxRequests) {
      this.logAudit('system', 'rate_limit_exceeded', 'security', { key, requests: rule.requests });
      return false;
    }

    return true;
  }

  getRateLimitStatus(key: string): { allowed: boolean; remaining: number; resetIn: number } {
    const rule = this.rateLimits.get(key);
    
    if (!rule) {
      return { allowed: true, remaining: 100, resetIn: 60000 };
    }

    const now = Date.now();
    const remaining = Math.max(0, rule.maxRequests - rule.requests);
    const resetIn = Math.max(0, rule.resetAt - now);

    return {
      allowed: rule.requests <= rule.maxRequests,
      remaining,
      resetIn,
    };
  }

  // ==================== AUDIT LOGS ====================

  logAudit(
    userId: string,
    action: string,
    resource: string,
    details: any,
    status: 'success' | 'failure' = 'success'
  ): void {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      details,
      ipAddress: this.getCurrentIP(),
      userAgent: this.getCurrentUserAgent(),
      timestamp: new Date(),
      status,
    };

    this.auditLogs.push(log);

    // Keep only last 10000 logs (in production, store in database)
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }

    console.log(`[Audit] ${userId} ${action} ${resource}`, details);
  }

  getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLog[] {
    let logs = [...this.auditLogs];

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action);
    }

    if (filters?.resource) {
      logs = logs.filter(log => log.resource === filters.resource);
    }

    if (filters?.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!);
    }

    // Sort by most recent first
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // ==================== SESSION MANAGEMENT ====================

  createSession(userId: string, expiresInMs: number = 24 * 60 * 60 * 1000): string {
    const sessionId = this.generateSessionId();
    const now = new Date();

    const session: SecuritySession = {
      sessionId,
      userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + expiresInMs),
      ipAddress: this.getCurrentIP(),
      userAgent: this.getCurrentUserAgent(),
      isActive: true,
    };

    this.sessions.set(sessionId, session);
    this.logAudit(userId, 'create_session', 'security', { sessionId });

    return sessionId;
  }

  validateSession(sessionId: string): { valid: boolean; userId?: string } {
    const session = this.sessions.get(sessionId);

    if (!session || !session.isActive) {
      return { valid: false };
    }

    if (new Date() > session.expiresAt) {
      session.isActive = false;
      return { valid: false };
    }

    return { valid: true, userId: session.userId };
  }

  revokeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.logAudit(session.userId, 'revoke_session', 'security', { sessionId });
    }
  }

  revokeAllSessions(userId: string): void {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        session.isActive = false;
      }
    }
    this.logAudit(userId, 'revoke_all_sessions', 'security', {});
  }

  getUserSessions(userId: string): SecuritySession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
  }

  // ==================== IP BLOCKING ====================

  blockIP(ipAddress: string, reason: string): void {
    this.blacklistedIPs.add(ipAddress);
    this.logAudit('system', 'block_ip', 'security', { ipAddress, reason });
  }

  unblockIP(ipAddress: string): void {
    this.blacklistedIPs.delete(ipAddress);
    this.logAudit('system', 'unblock_ip', 'security', { ipAddress });
  }

  isIPBlocked(ipAddress: string): boolean {
    return this.blacklistedIPs.has(ipAddress);
  }

  // ==================== PASSWORD SECURITY ====================

  validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    else feedback.push('Use at least 12 characters');

    // Uppercase
    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');

    // Lowercase
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');

    // Numbers
    if (/\d/.test(password)) score += 15;
    else feedback.push('Add numbers');

    // Special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
    else feedback.push('Add special characters');

    // No common patterns
    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
    if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score += 10;
    } else {
      feedback.push('Avoid common patterns');
      score = Math.max(0, score - 30);
    }

    return {
      isStrong: score >= 70,
      score,
      feedback,
    };
  }

  hashPassword(password: string): string {
    // In production, use bcrypt or argon2
    // This is a simplified mock
    return `hashed_${password}_${Date.now()}`;
  }

  verifyPassword(password: string, hash: string): boolean {
    // In production, use bcrypt.compare()
    return hash.includes(password);
  }

  // ==================== UTILITIES ====================

  private getCurrentIP(): string {
    // In production, get from request headers
    return '127.0.0.1';
  }

  private getCurrentUserAgent(): string {
    return navigator.userAgent || 'Unknown';
  }

  // ==================== SECURITY SUMMARY ====================

  getSecuritySummary(userId: string): {
    twoFactorEnabled: boolean;
    activeSessions: number;
    recentLogins: number;
    failedAttempts: number;
    lastActivity: Date | null;
  } {
    const twoFactor = this.twoFactorAccounts.get(userId);
    const sessions = this.getUserSessions(userId);
    const recentLogs = this.getAuditLogs({ userId, limit: 100 });

    const loginLogs = recentLogs.filter(log => log.action === 'login');
    const failedLogs = recentLogs.filter(log => log.status === 'failure');
    const lastActivity = recentLogs[0]?.timestamp || null;

    return {
      twoFactorEnabled: !!twoFactor?.enabled,
      activeSessions: sessions.length,
      recentLogins: loginLogs.length,
      failedAttempts: failedLogs.length,
      lastActivity,
    };
  }
}

// ==================== SINGLETON ====================

export const securityManager = new SecurityManager();

// ==================== CONVENIENCE FUNCTIONS ====================

export function requireAuth(sessionId: string): boolean {
  return securityManager.validateSession(sessionId).valid;
}

export function requireRateLimit(key: string, max: number = 100): boolean {
  return securityManager.checkRateLimit(key, max);
}

export function logSecurityEvent(userId: string, action: string, details: any): void {
  securityManager.logAudit(userId, action, 'security', details);
}
