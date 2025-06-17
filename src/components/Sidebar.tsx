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
import WithPermission from './WithPermission';
import { Permission } from '../auth/rbac';

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
            { path: '/dashboard', icon: faTachometerAlt, label: 'Tableau de bord', perm: Permission.DASHBOARD_VIEW },
            { path: '/agents', icon: faUserShield, label: 'Agents', badge: '24', perm: Permission.MISSIONS_VIEW },
            { path: '/missions', icon: faTasks, label: 'Missions', badge: '8', perm: Permission.MISSIONS_VIEW },
            { path: '/calendar', icon: faCalendarAlt, label: 'Calendrier', perm: Permission.MISSIONS_VIEW },
            { path: '/clients', icon: faBuilding, label: 'Clients', perm: Permission.CLIENTS_VIEW },
            { path: '/employees', icon: faUsers, label: 'Employés', perm: Permission.EMPLOYEES_VIEW },
            { path: '/planning', icon: faCalendarCheck, label: 'Plannings', perm: Permission.MISSIONS_VIEW },
            { path: '/leaves', icon: faCalendarTimes, label: 'Congés', perm: Permission.EMPLOYEES_VIEW },
            { path: '/equipment', icon: faBoxOpen, label: 'Équipements', perm: Permission.EQUIPMENT_VIEW },
            { path: '/fleet', icon: faTruck, label: 'Flotte', perm: Permission.FLEET_VIEW },
            { path: '/visitors', icon: faDoorOpen, label: 'Visiteurs', perm: Permission.VISITORS_VIEW },
            { path: '/compliance', icon: faClipboardList, label: 'Conformité', perm: Permission.REPORTS_VIEW },
            { path: '/training', icon: faGraduationCap, label: 'Formations', perm: Permission.EMPLOYEES_VIEW },
            { path: '/analytics', icon: faChartBar, label: 'BI', perm: Permission.DASHBOARD_VIEW },
            { path: '/billing', icon: faFileInvoiceDollar, label: 'Facturation', perm: Permission.CLIENTS_VIEW },
            { path: '/helpdesk', icon: faLifeRing, label: 'Help Desk', perm: Permission.TICKETS_VIEW },
            { path: '/risk-management', icon: faExclamationTriangle, label: 'Risques', perm: Permission.MISSIONS_VIEW },
            { path: '/reports', icon: faFileAlt, label: 'Rapports', perm: Permission.REPORTS_VIEW },
          ].map((item) => {
            const link = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-link no-underline',
                  location.pathname === item.path && 'active'
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
            );
            return item.perm ? (
              <WithPermission perm={item.perm} key={item.path}>
                {link}
              </WithPermission>
            ) : (
              link
            );
          })}
          
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