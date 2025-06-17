import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLifeRing,
  faEllipsisV,
  faEye,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import type { Ticket } from '../types/ticket';
import useClickOutside from '../hooks/useClickOutside';
import useKeyPress from '../hooks/useKeyPress';

interface TicketCardProps {
  ticket: Ticket;
  onView: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

const statusColors: Record<string, string> = {
  open: 'text-red-600',
  in_progress: 'text-yellow-600',
  closed: 'text-green-600',
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onView, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), [buttonRef]);
  useKeyPress('Escape', () => setMenuOpen(false));

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faLifeRing} className="text-accent text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{ticket.title}</h3>
              <span className={`text-sm ${statusColors[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full p-1"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <div
              ref={menuRef}
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transform transition-all duration-200 ease-in-out ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
              } z-10`}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onView(ticket);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" /> Voir les détails
                </button>
                <button
                  onClick={() => {
                    onEdit(ticket);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                </button>
                <button
                  onClick={() => {
                    onDelete(ticket);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-3 mb-2">{ticket.description}</p>
        <div className="text-sm text-gray-500">
          Priorité : <span className="font-medium capitalize">{ticket.priority}</span>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 flex justify-between">
        <span>Créé le {new Date(ticket.created_at).toLocaleDateString()}</span>
        <span>Mis à jour le {new Date(ticket.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TicketCard; 