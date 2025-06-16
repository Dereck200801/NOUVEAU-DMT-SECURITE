import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

// Get current file path (ES modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Import Google Calendar routes
import googleCalendarRoutes from './server/routes/googleCalendar.js';

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Use Google Calendar routes
app.use('/api/google-calendar', googleCalendarRoutes);

// Serve the frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 