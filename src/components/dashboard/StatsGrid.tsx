import React from 'react';
import { faClipboardCheck, faExclamationTriangle, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import StatCard from './StatCard';

// Keep in sync with DashboardStats interface in Dashboard page
export interface DashboardStats {
  activeAgents: number;
  activeMissions: number;
  completedMissions: number;
  reportedIncidents: number;
  resolvedIncidents: number;
  agentsChange: number;
  missionsActiveChange: number;
  missionsCompletedChange: number;
}

interface Props {
  stats: DashboardStats;
}

const StatsGrid: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Agents actifs"
        value={stats.activeAgents}
        icon={faUserShield}
        delta={{ value: `${stats.agentsChange}%`, positive: stats.agentsChange > 0 }}
      />

      <StatCard
        title="Missions en cours"
        value={stats.activeMissions}
        icon={faTasks}
        delta={{
          value: `${Math.abs(stats.missionsActiveChange)}%`,
          positive: stats.missionsActiveChange > 0,
        }}
      />

      <StatCard
        title="Missions terminées"
        value={stats.completedMissions}
        icon={faClipboardCheck}
        delta={{
          value: `${stats.missionsCompletedChange}%`,
          positive: stats.missionsCompletedChange > 0,
        }}
      />

      <StatCard
        title="Incidents reportés"
        value={stats.reportedIncidents}
        icon={faExclamationTriangle}
        delta={{ value: `${stats.resolvedIncidents} résolus`, positive: true }}
      />
    </div>
  );
};

export default StatsGrid; 