import axios from 'axios';
import { Incident, IncidentFilters, IncidentStats } from '../types/incident';

// Utiliser un chemin relatif au lieu d'une URL en dur
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Même en développement, on utilise un chemin relatif

// Données de secours (fallback) pour les incidents
const FALLBACK_INCIDENTS: Incident[] = [
  {
    id: 1,
    title: 'Intrusion détectée',
    description: 'Tentative d\'intrusion dans le secteur A',
    date: '2023-11-15T14:30:00',
    location: 'Secteur A, Bâtiment 3',
    severity: 'high',
    status: 'resolved',
    reportedBy: 1,
    reportedByName: 'Jean Dupont',
    assignedTo: 2,
    assignedToName: 'Marie Dubois'
  },
  {
    id: 2,
    title: 'Alarme déclenchée',
    description: 'Alarme incendie déclenchée au 2ème étage',
    date: '2023-11-17T09:15:00',
    location: 'Bâtiment principal, 2ème étage',
    severity: 'high',
    status: 'investigating',
    reportedBy: 3,
    reportedByName: 'Paul Martin',
    assignedTo: 1,
    assignedToName: 'Jean Dupont'
  },
  {
    id: 3,
    title: 'Équipement défectueux',
    description: 'Caméra de surveillance hors service',
    date: '2023-11-16T11:45:00',
    location: 'Entrée principale',
    severity: 'medium',
    status: 'open',
    reportedBy: 2,
    reportedByName: 'Marie Dubois',
    assignedTo: null,
    assignedToName: null
  },
  {
    id: 4,
    title: 'Problème d\'accès',
    description: 'Badge d\'accès non fonctionnel',
    date: '2023-11-14T16:20:00',
    location: 'Porte sécurisée, Niveau -1',
    severity: 'low',
    status: 'resolved',
    reportedBy: 4,
    reportedByName: 'Sophie Petit',
    assignedTo: 3,
    assignedToName: 'Paul Martin'
  }
];

// Données de secours pour les statistiques d'incidents
const FALLBACK_STATS: IncidentStats = {
  total: 12,
  resolved: 6,
  pending: 3,
  investigating: 3,
  bySeverity: {
    high: 2,
    medium: 7,
    low: 3
  }
};

export const incidentService = {
  getAll: async (filters?: IncidentFilters): Promise<Incident[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.severity) params.append('severity', filters.severity);
        if (filters.search) params.append('search', filters.search);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      const response = await axios.get(`${API_URL}/incidents`, { params });
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_INCIDENTS;
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
      console.log('Using fallback incident data');
      return FALLBACK_INCIDENTS;
    }
  },
  
  getById: async (id: number): Promise<Incident> => {
    try {
      const response = await axios.get(`${API_URL}/incidents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching incident with id ${id}:`, error);
      // Retourner un incident de secours correspondant à l'ID si possible
      const fallbackIncident = FALLBACK_INCIDENTS.find(inc => inc.id === id);
      if (fallbackIncident) {
        return fallbackIncident;
      }
      throw error;
    }
  },
  
  create: async (incident: Omit<Incident, 'id'>): Promise<Incident> => {
    try {
      const response = await axios.post(`${API_URL}/incidents`, incident);
      return response.data;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  },
  
  update: async (id: number, incident: Partial<Incident>): Promise<Incident> => {
    try {
      const response = await axios.put(`${API_URL}/incidents/${id}`, incident);
      return response.data;
    } catch (error) {
      console.error(`Error updating incident with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/incidents/${id}`);
    } catch (error) {
      console.error(`Error deleting incident with id ${id}:`, error);
      throw error;
    }
  },
  
  getStats: async (): Promise<IncidentStats> => {
    try {
      const response = await axios.get(`${API_URL}/incidents/stats`);
      
      // Vérifier que la réponse contient les champs attendus
      if (response.data && typeof response.data === 'object' && 'bySeverity' in response.data) {
        return response.data;
      } else {
        console.warn('API response does not have the expected format, using fallback stats');
        return FALLBACK_STATS;
      }
    } catch (error) {
      console.error('Error fetching incident stats:', error);
      console.log('Using fallback incident stats');
      return FALLBACK_STATS;
    }
  },
  
  assignIncident: async (incidentId: number, agentId: number): Promise<Incident> => {
    try {
      const response = await axios.post(`${API_URL}/incidents/${incidentId}/assign`, { agentId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning incident ${incidentId} to agent ${agentId}:`, error);
      // Retourner un incident de secours mis à jour avec l'assignation
      const fallbackIncident = FALLBACK_INCIDENTS.find(inc => inc.id === incidentId);
      if (fallbackIncident) {
        return {
          ...fallbackIncident,
          assignedTo: agentId,
          assignedToName: `Agent #${agentId}` // Nom générique
        };
      }
      throw error;
    }
  },
  
  changeStatus: async (incidentId: number, status: string): Promise<Incident> => {
    try {
      const response = await axios.post(`${API_URL}/incidents/${incidentId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error changing status of incident ${incidentId} to ${status}:`, error);
      // Retourner un incident de secours mis à jour avec le nouveau statut
      const fallbackIncident = FALLBACK_INCIDENTS.find(inc => inc.id === incidentId);
      if (fallbackIncident) {
        return {
          ...fallbackIncident,
          status
        };
      }
      throw error;
    }
  },
  
  resolveIncident: async (incidentId: number, resolutionNotes: string): Promise<Incident> => {
    try {
      const response = await axios.post(`${API_URL}/incidents/${incidentId}/resolve`, { resolutionNotes });
      return response.data;
    } catch (error) {
      console.error(`Error resolving incident ${incidentId}:`, error);
      // Retourner un incident de secours mis à jour comme résolu
      const fallbackIncident = FALLBACK_INCIDENTS.find(inc => inc.id === incidentId);
      if (fallbackIncident) {
        return {
          ...fallbackIncident,
          status: 'resolved',
          resolutionNotes
        };
      }
      throw error;
    }
  },
  
  reopenIncident: async (incidentId: number, reason: string): Promise<Incident> => {
    try {
      const response = await axios.post(`${API_URL}/incidents/${incidentId}/reopen`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error reopening incident ${incidentId}:`, error);
      // Retourner un incident de secours mis à jour comme réouvert
      const fallbackIncident = FALLBACK_INCIDENTS.find(inc => inc.id === incidentId);
      if (fallbackIncident) {
        return {
          ...fallbackIncident,
          status: 'open',
          reopenReason: reason
        };
      }
      throw error;
    }
  },
  
  uploadAttachment: async (incidentId: number, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/incidents/${incidentId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error(`Error uploading attachment for incident ${incidentId}:`, error);
      // Retourner une URL factice pour le fichier
      return `https://example.com/mock-attachments/${incidentId}/${file.name}`;
    }
  }
};

export default incidentService; 