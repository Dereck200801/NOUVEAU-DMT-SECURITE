export type EquipmentType = 'uniform' | 'radio' | 'vehicle' | 'protection' | 'other';
export type EquipmentStatus = 'available' | 'assigned' | 'maintenance' | 'lost';
export type EquipmentCondition = 'good' | 'fair' | 'poor';

export interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  category: string;
  status: EquipmentStatus;
  assignedTo?: number; // employeeId
  purchaseDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface NewEquipment {
  name: string;
  serialNumber: string;
  category: string;
  status?: EquipmentStatus;
  assignedTo?: number;
  purchaseDate: string;
  notes?: string;
}

export interface EquipmentFilters {
  type?: EquipmentType;
  status?: EquipmentStatus;
  condition?: EquipmentCondition;
  search?: string;
}

export interface EquipmentStats {
  total: number;
  available: number;
  assigned: number;
  maintenance: number;
  byType: Record<EquipmentType, number>;
} 