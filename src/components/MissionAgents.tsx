import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import type { Agent } from '../types/agent';
import type { MissionAgentsProps } from '../types/mission';

const MissionAgents = ({ missionTitle, onClose, assignedAgents, availableAgents, onSave }: MissionAgentsProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(assignedAgents);
  const [search, setSearch] = useState('');

  const filteredAgents = availableAgents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.badge?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIds(assignedAgents);
  }, [assignedAgents]);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'inactive':
        return 'bg-gray-200 text-gray-500';
      case 'on_mission':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'Disponible';
      case 'inactive':
        return 'Inactif';
      case 'on_mission':
        return 'En mission';
      default:
        return status;
    }
  };

  const toggleAgent = (agentId: number) => {
    setSelectedIds(prev => prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]);
  };

  const isChecked = (id: number) => selectedIds.includes(id);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Agents disponibles pour&nbsp;
            <span className="text-accent">{missionTitle}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="p-4 border-b bg-light/50">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un agent..."
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-accent focus:border-accent/50"
          />
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <label
              key={agent.id}
              className={`relative group border rounded-xl p-5 transition cursor-pointer ${isChecked(agent.id) ? 'ring-2 ring-accent' : ''} ${agent.status === 'on_mission' && !isChecked(agent.id) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
            >
              <input
                type="checkbox"
                className="absolute top-3 right-3 h-4 w-4 text-accent focus:ring-accent rounded"
                checked={isChecked(agent.id)}
                onChange={() => toggleAgent(agent.id)}
                disabled={agent.status === 'on_mission' && !isChecked(agent.id)}
                title={agent.status === 'on_mission' && !isChecked(agent.id) ? 'Agent déjà en mission' : ''}
              />
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-gray-300 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{agent.name}</p>
                  {agent.badge && <p className="text-sm text-gray-500">{agent.badge}</p>}
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(agent.status)}`}
                  >
                    {getStatusText(agent.status)}
                  </span>
                </div>
              </div>
            </label>
          ))}

          {filteredAgents.length === 0 && (
            <p className="col-span-full text-center text-gray-500">Aucun agent ne correspond à votre recherche.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center flex-wrap gap-4">
          <span className="text-sm text-gray-600">
            {selectedIds.length} agent{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
          </span>
          <div className="space-x-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(selectedIds)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionAgents; 