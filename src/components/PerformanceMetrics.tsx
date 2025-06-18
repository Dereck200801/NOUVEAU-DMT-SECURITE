import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faCheckCircle, 
  faExclamationTriangle,
  faSearch,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { PerformanceMetric } from '../types/metrics';
import useMetrics from '../hooks/useMetrics';
import Loader from './ui/loader';

const PerformanceMetrics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const { metrics, loading, error } = useMetrics({ search: searchFilter || undefined });

  // Fonction pour appliquer les filtres
  const applySearch = () => setSearchFilter(searchTerm);

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch();
  };

  // Fonction pour obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-accent';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  // Fonction pour obtenir l'icône en fonction du type de métrique
  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return faUsers;
      case 'mission':
        return faCheckCircle;
      case 'incident':
        return faExclamationTriangle;
      default:
        return faChartLine;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Métriques de performance</h2>
        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher une métrique..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            type="button"
            onClick={() => setSearchFilter('')}
            className="ml-2 bg-light text-gray-600 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition flex items-center"
          >
            <FontAwesomeIcon icon={faSort} className="mr-1" />
            Filtrer
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <Loader label="Chargement des métriques..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-danger">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-light text-primary rounded-lg px-3 py-1 text-sm hover:bg-gray-200 transition"
          >
            Réessayer
          </button>
        </div>
      ) : metrics.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucune métrique trouvée</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">MÉTRIQUE</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">CATÉGORIE</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">PÉRIODE</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">SCORE</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">TENDANCE</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(metrics) && metrics.map(metric => (
                <tr key={metric.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={getMetricIcon(metric.type)} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {metric.category}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {metric.period}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getScoreColor(metric.score)} font-medium`}>
                      {metric.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-danger' : 'text-gray-500'}`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {metric.trendValue}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="p-4 flex justify-between items-center border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Affichage de {metrics.length} métrique{metrics.length > 1 ? 's' : ''} 
          {metrics.length > 0 ? ' sur 15' : ''}
        </span>
        <button className="bg-accent text-white rounded-lg px-3 py-1 text-sm hover:bg-accent-dark transition">
          Rapport complet
        </button>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 