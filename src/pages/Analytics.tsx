import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faArrowUp,
  faArrowDown,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
// Components & services
import PerformanceMetrics from '../components/PerformanceMetrics';
import metricsService from '../services/metricsService';
// Types
import { PerformanceMetric } from '../types/metrics';

// Register ChartJS components once
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  gradientFrom: string;
  gradientTo: string;
}

const AnalyticsStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradientFrom,
  gradientTo,
}) => (
  <div
    className={`relative overflow-hidden p-6 rounded-xl shadow-lg text-white bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
  >
    <FontAwesomeIcon
      icon={icon}
      className="absolute bottom-3 right-3 text-5xl opacity-25"
    />
    <p className="text-sm font-medium tracking-wide uppercase opacity-90">
      {title}
    </p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

const Analytics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Filtre dynamique
  const [filters, setFilters] = useState<{
    type: string;
    category: string;
    period: string;
    search: string;
  }>({ type: '', category: '', period: '', search: '' });

  // Options statiques (peuvent être récupérées dynamiquement plus tard)
  const TYPE_OPTIONS = ['mission', 'incident', 'agent', 'equipment'];
  const CATEGORY_OPTIONS = [
    'Satisfaction',
    'Performance',
    'Ressources humaines',
    'Ressources matérielles',
  ];
  const PERIOD_OPTIONS = ['Dernier mois', 'Dernier trimestre'];

  // Récupération des métriques en fonction des filtres
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await metricsService.getAll({
          type: filters.type || undefined,
          category: filters.category || undefined,
          period: filters.period || undefined,
          search: filters.search || undefined,
        });
        if (Array.isArray(data)) {
          setMetrics(data);
          setError(null);
        } else {
          throw new Error('Format de données inattendu');
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des métriques:', err);
        setError('Impossible de charger les métriques.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filters]);

  // Derived statistics
  const totalMetrics = metrics.length;
  const avgScore =
    totalMetrics > 0
      ? Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / totalMetrics)
      : 0;
  const trendingUp = metrics.filter((m) => m.trend === 'up').length;
  const trendingDown = metrics.filter((m) => m.trend === 'down').length;

  // Data for charts
  const typeCounts: Record<string, number> = {};
  metrics.forEach((m) => {
    typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
  });
  const barData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: 'Nombre de métriques',
        data: Object.values(typeCounts),
        backgroundColor: '#134074', // Yale blue
        borderRadius: 8,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
  };

  const high = metrics.filter((m) => m.score >= 90).length;
  const medium = metrics.filter((m) => m.score >= 70 && m.score < 90).length;
  const low = metrics.filter((m) => m.score < 70).length;
  const doughnutData = {
    labels: ['Excellente', 'Bonne', 'À améliorer'],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'],
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '40%',
    radius: '80%',
    plugins: { legend: { position: 'right' as const } },
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Indicateurs Avancés / Business Intelligence</h1>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value="">Type (tous)</option>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value="">Catégorie (toutes)</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          value={filters.period}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, period: e.target.value }))
          }
          className="p-2 border rounded-md bg-white"
        >
          <option value="">Période (toutes)</option>
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Recherche…"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded-md flex-1"
        />

        <button
          onClick={() =>
            setFilters({ type: '', category: '', period: '', search: '' })
          }
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Réinitialiser
        </button>
      </div>

      {loading ? (
        <div className="flex items-center space-x-2 text-accent">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          <span>Chargement des données…</span>
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {/* Stat cards au design distinct */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsStatCard
              title="Métriques totales"
              value={totalMetrics}
              icon={faChartBar}
              gradientFrom="from-yale-blue"
              gradientTo="to-berkeley-blue"
            />
            <AnalyticsStatCard
              title="Score moyen (%)"
              value={avgScore}
              icon={faChartBar}
              gradientFrom="from-green-500"
              gradientTo="to-green-700"
            />
            <AnalyticsStatCard
              title="Tendance +"
              value={trendingUp}
              icon={faArrowUp}
              gradientFrom="from-purple-500"
              gradientTo="to-purple-700"
            />
            <AnalyticsStatCard
              title="Tendance -"
              value={trendingDown}
              icon={faArrowDown}
              gradientFrom="from-red-500"
              gradientTo="to-red-700"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[400px] overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Métriques par type</h2>
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[400px] overflow-hidden">
              <h2 className="text-lg font-semibold mb-4">Répartition des scores</h2>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Detailed table */}
          <PerformanceMetrics />
        </>
      )}
    </div>
  );
};

export default Analytics; 