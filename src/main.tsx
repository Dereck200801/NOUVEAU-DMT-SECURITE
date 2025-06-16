import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Initialize the mock service worker in development
async function initMockServer() {
  console.log("Initializing mock server...");
  if (import.meta.env.DEV) {
    try {
      console.log("Loading mock server module...");
      const { worker } = await import('./mocks/server');
      console.log("Starting mock server...");
      
      // Check if the service worker can be registered
      if ('serviceWorker' in navigator) {
        // Try to start the worker with the correct path
        await worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: '/mockServiceWorker.js',
            options: {
              scope: '/'
            }
          }
        });
        console.log('Mock server started successfully');
      } else {
        console.warn('Service Worker API not supported in this browser. Using fallback mock data.');
      }
    } catch (error) {
      console.error('Error starting mock server:', error);
      console.warn('Using fallback mock data instead of MSW');
    }
  } else {
    console.log("Not in development mode, mock server not started");
  }
}

// Start the mock server
initMockServer();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 