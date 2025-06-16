export type CertificationStatus = 'valid' | 'expiring' | 'expired';

export interface Certification {
  id: number;
  name: string;
  type: string;
  agentId: number;
  agentName: string;
  issueDate: string;
  expirationDate: string;
  daysRemaining: number;
  status: CertificationStatus;
  issuingAuthority?: string;
  certificateNumber?: string;
  notes?: string;
}

export interface Training {
  id: number;
  name: string;
  description?: string;
  agentId: number;
  agentName: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  score?: number;
  provider?: string;
  notes?: string;
}

export interface CertificationFilters {
  status?: CertificationStatus;
  type?: string;
  search?: string;
  expiringWithin?: number; // jours
}

export interface TrainingFilters {
  status?: 'completed' | 'in_progress' | 'scheduled';
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CertificationStats {
  total: number;
  valid: number;
  expiring: number;
  expired: number;
  byType: Record<string, number>;
} 