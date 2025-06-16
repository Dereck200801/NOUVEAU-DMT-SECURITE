import { toast } from 'react-toastify';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export const useNotifications = () => {
  const addNotification = ({ type, title, message }: NotificationProps) => {
    toast[type](
      <div>
        <h4 className="font-bold">{title}</h4>
        <p>{message}</p>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  return { addNotification };
}; 