
export type UserRole = 'owner' | 'finance_admin' | 'operations' | 'support' | 'viewer';

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

// MOCK USER STATE - In a real app this comes from AuthContext/Supabase
let CURRENT_USER: User = {
  name: 'Admin Owner',
  role: 'owner',
  email: 'admin@shiftmyhome.co.uk'
};

export const PERMISSIONS = {
  // Finance & Refunds
  PROCESS_REFUND: ['owner', 'finance_admin'],
  APPROVE_PAYOUT: ['owner', 'finance_admin'],
  VIEW_FINANCIALS: ['owner', 'finance_admin'],
  EDIT_PRICING: ['owner', 'finance_admin'],

  // Job Management
  CREATE_JOB: ['owner', 'operations', 'support'],
  EDIT_JOB_DETAILS: ['owner', 'operations', 'support'],
  CANCEL_JOB: ['owner', 'operations'],
  DELETE_JOB: ['owner'],
  ASSIGN_DRIVER: ['owner', 'operations'],
  DEALLOCATE_JOB: ['owner', 'operations'],
  
  // System
  VIEW_AUDIT_LOGS: ['owner', 'finance_admin', 'operations', 'support'], // Viewer can't see logs? Let's say yes for now or restricted.
  MANAGE_USERS: ['owner']
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const authManager = {
  getUser: () => CURRENT_USER,
  
  // For demo purposes only - to switch roles
  switchUser: (role: UserRole) => {
    const names = {
        owner: 'Admin Owner',
        finance_admin: 'Mike Finance',
        operations: 'Sarah Ops',
        support: 'Tom Support',
        viewer: 'Guest Viewer'
    };
    CURRENT_USER = {
        name: names[role],
        role: role,
        email: `${role}@shiftmyhome.co.uk`
    };
    // Trigger an event or reload might be needed in a real app, 
    // but React components will re-render if we use a hook. 
    // For now, this is a simple utility.
    window.location.reload(); // Force refresh to update UI state
  },

  hasPermission: (permission: Permission): boolean => {
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles.includes(CURRENT_USER.role as any);
  }
};
