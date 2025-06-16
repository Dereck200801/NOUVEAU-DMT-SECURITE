import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { eventService, type Event, type CreateEventDTO } from '../services/eventService';
import EventModal from '../components/EventModal';
import { useNotifications } from '../context/NotificationContext';
import { normalizeDate } from '../utils/dateUtils';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// Étendre l'interface Event pour inclure endTime si nécessaire
interface ExtendedEvent extends Event {
  endTime?: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const calendarRef = useRef<any>(null);
  const { addNotification } = useNotifications();

  // Charger les événements pour un mois donné (par défaut le mois actuel)
  const loadEvents = async (year?: number, month?: number) => {
    try {
      const targetDate = new Date();
      const targetYear = year ?? targetDate.getFullYear();
      const targetMonth = month ?? targetDate.getMonth() + 1; // JS months commencent à 0

      console.log('Loading events for:', targetYear, targetMonth);
      const response = await eventService.getEventsByMonth(targetYear, targetMonth);

      if (response.success && response.data) {
        // Normaliser les dates des événements
        const normalizedEvents = response.data.map(event => ({
          ...event,
          date: normalizeDate(event.date)
        }));

        setEvents(normalizedEvents as ExtendedEvent[]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      addNotification({
        type: 'danger',
        title: 'Erreur',
        message: 'Impossible de charger les événements'
      });
    }
  };

  // Charger les événements au montage
  useEffect(() => {
    loadEvents();
  }, []);

  // Callback déclenché lorsque la vue du calendrier change (mois, semaine, etc.)
  const handleDatesSet = (arg: any) => {
    const startDate: Date = arg.start;
    loadEvents(startDate.getFullYear(), startDate.getMonth() + 1);
  };

  // Convert internal events to FullCalendar format
  const getFormattedInternalEvents = () => {
    return events.map(event => ({
      id: String(event.id),
      title: event.title,
      start: `${event.date}T${event.time}:00`,
      end: event.endTime ? `${event.date}T${event.endTime}:00` : undefined,
      location: event.location,
      extendedProps: {
        type: event.type,
        participants: event.participants,
        source: 'internal'
      },
      color: event.type === 'mission' ? '#FF5722' : 
             event.type === 'formation' ? '#4CAF50' : 
             event.type === 'reunion' ? '#FFC107' : 
             '#9E9E9E'
    }));
  };

  // Retourne les événements internes formatés pour FullCalendar
  const getCalendarEvents = () => getFormattedInternalEvents();

  // Handle date click
  const handleDateClick = (arg: any) => {
    const clickedDate = normalizeDate(new Date(arg.date));
    setSelectedDate(clickedDate);
    setSelectedEvent(undefined);
    setShowModal(true);
  };

  // Handle event click
  const handleEventClick = (arg: any) => {
    const { event } = arg;
    
    // Ouvrir le modal pour l'événement interne sélectionné
    const internalEvent = events.find(e => String(e.id) === event.id);
    if (internalEvent) {
      setSelectedEvent(internalEvent);
      setShowModal(true);
    }
  };

  // Gérer la création/modification d'un événement
  const handleSaveEvent = async (data: CreateEventDTO) => {
    try {
      if (selectedEvent) {
        const response = await eventService.updateEvent(selectedEvent.id, data);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Succès',
            message: 'Événement mis à jour avec succès'
          });

          const updatedDate = new Date(data.date);

          // Mettre à jour localement l'évènement dans l'état
          setEvents(prev => prev.map(ev => (
            ev.id === selectedEvent.id ? { ...ev, ...data, date: normalizeDate(data.date) } : ev
          )));

          await loadEvents(updatedDate.getFullYear(), updatedDate.getMonth() + 1);
          calendarRef.current?.getApi()?.gotoDate(updatedDate);
        }
      } else {
        const response = await eventService.createEvent(data);
        if (response.success && response.data) {
          addNotification({
            type: 'success',
            title: 'Succès',
            message: 'Événement créé avec succès'
          });
          
          // Normaliser puis ajouter immédiatement à l'état local (optimistic update)
          const newEvent: ExtendedEvent = {
            ...response.data,
            date: normalizeDate(response.data.date)
          } as ExtendedEvent;

          setEvents(prev => [...prev, newEvent]);

          // Recharger les événements du mois de la nouvelle entrée (sécurisation) et naviguer vers celui-ci
          const eventDate = new Date(newEvent.date);
          await loadEvents(eventDate.getFullYear(), eventDate.getMonth() + 1);
          calendarRef.current?.getApi()?.gotoDate(eventDate);
        }
      }
      setShowModal(false);
      setSelectedEvent(undefined);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error saving event:', error);
      addNotification({
        type: 'danger',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'enregistrement'
      });
    }
  };

  // Supprimer un événement
  const handleDeleteEvent = async (event: ExtendedEvent) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await eventService.deleteEvent(event.id);
        addNotification({
          type: 'success',
          title: 'Succès',
          message: 'Événement supprimé avec succès'
        });
        await loadEvents();
      } catch (error) {
        addNotification({
          type: 'danger',
          title: 'Erreur',
          message: 'Impossible de supprimer l\'événement'
        });
      }
    }
  };

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Calendrier</h1>
        <div className="flex items-center gap-2">
          <button 
            className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            onClick={() => {
              setSelectedEvent(undefined);
              setSelectedDate(undefined);
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Ajouter un événement
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={getCalendarEvents()}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          locale="fr"
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          datesSet={handleDatesSet}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold mb-4">Légende</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-[#FF5722] mr-2"></div>
            <span className="text-sm">Missions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-[#4CAF50] mr-2"></div>
            <span className="text-sm">Formations</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-[#FFC107] mr-2"></div>
            <span className="text-sm">Réunions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-[#9E9E9E] mr-2"></div>
            <span className="text-sm">Autres</span>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(undefined);
          setSelectedDate(undefined);
        }}
        onSave={handleSaveEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar; 