import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faRadio,
  faUserTie,
  faCarSide,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useEquipments } from '../context/EquipmentContext';
import { useEmployees } from '../context/EmployeeContext';
import type { Equipment } from '../types/equipment';
import Loader from './ui/loader';

const EquipmentTracker: React.FC = () => {
  const { equipments } = useEquipments();
  const { employees } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const loading = equipments.length === 0;

  // Fonction pour gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Liste filtrée en fonction du terme de recherche
  const filteredEquipments = equipments.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.serialNumber.toLowerCase().includes(term) ||
      (e.notes ?? '').toLowerCase().includes(term)
    );
  });

  // Fonction pour obtenir l'icône en fonction du type d'équipement
  const getEquipmentIcon = (category: string) => {
    switch (category) {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Suivi des équipements</h2>
        <form className="mt-2 flex items-center" onSubmit={(e)=>e.preventDefault()}>
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
        </form>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <Loader label="Chargement des équipements..." />
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucun équipement</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ÉQUIPEMENT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">ASSIGNÉ À</th>
                <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">CATÉGORIE</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.map((equipment) => (
                <tr key={equipment.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-light flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={getEquipmentIcon(equipment.category)} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium">{equipment.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${getStatusColor(equipment.status)} text-xs font-medium capitalize`}>
                      {equipment.status === 'available' ? 'Disponible' : 
                       equipment.status === 'assigned' ? 'Assigné' : 
                       equipment.status === 'maintenance' ? 'Maintenance' : 'Perdu'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {equipment.assignedTo ? employees.find((e)=>e.id===equipment.assignedTo)?.name ?? '-' : '-'}
                  </td>
                  <td className="py-3 px-4 capitalize text-sm">
                    {equipment.category}
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