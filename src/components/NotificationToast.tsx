import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faExclamationTriangle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface NotificationToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'danger';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  message,
  type = 'info',
  onClose,
  autoClose = true,
  duration = 3000
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, autoClose, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-white" />;
      case 'error':
      case 'danger':
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-white" />;
      case 'warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-white" />;
      default:
        return <FontAwesomeIcon icon={faInfoCircle} className="text-white" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
      case 'danger':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className={`${getBackgroundColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
        <div className="mr-3">
          {getIcon()}
        </div>
        <div className="flex-grow mr-2">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Fermer la notification"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast; 