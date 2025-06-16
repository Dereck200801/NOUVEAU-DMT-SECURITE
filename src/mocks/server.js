import { setupWorker } from 'msw/browser';
import { http } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { normalizeDate, createDateString } from '../utils/dateUtils';

console.log("Mock server module loaded");

// Fonction pour obtenir la date d'aujourd'hui + un nombre de jours
const getDatePlusDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return normalizeDate(date);
};

// Fonction pour obtenir le premier jour du mois courant
const getFirstDayOfMonth = () => {
  const date = new Date();
  date.setDate(1);
  return normalizeDate(date);
};

// Fonction pour obtenir le 15 du mois courant
const getMidMonthDay = () => {
  const date = new Date();
  date.setDate(15);
  return normalizeDate(date);
};

// Fonction pour créer une date spécifique (année, mois, jour)
const createDate = (year, month, day) => {
  // month est 0-indexed (0 = janvier, 11 = décembre)
  return new Date(year, month - 1, day).toISOString().split('T')[0];
};

// Mock data for events
let events = [
  {
    id: 1,
    title: 'Réunion équipe',
    date: normalizeDate(new Date()), // Today
    time: '10:00',
    type: 'reunion',
    description: 'Réunion hebdomadaire de l\'équipe',
    location: 'Salle de conférence A',
    participants: ['John Doe', 'Jane Smith']
  },
  {
    id: 2,
    title: 'Formation sécurité',
    date: normalizeDate(new Date()), // Today
    time: '14:00',
    type: 'formation',
    description: 'Formation sur les nouvelles procédures de sécurité',
    location: 'Salle de formation B',
    participants: ['John Doe', 'Alice Johnson']
  },
  {
    id: 3,
    title: 'Mission client XYZ',
    date: getDatePlusDays(1), // Tomorrow
    time: '09:00',
    type: 'mission',
    description: 'Intervention sur site client XYZ',
    location: 'Client XYZ, Paris',
    participants: ['John Doe']
  },
  {
    id: 4,
    title: 'Audit sécurité',
    date: getDatePlusDays(2),
    time: '11:00',
    type: 'mission',
    description: 'Audit des systèmes de sécurité',
    location: 'Client ABC, Lyon',
    participants: ['Jane Smith', 'Alice Johnson']
  },
  {
    id: 5,
    title: 'Formation RGPD',
    date: getFirstDayOfMonth(),
    time: '09:30',
    type: 'formation',
    description: 'Formation sur les règles RGPD',
    location: 'Salle de formation A',
    participants: ['Toute l\'équipe']
  },
  {
    id: 6,
    title: 'Réunion commerciale',
    date: getMidMonthDay(),
    time: '14:30',
    type: 'reunion',
    description: 'Point commercial mensuel',
    location: 'Salle de réunion C',
    participants: ['Équipe commerciale']
  },
  {
    id: 7,
    title: 'Événement networking',
    date: getDatePlusDays(7),
    time: '18:00',
    type: 'autre',
    description: 'Événement networking cybersécurité',
    location: 'Hôtel Mercure, Paris',
    participants: ['Direction']
  },
  // Événements pour juin 2025
  {
    id: 8,
    title: 'Formation avancée',
    date: createDateString(2025, 6, 5), // 5 juin 2025
    time: '09:00',
    type: 'formation',
    description: 'Formation avancée sur les nouvelles technologies',
    location: 'Salle de formation A',
    participants: ['Équipe technique']
  },
  {
    id: 9,
    title: 'Mission client important',
    date: createDateString(2025, 6, 10), // 10 juin 2025
    time: '10:30',
    type: 'mission',
    description: 'Intervention chez un client important',
    location: 'Client VIP, Paris',
    participants: ['Équipe senior']
  },
  {
    id: 10,
    title: 'Réunion stratégique',
    date: createDateString(2025, 6, 15), // 15 juin 2025
    time: '14:00',
    type: 'reunion',
    description: 'Réunion stratégique semestrielle',
    location: 'Salle du conseil',
    participants: ['Direction', 'Managers']
  },
  {
    id: 11,
    title: 'Conférence sécurité',
    date: createDateString(2025, 6, 20), // 20 juin 2025
    time: '09:00',
    type: 'autre',
    description: 'Conférence annuelle sur la cybersécurité',
    location: 'Centre de conférences',
    participants: ['Toute l\'entreprise']
  }
];

