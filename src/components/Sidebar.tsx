import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUserShield, 
  faTasks, 
  faBuilding, 
  faFileAlt, 
  faCog, 
  faSignOutAlt,
  faShieldAlt,
  faCalendarAlt,
  faCamera,
  faIdCard,
  faFire,
  faUsers,
  faCalendarCheck,
  faCalendarTimes,
  faBoxOpen,
  faTruck,
  faDoorOpen,
  faClipboardList,
  faGraduationCap,
  faChartBar,
  faFileInvoiceDollar,
  faLifeRing,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { CardFooter } from './ui/card';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };
  
  const sidebarClass = isOpen ? 'sidebar active' : 'sidebar';
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="mobile-overlay md:hidden" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`${sidebarClass} w-64 fixed inset-y-0 left-0 z-50 transform md:translate-x-0 flex flex-col shadow-xl`}>
        {/* Company Logo & Name */}
        <div className="sidebar-header">
          <div className="flex items-center">
            <div className="bg-yale-blue/10 p-3 rounded-xl mr-3">
              <FontAwesomeIcon icon={faShieldAlt} className="text-yale-blue text-xl" />
            </div>
            <span className="text-oxford-blue text-xl font-bold tracking-tight">DMT Sécurité</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 mt-4 px-2 overflow-y-auto">
          {/* Menu items with active state handling */}
          {[
            { path: '/dashboard', icon: faTachometerAlt, label: 'Tableau de bord' },
            { path: '/agents', icon: faUserShield, label: 'Agents', badge: '24' },
            { path: '/missions', icon: faTasks, label: 'Missions', badge: '8' },
            { path: '/calendar', icon: faCalendarAlt, label: 'Calendrier' },
            { path: '/clients', icon: faBuilding, label: 'Clients' },
            { path: '/employees', icon: faUsers, label: 'Employés' },
            { path: '/planning', icon: faCalendarCheck, label: 'Plannings' },
            { path: '/leaves', icon: faCalendarTimes, label: 'Congés' },
            { path: '/equipment', icon: faBoxOpen, label: 'Équipements' },
            { path: '/fleet', icon: faTruck, label: 'Flotte' },
            { path: '/visitors', icon: faDoorOpen, label: 'Visiteurs' },
            { path: '/compliance', icon: faClipboardList, label: 'Conformité' },
            { path: '/training', icon: faGraduationCap, label: 'Formations' },
            { path: '/analytics', icon: faChartBar, label: 'BI' },
            { path: '/billing', icon: faFileInvoiceDollar, label: 'Facturation' },
            { path: '/helpdesk', icon: faLifeRing, label: 'Help Desk' },
            { path: '/risk-management', icon: faExclamationTriangle, label: 'Risques' },
            { path: '/reports', icon: faFileAlt, label: 'Rapports' },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "sidebar-link no-underline",
                location.pathname === item.path && "active"
              )}
            >
              <div className="sidebar-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-yale-blue/10 text-yale-blue text-xs rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          
          {/* Séparateur pour les modules premium */}
          <div className="sidebar-section-title mt-6">
            Modules Premium
          </div>
          
          {/* Liens vers les modules premium */}
          {[
            { path: '/premium/facial-recognition', icon: faCamera, label: 'Reconnaissance Faciale' },
            { path: '/premium/accreditations', icon: faIdCard, label: 'Accréditations' },
            { path: '/premium/crisis-simulator', icon: faFire, label: 'Simulateur de Crise' },
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "sidebar-link no-underline",
                location.pathname.includes(item.path) && "active"
              )}
            >
              <div className="sidebar-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span>{item.label}</span>
              <span className="ml-auto bg-berkeley-blue/10 text-berkeley-blue text-xs rounded-full px-2 py-0.5">
                New
              </span>
            </Link>
          ))}
          
          <div className="sidebar-divider" />
          
          <Link 
            to="/settings" 
            className={cn(
              "sidebar-link no-underline",
              location.pathname === '/settings' && "active"
            )}
          >
            <div className="sidebar-icon">
              <FontAwesomeIcon icon={faCog} />
            </div>
            <span>Paramètres</span>
          </Link>
        </nav>
        
        {/* User profile */}
        {user && (
          <CardFooter className="gap-3 border-t border-border/30 bg-yale-blue/5 p-4">
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-yale-blue/20">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=134074&color=fff`}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-oxford-blue">{user.name}</p>
              <p className="text-xs text-berkeley-blue/70">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-berkeley-blue hover:text-yale-blue hover:bg-yale-blue/10"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </CardFooter>
        )}
      </aside>
    </>
  );
};

export default Sidebar; 