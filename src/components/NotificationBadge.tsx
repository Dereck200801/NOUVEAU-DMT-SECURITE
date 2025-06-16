import React from 'react';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
}

/**
 * Composant pour afficher un badge de notification
 * Utilisé pour indiquer le nombre de notifications non lues
 */
const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  maxCount = 99,
  className = '' 
}) => {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <span 
      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full ${className}`}
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge; 