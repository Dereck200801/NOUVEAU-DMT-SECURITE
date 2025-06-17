import React from 'react';
import type { Ticket } from '../types/ticket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface TicketDetailsProps {
  ticket: Ticket;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusLabels: Record<string, string> = {
  open: 'Ouvert',
  in_progress: 'En cours',
  closed: 'Fermé',
};

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>
        <p className="mb-4 text-gray-700 whitespace-pre-line">{ticket.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Statut :</span> {statusLabels[ticket.status] || ticket.status}
          </div>
          <div>
            <span className="font-medium">Priorité :</span>{' '}
            <span className="capitalize">{ticket.priority}</span>
          </div>
          {ticket.assignee && (
            <div>
              <span className="font-medium">Assigné à :</span> {ticket.assignee}
            </div>
          )}
          <div>
            <span className="font-medium">Créé le :</span> {new Date(ticket.created_at).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Mis à jour le :</span> {new Date(ticket.updated_at).toLocaleString()}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails; 