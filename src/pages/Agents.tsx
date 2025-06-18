import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faEllipsisV, 
  faEdit, 
  faTrash, 
  faEye,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import AgentProfile from '../components/AgentProfile';
import { Agent } from '../types/agent';
import useKeyPress from '../hooks/useKeyPress';
import ProfessionalCard from '../components/ProfessionalCard';
import html2canvas from 'html2canvas';
import agentService from '../services/agentService';
import { useAgents as useAgentsContext } from '../context/AgentContext';

// Sample data for agents
const INITIAL_AGENTS_DATA: Agent[] = [
  {
    id: 1,
    name: 'Pierre Mbemba',
    email: 'pierre.mbemba@dmtsecurite.com',
    phone: '+241 77 98 45 21',
    status: 'active',
    specialty: 'Surveillance',
    joinDate: '15/03/2021'
  },
  {
    id: 2,
    name: 'Jean Koumba',
    email: 'jean.koumba@dmtsecurite.com',
    phone: '+241 66 12 34 56',
    status: 'inactive',
    specialty: 'Protection Rapprochée',
    joinDate: '21/06/2020'
  },
  {
    id: 3,
    name: 'Marie Ondo',
    email: 'marie.ondo@dmtsecurite.com',
    phone: '+241 74 56 78 90',
    status: 'active',
    specialty: "Contrôle d'Accès",
    joinDate: '05/01/2022'
  },
  {
    id: 4,
    name: 'Sophie Ndong',
    email: 'sophie.ndong@dmtsecurite.com',
    phone: '+241 66 45 67 89',
    status: 'active',
    specialty: 'Surveillance',
    joinDate: '12/09/2021'
  },
  {
    id: 5,
    name: 'Robert Ekomi',
    email: 'robert.ekomi@dmtsecurite.com',
    phone: '+241 77 12 34 56',
    status: 'on_mission',
    specialty: 'Protection Rapprochée',
    joinDate: '30/11/2020'
  },
  {
    id: 6,
    name: 'Marc Bivigou',
    email: 'marc.bivigou@dmtsecurite.com',
    phone: '+241 66 23 45 67',
    status: 'on_mission',
    specialty: 'Surveillance',
    joinDate: '08/05/2021'
  },
  {
    id: 7,
    name: 'Claudine Mba',
    email: 'claudine.mba@dmtsecurite.com',
    phone: '+241 74 34 56 78',
    status: 'active',
    specialty: "Contrôle d'Accès",
    joinDate: '14/02/2022'
  },
  {
    id: 8,
    name: 'François Edzang',
    email: 'francois.edzang@dmtsecurite.com',
    phone: '+241 77 45 67 89',
    status: 'inactive',
    specialty: 'Surveillance',
    joinDate: '23/07/2021'
  }
];

