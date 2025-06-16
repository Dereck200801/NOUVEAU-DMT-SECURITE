import {
  Scenario,
  Simulation,
  SimulationReport,
  ScenarioElement,
  SimulationAction,
  SimulationParticipant
} from '../types/crisis-simulator';

export default class CrisisSimulatorService {
  private API_URL = 'http://localhost:3001/api/crisis-simulator';

  /**
   * Récupère tous les scénarios
   */
  async getScenarios(): Promise<Scenario[]> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios`);
      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      return [];
    }
  }

  /**
   * Récupère un scénario par son ID
   */
  async getScenario(id: string): Promise<Scenario | null> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch scenario ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching scenario ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée un nouveau scénario
   */
  async createScenario(scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario | null> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create scenario');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating scenario:', error);
      return null;
    }
  }

  /**
   * Met à jour un scénario
   */
  async updateScenario(id: string, scenario: Partial<Scenario>): Promise<Scenario | null> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update scenario ${id}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating scenario ${id}:`, error);
      return null;
    }
  }

  /**
   * Supprime un scénario
   */
  async deleteScenario(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios/${id}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting scenario ${id}:`, error);
      return false;
    }
  }

  /**
   * Ajoute un élément à un scénario
   */
  async addScenarioElement(scenarioId: string, element: Omit<ScenarioElement, 'id'>): Promise<ScenarioElement | null> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios/${scenarioId}/elements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(element)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add element to scenario ${scenarioId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error adding element to scenario ${scenarioId}:`, error);
      return null;
    }
  }

  /**
   * Met à jour un élément de scénario
   */
  async updateScenarioElement(scenarioId: string, elementId: string, element: Partial<ScenarioElement>): Promise<ScenarioElement | null> {
    try {
      const response = await fetch(`${this.API_URL}/scenarios/${scenarioId}/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(element)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update element ${elementId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating element ${elementId}:`, error);
      return null;
    }
  }

  /**
   * Démarre une simulation
   */
  async startSimulation(scenarioId: string, options: {
    mode: 'real_time' | 'accelerated' | 'step_by_step';
    timeScale?: number;
    participants: {
      userId: string;
      role: 'coordinator' | 'responder' | 'observer';
    }[];
  }): Promise<Simulation | null> {
    try {
      const response = await fetch(`${this.API_URL}/simulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenarioId,
          ...options
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to start simulation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting simulation:', error);
      return null;
    }
  }

  /**
   * Récupère une simulation par son ID
   */
  async getSimulation(id: string): Promise<Simulation | null> {
    try {
      const response = await fetch(`${this.API_URL}/simulations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch simulation ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching simulation ${id}:`, error);
      return null;
    }
  }

  /**
   * Ajoute une action à une simulation
   */
  async addSimulationAction(simulationId: string, action: Omit<SimulationAction, 'id' | 'simulationId' | 'timestamp'>): Promise<SimulationAction | null> {
    try {
      const response = await fetch(`${this.API_URL}/simulations/${simulationId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add action to simulation ${simulationId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error adding action to simulation ${simulationId}:`, error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une simulation
   */
  async updateSimulationStatus(simulationId: string, status: 'in_progress' | 'paused' | 'completed' | 'aborted'): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/simulations/${simulationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error updating simulation ${simulationId} status:`, error);
      return false;
    }
  }

  /**
   * Génère un rapport de simulation
   */
  async generateReport(simulationId: string): Promise<SimulationReport | null> {
    try {
      const response = await fetch(`${this.API_URL}/simulations/${simulationId}/report`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate report for simulation ${simulationId}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error generating report for simulation ${simulationId}:`, error);
      return null;
    }
  }

  /**
   * Récupère un rapport de simulation par son ID
   */
  async getReport(id: string): Promise<SimulationReport | null> {
    try {
      const response = await fetch(`${this.API_URL}/reports/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch report ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching report ${id}:`, error);
      return null;
    }
  }

  /**
   * Exporte un rapport de simulation au format PDF
   */
  async exportReportPDF(reportId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.API_URL}/reports/${reportId}/export/pdf`, {
        headers: {
          Accept: 'application/pdf'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to export report ${reportId} as PDF`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Error exporting report ${reportId} as PDF:`, error);
      return null;
    }
  }
}

export const crisisSimulatorService = new CrisisSimulatorService(); 