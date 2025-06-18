import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCalendarAlt, 
  faUser, 
  faCheckCircle, 
  faSearch,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import certificationService from '../services/certificationService';
import { Certification, CertificationFilters } from '../types/certification';
import Loader from './ui/loader';

const TrainingCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<CertificationFilters>({});

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const data = await certificationService.getAll(filters);
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setCertifications(data);
          setError(null);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setCertifications([]);
          setError('Format de données incorrect');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des certifications:', err);
        setError('Impossible de charger les données des certifications');
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Formations et certifications</h2>
        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher une certification..."
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
          <Loader label="Chargement des certifications..." />
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
      ) : certifications.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucune certification trouvée</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">CERTIFICATION</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">AGENT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">DATE D'OBTENTION</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">EXPIRATION</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(certifications) && certifications.map(certification => (
                <tr key={certification.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{certification.name}</p>
                        <p className="text-xs text-gray-500">{certification.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                      <span className="text-sm">{certification.agentName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                      <span className="text-sm">{new Date(certification.issueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {certification.expiryDate ? new Date(certification.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center text-xs font-medium ${certification.isValid ? 'text-success' : 'text-danger'}`}>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      {certification.isValid ? 'Valide' : 'Expirée'}
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
          Affichage de {certifications.length} certification{certifications.length > 1 ? 's' : ''} 
          {certifications.length > 0 ? ' sur 18' : ''}
        </span>
        <button className="bg-accent text-white rounded-lg px-3 py-1 text-sm hover:bg-accent-dark transition">
          Gérer les formations
        </button>
      </div>
    </div>
  );
};

export default TrainingCertifications; 