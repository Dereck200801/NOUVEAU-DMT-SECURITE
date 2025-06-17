import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Ticket, NewTicket, TicketPriority, TicketStatus } from '../types/ticket';

// Sample data for development – this would be fetched from an API in production
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'Impossible d\'accéder au portail de vidéosurveillance',
    description: 'Depuis ce matin, le portail de vidéosurveillance retourne une erreur 500.',
    status: 'open',
    priority: 'high',
    assignee: 'Technicien 1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Badge d\'accès perdu',
    description: 'L\'agent Dupont a perdu son badge et ne peut plus accéder au site.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'RH',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Ordinateur de contrôle en panne',
    description: 'L\'ordinateur de contrôle du poste de garde ne démarre plus.',
    status: 'closed',
    priority: 'critical' as TicketPriority,
    assignee: 'IT Support',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: NewTicket) => void;
  updateTicket: (id: number, ticket: Partial<Ticket>) => void;
  deleteTicket: (id: number) => void;
  getTicketById: (id: number) => Ticket | undefined;
  getStatuses: () => TicketStatus[];
  getPriorities: () => TicketPriority[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load initial data
  useEffect(() => {
    setTickets(INITIAL_TICKETS);
  }, []);

  // Add Ticket
  const addTicket = (ticketData: NewTicket) => {
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    const newTicket: Ticket = {
      id: newId,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...ticketData,
    };
    setTickets([...tickets, newTicket]);
  };

  // Update Ticket
  const updateTicket = (id: number, ticketData: Partial<Ticket>) => {
    setTickets(
      tickets.map(ticket => (ticket.id === id ? { ...ticket, ...ticketData, updated_at: new Date().toISOString() } : ticket))
    );
  };

  // Delete Ticket
  const deleteTicket = (id: number) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  // Get by id
  const getTicketById = (id: number) => tickets.find(ticket => ticket.id === id);

  const getStatuses = () => ['open', 'in_progress', 'closed'] as TicketStatus[];
  const getPriorities = () => ['low', 'medium', 'high', 'critical'] as TicketPriority[];

  return (
    <TicketContext.Provider
      value={{ tickets, addTicket, updateTicket, deleteTicket, getTicketById, getStatuses, getPriorities }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within TicketProvider');
  }
  return context;
}; 