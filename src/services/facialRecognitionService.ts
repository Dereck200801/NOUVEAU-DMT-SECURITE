import { 
  FaceDetection, 
  AttendanceRecord, 
  CameraDevice, 
  BiometricData,
  FacialRecognitionSettings
} from '../types/facial-recognition';

class FacialRecognitionService {
  private API_URL = 'http://localhost:3001/api/facial-recognition';

  /**
   * Récupère la liste des caméras configurées
   */
  async getCameras(): Promise<CameraDevice[]> {
    try {
      const response = await fetch(`${this.API_URL}/cameras`);
      if (!response.ok) {
        throw new Error('Failed to fetch cameras');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cameras:', error);
      return [];
    }
  }

  /**
   * Ajoute une nouvelle caméra
   */
  async addCamera(camera: Omit<CameraDevice, 'id'>): Promise<CameraDevice | null> {
    try {
      const response = await fetch(`${this.API_URL}/cameras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(camera)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add camera');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding camera:', error);
      return null;
    }
  }

  /**
   * Enregistre les données biométriques d'un agent
   */
  async enrollAgent(agentId: number, imageData: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agentId, imageData })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error enrolling agent:', error);
      return false;
    }
  }

  /**
   * Récupère les dernières détections faciales
   */
  async getDetections(limit: number = 10): Promise<FaceDetection[]> {
    try {
      const response = await fetch(`${this.API_URL}/detections?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch detections');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching detections:', error);
      return [];
    }
  }

  /**
   * Récupère les enregistrements de présence
   */
  async getAttendanceRecords(date: string): Promise<AttendanceRecord[]> {
    try {
      const response = await fetch(`${this.API_URL}/attendance?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      return [];
    }
  }

  /**
   * Récupère les paramètres de reconnaissance faciale
   */
  async getSettings(): Promise<FacialRecognitionSettings> {
    try {
      const response = await fetch(`${this.API_URL}/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        minConfidence: 0.7,
        enableAttendanceTracking: true,
        retentionPeriodDays: 30,
        enableNotifications: true,
        allowedCameras: [],
        scheduleEnabled: false,
        privacyMaskingEnabled: true
      };
    }
  }

  /**
   * Met à jour les paramètres de reconnaissance faciale
   */
  async updateSettings(settings: FacialRecognitionSettings): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  /**
   * Exporte les données de présence au format CSV
   */
  async exportAttendanceData(startDate: string, endDate: string): Promise<Blob | null> {
    try {
      const response = await fetch(
        `${this.API_URL}/attendance/export?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Accept: 'text/csv' } }
      );
      
      if (!response.ok) {
        throw new Error('Failed to export attendance data');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error exporting attendance data:', error);
      return null;
    }
  }
}

export const facialRecognitionService = new FacialRecognitionService(); 