export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: string;
  created_at: string;
  updated_at: string;
}

export interface NewTicket {
  title: string;
  description: string;
  priority: TicketPriority;
  assignee?: string;
} 