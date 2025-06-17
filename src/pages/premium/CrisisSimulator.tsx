import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, 
  faPlay, 
  faUsers, 
  faChartLine,
  faClipboardList,
  faHistory,
  faGear,
  faBookOpen,
  faTimes,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Scenario } from '../../types/crisis-simulator';
import { crisisSimulatorService } from '../../services/crisisSimulatorService';

const CrisisSimulator: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showStartModal, setShowStartModal] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [participants, setParticipants] = useState<{ id: string; name: string; score: number }[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Fallback exemples si l'API ne renvoie rien
  const fallbackScenarios: Scenario[] = [
    {
      id: '1',
      name: 'Intrusion armée',
      description: "Simulation d'une intrusion armée dans un bâtiment sécurisé.",
      difficulty: 'Élevée',
      duration: 45 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any,
    {
      id: '2',
      name: 'Évacuation d\'urgence',
      description: "Evacuation rapide suite à un départ de feu.",
      difficulty: 'Moyenne',
      duration: 30 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any,
    {
      id: '3',
      name: 'Alerte à la bombe',
      description: "Gestion d'une menace d'explosif.",
      difficulty: 'Élevée',
      duration: 60 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any,
  ];

  useEffect(() => {
    const loadScenarios = async () => {
      setIsLoading(true);
      const data = await crisisSimulatorService.getScenarios();
      setScenarios(data.length > 0 ? data : fallbackScenarios);
      setIsLoading(false);
    };
    loadScenarios();
  }, []);

  const startSimulation = (scenario?: Scenario) => {
    const chosen = scenario || scenarios[0];
    if (chosen) {
      setSelectedScenario(chosen);
      setShowStartModal(true);
    } else {
      setShowStartModal(true);
    }
  };

  const confirmSimulation = () => {
    if (!selectedScenario) return;
    // Ici on pourrait appeler crisisSimulatorService.startSimulation
    console.log('Lancement simulation', selectedScenario);
    setShowStartModal(false);
    setIsRunning(true);
    setRemainingTime(selectedScenario.duration);
    // Pour la démo, on initialise des participants fictifs. Plus tard, récupérer via API.
    setParticipants([
      { id: 'p1', name: 'Agent Alpha', score: 0 },
      { id: 'p2', name: 'Agent Bravo', score: 0 },
      { id: 'p3', name: 'Agent Charlie', score: 0 },
    ]);
  };

  // Gestion du compte à rebours
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  // Lorsque le temps atteint 0, arrêter automatiquement
  useEffect(() => {
    if (isRunning && remainingTime <= 0) {
      handleStopSimulation();
    }
  }, [remainingTime, isRunning]);

  const handleStopSimulation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setShowScoreModal(true);
  };

  const handleAddScenario = async (data: { name: string; description: string; difficulty: string; durationMinutes: number }) => {
    const newScenario = await crisisSimulatorService.createScenario({
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      duration: data.durationMinutes * 60,
    } as any);

    // En local : si l'API renvoie null (dev), on crée un objet client side
    const scenarioObj: Scenario = newScenario ?? {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      duration: data.durationMinutes * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;

    setScenarios((prev) => [...prev, scenarioObj]);
    setShowAddModal(false);
  };

  const StartModal: React.FC = () => {
    if (!showStartModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-oxford-blue">Confirmer la simulation</h2>
            <button
              onClick={() => setShowStartModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="p-6 space-y-4 text-sm">
            {selectedScenario ? (
              <>
                <p>
                  Vous êtes sur le point de lancer la simulation <span className="font-medium">{selectedScenario.name}</span>.
                </p>
                <div className="bg-powder-blue/10 p-4 rounded-lg">
                  <p className="font-semibold text-oxford-blue mb-1">Description</p>
                  <p className="text-berkeley-blue/80 text-xs">
                    {selectedScenario.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-berkeley-blue/70">
                    <div>
                      <span className="block font-semibold text-oxford-blue">Difficulté</span>
                      {selectedScenario.difficulty}
                    </div>
                    <div>
                      <span className="block font-semibold text-oxford-blue">Durée</span>
                      {Math.round(selectedScenario.duration / 60)} min
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>Aucun scénario sélectionné.</p>
            )}
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setShowStartModal(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              Annuler
            </button>
            <button
              onClick={confirmSimulation}
              className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-4 py-2 text-sm"
            >
              Commencer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ScoreModal: React.FC = () => {
    if (!showScoreModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-oxford-blue">Attribuer un score</h2>
            <button
              onClick={() => setShowScoreModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <p>Veuillez saisir le score global (sur 20) pour la simulation <span className="font-medium">{selectedScenario?.name}</span>.</p>
            <input
              type="number"
              min={0}
              max={20}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />

            {/* Scores individuels */}
            <div className="mt-4">
              <p className="font-semibold text-oxford-blue mb-2 text-sm">Scores par agent (sur 20)</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {participants.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="flex-1 text-berkeley-blue/90 text-xs">{p.name}</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={p.score}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setParticipants((prev) =>
                          prev.map((pa, i) => (i === idx ? { ...pa, score: val } : pa))
                        );
                      }}
                      className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-xs text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={() => setShowScoreModal(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                console.log('Score global', score, 'scores individuels', participants);
                setShowScoreModal(false);
              }}
              className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-4 py-2 text-sm"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddScenarioModal: React.FC = () => {
    const [form, setForm] = useState({
      name: '',
      description: '',
      difficulty: 'Facile',
      durationMinutes: 30,
    });

    if (!showAddModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
          <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-oxford-blue">Nouveau scénario</h2>
            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddScenario(form);
            }}
            className="p-6 space-y-4 text-sm"
          >
            <div>
              <label className="block font-medium mb-1">Nom</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Difficulté</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Facile">Facile</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Élevée">Élevée</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Durée (minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-4 py-2"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
        <button
          className="inline-flex items-center px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors"
          onClick={() => startSimulation()}
        >
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
          <CardHeader className="flex items-start justify-between">
            <CardTitle className="text-oxford-blue">Scénarios disponibles</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Choisissez un scénario pour commencer
            </CardDescription>
            <button
              title="Ajouter un scénario"
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-yale-blue/10 rounded-lg text-yale-blue hover:bg-yale-blue/20 transition-colors ml-auto"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && (
                <p className="text-sm text-berkeley-blue/70">Chargement des scénarios...</p>
              )}
              {!isLoading && scenarios.map((scenario, index) => (
                <button
                  key={index}
                  className="w-full flex items-center p-4 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors"
                  onClick={() => startSimulation(scenario)}
                >
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

      {/* Modal */}
      <StartModal />
      {/* Timer bar */}
      {isRunning && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-powder-blue/30 rounded-full px-6 py-3 shadow-lg flex items-center gap-6 z-50">
          <span className="text-lg font-semibold text-oxford-blue">
            {Math.floor(remainingTime / 60)
              .toString()
              .padStart(2, '0')}
            :
            {(remainingTime % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={handleStopSimulation}
            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider"
          >
            Arrêter
          </button>
        </div>
      )}
      {/* Score Modal */}
      <ScoreModal />
      {/* Add Scenario Modal */}
      <AddScenarioModal />
    </div>
  );
};

export default CrisisSimulator; 