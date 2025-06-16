export interface Incident {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  severity: string; // 'high', 'medium', 'low'
  status: string; // 'open', 'investigating', 'resolved'
  reportedBy: number;
  reportedByName: string;
  assignedTo: number | null;
  assignedToName: string | null;
  resolutionDate?: string;
  resolutionNotes?: string;
}

export interface IncidentFilters {
  status?: string;
  severity?: string;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface IncidentStats {
  total: number;
  resolved: number;
  pending: number;
  investigating: number;
  bySeverity: {
    high: number;
    medium: number;
    low: number;
  };
} 