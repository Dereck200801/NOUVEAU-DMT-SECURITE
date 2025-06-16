export interface Leave {
  id: number;
  employeeId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NewLeave {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status?: 'pending' | 'approved' | 'rejected';
} 