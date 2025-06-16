import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Client, NewClient } from '../types/client';

// Sample data for development (will be replaced by API calls)
const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    name: 'Carrefour Mont-Bouët',
    type: 'Commercial',
    email: 'contact@carrefour-mb.com',
    phone: '+241 011 76 43 21',
    address: 'Quartier Mont-Bouët, Libreville',
    activeMissions: 1,
    totalMissions: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Ministère de l\'Intérieur',
    type: 'Gouvernement',
    email: 'admin@interieur.gouv.ga',
    phone: '+241 011 72 23 45',
    address: 'Boulevard Triomphal, Libreville',
    activeMissions: 1,
    totalMissions: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'BGFI Bank',
    type: 'Finance',
    email: 'contact@bgfibank.com',
    phone: '+241 011 76 12 34',
    address: 'Boulevard de l\'Indépendance, Libreville',
    activeMissions: 1,
    totalMissions: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Zones Industrielles Oloumi',
    type: 'Industriel',
    email: 'contact@zi-oloumi.ga',
    phone: '+241 077 65 43 21',
    address: 'Zone Industrielle d\'Oloumi, Libreville',
    activeMissions: 1,
    totalMissions: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Résidence Haut de Gue-Gue',
    type: 'Résidentiel',
    email: 'syndic@residence-hdg.com',
    phone: '+241 066 54 32 10',
    address: 'Quartier Haut de Gue-Gue, Libreville',
    activeMissions: 0,
    totalMissions: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Port de Libreville',
    type: 'Transport',
    email: 'securite@port-libreville.ga',
    phone: '+241 011 65 87 32',
    address: 'Zone Portuaire, Libreville',
    activeMissions: 1,
    totalMissions: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    name: 'Total Gabon',
    type: 'Énergie',
    email: 'contact@total-gabon.com',
    phone: '+241 011 65 43 21',
    address: 'Port-Gentil, Ogooué-Maritime',
    activeMissions: 1,
    totalMissions: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    name: 'BICIG',
    type: 'Finance',
    email: 'contact@bicig.ga',
    phone: '+241 011 79 87 65',
    address: 'Avenue du Colonel Parant, Libreville',
    activeMissions: 0,
    totalMissions: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

interface ClientContextType {
  clients: Client[];
  addClient: (client: NewClient) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  getClientById: (id: number) => Client | undefined;
  getClientTypes: () => string[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  
  // Charger les données initiales
  useEffect(() => {
    // Dans une application réelle, cela pourrait être un appel API
    setClients(INITIAL_CLIENTS);
  }, []);
  
  // Ajouter un client
  const addClient = (clientData: NewClient) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const newClient = { ...clientData, id: newId };
    setClients([...clients, newClient]);
  };
  
  // Mettre à jour un client
  const updateClient = (id: number, clientData: Partial<Client>) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
  };
  
  // Supprimer un client
  const deleteClient = (id: number) => {
    setClients(clients.filter(client => client.id !== id));
  };
  
  // Obtenir un client par son ID
  const getClientById = (id: number) => {
    return clients.find(client => client.id === id);
  };
  
  // Obtenir tous les types de clients uniques
  const getClientTypes = () => {
    return Array.from(new Set(clients.map(client => client.type)));
  };
  
  return (
    <ClientContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClientById,
      getClientTypes
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients doit être utilisé avec ClientProvider');
  }
  return context;
}; 