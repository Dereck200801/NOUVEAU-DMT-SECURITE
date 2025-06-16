import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  title?: string;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ title: defaultTitle, requireAuth = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Get current page title based on route
  const getCurrentTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/dashboard':
        return 'Tableau de Bord';
      case '/agents':
        return 'Gestion des Agents';
      case '/missions':
        return 'Gestion des Missions';
      case '/calendar':
        return 'Calendrier';
      case '/clients':
        return 'Gestion des Clients';
      case '/reports':
        return 'Rapports et Documents';
      case '/settings':
        return 'Paramètres';
      default:
        return defaultTitle || 'DMT Sécurité';
    }
  };
  
  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 md:ml-64">
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 