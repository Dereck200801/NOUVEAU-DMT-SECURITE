import axios from 'axios';
import { Invoice, BillingStats } from '../types/billing';

// Utiliser un chemin relatif pour faciliter le proxy côté frontend
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : '/api';

// Données de secours pour le développement hors-ligne
const FALLBACK_INVOICES: Invoice[] = [
  {
    id: 1,
    clientId: 1,
    clientName: 'Carrefour Mont-Bouët',
    amount: 12_000_000,
    currency: 'XAF',
    status: 'paid',
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    description: 'Sécurisation du site – Janvier 2024',
  },
  {
    id: 2,
    clientId: 2,
    clientName: "Ministère de l'Intérieur",
    amount: 18_500_000,
    currency: 'XAF',
    status: 'pending',
    issueDate: '2024-02-01',
    dueDate: '2024-02-15',
    description: 'Garde rapprochée – Février 2024',
  },
  {
    id: 3,
    clientId: 3,
    clientName: 'BGFI Bank',
    amount: 9_750_000,
    currency: 'XAF',
    status: 'overdue',
    issueDate: '2023-12-10',
    dueDate: '2023-12-25',
    description: 'Vidéosurveillance – Décembre 2023',
  },
  {
    id: 4,
    clientId: 4,
    clientName: 'Zones Industrielles Oloumi',
    amount: 14_200_000,
    currency: 'XAF',
    status: 'paid',
    issueDate: '2024-03-02',
    dueDate: '2024-03-17',
    description: 'Patrouilles de sécurité – Mars 2024',
  },
  {
    id: 5,
    clientId: 5,
    clientName: 'Résidence Haut de Gue-Gue',
    amount: 6_900_000,
    currency: 'XAF',
    status: 'pending',
    issueDate: '2024-03-10',
    dueDate: '2024-03-25',
    description: 'Sécurité résidentielle – Mars 2024',
  },
];

// In-memory store used when the API is unreachable (development/offline mode)
let IN_MEMORY_INVOICES: Invoice[] = [...FALLBACK_INVOICES];

const fetchInvoicesFromApi = async (): Promise<Invoice[]> => {
  const response = await axios.get(`${API_URL}/invoices`);
  if (Array.isArray(response.data)) {
    return response.data;
  }
  throw new Error('Format de la réponse inattendu');
};

const withApiFallback = async <T>(apiCall: () => Promise<T>, fallbackCall: () => T): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API indisponible – bascule sur le fallback pour la facturation.', error);
    return fallbackCall();
  }
};

export const billingService = {
  getAll: async (): Promise<Invoice[]> => {
    return withApiFallback(
      async () => {
        const data = await fetchInvoicesFromApi();
        IN_MEMORY_INVOICES = data; // Garder une copie locale pour modifications optimistes
        return data;
      },
      () => IN_MEMORY_INVOICES
    );
  },

  getStats: async (): Promise<BillingStats> => {
    const invoices = await billingService.getAll();

    const totalRevenue = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const outstanding = invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const overdue = invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      totalRevenue,
      outstanding,
      overdue,
      invoicesCount: invoices.length,
    };
  },

  getRevenueByMonth: async (): Promise<Record<string, number>> => {
    const invoices = await billingService.getAll();

    const revenueMap: Record<string, number> = {};
    invoices.forEach((inv) => {
      if (inv.status !== 'paid') return; // On comptabilise uniquement les factures payées
      const date = new Date(inv.issueDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // yyyy-mm
      revenueMap[key] = (revenueMap[key] || 0) + inv.amount;
    });

    return revenueMap;
  },

  create: async (payload: Omit<Invoice, 'id'>): Promise<Invoice> => {
    return withApiFallback(
      async () => {
        const response = await axios.post(`${API_URL}/invoices`, payload);
        return response.data;
      },
      () => {
        const newInvoice: Invoice = {
          ...payload,
          id: Math.max(0, ...IN_MEMORY_INVOICES.map((i) => i.id)) + 1,
        } as Invoice;
        IN_MEMORY_INVOICES = [newInvoice, ...IN_MEMORY_INVOICES];
        return newInvoice;
      }
    );
  },

  update: async (id: number, payload: Partial<Invoice>): Promise<Invoice> => {
    return withApiFallback(
      async () => {
        const response = await axios.put(`${API_URL}/invoices/${id}`, payload);
        return response.data;
      },
      () => {
        IN_MEMORY_INVOICES = IN_MEMORY_INVOICES.map((inv) =>
          inv.id === id ? { ...inv, ...payload } : inv
        );
        const updated = IN_MEMORY_INVOICES.find((inv) => inv.id === id)!;
        return updated;
      }
    );
  },

  remove: async (id: number): Promise<void> => {
    return withApiFallback(
      async () => {
        await axios.delete(`${API_URL}/invoices/${id}`);
      },
      () => {
        IN_MEMORY_INVOICES = IN_MEMORY_INVOICES.filter((inv) => inv.id !== id);
      }
    );
  },
};

export default billingService; 