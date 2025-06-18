import type { Employee } from './employee';

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

/**
 * Un Agent est un employé appartenant au personnel de sécurité.
 * On hérite des champs communs d'Employee et on ajoute les attributs
 * spécifiques (missions, spécialité, etc.).
 */
export interface Agent extends Omit<Employee, 'position' | 'department' | 'contract' | 'leaveBalance'> {
  /** Par exemple 'Surveillance', 'Protection rapprochée' … */
  specialty: string;
  /** Statut métier : on_mission | active | inactive … */
  status: string;
  joinDate: string;

  // Informations propres au suivi opérationnel
  missionHistory?: MissionHistory[];
  currentMission?: string | null;
  missionStartTime?: string | null;
  missionEndTime?: string | null;
  hoursOnDuty?: number | null;

  // Divers
  address?: string;
  birthDate?: string;
  education?: string;
  certifications?: string[];
  documents?: Document[];
  badge?: string;
  specializations?: string[];

  // Champs RH optionnels pour aligner avec Employee
  contract?: Employee['contract'];
  leaveBalance?: Employee['leaveBalance'];
}

export type NewAgent = Omit<Agent, 'id' | 'created_at' | 'updated_at'>;

export interface AgentProfileProps {
  agent: Agent;
  onClose: (updated?: Agent) => void;
  isNew?: boolean;
}

export interface NewDocument {
  name: string;
  type: string;
  date: string;
  file: File | null;
} 