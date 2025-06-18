import axios from 'axios';
import { Agent } from '../types/agent';
import { API_BASE_URL } from '../api';

// Utiliser un chemin relatif au lieu d'une URL en dur
const API_URL = API_BASE_URL;

// Interface pour les statistiques des agents
export interface AgentStats {
  total: number;
  active: number;
  inactive: number;
  onMission: number;
  bySpecialty: Record<string, number>;
  change: number; // Pourcentage de changement depuis le mois dernier
}

// Données de secours (fallback) pour les agents
const FALLBACK_AGENTS: Agent[] = [
  {
    id: 1,
    name: 'Pierre Mbemba',
    email: 'pierre.mbemba@dmtsecurite.com',
    phone: '+241 77 98 45 21',
    status: 'active',
    specialty: 'Surveillance',
    joinDate: '15/03/2021'
  },
  {
    id: 2,
    name: 'Didier Ondo',
    email: 'didier.ondo@dmtsecurite.com',
    phone: '+241 66 12 34 56',
    status: 'on_mission',
    specialty: 'Protection Rapprochée',
    joinDate: '21/06/2020'
  },
  {
    id: 3,
    name: 'Sarah Nzeng',
    email: 'sarah.nzeng@dmtsecurite.com',
    phone: '+241 74 56 78 90',
    status: 'on_mission',
    specialty: "Contrôle d'Accès",
    joinDate: '05/01/2022'
  },
  {
    id: 4,
    name: 'Marc Mba',
    email: 'marc.mba@dmtsecurite.com',
    phone: '+241 66 45 67 89',
    status: 'inactive',
    specialty: 'Surveillance',
    joinDate: '12/09/2021'
  }
];

// Données de secours pour les statistiques
const FALLBACK_STATS: AgentStats = {
  total: 18,
  active: 8,
  inactive: 2,
  onMission: 8,
  bySpecialty: {
    'Surveillance': 7,
    'Protection Rapprochée': 5,
    'Contrôle d\'Accès': 4,
    'Formation': 2
  },
  change: 5
};

// Données de secours pour les agents en mission
const FALLBACK_AGENTS_ON_DUTY = [
  {
    id: 1,
    name: 'Pierre Mbemba',
    email: 'pierre.mbemba@dmtsecurite.com',
    phone: '+241 77 98 45 21',
    status: 'on_mission',
    specialty: 'Protection Rapprochée',
    joinDate: '15/03/2021',
    currentMission: 'Protection VIP - Ministère',
    missionStartTime: '8h',
    missionEndTime: '18h',
    hoursOnDuty: 4
  },
  {
    id: 2,
    name: 'Didier Ondo',
    email: 'didier.ondo@dmtsecurite.com',
    phone: '+241 66 12 34 56',
    status: 'on_mission',
    specialty: 'Protection Rapprochée',
    joinDate: '21/06/2020',
    currentMission: 'Sécurité Événement',
    missionStartTime: '14h',
    missionEndTime: '22h',
    hoursOnDuty: 2
  },
  {
    id: 3,
    name: 'Sarah Nzeng',
    email: 'sarah.nzeng@dmtsecurite.com',
    phone: '+241 74 56 78 90',
    status: 'on_mission',
    specialty: "Contrôle d'Accès",
    joinDate: '05/01/2022',
    currentMission: 'Ronde Industrielle',
    missionStartTime: '6h',
    missionEndTime: '18h',
    hoursOnDuty: 6
  },
  {
    id: 4,
    name: 'Marc Mba',
    email: 'marc.mba@dmtsecurite.com',
    phone: '+241 66 45 67 89',
    status: 'active',
    specialty: 'Surveillance',
    joinDate: '12/09/2021',
    currentMission: null,
    missionStartTime: null,
    missionEndTime: null,
    hoursOnDuty: null
  }
];

export const agentService = {
  getAll: async (): Promise<Agent[]> => {
    try {
      const response = await axios.get(`${API_URL}/agents`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_AGENTS;
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      console.log('Using fallback agent data');
      return FALLBACK_AGENTS;
    }
  },
  
  getById: async (id: number): Promise<Agent> => {
    try {
      const response = await axios.get(`${API_URL}/agents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching agent with id ${id}:`, error);
      // Retourner un agent de secours correspondant à l'ID si possible
      const fallbackAgent = FALLBACK_AGENTS.find(a => a.id === id);
      if (fallbackAgent) {
        return fallbackAgent;
      }
      throw error;
    }
  },
  
  create: async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
    try {
      const response = await axios.post(`${API_URL}/agents`, agent);
      return response.data;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  },
  
  update: async (id: number, agent: Partial<Agent>): Promise<Agent> => {
    try {
      const response = await axios.put(`${API_URL}/agents/${id}`, agent);
      return response.data;
    } catch (error) {
      console.error(`Error updating agent with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/agents/${id}`);
    } catch (error) {
      console.error(`Error deleting agent with id ${id}:`, error);
      throw error;
    }
  },
  
  getStats: async (): Promise<AgentStats> => {
    try {
      const response = await axios.get(`${API_URL}/agents/stats`);
      
      // Vérifier que la réponse contient les champs attendus
      if (response.data && typeof response.data === 'object' && 'bySpecialty' in response.data) {
        return response.data;
      } else {
        console.warn('API response does not have the expected format, using fallback stats');
        return FALLBACK_STATS;
      }
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      console.log('Using fallback agent stats');
      return FALLBACK_STATS;
    }
  },
  
  getAgentsOnDuty: async (): Promise<Agent[]> => {
    try {
      const response = await axios.get(`${API_URL}/agents/on-duty`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_AGENTS_ON_DUTY;
      }
    } catch (error) {
      console.error('Error fetching agents on duty:', error);
      console.log('Using fallback agents on duty data');
      return FALLBACK_AGENTS_ON_DUTY;
    }
  },
  
  assignToMission: async (agentId: number, missionId: number): Promise<Agent> => {
    try {
      const response = await axios.post(`${API_URL}/agents/${agentId}/assign`, { missionId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning agent ${agentId} to mission ${missionId}:`, error);
      throw error;
    }
  }
};

export default agentService; 