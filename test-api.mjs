/**
 * Script pour tester l'API directement
 * Exécuter avec: node test-api.mjs
 */

import fetch from 'node-fetch';

async function testApi() {
  console.log('=== TESTING API ===');
  
  try {
    // Test 1: Get all events
    console.log('\n1. Testing GET /events');
    const allEventsResponse = await fetch('http://localhost:3002/events');
    const allEvents = await allEventsResponse.json();
    console.log(`Found ${allEvents.length} events`);
    console.log('First few events:', allEvents.slice(0, 3));
    
    // Test 2: Get events for June 2025
    console.log('\n2. Testing events with date_like=2025-06');
    const juneEventsResponse = await fetch('http://localhost:3002/events?date_like=2025-06');
    const juneEvents = await juneEventsResponse.json();
    console.log(`Found ${juneEvents.length} events for June 2025:`);
    juneEvents.forEach(event => {
      console.log(`- ${event.date}: ${event.title} (${event.type})`);
    });
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 