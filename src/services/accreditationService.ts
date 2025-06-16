import {
  Accreditation,
  AccreditationDocument,
  AccreditationNotification,
  AccreditationRequirement,
  AccreditationStats,
  OCRData
} from '../types/accreditation';

class AccreditationService {
  private API_URL = 'http://localhost:3001/api/accreditations';

  /**
   * Récupère toutes les accréditations
   */
  async getAccreditations(): Promise<Accreditation[]> {
    try {
      const response = await fetch(`${this.API_URL}`);
      if (!response.ok) {
        throw new Error('Failed to fetch accreditations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching accreditations:', error);
      return [];
    }
  }

  /**
   * Récupère les accréditations d'un agent
   */
  async getAgentAccreditations(agentId: number): Promise<Accreditation[]> {
    try {
      const response = await fetch(`${this.API_URL}/agent/${agentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agent accreditations');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching accreditations for agent ${agentId}:`, error);
      return [];
    }
  }

  /**
   * Récupère une accréditation par son ID
   */
  async getAccreditation(id: string): Promise<Accreditation | null> {
    try {
      const response = await fetch(`${this.API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch accreditation ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching accreditation ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée une nouvelle accréditation
   */
  async createAccreditation(accreditation: Omit<Accreditation, 'id' | 'status' | 'verificationStatus'>): Promise<Accreditation | null> {
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accreditation)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create accreditation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating accreditation:', error);
      return null;
    }
  }

  /**
   * Met à jour une accréditation
   */
  async updateAccreditation(id: string, accreditation: Partial<Accreditation>): Promise<Accreditation | null> {
    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(accreditation)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update accreditation ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating accreditation ${id}:`, error);
      return null;
    }
  }

  /**
   * Supprime une accréditation
   */
  async deleteAccreditation(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting accreditation ${id}:`, error);
      return false;
    }
  }

  /**
   * Télécharge un document d'accréditation
   */
  async uploadDocument(accreditationId: string, file: File): Promise<AccreditationDocument | null> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('accreditationId', accreditationId);
      
      const response = await fetch(`${this.API_URL}/documents`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  }

  /**
   * Analyse un document avec OCR
   */
  async scanDocument(documentId: string): Promise<OCRData | null> {
    try {
      const response = await fetch(`${this.API_URL}/documents/${documentId}/scan`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to scan document ${documentId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error scanning document ${documentId}:`, error);
      return null;
    }
  }

  /**
   * Récupère les notifications d'accréditation
   */
  async getNotifications(): Promise<AccreditationNotification[]> {
    try {
      const response = await fetch(`${this.API_URL}/notifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Récupère les exigences d'accréditation
   */
  async getRequirements(): Promise<AccreditationRequirement[]> {
    try {
      const response = await fetch(`${this.API_URL}/requirements`);
      if (!response.ok) {
        throw new Error('Failed to fetch requirements');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching requirements:', error);
      return [];
    }
  }

  /**
   * Récupère les statistiques d'accréditation
   */
  async getStats(): Promise<AccreditationStats> {
    try {
      const response = await fetch(`${this.API_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        total: 0,
        valid: 0,
        expiring: 0,
        expired: 0,
        revoked: 0,
        pending: 0,
        byType: {
          certification: 0,
          license: 0,
          training: 0,
          clearance: 0,
          badge: 0
        }
      };
    }
  }

  /**
   * Récupère les statistiques d'accréditation (alias pour getStats)
   */
  async getAccreditationStats(): Promise<AccreditationStats> {
    return this.getStats();
  }

  /**
   * Récupère un document d'accréditation par son ID
   */
  async getAccreditationDocument(id: string): Promise<AccreditationDocument | null> {
    try {
      const response = await fetch(`${this.API_URL}/documents/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch document ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      return null;
    }
  }

  /**
   * Vérifie la validité des accréditations pour une mission
   */
  async validateForMission(agentId: number, missionId: number): Promise<{
    valid: boolean;
    missingAccreditations: string[];
    expiringAccreditations: string[];
  }> {
    try {
      const response = await fetch(`${this.API_URL}/validate?agentId=${agentId}&missionId=${missionId}`);
      if (!response.ok) {
        throw new Error('Failed to validate accreditations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error validating accreditations:', error);
      return {
        valid: false,
        missingAccreditations: [],
        expiringAccreditations: []
      };
    }
  }
}

export const accreditationService = new AccreditationService(); 