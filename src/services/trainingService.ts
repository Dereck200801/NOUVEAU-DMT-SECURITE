import axios from 'axios';
import { Certification, Training, CertificationFilters, TrainingFilters, CertificationStats } from '../types/training';
import { API_BASE_URL } from '../api';

// Remplacer process.env par import.meta.env pour Vite
const API_URL = API_BASE_URL;

export const trainingService = {
  getAllCertifications: async (filters?: CertificationFilters): Promise<Certification[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.search) params.append('search', filters.search);
        if (filters.expiringWithin) params.append('expiringWithin', filters.expiringWithin.toString());
      }
      
      const response = await axios.get(`${API_URL}/certifications`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      
      // Retourne des données mockées en cas d'erreur (pour le développement)
      const today = new Date();
      const in15Days = new Date();
      in15Days.setDate(today.getDate() + 15);
      const in5Days = new Date();
      in5Days.setDate(today.getDate() + 5);
      const past5Days = new Date();
      past5Days.setDate(today.getDate() - 5);
      const in45Days = new Date();
      in45Days.setDate(today.getDate() + 45);
      
      return [
        {
          id: 1,
          name: 'Agent de sécurité privée',
          type: 'Certification professionnelle',
          agentId: 1,
          agentName: 'Pierre Mbemba',
          issueDate: '2023-03-15',
          expirationDate: in15Days.toISOString().split('T')[0],
          daysRemaining: 15,
          status: 'expiring'
        },
        {
          id: 2,
          name: 'Protection rapprochée',
          type: 'Certification spécialisée',
          agentId: 3,
          agentName: 'Sarah Nzeng',
          issueDate: '2023-02-02',
          expirationDate: in5Days.toISOString().split('T')[0],
          daysRemaining: 5,
          status: 'expiring'
        },
        {
          id: 3,
          name: 'Secourisme',
          type: 'Premiers secours',
          agentId: 2,
          agentName: 'Didier Ondo',
          issueDate: '2023-01-10',
          expirationDate: past5Days.toISOString().split('T')[0],
          daysRemaining: -5,
          status: 'expired'
        },
        {
          id: 4,
          name: 'Maniement d\'armes',
          type: 'Certification spécialisée',
          agentId: 4,
          agentName: 'Marc Mba',
          issueDate: '2023-04-22',
          expirationDate: in45Days.toISOString().split('T')[0],
          daysRemaining: 45,
          status: 'valid'
        }
      ];
    }
  },
  
  getAllTrainings: async (filters?: TrainingFilters): Promise<Training[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      const response = await axios.get(`${API_URL}/trainings`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      
      // Retourne des données mockées en cas d'erreur (pour le développement)
      return [
        {
          id: 1,
          name: 'Formation anti-terrorisme',
          description: 'Formation spécialisée pour la prévention des attaques terroristes',
          agentId: 1,
          agentName: 'Pierre Mbemba',
          startDate: '2023-10-10',
          endDate: '2023-10-15',
          status: 'completed',
          score: 92,
          provider: 'Centre National de Formation'
        },
        {
          id: 2,
          name: 'Gestion de foule',
          description: 'Techniques de gestion de foule et de prévention des mouvements de panique',
          agentId: 3,
          agentName: 'Sarah Nzeng',
          startDate: '2023-11-20',
          endDate: '2023-11-25',
          status: 'in_progress',
          provider: 'Institut de Sécurité'
        }
      ];
    }
  },
  
  getCertificationById: async (id: number): Promise<Certification> => {
    try {
      const response = await axios.get(`${API_URL}/certifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching certification with id ${id}:`, error);
      throw error;
    }
  },
  
  getTrainingById: async (id: number): Promise<Training> => {
    try {
      const response = await axios.get(`${API_URL}/trainings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching training with id ${id}:`, error);
      throw error;
    }
  },
  
  createCertification: async (certification: Omit<Certification, 'id' | 'status' | 'daysRemaining'>): Promise<Certification> => {
    try {
      const response = await axios.post(`${API_URL}/certifications`, certification);
      return response.data;
    } catch (error) {
      console.error('Error creating certification:', error);
      throw error;
    }
  },
  
  createTraining: async (training: Omit<Training, 'id'>): Promise<Training> => {
    try {
      const response = await axios.post(`${API_URL}/trainings`, training);
      return response.data;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  },
  
  updateCertification: async (id: number, certification: Partial<Certification>): Promise<Certification> => {
    try {
      const response = await axios.put(`${API_URL}/certifications/${id}`, certification);
      return response.data;
    } catch (error) {
      console.error(`Error updating certification with id ${id}:`, error);
      throw error;
    }
  },
  
  updateTraining: async (id: number, training: Partial<Training>): Promise<Training> => {
    try {
      const response = await axios.put(`${API_URL}/trainings/${id}`, training);
      return response.data;
    } catch (error) {
      console.error(`Error updating training with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteCertification: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/certifications/${id}`);
    } catch (error) {
      console.error(`Error deleting certification with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteTraining: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/trainings/${id}`);
    } catch (error) {
      console.error(`Error deleting training with id ${id}:`, error);
      throw error;
    }
  },
  
  getCertificationStats: async (): Promise<CertificationStats> => {
    try {
      const response = await axios.get(`${API_URL}/certifications/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certification stats:', error);
      
      // Retourne des données mockées en cas d'erreur (pour le développement)
      return {
        total: 32,
        valid: 24,
        expiring: 5,
        expired: 3,
        byType: {
          'Certification professionnelle': 12,
          'Certification spécialisée': 8,
          'Premiers secours': 7,
          'Autre': 5
        }
      };
    }
  }
};

export default trainingService; 