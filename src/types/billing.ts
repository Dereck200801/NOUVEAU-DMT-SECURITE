export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: number;
  clientId: number;
  clientName: string;
  amount: number; // Montant total de la facture (dans la devise spécifiée)
  currency: string; // Ex: 'XAF', 'EUR'
  status: InvoiceStatus;
  issueDate: string; // Date d'émission (ISO string)
  dueDate: string; // Date d'échéance (ISO string)
  description?: string;
}

export interface BillingStats {
  totalRevenue: number; // Somme des factures payées
  outstanding: number; // Somme des factures en attente
  overdue: number; // Somme des factures en retard
  invoicesCount: number; // Nombre total de factures
} 