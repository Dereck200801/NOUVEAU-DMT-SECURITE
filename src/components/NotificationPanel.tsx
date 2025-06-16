import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes, faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { useNotifications, Notification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fermer le panel quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Formater la date de la notification
  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Moins d'une minute
    if (diff < 60000) {
      return 'À l\'instant';
    }
    
    // Moins d'une heure
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    }
    
    // Moins d'un jour
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours} ${hours > 1 ? 'heures' : 'heure'}`;
    }
    
    // Plus d'un jour
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days} ${days > 1 ? 'jours' : 'jour'}`;
  };

  // Obtenir la couleur de bordure en fonction du type de notification
  const getBorderColor = (type: Notification['type']): string => {
    switch (type) {
      case 'info':
        return 'border-blue-500';
      case 'success':
        return 'border-green-500';
      case 'warning':
        return 'border-yellow-500';
      case 'danger':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        className="text-gray-500 relative" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary-dark transition-colors"
                  title="Marquer tout comme lu"
                >
                  <FontAwesomeIcon icon={faCheckDouble} />
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  title="Supprimer tout"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-l-4 ${getBorderColor(notification.type)} hover:bg-gray-50 cursor-pointer ${notification.isRead ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <h4 className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="mt-2 text-xs text-primary hover:text-primary-dark transition-colors"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-1" /> Marquer comme lu
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 