console.log("Initial events:", events);

// Helper function to create a standard response with CORS headers
const createResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};

// Define handlers
export const handlers = [
  // Handle OPTIONS requests for CORS preflight
  http.options('*', () => {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }),

  // Get all events
  http.get('/api/events', ({ request }) => {
    console.log("GET /api/events called");
    console.log("Returning events:", events);
    return createResponse(events);
  }),

  // Get events by month
  http.get('/api/events/month/:year/:month', ({ params }) => {
    const { year, month } = params;
    console.log(`GET /api/events/month/${year}/${month} called`);
    
    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month);
    
    console.log(`Filtering events for year=${parsedYear}, month=${parsedMonth}`);
    
    const filteredEvents = events.filter(event => {
      // Normaliser la date de l'événement
      const eventDate = new Date(event.date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth() + 1; // getMonth() returns 0-11
      
      console.log(`Event: ${event.title}, date=${event.date}, year=${eventYear}, month=${eventMonth}`);
      
      const match = eventYear === parsedYear && eventMonth === parsedMonth;
      console.log(`Match: ${match}`);
      
      return match;
    });
    
    console.log(`Found ${filteredEvents.length} events for ${year}-${month}:`, filteredEvents);
    return createResponse(filteredEvents);
  }),

  // Get event by ID
  http.get('/api/events/:id', ({ params }) => {
    const { id } = params;
    console.log(`GET /api/events/${id} called`);
    
    const event = events.find(e => e.id === parseInt(id));
    if (!event) {
      console.log(`Event with id=${id} not found`);
      return new Response(JSON.stringify({ message: 'Événement non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Returning event:`, event);
    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }),

  // Create new event
  http.post('/api/events', async ({ request }) => {
    console.log("POST /api/events called");
    const body = await request.json();
    console.log("Request body:", body);
    
    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      ...body
    };
    
    // Normaliser la date
    newEvent.date = normalizeDate(newEvent.date);
    
    // S'assurer que les participants sont un tableau
    if (typeof newEvent.participants === 'string') {
      newEvent.participants = newEvent.participants.split(',').map(p => p.trim()).filter(Boolean);
    } else if (!Array.isArray(newEvent.participants)) {
      newEvent.participants = [];
    }
    
    console.log('Creating new event:', newEvent);
    events.push(newEvent);
    
    console.log('Updated events:', events);
    return new Response(JSON.stringify(newEvent), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }),

  // Update event
  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    console.log(`PUT /api/events/${id} called`);
    const body = await request.json();
    console.log("Request body:", body);
    
    const eventIndex = events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      console.log(`Event with id=${id} not found`);
      return new Response(JSON.stringify({ message: 'Événement non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updatedEvent = {
      ...events[eventIndex],
      ...body
    };
    
    // Normaliser la date
    if (updatedEvent.date) {
      updatedEvent.date = normalizeDate(updatedEvent.date);
    }
    
    events[eventIndex] = updatedEvent;
    
    console.log(`Updated event:`, updatedEvent);
    return new Response(JSON.stringify(events[eventIndex]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }),

  // Delete event
  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    console.log(`DELETE /api/events/${id} called`);
    
    const eventIndex = events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      console.log(`Event with id=${id} not found`);
      return new Response(JSON.stringify({ message: 'Événement non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    events = events.filter(e => e.id !== parseInt(id));
    console.log(`Event with id=${id} deleted`);
    console.log('Updated events:', events);
    
    return new Response(null, { status: 204 });
  }),

  // Mock handlers for locations
  http.get('/api/locations', () => {
    console.log("GET /api/locations called");
    const locations = [
      {
        id: 1,
        missionId: 101,
        name: 'Protection VIP',
        client: 'Ministère de l\'Intérieur',
        clientId: 1,
        address: 'Boulevard Triomphal, Libreville',
        agentsCount: 4,
        date: '18-25 Nov',
        startDate: '2023-11-18',
        endDate: '2023-11-25',
        status: 'active',
        coordinates: { latitude: 0.3924, longitude: 9.4536 },
        contactPerson: 'Jean Moussa',
        contactPhone: '+241 77 12 34 56'
      },
      {
        id: 2,
        missionId: 102,
        name: 'Surveillance Supermarché',
        client: 'Carrefour Mont-Bouët',
        clientId: 2,
        address: 'Mont-Bouët, Libreville',
        agentsCount: 2,
        date: '15-22 Nov',
        startDate: '2023-11-15',
        endDate: '2023-11-22',
        status: 'completed',
        coordinates: { latitude: 0.4157, longitude: 9.4669 }
      },
      {
        id: 3,
        missionId: 103,
        name: 'Sécurité Événement',
        client: 'Gala annuel BGFI',
        clientId: 3,
        address: 'Hôtel Radisson Blu, Libreville',
        agentsCount: 6,
        date: '25-26 Nov',
        startDate: '2023-11-25',
        endDate: '2023-11-26',
        status: 'planned',
        coordinates: { latitude: 0.4578, longitude: 9.4150 },
        contactPerson: 'Marie Ndong',
        contactPhone: '+241 66 78 90 12'
      },
      {
        id: 4,
        missionId: 104,
        name: 'Ronde Industrielle',
        client: 'Zones Industrielles Oloumi',
        clientId: 4,
        address: 'Oloumi, Libreville',
        agentsCount: 3,
        date: '20-27 Nov',
        startDate: '2023-11-20',
        endDate: '2023-11-27',
        status: 'active',
        coordinates: { latitude: 0.3845, longitude: 9.4725 }
      }
    ];
    return createResponse(locations);
  }),

  // Mock handler for location stats
  http.get('/api/locations/stats', () => {
    console.log("GET /api/locations/stats called");
    const stats = {
      active: 8,
      planned: 5,
      completed: 15,
      byClient: {
        1: 3, // Ministère de l'Intérieur
        2: 4, // Carrefour Mont-Bouët
        3: 2, // BGFI
        4: 6, // Zones Industrielles Oloumi
        5: 13 // Autres clients
      }
    };
    return createResponse(stats);
  }),

  // Mock handlers for incidents
  http.get('/api/incidents', () => {
    console.log("GET /api/incidents called");
    const incidents = [
      {
        id: 1,
        title: 'Intrusion détectée',
        description: 'Tentative d\'intrusion dans le secteur A',
        date: '2023-11-15T14:30:00',
        location: 'Secteur A, Bâtiment 3',
        severity: 'high',
        status: 'resolved',
        reportedBy: 1,
        reportedByName: 'Jean Dupont',
        assignedTo: 2,
        assignedToName: 'Marie Dubois'
      },
      {
        id: 2,
        title: 'Alarme déclenchée',
        description: 'Alarme incendie déclenchée au 2ème étage',
        date: '2023-11-17T09:15:00',
        location: 'Bâtiment principal, 2ème étage',
        severity: 'high',
        status: 'investigating',
        reportedBy: 3,
        reportedByName: 'Paul Martin',
        assignedTo: 1,
        assignedToName: 'Jean Dupont'
      },
      {
        id: 3,
        title: 'Équipement défectueux',
        description: 'Caméra de surveillance hors service',
        date: '2023-11-16T11:45:00',
        location: 'Entrée principale',
        severity: 'medium',
        status: 'open',
        reportedBy: 2,
        reportedByName: 'Marie Dubois',
        assignedTo: null,
        assignedToName: null
      }
    ];
    return createResponse(incidents);
  }),

  // Mock handler for incident stats
  http.get('/api/incidents/stats', () => {
    console.log("GET /api/incidents/stats called");
    const stats = {
      total: 12,
      resolved: 6,
      pending: 3,
      investigating: 3,
      bySeverity: {
        high: 2,
        medium: 7,
        low: 3
      }
    };
    return createResponse(stats);
  }),

  // Mock handlers for metrics
  http.get('/api/metrics', () => {
    console.log("GET /api/metrics called");
    const metrics = [
      {
        id: 1,
        name: 'Taux de satisfaction client',
        description: 'Pourcentage de clients satisfaits',
        type: 'mission',
        category: 'Satisfaction',
        period: 'Dernier mois',
        score: 92,
        trend: 'up',
        trendValue: 3
      },
      {
        id: 2,
        name: 'Temps de réponse moyen',
        description: 'Temps moyen pour répondre aux incidents',
        type: 'incident',
        category: 'Performance',
        period: 'Dernier mois',
        score: 87,
        trend: 'down',
        trendValue: 5
      },
      {
        id: 3,
        name: 'Taux de présence',
        description: 'Pourcentage de présence des agents',
        type: 'agent',
        category: 'Ressources humaines',
        period: 'Dernier trimestre',
        score: 95,
        trend: 'up',
        trendValue: 2
      }
    ];
    return createResponse(metrics);
  }),

  // Mock handlers for equipment
  http.get('/api/equipment', () => {
    console.log("GET /api/equipment called");
    const equipment = [
      {
        id: 1,
        name: 'Radio Motorola XTR',
        type: 'radio',
        status: 'assigned',
        assignedTo: 1,
        assignedToName: 'Pierre Mbemba',
        condition: 'good',
        lastCheck: '2023-11-12'
      },
      {
        id: 2,
        name: 'Uniforme Taille L',
        type: 'uniform',
        status: 'available',
        condition: 'good',
        lastCheck: '2023-11-15'
      },
      {
        id: 3,
        name: 'Toyota Land Cruiser',
        type: 'vehicle',
        status: 'maintenance',
        condition: 'fair',
        lastCheck: '2023-11-05'
      },
      {
        id: 4,
        name: 'Gilet pare-balles',
        type: 'protection',
        status: 'assigned',
        assignedTo: 3,
        assignedToName: 'Sarah Nzeng',
        condition: 'good',
        lastCheck: '2023-11-10'
      }
    ];
    return createResponse(equipment);
  }),

  // Mock handler for equipment stats
  http.get('/api/equipment/stats', () => {
    console.log("GET /api/equipment/stats called");
    const stats = {
      total: 24,
      available: 10,
      assigned: 12,
      maintenance: 2,
      byType: {
        uniform: 8,
        radio: 6,
        vehicle: 4,
        protection: 5,
        other: 1
      }
    };
    return createResponse(stats);
  }),

  // Mock handlers for certifications
  http.get('/api/certifications', () => {
    console.log("GET /api/certifications called");
    const certifications = [
      {
        id: 1,
        name: 'Formation Sécurité Niveau 1',
        provider: 'Institut National de Sécurité',
        agentId: 1,
        agentName: 'Jean Dupont',
        issueDate: '2023-05-15',
        expiryDate: '2025-05-15',
        isValid: true
      },
      {
        id: 2,
        name: 'Secourisme et Premiers Soins',
        provider: 'Croix Rouge',
        agentId: 2,
        agentName: 'Marie Dubois',
        issueDate: '2023-02-10',
        expiryDate: '2024-02-10',
        isValid: true
      },
      {
        id: 3,
        name: 'Gestion de Crise',
        provider: 'Centre de Formation Sécurité',
        agentId: 1,
        agentName: 'Jean Dupont',
        issueDate: '2022-11-20',
        expiryDate: '2023-11-20',
        isValid: false
      },
      {
        id: 4,
        name: 'Manipulation d\'Armes à Feu',
        provider: 'École Nationale de Police',
        agentId: 3,
        agentName: 'Paul Martin',
        issueDate: '2023-08-05',
        expiryDate: '2025-08-05',
        isValid: true
      }
    ];
    return createResponse(certifications);
  }),

  // Mock handler for agent certifications
  http.get('/api/agents/:agentId/certifications', ({ params }) => {
    const { agentId } = params;
    console.log(`GET /api/agents/${agentId}/certifications called`);
    
    const allCertifications = [
      {
        id: 1,
        name: 'Formation Sécurité Niveau 1',
        provider: 'Institut National de Sécurité',
        agentId: 1,
        agentName: 'Jean Dupont',
        issueDate: '2023-05-15',
        expiryDate: '2025-05-15',
        isValid: true
      },
      {
        id: 2,
        name: 'Secourisme et Premiers Soins',
        provider: 'Croix Rouge',
        agentId: 2,
        agentName: 'Marie Dubois',
        issueDate: '2023-02-10',
        expiryDate: '2024-02-10',
        isValid: true
      },
      {
        id: 3,
        name: 'Gestion de Crise',
        provider: 'Centre de Formation Sécurité',
        agentId: 1,
        agentName: 'Jean Dupont',
        issueDate: '2022-11-20',
        expiryDate: '2023-11-20',
        isValid: false
      },
      {
        id: 4,
        name: 'Manipulation d\'Armes à Feu',
        provider: 'École Nationale de Police',
        agentId: 3,
        agentName: 'Paul Martin',
        issueDate: '2023-08-05',
        expiryDate: '2025-08-05',
        isValid: true
      }
    ];
    
    const agentCertifications = allCertifications.filter(
      cert => cert.agentId === parseInt(agentId)
    );
    
    return createResponse(agentCertifications);
  }),

  // Mock handler for agents
  http.get('/api/agents', () => {
    console.log("GET /api/agents called");
    const agents = [
      {
        id: 1,
        name: 'Pierre Mbemba',
        email: 'pierre.mbemba@dmtsecurite.com',
        phone: '+241 77 98 45 21',
        status: 'active',
        specialty: 'Surveillance',
        joinDate: '15/03/2021'
      },
      {
        id: 2,
        name: 'Didier Ondo',
        email: 'didier.ondo@dmtsecurite.com',
        phone: '+241 66 12 34 56',
        status: 'on_mission',
        specialty: 'Protection Rapprochée',
        joinDate: '21/06/2020'
      },
      {
        id: 3,
        name: 'Sarah Nzeng',
        email: 'sarah.nzeng@dmtsecurite.com',
        phone: '+241 74 56 78 90',
        status: 'on_mission',
        specialty: "Contrôle d'Accès",
        joinDate: '05/01/2022'
      },
      {
        id: 4,
        name: 'Marc Mba',
        email: 'marc.mba@dmtsecurite.com',
        phone: '+241 66 45 67 89',
        status: 'inactive',
        specialty: 'Surveillance',
        joinDate: '12/09/2021'
      }
    ];
    return createResponse(agents);
  }),

  // Mock handler for agent stats
  http.get('/api/agents/stats', () => {
    console.log("GET /api/agents/stats called");
    const stats = {
      total: 18,
      active: 8,
      inactive: 2,
      onMission: 8,
      bySpecialty: {
        'Surveillance': 7,
        'Protection Rapprochée': 5,
        'Contrôle d\'Accès': 4,
        'Formation': 2
      },
      change: 5
    };
    return createResponse(stats);
  }),

  // Mock handler for agents on duty
  http.get('/api/agents/on-duty', () => {
    console.log("GET /api/agents/on-duty called");
    const agentsOnDuty = [
      {
        id: 1,
        name: 'Pierre Mbemba',
        email: 'pierre.mbemba@dmtsecurite.com',
        phone: '+241 77 98 45 21',
        status: 'on_mission',
        specialty: 'Protection Rapprochée',
        joinDate: '15/03/2021',
        currentMission: 'Protection VIP - Ministère',
        missionStartTime: '8h',
        missionEndTime: '18h',
        hoursOnDuty: 4
      },
      {
        id: 2,
        name: 'Didier Ondo',
        email: 'didier.ondo@dmtsecurite.com',
        phone: '+241 66 12 34 56',
        status: 'on_mission',
        specialty: 'Protection Rapprochée',
        joinDate: '21/06/2020',
        currentMission: 'Sécurité Événement',
        missionStartTime: '14h',
        missionEndTime: '22h',
        hoursOnDuty: 2
      },
      {
        id: 3,
        name: 'Sarah Nzeng',
        email: 'sarah.nzeng@dmtsecurite.com',
        phone: '+241 74 56 78 90',
        status: 'on_mission',
        specialty: "Contrôle d'Accès",
        joinDate: '05/01/2022',
        currentMission: 'Ronde Industrielle',
        missionStartTime: '6h',
        missionEndTime: '18h',
        hoursOnDuty: 6
      },
      {
        id: 4,
        name: 'Marc Mba',
        email: 'marc.mba@dmtsecurite.com',
        phone: '+241 66 45 67 89',
        status: 'active',
        specialty: 'Surveillance',
        joinDate: '12/09/2021',
        currentMission: null,
        missionStartTime: null,
        missionEndTime: null,
        hoursOnDuty: null
      }
    ];
    return createResponse(agentsOnDuty);
  })
];

// Create the worker
console.log("Creating MSW worker");
const worker = setupWorker(...handlers);
console.log("MSW worker created");

// Export the worker
export { worker }; 