import axios from 'axios';
import { PerformanceMetric, MetricsFilters } from '../types/metrics';

// Utiliser un chemin relatif au lieu d'une URL en dur
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Même en développement, on utilise un chemin relatif

// Données de secours (fallback) pour les métriques
const FALLBACK_METRICS: PerformanceMetric[] = [
  {
    id: 1,
    name: 'Taux de satisfaction client',
    description: 'Pourcentage de clients satisfaits',
    type: 'mission',
    category: 'Satisfaction',
    period: 'Dernier mois',
    score: 92,
    trend: 'up',
    trendValue: 3
  },
  {
    id: 2,
    name: 'Temps de réponse moyen',
    description: 'Temps moyen pour répondre aux incidents',
    type: 'incident',
    category: 'Performance',
    period: 'Dernier mois',
    score: 87,
    trend: 'down',
    trendValue: 5
  },
  {
    id: 3,
    name: 'Taux de présence',
    description: 'Pourcentage de présence des agents',
    type: 'agent',
    category: 'Ressources humaines',
    period: 'Dernier trimestre',
    score: 95,
    trend: 'up',
    trendValue: 2
  },
  {
    id: 4,
    name: 'Taux d\'incidents résolus',
    description: 'Pourcentage d\'incidents résolus',
    type: 'incident',
    category: 'Performance',
    period: 'Dernier mois',
    score: 78,
    trend: 'stable',
    trendValue: 0
  },
  {
    id: 5,
    name: 'Efficacité des équipements',
    description: 'Taux d\'utilisation des équipements',
    type: 'equipment',
    category: 'Ressources matérielles',
    period: 'Dernier trimestre',
    score: 82,
    trend: 'up',
    trendValue: 4
  }
];

export const metricsService = {
  getAll: async (filters?: MetricsFilters): Promise<PerformanceMetric[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.period) params.append('period', filters.period);
      }
      
      const response = await axios.get(`${API_URL}/metrics`, { params });
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_METRICS;
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      console.log('Using fallback metrics data');
      
      // Appliquer les filtres aux données de secours
      let filteredMetrics = [...FALLBACK_METRICS];
      
      if (filters) {
        if (filters.type) {
          filteredMetrics = filteredMetrics.filter(m => m.type === filters.type);
        }
        if (filters.category) {
          filteredMetrics = filteredMetrics.filter(m => m.category === filters.category);
        }
        if (filters.period) {
          filteredMetrics = filteredMetrics.filter(m => m.period === filters.period);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredMetrics = filteredMetrics.filter(m => 
            m.name.toLowerCase().includes(searchLower) || 
            m.description.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return filteredMetrics;
    }
  },
  
  getById: async (id: number): Promise<PerformanceMetric> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metric with id ${id}:`, error);
      // Retourner une métrique de secours correspondant à l'ID si possible
      const fallbackMetric = FALLBACK_METRICS.find(m => m.id === id);
      if (fallbackMetric) {
        return fallbackMetric;
      }
      throw error;
    }
  },
  
  getByType: async (type: string): Promise<PerformanceMetric[]> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/type/${type}`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_METRICS.filter(m => m.type === type);
      }
    } catch (error) {
      console.error(`Error fetching metrics of type ${type}:`, error);
      console.log('Using fallback metrics data filtered by type');
      return FALLBACK_METRICS.filter(m => m.type === type);
    }
  },
  
  getByCategory: async (category: string): Promise<PerformanceMetric[]> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/category/${category}`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_METRICS.filter(m => m.category === category);
      }
    } catch (error) {
      console.error(`Error fetching metrics of category ${category}:`, error);
      console.log('Using fallback metrics data filtered by category');
      return FALLBACK_METRICS.filter(m => m.category === category);
    }
  },
  
  getByPeriod: async (period: string): Promise<PerformanceMetric[]> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/period/${period}`);
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_METRICS.filter(m => m.period === period);
      }
    } catch (error) {
      console.error(`Error fetching metrics for period ${period}:`, error);
      console.log('Using fallback metrics data filtered by period');
      return FALLBACK_METRICS.filter(m => m.period === period);
    }
  }
};

export default metricsService; 