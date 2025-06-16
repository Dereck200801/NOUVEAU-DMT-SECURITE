export interface Document {
  id: number;
  name: string;
  type: string;
  date: string;
  file: File | null;
  fileUrl?: string;
}

export interface MissionHistory {
  id: number;
  title: string;
  date: string;
  location: string;
  status: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  specialty: string;
  joinDate: string;
  address?: string;
  birthDate?: string;
  education?: string;
  certifications?: string[];
  documents?: Document[];
  missionHistory?: MissionHistory[];
  currentMission?: string | null;
  missionStartTime?: string | null;
  missionEndTime?: string | null;
  hoursOnDuty?: number | null;
  badge?: string;
  specializations?: string[];
}

export type NewAgent = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;

export interface AgentProfileProps {
  agent: Agent;
  onClose: () => void;
}

export interface NewDocument {
  name: string;
  type: string;
  date: string;
  file: File | null;
} 