export type VehicleStatus = 'available' | 'assigned' | 'maintenance' | 'out_of_service';

export interface Vehicle {
  id: number;
  make: string;          // Manufacturer, e.g., Toyota
  model: string;         // Model, e.g., Hilux
  plate: string;         // Registration plate
  status: VehicleStatus;
  assignedTo?: number;   // employeeId if vehicle assigned
  mileage: number;       // Current mileage in km
  lastServiceDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface NewVehicle {
  make: string;
  model: string;
  plate: string;
  status?: VehicleStatus;
  assignedTo?: number;
  mileage?: number;
  lastServiceDate?: string;
  notes?: string;
}

export interface VehicleFilters {
  status?: VehicleStatus;
  search?: string;
} 