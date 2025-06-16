import axios from 'axios';
import { Certification, CertificationFilters } from '../types/certification';

// Utiliser un chemin relatif au lieu d'une URL en dur
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Même en développement, on utilise un chemin relatif

// Données de secours (fallback) pour les certifications
const FALLBACK_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: 'Formation Sécurité Niveau 1',
    provider: 'Institut National de Sécurité',
    agentId: 1,
    agentName: 'Jean Dupont',
    issueDate: '2023-05-15',
    expiryDate: '2025-05-15',
    isValid: true
  },
  {
    id: 2,
    name: 'Secourisme et Premiers Soins',
    provider: 'Croix Rouge',
    agentId: 2,
    agentName: 'Marie Dubois',
    issueDate: '2023-02-10',
    expiryDate: '2024-02-10',
    isValid: true
  },
  {
    id: 3,
    name: 'Gestion de Crise',
    provider: 'Centre de Formation Sécurité',
    agentId: 1,
    agentName: 'Jean Dupont',
    issueDate: '2022-11-20',
    expiryDate: '2023-11-20',
    isValid: false
  },
  {
    id: 4,
    name: 'Manipulation d\'Armes à Feu',
    provider: 'École Nationale de Police',
    agentId: 3,
    agentName: 'Paul Martin',
    issueDate: '2023-08-05',
    expiryDate: '2025-08-05',
    isValid: true
  }
];

export const certificationService = {
  getAll: async (filters?: CertificationFilters): Promise<Certification[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.agentId) params.append('agentId', filters.agentId.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.validOnly !== undefined) params.append('validOnly', filters.validOnly.toString());
      }
      
      const response = await axios.get(`${API_URL}/certifications`, { params });
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_CERTIFICATIONS;
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      console.log('Using fallback certification data');
      
      // Appliquer les filtres aux données de secours
      let filteredCertifications = [...FALLBACK_CERTIFICATIONS];
      
      if (filters) {
        if (filters.agentId) {
          filteredCertifications = filteredCertifications.filter(c => c.agentId === filters.agentId);
        }
        if (filters.validOnly) {
          filteredCertifications = filteredCertifications.filter(c => c.isValid);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredCertifications = filteredCertifications.filter(c => 
            c.name.toLowerCase().includes(searchLower) || 
            c.provider.toLowerCase().includes(searchLower) ||
            c.agentName.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return filteredCertifications;
    }
  },
  
  getById: async (id: number): Promise<Certification> => {
    try {
      const response = await axios.get(`${API_URL}/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching certification with id ${id}:`, error);
      // Retourner une certification de secours correspondant à l'ID si possible
      const fallbackCertification = FALLBACK_CERTIFICATIONS.find(c => c.id === id);
      if (fallbackCertification) {
        return fallbackCertification;
      }
      throw error;
    }
  },
  
  getByAgentId: async (agentId: number): Promise<Certification[]> => {
    try {
      const response = await axios.get(`${API_URL}/agents/${agentId}/certifications`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_CERTIFICATIONS.filter(c => c.agentId === agentId);
      }
    } catch (error) {
      console.error(`Error fetching certifications for agent ${agentId}:`, error);
      console.log('Using fallback certification data filtered by agent');
      return FALLBACK_CERTIFICATIONS.filter(c => c.agentId === agentId);
    }
  },
  
  create: async (certification: Omit<Certification, 'id'>): Promise<Certification> => {
    try {
      const response = await axios.post(`${API_URL}/certifications`, certification);
      return response.data;
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  },
  
  update: async (id: number, certification: Partial<Certification>): Promise<Certification> => {
    try {
      const response = await axios.put(`${API_URL}/certifications/${id}`, certification);
      return response.data;
    } catch (error) {
      console.error(`Error updating certification with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/certifications/${id}`);
    } catch (error) {
      console.error(`Error deleting certification with id ${id}:`, error);
      throw error;
    }
  }
};

export default certificationService; 