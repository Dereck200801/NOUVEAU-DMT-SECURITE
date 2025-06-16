export interface Shift {
  id: number;
  employeeId: number;
  date: string; // format YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  status: 'planned' | 'completed' | 'cancelled';
}

export interface NewShift {
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status?: 'planned' | 'completed' | 'cancelled';
} 