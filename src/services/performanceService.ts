import axios from 'axios';
import { Metric, PerformanceFilters, AgentPerformance } from '../types/performance';

const API_URL = 'http://localhost:3001/api';

export const performanceService = {
  getAllMetrics: async (filters?: PerformanceFilters): Promise<Metric[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
        if (filters.metricTypes && filters.metricTypes.length > 0) {
          filters.metricTypes.forEach(type => {
            params.append('types[]', type);
          });
        }
      }
      
      const response = await axios.get(`${API_URL}/metrics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      
      // Retourne des données mockées en cas d'erreur (pour le développement)
      return [
        {
          id: 1,
          name: 'Taux de satisfaction client',
          value: 92,
          unit: '%',
          trend: 'up',
          change: 3.5,
          chartData: [85, 87, 84, 89, 90, 88, 92],
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
          description: 'Satisfaction moyenne des clients basée sur les évaluations',
          target: 90,
          isPositive: true
        },
        {
          id: 2,
          name: 'Temps de réponse moyen',
          value: 12.5,
          unit: 'min',
          trend: 'down',
          change: 2.1,
          chartData: [18, 16, 15, 14.5, 13.8, 13, 12.5],
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
          description: 'Temps moyen de réponse aux appels d\'urgence',
          target: 10,
          isPositive: false
        },
        {
          id: 3,
          name: 'Taux d\'incidents',
          value: 1.2,
          unit: '%',
          trend: 'down',
          change: 0.8,
          chartData: [3.5, 3.0, 2.5, 2.0, 1.8, 1.5, 1.2],
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
          description: 'Pourcentage de missions avec incidents signalés',
          target: 1.0,
          isPositive: false
        },
        {
          id: 4,
          name: 'Efficacité des agents',
          value: 87,
          unit: '%',
          trend: 'stable',
          change: 0.2,
          chartData: [86, 85, 87, 86, 88, 87, 87],
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
          description: 'Évaluation moyenne de l\'efficacité des agents',
          target: 90,
          isPositive: true
        }
      ];
    }
  },
  
  getMetricById: async (id: number): Promise<Metric> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching metric with id ${id}:`, error);
      throw error;
    }
  },
  
  getAgentPerformance: async (agentId: number): Promise<AgentPerformance> => {
    try {
      const response = await axios.get(`${API_URL}/agents/${agentId}/performance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  getAllAgentsPerformance: async (): Promise<AgentPerformance[]> => {
    try {
      const response = await axios.get(`${API_URL}/agents/performance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all agents performance:', error);
      
      // Retourne des données mockées en cas d'erreur (pour le développement)
      return [
        {
          agentId: 1,
          agentName: 'Pierre Mbemba',
          metrics: {
            efficiency: 92,
            satisfaction: 95,
            responseTime: 10.2,
            incidents: 0.5
          }
        },
        {
          agentId: 2,
          agentName: 'Didier Ondo',
          metrics: {
            efficiency: 88,
            satisfaction: 90,
            responseTime: 11.5,
            incidents: 1.2
          }
        },
        {
          agentId: 3,
          agentName: 'Sarah Nzeng',
          metrics: {
            efficiency: 94,
            satisfaction: 92,
            responseTime: 9.8,
            incidents: 0.3
          }
        },
        {
          agentId: 4,
          agentName: 'Marc Mba',
          metrics: {
            efficiency: 85,
            satisfaction: 87,
            responseTime: 12.5,
            incidents: 1.8
          }
        }
      ];
    }
  },
  
  getMetricHistory: async (metricId: number, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{ labels: string[], data: number[] }> => {
    try {
      const response = await axios.get(`${API_URL}/metrics/${metricId}/history`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for metric ${metricId}:`, error);
      throw error;
    }
  },
  
  createMetric: async (metric: Omit<Metric, 'id'>): Promise<Metric> => {
    try {
      const response = await axios.post(`${API_URL}/metrics`, metric);
      return response.data;
    } catch (error) {
      console.error('Error creating metric:', error);
      throw error;
    }
  },
  
  updateMetric: async (id: number, metric: Partial<Metric>): Promise<Metric> => {
    try {
      const response = await axios.put(`${API_URL}/metrics/${id}`, metric);
      return response.data;
    } catch (error) {
      console.error(`Error updating metric with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteMetric: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/metrics/${id}`);
    } catch (error) {
      console.error(`Error deleting metric with id ${id}:`, error);
      throw error;
    }
  }
};

export default performanceService; 