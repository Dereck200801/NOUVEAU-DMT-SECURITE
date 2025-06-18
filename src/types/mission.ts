import type { Agent } from './agent';

export interface Mission {
  id: number;
  title: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  agents?: number[];
  description: string;
  created_at?: string;
  updated_at?: string;
}

export type NewMission = Omit<Mission, 'id' | 'created_at' | 'updated_at'>;

export interface MissionFormData {
  title: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
  status?: Mission['status'];
  agents?: number[];
  description: string;
}

export interface MissionAgentsProps {
  missionId: number;
  missionTitle: string;
  assignedAgents: number[];
  availableAgents: Agent[];
  onSave: (selectedIds: number[]) => void;
  onClose: () => void;
} 