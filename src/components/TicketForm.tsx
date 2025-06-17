import React, { useState, useEffect } from 'react';
import type { Ticket, NewTicket, TicketPriority, TicketStatus } from '../types/ticket';
import { useTickets } from '../context/TicketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

interface TicketFormProps {
  ticket?: Ticket;
  onSubmit: (data: NewTicket | Partial<Ticket>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, onSubmit, onCancel, isEdit }) => {
  const { getPriorities, getStatuses } = useTickets();
  const priorities = getPriorities();
  const statuses = getStatuses();

  const [title, setTitle] = useState(ticket?.title || '');
  const [description, setDescription] = useState(ticket?.description || '');
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority || 'medium');
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'open');

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description);
      setPriority(ticket.priority);
      setStatus(ticket.status);
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      onSubmit({ title, description, priority, status });
    } else {
      onSubmit({ title, description, priority });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Modifier le ticket' : 'Nouveau ticket'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent"
              >
                {priorities.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TicketStatus)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" /> {isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm; 