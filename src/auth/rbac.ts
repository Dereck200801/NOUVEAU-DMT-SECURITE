export type Role = 'admin' | 'supervisor' | 'agent';

// Fine-grained permissions (extend as the app grows)
export enum Permission {
  // Missions
  MISSIONS_VIEW = 'missions:view',
  MISSIONS_EDIT = 'missions:edit',
  // Tickets / Help-Desk
  TICKETS_VIEW = 'tickets:view',
  TICKETS_EDIT = 'tickets:edit',
  // Dashboard metrics
  DASHBOARD_VIEW = 'dashboard:view',
}

/**
 * Default permission matrix for each role.
 * Admin gets every permission by default.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: Object.values(Permission),
  supervisor: [
    Permission.MISSIONS_VIEW,
    Permission.MISSIONS_EDIT,
    Permission.TICKETS_VIEW,
    Permission.DASHBOARD_VIEW,
  ],
  agent: [Permission.MISSIONS_VIEW, Permission.DASHBOARD_VIEW],
};

export type AccreditationLevel = 'basic' | 'intermediate' | 'advanced'; 