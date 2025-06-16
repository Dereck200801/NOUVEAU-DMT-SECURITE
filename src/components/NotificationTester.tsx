import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationTester: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'danger'>('info');
  
  const { addNotification } = useNotifications();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title && message) {
      addNotification({
        title,
        message,
        type,
        link: '/dashboard'
      });
      
      // Réinitialiser le formulaire
      setTitle('');
      setMessage('');
      setType('info');
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Tester les notifications</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'info' | 'success' | 'warning' | 'danger')}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="info">Information</option>
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
            <option value="danger">Alerte</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Créer une notification
        </button>
      </form>
    </div>
  );
};

export default NotificationTester; 