import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: IconDefinition;
  iconBgColor: string;
  iconColor: string;
  borderColor: string;
  change?: {
    value: string | number;
    isPositive: boolean;
    text: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconBgColor, 
  iconColor,
  borderColor,
  change
}) => {
  return (
    <div className={`dashboard-card bg-white rounded-2xl shadow-lg p-6 border-t-4 border-${borderColor}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <FontAwesomeIcon icon={icon} className={`${iconColor} text-2xl`} />
        </div>
      </div>
      {change && (
        <div className="mt-4 text-sm text-gray-500">
          <span className={`${change.isPositive ? 'text-success' : 'text-danger'} font-medium`}>
            <FontAwesomeIcon icon={change.isPositive ? faArrowUp : faArrowDown} /> {change.value}
          </span> {change.text}
        </div>
      )}
    </div>
  );
};

export default DashboardCard; 