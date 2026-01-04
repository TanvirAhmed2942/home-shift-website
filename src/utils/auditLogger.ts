
export interface AuditLogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
  jobId?: string;
  timestamp: string;
  ip: string; // Mocked
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'refund' | 'financial' | 'security';
}

const STORAGE_KEY = 'shiftmyhome_audit_logs';

// Initialize with some mock data if empty
const INITIAL_LOGS: AuditLogEntry[] = [
  { 
    id: '1', 
    user: 'System Admin', 
    role: 'owner', 
    action: 'System Initialization', 
    details: 'Audit logging system started', 
    timestamp: new Date().toISOString(), 
    ip: '127.0.0.1', 
    type: 'security' 
  }
];

export const auditLogger = {
  getLogs: (jobId?: string): AuditLogEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let logs: AuditLogEntry[] = stored ? JSON.parse(stored) : INITIAL_LOGS;
      
      if (jobId) {
        logs = logs.filter(log => log.jobId === jobId);
      }
      
      // Sort by newest first
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.error("Failed to load audit logs", e);
      return [];
    }
  },

  log: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ip'>) => {
    try {
      const logs = auditLogger.getLogs();
      const newLog: AuditLogEntry = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1' // Mock IP
      };
      
      logs.unshift(newLog); // Add to top
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return newLog;
    } catch (e) {
      console.error("Failed to save audit log", e);
    }
  },

  // Helper for formatting
  formatDate: (isoString: string) => {
    return new Date(isoString).toLocaleString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  }
};
