import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faRadio, 
  faUserTie, 
  faCarSide, 
  faSearch, 
  faSort,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import equipmentService from '../services/equipmentService';
import { Equipment, EquipmentFilters } from '../types/equipment';

const EquipmentTracker: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<EquipmentFilters>({});

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getAll(filters);
        if (Array.isArray(data)) {
          setEquipments(data);
          setError(null);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setEquipments([]);
          setError('Format de données incorrect');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des équipements:', err);
        setError('Impossible de charger les données des équipements');
        setEquipments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
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

  // Fonction pour obtenir l'icône en fonction du type d'équipement
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'uniform':
        return faUserTie;
      case 'radio':
        return faRadio;
      case 'vehicle':
        return faCarSide;
      case 'protection':
        return faShieldAlt;
      default:
        return faShieldAlt;
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-success';
      case 'assigned':
        return 'text-accent';
      case 'maintenance':
        return 'text-warning';
      default:
        return 'text-gray-500';
    }
  };

  // Fonction pour obtenir la couleur de l'état
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'text-success';
      case 'fair':
        return 'text-warning';
      case 'poor':
        return 'text-danger';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Suivi des équipements</h2>
        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher un équipement..."
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
          <p className="mt-2 text-gray-500">Chargement des équipements...</p>
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
      ) : equipments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucun équipement trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ÉQUIPEMENT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ASSIGNÉ À</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ÉTAT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">DERNIÈRE VÉRIF.</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(equipments) && equipments.map(equipment => (
                <tr key={equipment.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={getEquipmentIcon(equipment.type)} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium">{equipment.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(equipment.status)} text-xs font-medium`}>
                      {equipment.status === 'available' ? 'Disponible' : 
                       equipment.status === 'assigned' ? 'Assigné' : 'En maintenance'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {equipment.assignedToName || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getConditionColor(equipment.condition)} text-xs font-medium`}>
                      {equipment.condition === 'good' ? 'Bon' : 
                       equipment.condition === 'fair' ? 'Moyen' : 'Mauvais'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(equipment.lastCheck).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="p-4 flex justify-between items-center border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Affichage de {equipments.length} équipement{equipments.length > 1 ? 's' : ''} 
          {equipments.length > 0 ? ' sur 24' : ''}
        </span>
        <button className="bg-accent text-white rounded-lg px-3 py-1 text-sm hover:bg-accent-dark transition">
          Gérer les équipements
        </button>
      </div>
    </div>
  );
};

export default EquipmentTracker; 