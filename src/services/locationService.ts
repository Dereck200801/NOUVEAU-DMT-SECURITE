import axios from 'axios';
import { MissionLocation, LocationFilters, LocationStats } from '../types/location';

// Utiliser un chemin relatif au lieu d'une URL en dur
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Même en développement, on utilise un chemin relatif

// Données de secours (fallback) pour les emplacements
const FALLBACK_LOCATIONS: MissionLocation[] = [
  {
    id: 1,
    missionId: 101,
    name: 'Protection VIP',
    client: 'Ministère de l\'Intérieur',
    clientId: 1,
    address: 'Boulevard Triomphal, Libreville',
    agentsCount: 4,
    date: '18-25 Nov',
    startDate: '2023-11-18',
    endDate: '2023-11-25',
    status: 'active',
    coordinates: { latitude: 0.3924, longitude: 9.4536 },
    contactPerson: 'Jean Moussa',
    contactPhone: '+241 77 12 34 56'
  },
  {
    id: 2,
    missionId: 102,
    name: 'Surveillance Supermarché',
    client: 'Carrefour Mont-Bouët',
    clientId: 2,
    address: 'Mont-Bouët, Libreville',
    agentsCount: 2,
    date: '15-22 Nov',
    startDate: '2023-11-15',
    endDate: '2023-11-22',
    status: 'completed',
    coordinates: { latitude: 0.4157, longitude: 9.4669 }
  },
  {
    id: 3,
    missionId: 103,
    name: 'Sécurité Événement',
    client: 'Gala annuel BGFI',
    clientId: 3,
    address: 'Hôtel Radisson Blu, Libreville',
    agentsCount: 6,
    date: '25-26 Nov',
    startDate: '2023-11-25',
    endDate: '2023-11-26',
    status: 'planned',
    coordinates: { latitude: 0.4578, longitude: 9.4150 },
    contactPerson: 'Marie Ndong',
    contactPhone: '+241 66 78 90 12'
  },
  {
    id: 4,
    missionId: 104,
    name: 'Ronde Industrielle',
    client: 'Zones Industrielles Oloumi',
    clientId: 4,
    address: 'Oloumi, Libreville',
    agentsCount: 3,
    date: '20-27 Nov',
    startDate: '2023-11-20',
    endDate: '2023-11-27',
    status: 'active',
    coordinates: { latitude: 0.3845, longitude: 9.4725 }
  }
];

// Données de secours pour les statistiques
const FALLBACK_STATS: LocationStats = {
  active: 8,
  planned: 5,
  completed: 15,
  byClient: {
    1: 3, // Ministère de l'Intérieur
    2: 4, // Carrefour Mont-Bouët
    3: 2, // BGFI
    4: 6, // Zones Industrielles Oloumi
    5: 13 // Autres clients
  }
};

export const locationService = {
  getAll: async (filters?: LocationFilters): Promise<MissionLocation[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.clientId) params.append('clientId', filters.clientId.toString());
        if (filters.search) params.append('search', filters.search);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }
      
      const response = await axios.get(`${API_URL}/locations`, { params });
      
      // Vérifier que la réponse est bien un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API response is not an array, using fallback data');
        return FALLBACK_LOCATIONS;
      }
    } catch (error) {
      console.error('Error fetching mission locations:', error);
      console.log('Using fallback location data');
      return FALLBACK_LOCATIONS;
    }
  },
  
  getById: async (id: number): Promise<MissionLocation> => {
    try {
      const response = await axios.get(`${API_URL}/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching location with id ${id}:`, error);
      // Retourner une location de secours correspondant à l'ID si possible
      const fallbackLocation = FALLBACK_LOCATIONS.find(loc => loc.id === id);
      if (fallbackLocation) {
        return fallbackLocation;
      }
      throw error;
    }
  },
  
  getByMissionId: async (missionId: number): Promise<MissionLocation> => {
    try {
      const response = await axios.get(`${API_URL}/missions/${missionId}/location`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching location for mission ${missionId}:`, error);
      // Retourner une location de secours correspondant à l'ID de mission si possible
      const fallbackLocation = FALLBACK_LOCATIONS.find(loc => loc.missionId === missionId);
      if (fallbackLocation) {
        return fallbackLocation;
      }
      throw error;
    }
  },
  
  create: async (location: Omit<MissionLocation, 'id'>): Promise<MissionLocation> => {
    try {
      const response = await axios.post(`${API_URL}/locations`, location);
      return response.data;
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  },
  
  update: async (id: number, location: Partial<MissionLocation>): Promise<MissionLocation> => {
    try {
      const response = await axios.put(`${API_URL}/locations/${id}`, location);
      return response.data;
    } catch (error) {
      console.error(`Error updating location with id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/locations/${id}`);
    } catch (error) {
      console.error(`Error deleting location with id ${id}:`, error);
      throw error;
    }
  },
  
  getStats: async (): Promise<LocationStats> => {
    try {
      const response = await axios.get(`${API_URL}/locations/stats`);
      
      // Vérifier que la réponse contient les champs attendus
      if (response.data && typeof response.data === 'object' && 'byClient' in response.data) {
        return response.data;
      } else {
        console.warn('API response does not have the expected format, using fallback stats');
        return FALLBACK_STATS;
      }
    } catch (error) {
      console.error('Error fetching location stats:', error);
      console.log('Using fallback location stats');
      return FALLBACK_STATS;
    }
  },
  
  getNearbyLocations: async (latitude: number, longitude: number, radius: number): Promise<MissionLocation[]> => {
    try {
      const response = await axios.get(`${API_URL}/locations/nearby`, {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching nearby locations:`, error);
      // Retourner des emplacements de secours proches des coordonnées données
      return FALLBACK_LOCATIONS.filter(loc => {
        const distance = Math.sqrt(
          Math.pow(loc.coordinates.latitude - latitude, 2) + 
          Math.pow(loc.coordinates.longitude - longitude, 2)
        );
        return distance <= radius / 111; // Conversion approximative de km en degrés
      });
    }
  }
};

export default locationService; 