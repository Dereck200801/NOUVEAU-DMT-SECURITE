import { useEffect, useState } from 'react';
import metricsService from '../services/metricsService';
import type { PerformanceMetric, MetricsFilters } from '../types/metrics';

/**
 * Reusable hook to fetch / filter performance metrics.
 * Centralises data access so components (Analytics, PerformanceMetrics, etc.)
 * do not duplicate calls.
 */
export const useMetrics = (filters: MetricsFilters = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await metricsService.getAll(filters);
        if (isMounted) {
          if (Array.isArray(data)) {
            setMetrics(data);
            setError(null);
          } else {
            setMetrics([]);
            setError('Format de données incorrect');
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error(err);
        setError('Erreur de chargement');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(filters)]); // stringify for stable dep

  return { metrics, loading, error };
};

export default useMetrics; 