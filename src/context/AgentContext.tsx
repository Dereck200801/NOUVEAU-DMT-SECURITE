import React, { createContext, useContext, useEffect, useState } from 'react';
import agentService from '../services/agentService';
import type { Agent } from '../types/agent';

interface AgentContextType {
  /** Liste globale des agents */
  agents: Agent[];
  /** Force une synchronisation avec l'API */
  refresh: () => Promise<void>;
  /** Met à jour un agent (patch) */
  updateAgent: (id: number, data: Partial<Agent>) => Promise<void>;
  /** Affecte un agent à une mission et met à jour son statut */
  assignToMission: (agentId: number, missionId: number) => Promise<void>;
  /** Détache l'agent de sa mission en cours */
  detachFromMission: (agentId: number) => Promise<void>;
  /** Synchronise les statuts en fonction des ids réellement en mission */
  reconcileStatuses: (activeAgentIds: number[]) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  /** Récupère les agents depuis l'API */
  const refresh = async () => {
    try {
      const data = await agentService.getAll();
      setAgents(data);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des agents', err);
    }
  };

  useEffect(() => {
    // Première synchronisation au montage du provider
    refresh();
  }, []);

  /** Met à jour partiellement un agent */
  const updateAgent = async (id: number, data: Partial<Agent>) => {
    try {
      const updated = await agentService.update(id, data);
      setAgents((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error(`Impossible de mettre à jour l'agent ${id}`, err);
      // Fallback local si l'API échoue
      setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    }
  };

  /** Affecte un agent à une mission */
  const assignToMission = async (agentId: number, missionId: number) => {
    // Vérifier s'il est déjà en mission
    const current = agents.find((a) => a.id === agentId);
    if (current?.status === 'on_mission') {
      throw new Error('Cet agent est déjà en mission. Détachez-le avant de le réaffecter.');
    }

    try {
      const updated = await agentService.assignToMission(agentId, missionId);
      setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
    } catch (err) {
      console.error(`Erreur lors de l'affectation de l'agent ${agentId} à la mission ${missionId}`, err);
      // Fallback local en cas d'échec API
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: 'on_mission',
                currentMission: `Mission #${missionId}`,
              }
            : a
        )
      );
    }
  };

  /** Détache l'agent de sa mission en cours */
  const detachFromMission = async (agentId: number) => {
    try {
      const updated = await agentService.update(agentId, {
        status: 'active',
        currentMission: null,
      });
      setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
    } catch (err) {
      console.error(`Erreur lors du détachement de l'agent ${agentId}`, err);
      // Fallback local
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: 'active',
                currentMission: null,
              }
            : a
        )
      );
    }
  };

  /** Met à jour en lot : synchronise le statut "on_mission" en fonction de la liste des agents réellement en mission */
  const reconcileStatuses = (activeIds: number[]) => {
    setAgents((prev) =>
      prev.map((agent) => {
        // Si l'agent figure parmi ceux actuellement en mission → on_mission
        if (activeIds.includes(agent.id)) {
          if (agent.status !== 'on_mission') {
            return {
              ...agent,
              status: 'on_mission',
              currentMission: agent.currentMission ?? 'Mission en cours',
            };
          }
          return agent;
        }
        // Sinon, s'il était marqué "on_mission", on le remet disponible
        if (agent.status === 'on_mission') {
          return { ...agent, status: 'active', currentMission: null };
        }
        return agent;
      })
    );
  };

  const value: AgentContextType = {
    agents,
    refresh,
    updateAgent,
    assignToMission,
    detachFromMission,
    reconcileStatuses,
  };

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
};

export const useAgents = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgents must be used within AgentProvider');
  return ctx;
}; 