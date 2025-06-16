import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faTasks, 
  faEllipsisV,
  faEye,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import type { Client } from '../types/client';
import useClickOutside from '../hooks/useClickOutside';
import useKeyPress from '../hooks/useKeyPress';

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientCard = ({ client, onView, onEdit, onDelete }: ClientCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => setIsMenuOpen(false), [buttonRef]);
  useKeyPress('Escape', () => setIsMenuOpen(false));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faBuilding} className="text-accent text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{client.name}</h3>
              <span className="text-sm text-gray-500">{client.type}</span>
            </div>
          </div>
          <div className="relative">
            <button 
              ref={buttonRef}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full p-1"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <div 
              ref={menuRef}
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transform transition-all duration-200 ease-in-out ${
                isMenuOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-[-10px] pointer-events-none'
              } z-10`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                <button 
                  onClick={() => {
                    onView(client);
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" /> Voir les détails
                </button>
                <button 
                  onClick={() => {
                    onEdit(client);
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                </button>
                <button 
                  onClick={() => {
                    onDelete(client);
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-red-700"
                  role="menuitem"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400 w-5" />
            {client.email}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400 w-5" />
            {client.phone}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400 w-5" />
            {client.address}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <FontAwesomeIcon icon={faTasks} className="mr-2 text-gray-500" />
          <span>
            <span className="font-medium">{client.activeMissions}</span> mission{client.activeMissions !== 1 ? 's' : ''} active{client.activeMissions !== 1 ? 's' : ''}
          </span>
        </div>
        <button 
          onClick={() => onView(client)} 
          className="text-accent hover:text-blue-700 text-sm font-medium"
        >
          Voir les missions
        </button>
      </div>
    </div>
  );
};

export default ClientCard; 