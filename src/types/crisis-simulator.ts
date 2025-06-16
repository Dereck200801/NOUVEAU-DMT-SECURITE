export type ScenarioType = 'intrusion' | 'fire' | 'medical' | 'natural_disaster' | 'cyber_attack' | 'terrorist' | 'custom';
export type ScenarioStatus = 'draft' | 'ready' | 'in_progress' | 'completed' | 'archived';
export type SimulationMode = 'real_time' | 'accelerated' | 'step_by_step';
export type ParticipantRole = 'coordinator' | 'responder' | 'observer';

export interface ScenarioElement {
  id: string;
  type: 'event' | 'decision' | 'resource' | 'objective';
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  connections: string[]; // IDs of connected elements
  properties: Record<string, any>;
}

export interface ScenarioEvent extends ScenarioElement {
  type: 'event';
  properties: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    triggerTime: number; // seconds from start
    triggerCondition?: string; // optional condition expression
    duration?: number; // in seconds
    affectedAreas?: string[];
    mediaAssets?: string[]; // URLs to images, videos, etc.
  };
}

export interface ScenarioDecision extends ScenarioElement {
  type: 'decision';
  properties: {
    options: {
      id: string;
      text: string;
      consequences: string[]; // IDs of elements triggered by this option
      score: number;
    }[];
    timeLimit?: number; // seconds to make decision
    defaultOption?: string; // ID of default option if time expires
  };
}

export interface ScenarioResource extends ScenarioElement {
  type: 'resource';
  properties: {
    quantity: number;
    availabilityDelay: number; // seconds until available
    consumable: boolean;
    effectiveness: number; // 0-100
    requiredSkills?: string[];
  };
}

export interface ScenarioObjective extends ScenarioElement {
  type: 'objective';
  properties: {
    completionCriteria: string; // expression to evaluate
    timeLimit?: number; // seconds to complete
    priority: 'low' | 'medium' | 'high';
    points: number;
  };
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: ScenarioType;
  status: ScenarioStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  elements: ScenarioElement[];
  initialConditions: Record<string, any>;
  successCriteria: string[];
  failureCriteria: string[];
}

export interface SimulationParticipant {
  id: string;
  userId: string;
  userName: string;
  role: ParticipantRole;
  joinedAt: string;
  isActive: boolean;
  lastAction?: string;
  score?: number;
}

export interface SimulationAction {
  id: string;
  simulationId: string;
  participantId: string;
  timestamp: string;
  elementId: string;
  actionType: string;
  details: Record<string, any>;
  result?: Record<string, any>;
}

export interface Simulation {
  id: string;
  scenarioId: string;
  scenarioName: string;
  status: 'scheduled' | 'in_progress' | 'paused' | 'completed' | 'aborted';
  startTime?: string;
  endTime?: string;
  mode: SimulationMode;
  timeScale: number; // for accelerated mode
  currentTime: number; // seconds from start
  participants: SimulationParticipant[];
  actions: SimulationAction[];
  metrics: {
    objectivesCompleted: number;
    totalObjectives: number;
    criticalEventsHandled: number;
    totalCriticalEvents: number;
    responseTimeAvg: number;
    decisionQualityScore: number;
    overallScore: number;
  };
}

export interface SimulationReport {
  id: string;
  simulationId: string;
  scenarioId: string;
  generatedAt: string;
  duration: number;
  participants: {
    id: string;
    name: string;
    role: ParticipantRole;
    score: number;
    keyActions: {
      timestamp: string;
      description: string;
      outcome: string;
      score: number;
    }[];
  }[];
  timeline: {
    time: number;
    event: string;
    responses: {
      participantId: string;
      action: string;
      effectiveness: number;
    }[];
  }[];
  metrics: {
    overallScore: number;
    responseTime: {
      average: number;
      min: number;
      max: number;
    };
    decisionQuality: number;
    resourceUtilization: number;
    objectivesCompleted: number;
    criticalEventsHandled: number;
  };
  recommendations: string[];
  improvementAreas: string[];
} 