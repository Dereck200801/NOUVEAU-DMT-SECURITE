import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useClients } from '../context/ClientContext';
import type { Client, NewClient } from '../types/client';
import ClientCard from '../components/ClientCard';
import ClientDetails from '../components/ClientDetails';
import ClientForm from '../components/ClientForm';
import DeleteConfirmation from '../components/DeleteConfirmation';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, getClientTypes } = useClients();
  
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // États pour les modales
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Obtenir tous les types de clients uniques pour le filtre
  const clientTypes = getClientTypes();
  
  // Filtrer les clients en fonction des critères de recherche et des filtres
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
      
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    const matchesActive = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && client.activeMissions > 0) ||
      (activeFilter === 'inactive' && client.activeMissions === 0);
    
    return matchesSearch && matchesType && matchesActive;
  });
  
  // Gestionnaires d'événements
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };
  
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditForm(true);
  };
  
  const handleDeleteRequest = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteConfirm(true);
  };
  
  const handleAddSubmit = (clientData: NewClient | Partial<Client>) => {
    const newClient: NewClient = {
      name: clientData.name || '',
      type: clientData.type || '',
      email: clientData.email || '',
      phone: clientData.phone || '',
      address: clientData.address || '',
      activeMissions: clientData.activeMissions || 0,
      totalMissions: clientData.totalMissions || 0
    };
    
    addClient(newClient);
    setShowAddForm(false);
  };
  
  const handleEditSubmit = (clientData: Partial<Client>) => {
    if (selectedClient) {
      updateClient(selectedClient.id, clientData);
      setShowEditForm(false);
      setSelectedClient(null);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setShowDeleteConfirm(false);
      setShowDetails(false);
      setSelectedClient(null);
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Clients</h1>
        <button 
          className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Ajouter un client
        </button>
      </div>
      
      {/* Filters section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Type filter */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {clientTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Active filter */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">Tous les clients</option>
              <option value="active">Clients avec mission active</option>
              <option value="inactive">Clients sans mission active</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onView={handleViewClient}
              onEdit={handleEditClient}
              onDelete={handleDeleteRequest}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucun client ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
      
      {/* Pagination - simplifié pour le moment */}
      {filteredClients.length > 0 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-accent text-white hover:bg-blue-700">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      )}
      
      {/* Modales */}
      {showAddForm && (
        <ClientForm
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
          existingTypes={clientTypes}
        />
      )}
      
      {showEditForm && selectedClient && (
        <ClientForm
          client={selectedClient}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setShowEditForm(false);
            setSelectedClient(null);
          }}
          isEdit={true}
          existingTypes={clientTypes}
        />
      )}
      
      {showDetails && selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={() => {
            setShowDetails(false);
            setSelectedClient(null);
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
      
      {showDeleteConfirm && selectedClient && (
        <DeleteConfirmation
          title="Supprimer le client"
          message={`Êtes-vous sûr de vouloir supprimer le client "${selectedClient.name}" ?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            if (!showDetails && !showEditForm) {
              setSelectedClient(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Clients; 