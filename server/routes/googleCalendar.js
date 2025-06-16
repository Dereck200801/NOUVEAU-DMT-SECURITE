import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get current file path (ES modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the service account key
const keyPath = path.join(process.cwd(), 'service-account-key.json');
const keyContent = fs.readFileSync(keyPath, 'utf8');
const credentials = JSON.parse(keyContent);

// Create JWT client
const auth = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

// Create Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth });

// Get events from Google Calendar
router.get('/events', async (req, res) => {
  try {
    const timeMin = req.query.timeMin || new Date().toISOString();
    const timeMax = req.query.timeMax || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      description: event.description,
      source: 'google',
      color: '#4285F4'
    })) || [];

    res.json(events);
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch events from Google Calendar' });
  }
});

// Add event to Google Calendar
router.post('/events', async (req, res) => {
  try {
    const { title, date, time, description, location, participants } = req.body;
    
    // Convert date and time to ISO format
    const startDateTime = new Date(`${date}T${time}`);
    
    // Default end time is 1 hour after start time
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    
    const event = {
      summary: title,
      location: location,
      description: description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Paris',
      },
      attendees: participants?.map(participant => ({ email: participant })) || [],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.json({
      success: true,
      data: {
        id: response.data.id,
        title: response.data.summary,
        start: response.data.start?.dateTime,
        end: response.data.end?.dateTime,
        location: response.data.location,
        description: response.data.description,
        source: 'google',
        color: '#4285F4'
      }
    });
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add event to Google Calendar' 
    });
  }
});

export default router; 