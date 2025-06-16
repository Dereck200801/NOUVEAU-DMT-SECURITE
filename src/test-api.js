/**
 * Script pour tester l'API directement
 * Exécuter avec: node src/test-api.js
 */

import fetch from 'node-fetch';

async function testApi() {
  console.log('=== TESTING API ===');
  
  try {
    // Test 1: Get all events
    console.log('\n1. Testing GET /api/events');
    const allEventsResponse = await fetch('http://localhost:3002/api/events');
    const allEvents = await allEventsResponse.json();
    console.log(`Found ${allEvents.length} events`);
    
    // Test 2: Get events for June 2025
    console.log('\n2. Testing GET /api/events/month/2025/06');
    const juneEventsResponse = await fetch('http://localhost:3002/api/events/month/2025/06');
    const juneEvents = await juneEventsResponse.json();
    console.log(`Found ${juneEvents.length} events for June 2025:`);
    juneEvents.forEach(event => {
      console.log(`- ${event.date}: ${event.title} (${event.type})`);
    });
    
    // Test 3: Get events for current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    console.log(`\n3. Testing GET /api/events/month/${currentYear}/${currentMonth}`);
    const currentMonthEventsResponse = await fetch(`http://localhost:3002/api/events/month/${currentYear}/${currentMonth}`);
    const currentMonthEvents = await currentMonthEventsResponse.json();
    console.log(`Found ${currentMonthEvents.length} events for ${currentYear}-${currentMonth}`);
    
    // Test 4: Create a new event
    console.log('\n4. Testing POST /api/events');
    const newEvent = {
      title: 'Test Event',
      date: `${currentYear}-${currentMonth}-15`,
      time: '15:00',
      type: 'reunion',
      description: 'Test event description',
      location: 'Test location',
      participants: ['Test User']
    };
    console.log('Creating event:', newEvent);
    
    const createEventResponse = await fetch('http://localhost:3002/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEvent)
    });
    
    const createdEvent = await createEventResponse.json();
    console.log('Created event:', createdEvent);
    
    // Test 5: Get event by ID
    console.log(`\n5. Testing GET /api/events/${createdEvent.id}`);
    const eventByIdResponse = await fetch(`http://localhost:3002/api/events/${createdEvent.id}`);
    const eventById = await eventByIdResponse.json();
    console.log('Event by ID:', eventById);
    
    // Test 6: Update event
    console.log(`\n6. Testing PUT /api/events/${createdEvent.id}`);
    const updatedEventData = {
      ...createdEvent,
      title: 'Updated Test Event',
      description: 'Updated test event description'
    };
    console.log('Updating event:', updatedEventData);
    
    const updateEventResponse = await fetch(`http://localhost:3002/api/events/${createdEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedEventData)
    });
    
    const updatedEvent = await updateEventResponse.json();
    console.log('Updated event:', updatedEvent);
    
    // Test 7: Delete event
    console.log(`\n7. Testing DELETE /api/events/${createdEvent.id}`);
    await fetch(`http://localhost:3002/api/events/${createdEvent.id}`, {
      method: 'DELETE'
    });
    console.log('Event deleted');
    
    // Test 8: Verify deletion
    console.log(`\n8. Testing GET /api/events/${createdEvent.id} after deletion`);
    const deletedEventResponse = await fetch(`http://localhost:3002/api/events/${createdEvent.id}`);
    console.log('Status code:', deletedEventResponse.status);
    
    console.log('\n=== API TESTING COMPLETE ===');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 