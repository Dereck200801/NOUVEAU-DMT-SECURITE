export type ContractType = 'cdi' | 'cdd' | 'interim' | 'stagiaire';

export interface ContractInfo {
  type: ContractType;
  startDate: string;
  endDate?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface LeaveBalance {
  annual: number; // droits acquis totaux
  remaining: number; // solde restant
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department?: string;
  status: 'active' | 'inactive' | 'on_leave';
  contract: ContractInfo;
  salary?: {
    grade: string;
    hourlyRate: number;
    bonuses?: number;
  };
  leaveBalance: LeaveBalance;
  documents?: import('./agent').Document[];
  created_at?: string;
  updated_at?: string;
}

export interface NewEmployee extends Omit<Employee, 'id' | 'created_at' | 'updated_at'> {} 