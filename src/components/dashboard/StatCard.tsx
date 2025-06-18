import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconDefinition;
  delta?: {
    value: string | number;
    positive: boolean;
  };
}

/**
 * A polished statistic card for the dashboard.
 * Uses generous paddings, large rounded corners and the primary colour (#134074).
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, delta }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5 animate-fade-in">
      {/* Leading icon */}
      <span className="p-3 rounded-xl bg-primary/10 text-primary text-lg">
        <FontAwesomeIcon icon={icon} />
      </span>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-semibold text-oxford-blue">{value}</p>
      </div>

      {/* Delta */}
      {delta && (
        <span
          className={`text-sm font-medium flex items-center gap-1 ${
            delta.positive ? 'text-green-600' : 'text-red-500'
          }`}
        >
          <FontAwesomeIcon icon={delta.positive ? faArrowUp : faArrowDown} />
          {delta.value}
        </span>
      )}
    </div>
  );
};

export default StatCard; 