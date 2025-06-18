import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faBuilding, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import locationService from '../services/locationService';
import { MissionLocation } from '../types/location';
import Loader from './ui/loader';

// Dimensions de l'iframe carte
const mapHeight = 400;
const mapZoom = 13; // Niveau de zoom par défaut

const MissionMap: React.FC = () => {
  const [missions, setMissions] = useState<MissionLocation[]>([]);
  const [selectedMission, setSelectedMission] = useState<MissionLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await locationService.getAll();
        
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setMissions(data);
          if (data.length > 0) {
            setSelectedMission(data[0]);
          }
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setMissions([]);
          setError('Format de données incorrect - Veuillez contacter le support technique');
        }
      } catch (err: any) {
        console.error('Erreur lors de la récupération des emplacements de mission:', err);
        
        // Fournir un message d'erreur plus informatif basé sur le type d'erreur
        if (err.response) {
          // La requête a été faite et le serveur a répondu avec un code d'état en dehors de la plage 2xx
          setError(`Erreur serveur: ${err.response.status} - ${err.response.data.message || 'Veuillez réessayer plus tard'}`);
        } else if (err.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          // Une erreur s'est produite lors de la configuration de la requête
          setError(`Erreur de chargement: ${err.message}`);
        }
        
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Construire l'URL de l'iframe Waze pour la mission sélectionnée
  const getWazeEmbedUrl = (mission: MissionLocation) => {
    const { latitude, longitude } = mission.coordinates;
    return `https://embed.waze.com/iframe?zoom=${mapZoom}&lat=${latitude}&lon=${longitude}&pin=1`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Cartographie des missions</h2>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <Loader label="Chargement de la carte..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-danger">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-light text-primary rounded-lg px-3 py-1 text-sm hover:bg-gray-200 transition"
          >
            Réessayer
          </button>
        </div>
      ) : missions.length === 0 || !selectedMission ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Aucune mission à afficher sur la carte</p>
        </div>
      ) : (
        <div className="p-4">
          {/* Sélecteur de mission */}
          <div className="mb-4 flex items-center">
            <label htmlFor="sel-mission" className="mr-2 text-sm text-gray-600">Mission :</label>
            <select
              id="sel-mission"
              className="p-2 border border-gray-200 rounded-lg text-sm"
              value={selectedMission.id}
              onChange={(e) => {
                const missionId = parseInt(e.target.value, 10);
                const m = missions.find(mis => mis.id === missionId);
                if (m) setSelectedMission(m);
              }}
            >
              {missions.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full" style={{height: mapHeight}}>
            <iframe
              title="Waze Map"
              src={getWazeEmbedUrl(selectedMission)}
              width="100%"
              height={mapHeight}
              allowFullScreen
            ></iframe>
          </div>

          {/* infos mission */}
          <div className="mt-4 text-sm text-gray-700">
            <h3 className="font-semibold text-base">{selectedMission.name}</h3>
            <p className="text-gray-600">{selectedMission.address}</p>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserShield} className="mr-1" />
                {selectedMission.agentsCount} agents
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                {selectedMission.client}
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                {selectedMission.date}
              </div>
            </div>
            <div className="mt-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${
                selectedMission.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
                selectedMission.status === 'planned' ? 'bg-blue-100 text-blue-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {selectedMission.status === 'active' ? 'En cours' : 
                 selectedMission.status === 'planned' ? 'Planifiée' : 'Terminée'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionMap; 