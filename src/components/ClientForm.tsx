import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Client, NewClient, ClientFormProps } from '../types/client';

const ClientForm = ({ client, onSubmit, onCancel, isEdit = false, existingTypes }: ClientFormProps) => {
  const [formData, setFormData] = useState<NewClient | Partial<Client>>({
    name: '',
    type: '',
    email: '',
    phone: '',
    address: '',
    activeMissions: 0,
    totalMissions: 0
  });
  
  const [newType, setNewType] = useState<string>('');
  const [showNewTypeInput, setShowNewTypeInput] = useState<boolean>(false);
  
  // Charger les données du client si en mode édition
  useEffect(() => {
    if (client) {
      setFormData({ ...client });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const parsedValue = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewTypeInput(true);
    } else {
      setFormData(prev => ({ ...prev, type: value }));
      setShowNewTypeInput(false);
    }
  };
  
  const handleNewTypeSubmit = () => {
    if (newType.trim()) {
      setFormData(prev => ({ ...prev, type: newType.trim() }));
      setShowNewTypeInput(false);
      setNewType('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Modifier le client' : 'Ajouter un nouveau client'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du client */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du client
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            
            {/* Type de client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de client
              </label>
              {!showNewTypeInput ? (
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleTypeChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {existingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="new">+ Ajouter un nouveau type</option>
                </select>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="border border-gray-300 rounded-l-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Nouveau type de client"
                  />
                  <button
                    type="button"
                    onClick={handleNewTypeSubmit}
                    className="bg-accent hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            
            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                pattern="^[0-9+\s-]{6,}$"
                title="Veuillez entrer un numéro de téléphone valide (au moins 6 chiffres)"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            
            {/* Missions actives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Missions actives
              </label>
              <input
                type="number"
                name="activeMissions"
                value={formData.activeMissions || 0}
                onChange={handleChange}
                min="0"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            {/* Total des missions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total des missions
              </label>
              <input
                type="number"
                name="totalMissions"
                value={formData.totalMissions || 0}
                onChange={handleChange}
                min="0"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            
            {/* Adresse */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-blue-700 text-white rounded-lg"
            >
              {isEdit ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm; 