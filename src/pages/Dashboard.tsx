import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faTasks, 
  faClipboardCheck, 
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import DashboardCard from '../components/DashboardCard';
import NotificationTester from '../components/NotificationTester';
import TrainingCertifications from '../components/TrainingCertifications';
import MissionMap from '../components/MissionMap';
import EquipmentTracker from '../components/EquipmentTracker';
import PerformanceMetrics from '../components/PerformanceMetrics';
import IncidentReports from '../components/IncidentReports';
import incidentService from '../services/incidentService';
import locationService from '../services/locationService';
import agentService from '../services/agentService';
import { Agent } from '../types/agent';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  activeAgents: number;
  activeMissions: number;
  completedMissions: number;
  reportedIncidents: number;
  resolvedIncidents: number;
  agentsChange: number;
  missionsActiveChange: number;
  missionsCompletedChange: number;
}

interface MissionsByClient {
  labels: string[];
  data: number[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeAgents: 0,
    activeMissions: 0,
    completedMissions: 0,
    reportedIncidents: 0,
    resolvedIncidents: 0,
    agentsChange: 0,
    missionsActiveChange: 0,
    missionsCompletedChange: 0
  });
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [missionsByClient, setMissionsByClient] = useState<MissionsByClient>({
    labels: [],
    data: []
  });
  const [recentMissions, setRecentMissions] = useState<any[]>([]);
  const [agentsOnDuty, setAgentsOnDuty] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningAgentId, setAssigningAgentId] = useState<number | null>(null);

  // Chart configuration
  const chartColors = {
    primary: '#1d4ed8',
    success: '#16a34a',
    secondary: '#64748b'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les statistiques des incidents
        const incidentStats = await incidentService.getStats();
        
        // Récupérer les statistiques des missions
        const locationStats = await locationService.getStats();
        
        // Récupérer les statistiques des agents
        const agentStats = await agentService.getStats();
        
        // Récupérer les agents en mission
        const agentsOnDutyData = await agentService.getAgentsOnDuty();
        
        // Récupérer les missions récentes
        const allLocations = await locationService.getAll();
        const sortedLocations = [...allLocations].sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        
        // Mettre à jour les statistiques du tableau de bord
        setStats({
          activeAgents: agentStats.active,
          activeMissions: locationStats.active,
          completedMissions: locationStats.completed,
          reportedIncidents: incidentStats.total,
          resolvedIncidents: incidentStats.resolved,
          agentsChange: agentStats.change,
          missionsActiveChange: -2, // À remplacer par des données réelles
          missionsCompletedChange: 12 // À remplacer par des données réelles
        });

        // Données pour le graphique d'occupation
        // Calculer l'occupation des agents par jour de la semaine
        const weekdayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const totalAgents = agentStats.total;
        
        // Simuler des données d'occupation (à remplacer par des données réelles)
        const occupiedData = [75, 70, 80, 65, 85, 60, 40];
        const availableData = weekdayLabels.map((_, i) => totalAgents - occupiedData[i]);
        
        setOccupancyData({
          labels: weekdayLabels,
          datasets: [
            {
              label: 'Occupé',
              data: occupiedData,
              backgroundColor: chartColors.primary,
              borderRadius: 8,
            },
            {
              label: 'Disponible',
              data: availableData,
              backgroundColor: chartColors.secondary,
              borderRadius: 8,
            }
          ]
        });

        // Données pour le graphique des missions par client
        const clientLabels = Object.keys(locationStats.byClient || {}).map(id => {
          switch (parseInt(id)) {
            case 1: return 'Ministère';
            case 2: return 'Sociétés';
            case 3: return 'Événements';
            case 4: return 'Résidences';
            default: return 'Autres';
          }
        });

        setMissionsByClient({
          labels: clientLabels,
          data: Object.values(locationStats.byClient || {})
        });
        
        // Mettre à jour les missions récentes
        setRecentMissions(sortedLocations.slice(0, 5));
        
        // Mettre à jour les agents en mission
        setAgentsOnDuty(agentsOnDutyData);

        setError(null);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
        
        // Fournir un message d'erreur plus informatif basé sur le type d'erreur
        if (err.response) {
          // La requête a été faite et le serveur a répondu avec un code d'état en dehors de la plage 2xx
          setError(`Impossible de charger certaines données du tableau de bord: ${err.response.status} - ${err.response.data?.message || 'Erreur serveur'}`);
        } else if (err.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          // Une erreur s'est produite lors de la configuration de la requête
          setError(`Impossible de charger certaines données du tableau de bord: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Options des graphiques
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      }
    }
  };

  // Fonction pour affecter un agent à une mission (interaction simple via prompt)
  const handleAssignAgent = async (agent: Agent) => {
    // Demander l'ID de mission à l'utilisateur. Dans une vraie application on ouvrirait un
    // sélecteur ou une modal, mais un prompt suffit pour rendre la fonctionnalité utilisable.
    const missionIdStr = window.prompt(`Entrez l\'ID de la mission à assigner à ${agent.name}`);
    const missionId = missionIdStr ? parseInt(missionIdStr, 10) : null;

    if (!missionId) {
      return; // L\'utilisateur a annulé ou fourni une entrée invalide
    }

    try {
      setAssigningAgentId(agent.id);
      // Appel API : agentService.assignToMission mettra à jour côté serveur
      await agentService.assignToMission(agent.id, missionId);

      // Mettre à jour l\'état local pour refléter le changement sans attendre un rafraîchissement global
      setAgentsOnDuty((prev) => prev.map((a) =>
        a.id === agent.id
          ? {
              ...a,
              status: 'on_mission',
              currentMission: `Mission #${missionId}`,
              // Valeurs fictives – dans une vraie app on récupérerait les vraies données du backend
              missionStartTime: new Date().getHours() + 'h',
              missionEndTime: '--',
              hoursOnDuty: 0,
            }
          : a
      ));
    } catch (err) {
      console.error('Erreur lors de l\'assignation de l\'agent:', err);
      window.alert('Impossible d\'assigner l\'agent à la mission. Veuillez réessayer plus tard.');
    } finally {
      setAssigningAgentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-accent text-4xl mb-4" />
          <p className="text-lg text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {error && (
        <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-danger text-white rounded-lg px-3 py-1 text-sm hover:bg-danger-dark transition"
          >
            Réessayer
          </button>
        </div>
      )}
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Agents actifs"
          value={stats.activeAgents}
          icon={faUserShield}
          iconBgColor="bg-blue-100"
          iconColor="text-accent"
          borderColor="accent"
          change={{
            value: `${stats.agentsChange}%`,
            isPositive: stats.agentsChange > 0,
            text: "depuis le mois dernier"
          }}
        />
        
        <DashboardCard 
          title="Missions en cours"
          value={stats.activeMissions}
          icon={faTasks}
          iconBgColor="bg-yellow-100"
          iconColor="text-warning"
          borderColor="warning"
          change={{
            value: `${Math.abs(stats.missionsActiveChange)}%`,
            isPositive: stats.missionsActiveChange > 0,
            text: "depuis le mois dernier"
          }}
        />
        
        <DashboardCard 
          title="Missions terminées"
          value={stats.completedMissions}
          icon={faClipboardCheck}
          iconBgColor="bg-green-100"
          iconColor="text-success"
          borderColor="success"
          change={{
            value: `${stats.missionsCompletedChange}%`,
            isPositive: stats.missionsCompletedChange > 0,
            text: "depuis le mois dernier"
          }}
        />
        
        <DashboardCard 
          title="Incidents reportés"
          value={stats.reportedIncidents}
          icon={faExclamationTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-danger"
          borderColor="danger"
          change={{
            value: `${stats.resolvedIncidents}`,
            isPositive: true,
            text: "résolus ce mois"
          }}
        />
      </div>
      
      {/* Performance Metrics */}
      <div className="mb-8">
        <PerformanceMetrics />
      </div>
      
      {/* Main area charts and map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Occupancy chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Taux d'occupation des agents</h2>
          <div className="chart-container">
            {occupancyData ? (
              <Bar data={occupancyData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Données non disponibles</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Mission Map */}
        <MissionMap />
      </div>
      
      {/* Equipment Tracker */}
      <div className="mb-8">
        <EquipmentTracker />
      </div>
      
      {/* Incident Reports */}
      <div className="mb-8">
        <IncidentReports />
      </div>
      
      {/* Training Certifications and Missions by client */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrainingCertifications />
        
        {/* Missions by client */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Missions par client</h2>
          <div className="chart-container">
            {missionsByClient.labels.length > 0 ? (
              <Doughnut 
                data={{
                  labels: missionsByClient.labels,
                  datasets: [{
                    data: missionsByClient.data,
                    backgroundColor: [
                      chartColors.primary,
                      '#0ea5e9',
                      chartColors.success,
                      '#8b5cf6',
                      chartColors.secondary
                    ],
                    borderWidth: 0,
                  }]
                }} 
                options={doughnutOptions} 
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Données non disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Latest missions & agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Latest missions table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">Missions récentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">MISSION</th>
                  <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">CLIENT</th>
                  <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">STATUT</th>
                  <th className="text-left py-3 px-4 font-medium text-xs text-gray-500">DÉBUT</th>
                </tr>
              </thead>
              <tbody>
                {recentMissions.length > 0 ? (
                  recentMissions.map((mission) => (
                    <tr key={mission.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm">{mission.name}</td>
                      <td className="py-3 px-4 text-sm">{mission.client}</td>
                      <td className="py-3 px-4">
                        <span className={`
                          ${mission.status === 'completed' ? 'bg-success/20 text-success' : 
                            mission.status === 'active' ? 'bg-warning/20 text-warning' : 
                            mission.status === 'planned' ? 'bg-accent/20 text-accent' : 
                            'bg-gray-200 text-gray-500'} 
                          text-xs rounded-full px-3 py-1`}>
                          {mission.status === 'completed' ? 'Terminée' : 
                           mission.status === 'active' ? 'En cours' : 
                           mission.status === 'planned' ? 'Planifiée' : 'Attente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(mission.startDate).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      Aucune mission récente à afficher
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Agents on duty */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">Agents actuellement en mission</h2>
          </div>
          <div>
            {agentsOnDuty.length > 0 ? (
              agentsOnDuty.map((agent) => (
                <div key={agent.id} className="flex items-center border-b border-gray-100 p-4">
                  <div className="relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=${
                        agent.id % 4 === 0 ? 'f97316' : 
                        agent.id % 3 === 0 ? '8b5cf6' : 
                        agent.id % 2 === 0 ? '0ea5e9' : '10b981'
                      }&color=fff`} 
                      alt="Agent" 
                      className="w-12 h-12 rounded-full" 
                    />
                    <span className={`absolute bottom-0 right-0 ${
                      agent.status === 'on_mission' ? 'bg-success' : 'bg-danger'
                    } border-2 border-white rounded-full w-3 h-3`}></span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-500">
                      {agent.currentMission || 'Attente d\'affectation'}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    {agent.status === 'on_mission' ? (
                      <>
                        <p className="text-sm">Depuis {agent.hoursOnDuty}h</p>
                        <p className="text-xs text-gray-500">{agent.missionStartTime}-{agent.missionEndTime}</p>
                      </>
                    ) : (
                      <button className="bg-light text-primary rounded-lg px-3 py-1 text-sm hover:bg-gray-200 transition" onClick={() => handleAssignAgent(agent)} disabled={assigningAgentId === agent.id}>
                        {assigningAgentId === agent.id ? '...' : 'Affecter'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                Aucun agent en mission actuellement
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Tester */}
      <div className="grid grid-cols-1 mb-8">
        <NotificationTester />
      </div>
    </div>
  );
};

export default Dashboard; 