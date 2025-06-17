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
  // Clients
  CLIENTS_VIEW = 'clients:view',
  CLIENTS_EDIT = 'clients:edit',
  // Employees
  EMPLOYEES_VIEW = 'employees:view',
  EMPLOYEES_EDIT = 'employees:edit',
  // Equipments & Fleet
  EQUIPMENT_VIEW = 'equipment:view',
  EQUIPMENT_EDIT = 'equipment:edit',
  FLEET_VIEW = 'fleet:view',
  FLEET_EDIT = 'fleet:edit',
  // Visitors
  VISITORS_VIEW = 'visitors:view',
  VISITORS_EDIT = 'visitors:edit',
  // Reports & Compliance
  REPORTS_VIEW = 'reports:view',
  REPORTS_EDIT = 'reports:edit',
}

/**
 * Default permission matrix for each role.
 * Admin gets every permission by default.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: Object.values(Permission),
  supervisor: [
    Permission.DASHBOARD_VIEW,
    Permission.MISSIONS_VIEW,
    Permission.MISSIONS_EDIT,
    Permission.TICKETS_VIEW,
    Permission.CLIENTS_VIEW,
    Permission.EMPLOYEES_VIEW,
    Permission.EQUIPMENT_VIEW,
    Permission.FLEET_VIEW,
    Permission.VISITORS_VIEW,
    Permission.REPORTS_VIEW,
  ],
  agent: [
    Permission.DASHBOARD_VIEW,
    Permission.MISSIONS_VIEW,
    Permission.CLIENTS_VIEW,
    Permission.EQUIPMENT_VIEW,
    Permission.REPORTS_VIEW,
  ],
};

export type AccreditationLevel = 'basic' | 'intermediate' | 'advanced'; 