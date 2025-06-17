export interface Risk {
  id: number;
  title: string;
  description: string;
  category: string; // e.g., Physical, Cyber, Operational
  severity: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated';
  owner: string;
  dateIdentified: string; // format: DD/MM/YYYY
}

export interface RiskFilters {
  severity?: 'high' | 'medium' | 'low';
  status?: 'active' | 'mitigated';
  search?: string;
} 