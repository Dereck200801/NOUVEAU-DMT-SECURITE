import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Event } from '../../services/eventService';

const router = express.Router();

// Mock data for events
let events: Event[] = [
  {
    id: 1,
    title: 'Réunion équipe',
    date: '2023-09-15',
    time: '10:00',
    type: 'reunion',
    description: 'Réunion hebdomadaire de l\'équipe',
    location: 'Salle de conférence A',
    participants: ['John Doe', 'Jane Smith']
  },
  {
    id: 2,
    title: 'Formation sécurité',
    date: '2023-09-20',
    time: '14:00',
    type: 'formation',
    description: 'Formation sur les nouvelles procédures de sécurité',
    location: 'Salle de formation B',
    participants: ['John Doe', 'Alice Johnson']
  }
];

// Get all events
router.get('/', (req, res) => {
  res.json(events);
});

// Get events by month
router.get('/month/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === parseInt(year) && eventDate.getMonth() + 1 === parseInt(month);
  });
  res.json(filteredEvents);
});

// Get event by ID
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  res.json(event);
});

// Create new event
router.post('/', (req, res) => {
  const newEvent: Event = {
    id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update event
router.put('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...req.body
  };
  
  res.json(events[eventIndex]);
});

// Delete event
router.delete('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  
  events = events.filter(e => e.id !== eventId);
  res.status(204).send();
});

// Update event status
router.put('/:id/status', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { status } = req.body;
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  
  events[eventIndex].status = status;
  res.json(events[eventIndex]);
});

// Add participants to event
router.post('/:id/participants', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { participantIds } = req.body;
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  
  if (!events[eventIndex].participants) {
    events[eventIndex].participants = [];
  }
  
  events[eventIndex].participants = [
    ...events[eventIndex].participants!,
    ...participantIds
  ];
  
  res.json(events[eventIndex]);
});

// Remove participants from event
router.delete('/:id/participants', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { participantIds } = req.body;
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Événement non trouvé' });
  }
  
  if (events[eventIndex].participants) {
    events[eventIndex].participants = events[eventIndex].participants!.filter(
      p => !participantIds.includes(p)
    );
  }
  
  res.json(events[eventIndex]);
});

export default router; 