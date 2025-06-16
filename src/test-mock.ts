/**
 * Ce fichier est utilisé pour tester directement le mock server
 */

import { normalizeDate } from './utils/dateUtils';

// Fonction pour tester l'API
async function testApi() {
  console.log('Testing API...');
  
  try {
    // Tester la récupération de tous les événements
    console.log('Fetching all events...');
    const allEventsResponse = await fetch('http://localhost:3002/api/events');
    const allEvents = await allEventsResponse.json();
    console.log('All events:', allEvents);

    // Tester la récupération des événements pour le mois courant
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    console.log(`Fetching events for ${year}-${month}...`);
    const monthEventsResponse = await fetch(`http://localhost:3002/api/events/month/${year}/${month}`);
    const monthEvents = await monthEventsResponse.json();
    console.log(`Events for ${year}-${month}:`, monthEvents);

    // Tester la récupération des événements pour juin 2025
    console.log('Fetching events for 2025-6...');
    const june2025EventsResponse = await fetch('http://localhost:3002/api/events/month/2025/6');
    const june2025Events = await june2025EventsResponse.json();
    console.log('Events for 2025-6:', june2025Events);

    // Tester la création d'un événement
    console.log('Creating a new event...');
    const newEvent = {
      title: 'Test Event',
      date: normalizeDate(new Date()),
      time: '15:00',
      type: 'reunion',
      description: 'Test event description',
      location: 'Test location',
      participants: ['Test User']
    };
    const createEventResponse = await fetch('http://localhost:3002/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEvent)
    });
    const createdEvent = await createEventResponse.json();
    console.log('Created event:', createdEvent);

    // Vérifier que l'événement a bien été créé
    console.log('Fetching all events again...');
    const updatedEventsResponse = await fetch('http://localhost:3002/api/events');
    const updatedEvents = await updatedEventsResponse.json();
    console.log('Updated events:', updatedEvents);
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Exécuter le test après un délai pour s'assurer que le mock server est démarré
setTimeout(() => {
  console.log('Starting API test...');
  testApi();
}, 2000);

export {}; 