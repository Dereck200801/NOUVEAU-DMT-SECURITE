import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faEllipsisV, 
  faEdit, 
  faTrash, 
  faEye, 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faUserShield,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import MissionAgents from '../components/MissionAgents';
import useKeyPress from '../hooks/useKeyPress';
import type { Mission, MissionFormData } from '../types/mission';
import AGENTS_DATA from '../data/agents';
import { eventService, type CreateEventDTO, type Event as CalendarEvent } from '../services/eventService';
import { normalizeDate } from '../utils/dateUtils';

// Liste globale des agents disponibles (à remplacer par un appel API dans une vraie appli)
const AVAILABLE_AGENTS = AGENTS_DATA;

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | 'view'>('create');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [showAgentsModal, setShowAgentsModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    client: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    agents: [],
    description: ''
  });
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Charger les missions depuis le calendrier (événements de type "mission")
  useEffect(() => {
    loadMissionsFromCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers de conversion de dates
  function frToIso(dateFr: string): string {
    const [d, m, y] = dateFr.split('/');
    if (!d || !m || !y) return normalizeDate(new Date());
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }

  function isoToFr(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  const loadMissionsFromCalendar = async () => {
    try {
      const resp = await eventService.getEvents();
      if (resp.success && resp.data) {
        const missionsFromEvents = resp.data
          .filter((ev: CalendarEvent) => ev.type === 'mission')
          .map<Mission>((ev: CalendarEvent) => ({
            id: ev.id,
            title: ev.title,
            client: ev.client || '',
            location: ev.location || '',
            startDate: isoToFr(ev.date),
            endDate: ev.endDate ? isoToFr(ev.endDate) : isoToFr(ev.date),
            status: ev.status || 'pending',
            agents: ev.agents || ev.participants?.map(p => Number(p)) || [],
            description: ev.description || ''
          }));
        setMissions(missionsFromEvents);
      }
    } catch (e) {
      console.error('Erreur chargement missions depuis calendrier', e);
    }
  };

  // Filter missions based on search term and status filter
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = 
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Open modal with specified type
  const openModal = (type: 'create' | 'edit' | 'delete' | 'view', mission?: Mission) => {
    setModalType(type);
    setShowModal(true);
    
    if (mission && (type === 'edit' || type === 'delete' || type === 'view')) {
      setCurrentMission(mission);
      setFormData({ ...mission });
    } else {
      setCurrentMission(null);
      setFormData({
        title: '',
        client: '',
        location: '',
        startDate: '',
        endDate: '',
        status: 'pending',
        agents: [],
        description: ''
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Nouvelle fonction pour gérer la sélection des agents
  const handleAgentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(option => parseInt(option.value, 10));
    setFormData({
      ...formData,
      agents: selectedIds
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dto: CreateEventDTO = {
      title: formData.title,
      date: normalizeDate(frToIso(formData.startDate)),
      time: '09:00',
      type: 'mission',
      description: formData.description,
      location: formData.location,
      participants: (formData.agents || []).map(id => String(id)),
      client: formData.client,
      endDate: normalizeDate(frToIso(formData.endDate)),
      status: formData.status,
      agents: formData.agents
    };

    try {
      if (modalType === 'create') {
        await eventService.createEvent(dto);
      } else if (modalType === 'edit' && currentMission) {
        await eventService.updateEvent(currentMission.id, dto);
      } else if (modalType === 'delete' && currentMission) {
        await eventService.deleteEvent(currentMission.id);
      }
      await loadMissionsFromCalendar();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la mission', err);
    }

    setShowModal(false);
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-success/20 text-success text-xs rounded-full px-3 py-1">Terminée</span>;
      case 'active':
        return <span className="bg-warning/20 text-warning text-xs rounded-full px-3 py-1">En cours</span>;
      case 'pending':
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">En attente</span>;
      case 'cancelled':
        return <span className="bg-danger bg-opacity-20 text-danger text-xs rounded-full px-3 py-1">Annulée</span>;
      default:
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">{status}</span>;
    }
  };

  // Toggle menu for mission actions
  const toggleMenu = (missionId: number) => {
    setOpenMenuId(openMenuId === missionId ? null : missionId);
  };

  // Fonction pour créer ou obtenir une ref pour un menu
  const getMenuRef = useCallback((missionId: number) => {
    return (element: HTMLDivElement | null) => {
      menuRefs.current[missionId] = element;
    };
  }, []);

  // Fonction pour créer ou obtenir une ref pour un bouton
  const getButtonRef = useCallback((missionId: number) => {
    return (element: HTMLButtonElement | null) => {
      buttonRefs.current[missionId] = element;
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

  // Modifier la fonction renderActionMenu
  const renderActionMenu = (mission: Mission) => {
    return (
      <div className="relative">
        <button 
          ref={getButtonRef(mission.id)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full p-1"
          onClick={() => toggleMenu(mission.id)}
          aria-expanded={openMenuId === mission.id}
          aria-haspopup="true"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        <div 
          ref={getMenuRef(mission.id)}
          className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transform transition-all duration-200 ease-in-out ${
            openMenuId === mission.id 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-[-10px] pointer-events-none'
          } z-10`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <button 
              onClick={() => {
                openModal('view', mission);
                setOpenMenuId(null);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faEye} className="mr-2" /> Voir les détails
            </button>
            <button 
              onClick={() => {
                openModal('edit', mission);
                setOpenMenuId(null);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier
            </button>
            <button 
              onClick={() => {
                openModal('delete', mission);
                setOpenMenuId(null);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-red-700"
              role="menuitem"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Missions</h1>
        <button 
          onClick={() => openModal('create')}
          className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nouvelle mission
        </button>
      </div>
      
      {/* Filters section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une mission..."
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
              <option value="in_progress">En cours</option>
              <option value="planned">Planifiée</option>
              <option value="completed">Terminée</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Missions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{mission.title}</h3>
                {renderActionMenu(mission)}
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-2">{mission.description}</p>
                <div className="mt-4">{renderStatusBadge(mission.status)}</div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                  {mission.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                  {mission.startDate} - {mission.endDate}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2 text-gray-400" />
                  {(mission.agents || []).length} agent{(mission.agents || []).length > 1 ? 's' : ''} assigné{(mission.agents || []).length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <span className="text-sm font-medium">{mission.client}</span>
              <button 
                onClick={() => {
                  setCurrentMission(mission);
                  setShowAgentsModal(true);
                }}
                className="text-accent hover:text-blue-700 text-sm font-medium"
              >
                Voir les agents
              </button>
            </div>
          </div>
        ))}

        {filteredMissions.length === 0 && (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">Aucune mission ne correspond à votre recherche</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">
                {modalType === 'create' && 'Nouvelle mission'}
                {modalType === 'edit' && 'Modifier la mission'}
                {modalType === 'delete' && 'Supprimer la mission'}
                {modalType === 'view' && 'Détails de la mission'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-4">
                {modalType === 'delete' ? (
                  <div className="mb-4">
                    <p>Êtes-vous sûr de vouloir supprimer la mission "{currentMission?.title}" ?</p>
                    <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
                  </div>
                ) : modalType === 'view' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Titre</h4>
                      <p>{currentMission?.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Client</h4>
                      <p>{currentMission?.client}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Lieu</h4>
                      <p>{currentMission?.location}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Période</h4>
                      <p>{currentMission?.startDate} - {currentMission?.endDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                      <div>{renderStatusBadge(currentMission?.status || '')}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Nombre d'agents</h4>
                      <p>{(currentMission?.agents || []).length}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p>{currentMission?.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Titre</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client</label>
                      <input
                        type="text"
                        name="client"
                        value={formData.client || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lieu</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de début</label>
                        <input
                          type="text"
                          name="startDate"
                          value={formData.startDate || ''}
                          onChange={handleInputChange}
                          placeholder="JJ/MM/AAAA"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                        <input
                          type="text"
                          name="endDate"
                          value={formData.endDate || ''}
                          onChange={handleInputChange}
                          placeholder="JJ/MM/AAAA"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <select
                        name="status"
                        value={formData.status || 'pending'}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      >
                        <option value="pending">En attente</option>
                        <option value="active">En cours</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigner des agents</label>
                      <select
                        multiple
                        name="agents"
                        value={(formData.agents || []).map(id => String(id))}
                        onChange={handleAgentsChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        size={5}
                      >
                        {AVAILABLE_AGENTS.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} ({agent.badge})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs agents.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                {modalType !== 'view' && (
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                      modalType === 'delete' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-accent hover:bg-blue-700'
                    }`}
                  >
                    {modalType === 'create' && 'Créer'}
                    {modalType === 'edit' && 'Enregistrer'}
                    {modalType === 'delete' && 'Supprimer'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal des agents */}
      {showAgentsModal && currentMission && (
        <MissionAgents
          missionId={currentMission.id}
          missionTitle={currentMission.title}
          assignedAgents={currentMission.agents || []}
          availableAgents={AVAILABLE_AGENTS}
          onSave={async (selectedIds) => {
            if (currentMission) {
              try {
                // Récupérer l'événement existant
                const dto: CreateEventDTO = {
                  title: currentMission.title,
                  date: normalizeDate(frToIso(currentMission.startDate)),
                  time: '09:00',
                  type: 'mission',
                  description: currentMission.description,
                  location: currentMission.location,
                  participants: selectedIds.map(id => String(id)),
                  client: currentMission.client,
                  endDate: normalizeDate(frToIso(currentMission.endDate)),
                  status: currentMission.status,
                  agents: selectedIds
                };
                await eventService.updateEvent(currentMission.id, dto);
                await loadMissionsFromCalendar();
              } catch (error) {
                console.error('Erreur mise à jour agents mission', error);
              }
            }
            setShowAgentsModal(false);
          }}
          onClose={() => setShowAgentsModal(false)}
        />
      )}
    </div>
  );
};

export default Missions; 