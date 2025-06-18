import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import TermsModal from './TermsModal';
import { cn } from '../lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

interface LayoutProps {
  title?: string;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ title: defaultTitle, requireAuth = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
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
  
  // Show terms modal on first login per utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      const accepted = localStorage.getItem(`termsAccepted-${user.id}`) === 'true';
      setShowTerms(!accepted);
    }
  }, [isAuthenticated, user]);

  const handleAcceptTerms = () => {
    if (user) {
      localStorage.setItem(`termsAccepted-${user.id}`, 'true');
    }
    setShowTerms(false);
  };
  
  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={cn("flex-1 flex flex-col transition-all duration-300", collapsed ? "md:ml-20" : "md:ml-64")}>
        {/* Mobile top bar */}
        <header className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-md border-b border-border md:hidden">
          <button
            className="text-oxford-blue text-xl focus:outline-none focus:ring-2 focus:ring-yale-blue rounded-lg bg-yale-blue/10 p-2"
            onClick={toggleSidebar}
            aria-label="Ouvrir le menu"
          >
            <FontAwesomeIcon icon={faShieldAlt} />
          </button>
          <h1 className="text-lg font-semibold text-oxford-blue flex-1 truncate">{getCurrentTitle()}</h1>
        </header>

        <main className="p-4 pt-20 md:pt-6 md:p-6 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>

      {/* Modal d'acceptation des CGU / Politique */}
      <TermsModal isOpen={showTerms} onAccept={handleAcceptTerms} />
    </div>
  );
};

export default Layout; 