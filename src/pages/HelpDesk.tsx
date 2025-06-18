import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TicketProvider, useTickets } from '../context/TicketContext';
import TicketCard from '../components/TicketCard';
import TicketForm from '../components/TicketForm';
import TicketDetails from '../components/TicketDetails';
import DeleteConfirmation from '../components/DeleteConfirmation';
import type { Ticket, NewTicket } from '../types/ticket';

const HelpDeskContent: React.FC = () => {
  const { tickets, addTicket, updateTicket, deleteTicket, getPriorities, getStatuses } = useTickets();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Ticket['priority']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Ticket['status']>('all');

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const priorities = getPriorities();
  const statuses = getStatuses();

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tickets, searchTerm, priorityFilter, statusFilter]);

  const handleAddSubmit = useCallback((data: NewTicket | Partial<Ticket>) => {
    addTicket(data as NewTicket);
    setShowAddForm(false);
  }, [addTicket]);

  const handleEditSubmit = useCallback((data: Partial<Ticket>) => {
    if (selectedTicket) {
      updateTicket(selectedTicket.id, data);
      setShowEditForm(false);
      setSelectedTicket(null);
    }
  }, [selectedTicket, updateTicket]);

  const handleConfirmDelete = useCallback(() => {
    if (selectedTicket) {
      deleteTicket(selectedTicket.id);
      setShowDeleteConfirm(false);
      setShowDetails(false);
      setSelectedTicket(null);
    }
  }, [selectedTicket, deleteTicket]);

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Help Desk / Tickets Internes</h1>
        <button
          className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Créer un ticket
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Priority */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
              value={priorityFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setPriorityFilter(e.target.value as Ticket['priority'] | 'all')}
            >
              <option value="all">Toutes les priorités</option>
              {priorities.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
          </div>
          {/* Status */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as Ticket['status'] | 'all')}
            >
              <option value="all">Tous les statuts</option>
              {statuses.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onView={(t) => {
                setSelectedTicket(t);
                setShowDetails(true);
              }}
              onEdit={(t) => {
                setSelectedTicket(t);
                setShowEditForm(true);
              }}
              onDelete={(t) => {
                setSelectedTicket(t);
                setShowDeleteConfirm(true);
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">Aucun ticket trouvé.</div>
        )}
      </div>

      {/* Modals */}
      {showAddForm && (
        <TicketForm onSubmit={handleAddSubmit} onCancel={() => setShowAddForm(false)} />
      )}
      {showEditForm && selectedTicket && (
        <TicketForm
          ticket={selectedTicket}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedTicket(null);
          }}
          isEdit
        />
      )}
      {showDetails && selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          onClose={() => {
            setShowDetails(false);
            setSelectedTicket(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowEditForm(true);
          }}
          onDelete={() => {
            setShowDetails(false);
            setShowDeleteConfirm(true);
          }}
        />
      )}
      {showDeleteConfirm && selectedTicket && (
        <DeleteConfirmation
          title="Supprimer le ticket"
          message={`Êtes-vous sûr de vouloir supprimer le ticket \"${selectedTicket.title}\" ?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            if (!showDetails && !showEditForm) {
              setSelectedTicket(null);
            }
          }}
        />
      )}
    </div>
  );
};

const HelpDesk: React.FC = () => (
  <TicketProvider>
    <HelpDeskContent />
  </TicketProvider>
);

export default HelpDesk; 