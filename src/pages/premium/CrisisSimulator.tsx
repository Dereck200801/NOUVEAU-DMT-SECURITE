import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, 
  faPlay, 
  faUsers, 
  faChartLine,
  faClipboardList,
  faHistory,
  faGear,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Scenario } from '../../types/crisis-simulator';
import { crisisSimulatorService } from '../../services/crisisSimulatorService';

const CrisisSimulator: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScenarios = async () => {
      setIsLoading(true);
      const data = await crisisSimulatorService.getScenarios();
      setScenarios(data);
      setIsLoading(false);
    };
    loadScenarios();
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-oxford-blue">Simulateur de Crise</h1>
          <p className="text-sm text-berkeley-blue/70 mt-1">
            Entraînement et préparation aux situations d'urgence
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors">
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          Lancer une simulation
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Simulations réalisées</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">48</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">ce mois</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Agents formés</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">156</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">participants</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Score moyen</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">82%</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">de réussite</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Temps moyen</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">45</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">minutes</div>
          </div>
        </div>
      </div>

      {/* Scénarios et rapports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Scénarios disponibles</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Choisissez un scénario pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && (
                <p className="text-sm text-berkeley-blue/70">Chargement des scénarios...</p>
              )}
              {!isLoading && scenarios.map((scenario, index) => (
                <button key={index} className="w-full flex items-center p-4 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors">
                  <div className="w-12 h-12 bg-yale-blue/10 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faFire} className="text-yale-blue" />
                  </div>
                  <div className="ml-4 flex-1 text-left">
                    <h3 className="text-sm font-medium text-oxford-blue">{scenario.name}</h3>
                    <p className="text-xs text-berkeley-blue/70">{scenario.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-xs font-medium text-yale-blue block">{scenario.difficulty}</span>
                    <span className="text-xs text-berkeley-blue/70 block">{Math.round(scenario.duration / 60)} min</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Derniers rapports</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Résultats des simulations récentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Équipe Alpha',
                  scenario: 'Intrusion armée',
                  score: '95%',
                  date: 'Il y a 2 heures'
                },
                {
                  title: 'Équipe Bravo',
                  scenario: 'Évacuation d\'urgence',
                  score: '87%',
                  date: 'Il y a 5 heures'
                },
                {
                  title: 'Équipe Charlie',
                  scenario: 'Alerte à la bombe',
                  score: '92%',
                  date: 'Hier'
                }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-powder-blue/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yale-blue/10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faUsers} className="text-yale-blue" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-oxford-blue">{report.title}</h3>
                      <p className="text-xs text-berkeley-blue/70">{report.scenario}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-yale-blue block">{report.score}</span>
                    <span className="text-xs text-berkeley-blue/70">{report.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: faClipboardList,
            title: 'Planifier',
            description: 'Créer un planning de formation'
          },
          {
            icon: faChartLine,
            title: 'Analyser',
            description: 'Voir les statistiques détaillées'
          },
          {
            icon: faGear,
            title: 'Configurer',
            description: 'Paramètres des scénarios'
          },
          {
            icon: faBookOpen,
            title: 'Ressources',
            description: 'Documentation et guides'
          }
        ].map((action, index) => (
          <button key={index} className="p-6 bg-white rounded-lg border border-powder-blue/30 hover:bg-powder-blue/5 transition-colors">
            <div className="w-12 h-12 bg-yale-blue/10 rounded-lg flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={action.icon} className="text-yale-blue text-xl" />
            </div>
            <h3 className="text-sm font-medium text-oxford-blue">{action.title}</h3>
            <p className="text-xs text-berkeley-blue/70 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CrisisSimulator; 