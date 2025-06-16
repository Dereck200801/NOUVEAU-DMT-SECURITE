export type ComplianceStatus = 'pending' | 'passed' | 'failed' | 'in_progress';

export interface ComplianceRecord {
  id: number;
  title: string;
  complianceType: string; // e.g., "Audit interne", "ISO 9001"
  targetDate: string; // YYYY-MM-DD
  completedDate?: string; // YYYY-MM-DD
  status: ComplianceStatus;
  ownerId?: number; // employeeId
  notes?: string;
}

export interface NewComplianceRecord {
  title: string;
  complianceType: string;
  targetDate: string;
  ownerId?: number;
  notes?: string;
} 