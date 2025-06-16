import { useState } from 'react';

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: '', 
    type: 'info' 
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
}; 