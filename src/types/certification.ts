export interface Certification {
  id: number;
  name: string;
  provider: string;
  agentId: number;
  agentName: string;
  issueDate: string;
  expiryDate?: string;
  isValid: boolean;
}

export interface CertificationFilters {
  status?: string;
  agentId?: number;
  search?: string;
  validOnly?: boolean;
} 