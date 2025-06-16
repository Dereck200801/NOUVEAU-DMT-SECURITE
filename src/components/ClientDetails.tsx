import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faBuilding, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faTasks,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import type { Client } from '../types/client';

interface ClientDetailsProps {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientDetails = ({ client, onClose, onEdit, onDelete }: ClientDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Détails du client</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className={`w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center mr-4`}>
              <FontAwesomeIcon icon={faBuilding} className="text-accent text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-2xl">{client.name}</h3>
              <span className="text-gray-500">{client.type}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p>{client.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center col-span-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p>{client.address}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTasks} className="text-gray-400 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Missions actives</p>
                <p>{client.activeMissions}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTasks} className="text-gray-400 mr-3 w-5" />
              <div>
                <p className="text-sm text-gray-500">Total des missions</p>
                <p>{client.totalMissions}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 flex justify-end space-x-3">
            <button
              onClick={onDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Supprimer
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails; 