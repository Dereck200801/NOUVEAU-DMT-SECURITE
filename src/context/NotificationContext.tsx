import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types pour les notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Mettre à jour le nombre de notifications non lues
  useEffect(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  // Ajouter une nouvelle notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Supprimer toutes les notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Données fictives pour la démo
  useEffect(() => {
    // Exemples de notifications pour la démo
    const demoNotifications: Omit<Notification, 'id' | 'timestamp' | 'isRead'>[] = [
      {
        title: 'Nouvelle mission',
        message: 'Une nouvelle mission a été créée pour le client BGFI Bank',
        type: 'info',
        link: '/missions'
      },
      {
        title: 'Alerte agent',
        message: 'L\'agent Didier Ondo n\'a pas pointé depuis 2 heures',
        type: 'danger',
        link: '/agents'
      },
      {
        title: 'Rapport complété',
        message: 'Le rapport d\'intervention #4582 a été complété',
        type: 'success',
        link: '/reports'
      }
    ];

    // Ajouter les notifications de démo avec un délai pour simuler des notifications réelles
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, index * 1000); // Ajouter une notification chaque seconde
    });
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications doit être utilisé avec NotificationProvider');
  }
  return context;
}; 