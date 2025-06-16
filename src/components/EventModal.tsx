import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faUsers 
} from '@fortawesome/free-solid-svg-icons';
import type { Event, CreateEventDTO } from '../services/eventService';
import { normalizeDate } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEventDTO) => void;
  event?: Event;
  selectedDate?: string;
}

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  event, 
  selectedDate 
}) => {
  const [formData, setFormData] = useState<CreateEventDTO>({
    title: '',
    date: selectedDate || normalizeDate(new Date()),
    time: '09:00',
    type: 'mission',
    description: '',
    location: '',
    participants: []
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: normalizeDate(event.date),
        time: event.time,
        type: event.type,
        description: event.description,
        location: event.location || '',
        participants: event.participants || []
      });
    } else if (selectedDate) {
      setFormData(prev => ({ 
        ...prev, 
        date: normalizeDate(selectedDate),
        title: '',
        time: '09:00',
        type: 'mission',
        description: '',
        location: '',
        participants: []
      }));
    } else {
      // Réinitialiser le formulaire avec la date du jour
      setFormData({
        title: '',
        date: normalizeDate(new Date()),
        time: '09:00',
        type: 'mission',
        description: '',
        location: '',
        participants: []
      });
    }
  }, [event, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // S'assurer que la date est normalisée avant de soumettre
    const normalizedData = {
      ...formData,
      date: normalizeDate(formData.date)
    };
    console.log('Submitting form data:', normalizedData);
    onSave(normalizedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Titre de l'événement"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              >
                <option value="mission">Mission</option>
                <option value="formation">Formation</option>
                <option value="reunion">Réunion</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Heure
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Lieu
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Lieu de l'événement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Participants
              </label>
              <input
                type="text"
                name="participants"
                value={formData.participants?.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  participants: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                }))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Noms séparés par des virgules"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Description de l'événement"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
            >
              {event ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 