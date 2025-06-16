export type MissionStatus = 'active' | 'planned' | 'completed';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MissionLocation {
  id: number;
  missionId: number;
  name: string;
  client: string;
  clientId: number;
  address: string;
  agentsCount: number;
  date: string;
  startDate: string;
  endDate: string;
  status: MissionStatus;
  coordinates: Coordinates;
  description?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface LocationFilters {
  status?: MissionStatus;
  clientId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface LocationStats {
  active: number;
  planned: number;
  completed: number;
  byClient: Record<number, number>; // clientId -> count
} 