const Agents: React.FC = () => {
  const { agents: contextAgents, updateAgent: updateAgentContext, refresh: refreshAgents } = useAgentsContext();

  const [agents, setAgents] = useState<Agent[]>(contextAgents);
  const [loading, setLoading] = useState<boolean>(contextAgents.length === 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardAgent, setCardAgent] = useState<Agent | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Agent, 'id'>>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    specialty: '',
    joinDate: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Fonction pour créer ou obtenir une ref pour un menu
  const getMenuRef = useCallback((agentId: number) => {
    return (element: HTMLDivElement | null) => {
      menuRefs.current[agentId] = element;
    };
  }, []);

  // Fonction pour créer ou obtenir une ref pour un bouton
  const getButtonRef = useCallback((agentId: number) => {
    return (element: HTMLButtonElement | null) => {
      buttonRefs.current[agentId] = element;
    };
  }, []);

  // Utiliser useClickOutside pour chaque menu ouvert
  useEffect(() => {
    if (openMenuId !== null) {
      const menuRef = { current: menuRefs.current[openMenuId] };
      const buttonRef = { current: buttonRefs.current[openMenuId] };
      
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        const menu = menuRef.current;
        const button = buttonRef.current;
        
        if (!menu || !button) return;
        
        if (!menu.contains(target) && !button.contains(target)) {
          setOpenMenuId(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Ajouter la gestion de la touche Echap
  useKeyPress('Escape', () => setOpenMenuId(null));

  // Synchroniser l'état local quand le contexte évolue
  useEffect(() => {
    setAgents(contextAgents);
    setLoading(false);
  }, [contextAgents]);

  // L'ancien fetch est maintenant géré par le contexte, on se contente de rafraîchir au montage si nécessaire
  useEffect(() => {
    if (contextAgents.length === 0) {
      refreshAgents();
    }
  }, [contextAgents, refreshAgents]);

  // Filter agents based on search term and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesSpecialty = specialtyFilter === 'all' || agent.specialty === specialtyFilter;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });
  
  // Get unique specialties for filter
  const specialties = Array.from(new Set(agents.map(agent => agent.specialty)));
  
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-success/20 text-success text-xs rounded-full px-3 py-1">Disponible</span>;
      case 'inactive':
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">Inactif</span>;
      case 'on_mission':
        return <span className="bg-accent/20 text-accent text-xs rounded-full px-3 py-1">En mission</span>;
      default:
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">{status}</span>;
    }
  };

  // Get avatar URL (custom photo if exists in documents)
  const getAvatarUrl = (agent: Agent) => {
    if (agent.documents && agent.documents.length) {
      const photoDoc = agent.documents.find(d => (d.type === 'ID' || /photo/i.test(d.name)) && d.fileUrl);
      if (photoDoc && photoDoc.fileUrl) return photoDoc.fileUrl;
    }
    return `https://ui-avatars.com/api/?name=${agent.name.replace(' ', '+')}&background=1d4ed8&color=fff`;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new agent
  const handleAddAgent = () => {
    const blank: Agent = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      status: 'active',
      specialty: '',
      joinDate: new Date().toLocaleDateString('fr-FR'),
      documents: []
    } as Agent;
    setCurrentAgent(blank);
    setIsEditing(false);
    setShowProfile(true);
  };

  // Edit agent
  const handleEditAgent = (agent: Agent) => {
    setIsEditing(true);
    setCurrentAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      status: agent.status,
      specialty: agent.specialty,
      joinDate: agent.joinDate
    });
    setShowModal(true);
  };

  // View agent profile
  const handleViewAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setShowProfile(true);
  };

  // Close profile
  const handleCloseProfile = (updated?: Agent) => {
    if (updated) {
      setAgents(prev => {
        if (updated.id === 0) {
          const newId = Math.max(...prev.map(a => a.id), 0) + 1;
          return [...prev, { ...updated, id: newId }];
        }
        return prev.map(a => (a.id === updated.id ? updated : a));
      });
    }
    setShowProfile(false);
  };

  // Delete agent
  const handleDeleteAgent = (id: number) => {
    setDeleteConfirmation(id);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (deleteConfirmation !== null) {
      try {
        await agentService.delete(deleteConfirmation);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'agent:", error);
      } finally {
        setAgents(agents.filter(agent => agent.id !== deleteConfirmation));
        setDeleteConfirmation(null);
      }
    }
  };

  // Save agent (add or update)
  const handleSaveAgent = async () => {
    if (isEditing && currentAgent) {
      // Update existing agent via API + contexte
      try {
        await updateAgentContext(currentAgent.id, formData);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'agent:", error);
      }
    } else {
      // Add new agent via API (hors contexte pour l'instant)
      try {
        const createdAgent = await agentService.create(formData);
        await refreshAgents(); // Rafraîchir après création

        // Open professional card modal for the newly created agent
        setCardAgent(createdAgent);
        setShowCardModal(true);
      } catch (error) {
        console.error("Erreur lors de la création de l'agent:", error);
        // Fallback locale
        const newAgent: Agent = {
          ...formData,
          id: Math.max(...agents.map(a => a.id), 0) + 1
        };
        setAgents([...agents, newAgent]);
        setCardAgent(newAgent);
        setShowCardModal(true);
      }
    }
    setShowModal(false);
  };

  const toggleMenu = (agentId: number) => {
    setOpenMenuId(openMenuId === agentId ? null : agentId);
  };
  
  // --- Professional Card: Print & Export ---
  const handlePrintCard = () => {
    if (!cardRef.current) return;

    const stylesheetLink = (document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement)?.href;
    const printWindow = window.open('', 'PRINT', 'height=600,width=900');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Carte Professionnelle</title>${
      stylesheetLink ? `<link rel="stylesheet" href="${stylesheetLink}">` : ''
    }<style>@page { size: 85.6mm 54mm; margin: 0; } body { margin: 0; display: flex; justify-content: center; align-items: center; }</style></head><body>${cardRef.current.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExportCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement('a');
      link.download = `${cardAgent?.name || 'carte'}_dmt.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erreur export carte:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-accent text-4xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Agents</h1>
        <button 
          className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          onClick={handleAddAgent}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Ajouter un agent
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
              placeholder="Rechercher un agent..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Disponible</option>
              <option value="inactive">Inactif</option>
              <option value="on_mission">En mission</option>
            </select>
          </div>
          
          {/* Specialty filter */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="all">Toutes les spécialités</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Agents table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">NOM</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">EMAIL</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">TÉLÉPHONE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">STATUT</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">SPÉCIALITÉ</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">DATE D'EMBAUCHE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <img 
                        src={getAvatarUrl(agent)} 
                        alt={agent.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span>{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{agent.email}</td>
                  <td className="py-4 px-6 text-sm">{agent.phone}</td>
                  <td className="py-4 px-6">{renderStatusBadge(agent.status)}</td>
                  <td className="py-4 px-6 text-sm">{agent.specialty}</td>
                  <td className="py-4 px-6 text-sm">{agent.joinDate}</td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <button 
                        ref={getButtonRef(agent.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full p-1"
                        onClick={() => toggleMenu(agent.id)}
                        aria-expanded={openMenuId === agent.id}
                        aria-haspopup="true"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                      <div 
                        ref={getMenuRef(agent.id)}
                        className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transform transition-all duration-200 ease-in-out ${
                          openMenuId === agent.id 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-[-10px] pointer-events-none'
                        } z-10`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div className="py-1" role="none">
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            onClick={() => {
                              handleViewAgent(agent);
                              setOpenMenuId(null);
                            }}
                            role="menuitem"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" /> Voir le profil
                          </button>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                            onClick={() => {
                              handleEditAgent(agent);
                              setOpenMenuId(null);
                            }}
                            role="menuitem"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
                          </button>
                          <button 
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-red-700"
                            onClick={() => {
                              handleDeleteAgent(agent.id);
                              setOpenMenuId(null);
                            }}
                            role="menuitem"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">{filteredAgents.length}</span> agents sur <span className="font-medium">{agents.length}</span>
          </div>
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
      </div>

      {/* Add/Edit Agent Modal */}
      {false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{isEditing ? 'Modifier un agent' : 'Ajouter un agent'}</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Nom et prénom"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="email@dmtsecurite.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="+241 XX XX XX XX"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="active">Disponible</option>
                  <option value="inactive">Inactif</option>
                  <option value="on_mission">En mission</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Spécialité de l'agent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                <input
                  type="text"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="JJ/MM/AAAA"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
                onClick={handleSaveAgent}
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setDeleteConfirmation(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Profile Modal */}
      {showProfile && currentAgent && (
        <AgentProfile agent={currentAgent} onClose={handleCloseProfile} isNew={currentAgent?.id === 0} />
      )}

      {/* Professional Card Modal */}
      {showCardModal && cardAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Carte professionnelle</h2>
            <div className="flex justify-center mb-4">
              <ProfessionalCard ref={cardRef} agent={cardAgent} />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
                onClick={handlePrintCard}
              >
                Imprimer
              </button>
              <button
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
                onClick={handleExportCard}
              >
                Exporter
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowCardModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents; 