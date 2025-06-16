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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 md:mx-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">
            Agents disponibles pour la mission : {missionTitle}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Liste des agents disponibles avec cases à cocher */}
          <div>
            <h4 className="font-medium mb-2">Sélectionner les agents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
              {availableAgents.map(agent => (
                <label 
                  key={agent.id}
                  className={`bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow cursor-pointer flex items-start space-x-4 ${isChecked(agent.id) ? 'ring-2 ring-accent' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 mr-2" 
                    checked={isChecked(agent.id)} 
                    onChange={() => toggleAgent(agent.id)}
                  />
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {agent.name}
                    </p>
                    {agent.badge && <p className="text-sm text-gray-500">{agent.badge}</p>}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)} mt-1`}>
                      {getStatusText(agent.status)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Zone d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              onClick={() => onSave(selectedIds)}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-accent hover:bg-blue-700"
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