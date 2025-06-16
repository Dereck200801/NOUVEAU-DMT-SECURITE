import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MissionHistory } from '../types/agent';

interface MissionHistoryTableProps {
  missions: MissionHistory[];
}

const MissionHistoryTable: React.FC<MissionHistoryTableProps> = ({ missions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour afficher le statut d'une mission avec le bon style
  const renderMissionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-success/20 text-success text-xs rounded-full px-3 py-1">Terminée</span>;
      case 'ongoing':
        return <span className="bg-accent/20 text-accent text-xs rounded-full px-3 py-1">En cours</span>;
      case 'planned':
        return <span className="bg-warning/20 text-warning text-xs rounded-full px-3 py-1">Planifiée</span>;
      default:
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">{status}</span>;
    }
  };

  // Filtrer les missions en fonction du terme de recherche
  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Tableau des missions */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mission</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMissions.length > 0 ? (
              filteredMissions.map((mission) => (
                <tr key={mission.id}>
                  <td className="py-3 px-4">{mission.title}</td>
                  <td className="py-3 px-4">{mission.date}</td>
                  <td className="py-3 px-4">{mission.location}</td>
                  <td className="py-3 px-4">{renderMissionStatusBadge(mission.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  {searchTerm 
                    ? "Aucune mission ne correspond à votre recherche" 
                    : "Aucune mission disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MissionHistoryTable; 