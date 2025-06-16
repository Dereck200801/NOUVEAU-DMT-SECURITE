import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faSearch, 
  faSort, 
  faSpinner, 
  faEye,
  faCalendarAlt,
  faMapMarkerAlt,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import incidentService from '../services/incidentService';
import { Incident, IncidentFilters } from '../types/incident';

const IncidentReports: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<IncidentFilters>({});

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const data = await incidentService.getAll(filters);
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setIncidents(data);
          setError(null);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setIncidents([]);
          setError('Format de données incorrect');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des incidents:', err);
        setError('Impossible de charger les données des incidents');
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [filters]);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
  };

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Fonction pour obtenir la couleur de la sévérité
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-gray-500';
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-danger';
      case 'investigating':
        return 'text-warning';
      case 'resolved':
        return 'text-success';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Rapports d'incidents</h2>
        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher un incident..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            type="button"
            onClick={() => setFilters({})}
            className="ml-2 bg-light text-gray-600 rounded-lg px-3 py-2 text-sm hover:bg-gray-200 transition flex items-center"
          >
            <FontAwesomeIcon icon={faSort} className="mr-1" />
            Filtrer
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-accent text-2xl" />
          <p className="mt-2 text-gray-500">Chargement des incidents...</p>
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
      ) : incidents.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucun incident trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">INCIDENT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">DATE</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">LIEU</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">SÉVÉRITÉ</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(incidents) && incidents.map(incident => (
                <tr key={incident.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium">{incident.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                      {new Date(incident.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2" />
                      {incident.location}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getSeverityColor(incident.severity)} text-xs font-medium`}>
                      {incident.severity === 'high' ? 'Élevée' : 
                       incident.severity === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(incident.status)} text-xs font-medium`}>
                      {incident.status === 'open' ? 'Ouvert' : 
                       incident.status === 'investigating' ? 'En cours' : 'Résolu'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-accent hover:text-accent-dark">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="p-4 flex justify-between items-center border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Affichage de {incidents.length} incident{incidents.length > 1 ? 's' : ''} 
          {incidents.length > 0 ? ' sur 12' : ''}
        </span>
        <button className="bg-accent text-white rounded-lg px-3 py-1 text-sm hover:bg-accent-dark transition">
          Signaler un incident
        </button>
      </div>
    </div>
  );
};

export default IncidentReports; 