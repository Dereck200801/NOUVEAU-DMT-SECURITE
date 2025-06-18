import { normalizeDate } from '../utils/dateUtils';

// Types
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description?: string;
  location?: string;
  participants?: string[];
  client?: string;
  endDate?: string;
  status?: 'pending' | 'active' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  agents?: number[];
}

export interface CreateEventDTO {
  title: string;
  date: string;
  time: string;
  type: string;
  description?: string;
  location?: string;
  participants?: string[];
  client?: string;
  endDate?: string;
  status?: 'pending' | 'active' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  agents?: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_URL = 'http://localhost:3002';

// Service
export const eventService = {
  // Get all events
  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      console.log('Fetching all events from API');
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      console.log('API response for all events:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, message: 'Failed to fetch events' };
    }
  },

  // Get events by month
  async getEventsByMonth(year: number, month: number): Promise<ApiResponse<Event[]>> {
    try {
      console.log(`Fetching events for ${year}-${month} from API`);
      // Format month to ensure it's always 2 digits
      const formattedMonth = month.toString().padStart(2, '0');
      const url = `${API_URL}/events?date_like=${year}-${formattedMonth}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log(`API response for ${year}-${month}:`, data);
      
      // Normalize dates in the response
      const normalizedData = data.map((event: Event) => ({
        ...event,
        date: normalizeDate(event.date)
      }));
      
      console.log('Normalized data:', normalizedData);
      return { success: true, data: normalizedData };
    } catch (error) {
      console.error(`Error fetching events for ${year}-${month}:`, error);
      return { success: false, message: 'Failed to fetch events for the specified month' };
    }
  },

  // Get event by ID
  async getEvent(id: number): Promise<ApiResponse<Event>> {
    try {
      console.log(`Fetching event with ID ${id} from API`);
      const response = await fetch(`${API_URL}/events/${id}`);
      if (!response.ok) {
        throw new Error('Event not found');
      }
      const data = await response.json();
      console.log(`API response for event ${id}:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return { success: false, message: 'Failed to fetch event' };
    }
  },

  // Create new event
  async createEvent(event: CreateEventDTO): Promise<ApiResponse<Event>> {
    try {
      console.log('Creating new event:', event);
      // Normalize date
      const normalizedEvent = {
        ...event,
        date: normalizeDate(event.date)
      };
      console.log('Normalized event to create:', normalizedEvent);
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(normalizedEvent)
      });
      const data = await response.json();
      console.log('API response for create event:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, message: 'Failed to create event' };
    }
  },

  // Update event
  async updateEvent(id: number, event: CreateEventDTO): Promise<ApiResponse<Event>> {
    try {
      console.log(`Updating event ${id}:`, event);
      // Normalize date
      const normalizedEvent = {
        ...event,
        date: normalizeDate(event.date)
      };
      console.log('Normalized event to update:', normalizedEvent);
      
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(normalizedEvent)
      });
      const data = await response.json();
      console.log(`API response for update event ${id}:`, data);
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return { success: false, message: 'Failed to update event' };
    }
  },

  // Delete event
  async deleteEvent(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`Deleting event ${id}`);
      await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE'
      });
      console.log(`Event ${id} deleted successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return { success: false, message: 'Failed to delete event' };
    }
  }
}; 