export interface PerformanceMetric {
  id: number;
  name: string;
  description: string;
  type: string; // 'agent', 'mission', 'incident', 'equipment'
  category: string;
  period: string;
  score: number;
  trend: string; // 'up', 'down', 'stable'
  trendValue: number;
}

export interface MetricsFilters {
  type?: string;
  category?: string;
  period?: string;
  search?: string;
} 