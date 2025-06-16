export type TrendDirection = 'up' | 'down' | 'stable';

export interface Metric {
  id: number;
  name: string;
  value: number;
  unit: string;
  trend: TrendDirection;
  change: number;
  chartData: number[];
  labels: string[];
  description?: string;
  target?: number;
  isPositive?: boolean; // Indique si une augmentation est positive ou négative
}

export interface PerformanceFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  metricTypes?: string[];
}

export interface AgentPerformance {
  agentId: number;
  agentName: string;
  metrics: {
    efficiency: number;
    satisfaction: number;
    responseTime: number;
    incidents: number;
  };
} 