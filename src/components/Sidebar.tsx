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
  faExclamationTriangle,
  faSearch
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
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Search state for filtering navigation links
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleLogout = () => {
    logout();
  };
  
  const sidebarClass = isOpen ? 'sidebar active' : 'sidebar';
  
  // Handler to toggle collapse when clicking the logo
  const handleLogoClick = () => {
    // On small screens we keep the existing toggleSidebar behaviour
    if (window.innerWidth < 768) {
      toggleSidebar();
    } else {
      setCollapsed((prev) => !prev);
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="mobile-overlay md:hidden" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`${sidebarClass} ${collapsed ? 'w-20' : 'w-64'} fixed inset-y-0 left-0 z-50 transform md:translate-x-0 flex flex-col shadow-xl transition-all duration-300`}>
        {/* Company Logo & Name */}
        <div className="sidebar-header cursor-pointer" onClick={handleLogoClick}>
          <div className={cn("flex items-center", collapsed && "justify-center")}>
            <div className={cn("bg-yale-blue/10 p-3 rounded-xl", !collapsed && "mr-3")}>
              <FontAwesomeIcon icon={faShieldAlt} className="text-yale-blue text-xl" />
            </div>
            {!collapsed && (
              <span className="text-oxford-blue text-xl font-bold tracking-tight">DMT Sécurité</span>
            )}
          </div>
        </div>
        
        {/* Search bar (hidden when collapsed) */}
        {!collapsed && (
          <div className="px-4 mt-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-berkeley-blue/60"
              />
              <input
                type="text"
                placeholder="Rechercher une page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-powder-blue/10 focus:outline-none focus:ring-2 focus:ring-yale-blue dark:bg-oxford-blue/50 dark:text-white"
              />
            </div>
          </div>
        )}
        
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
          ].filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((item) => {
            const link = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'sidebar-link no-underline',
                  collapsed && 'justify-center',
                  location.pathname === item.path && 'active'
                )}
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                }}
              >
                <div className="sidebar-icon">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
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
          {!collapsed && (
            <div className="sidebar-section-title mt-6">
              Modules Premium
            </div>
          )}
          
          {/* Liens vers les modules premium */}
          {[
            { path: '/premium/facial-recognition', icon: faCamera, label: 'Reconnaissance Faciale' },
            { path: '/premium/accreditations', icon: faIdCard, label: 'Accréditations' },
            { path: '/premium/crisis-simulator', icon: faFire, label: 'Simulateur de Crise' },
          ].filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "sidebar-link no-underline",
                collapsed && 'justify-center',
                location.pathname.includes(item.path) && "active"
              )}
              onClick={() => {
                if (collapsed) setCollapsed(false);
              }}
            >
              <div className="sidebar-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && (
                <span className="ml-auto bg-berkeley-blue/10 text-berkeley-blue text-xs rounded-full px-2 py-0.5">
                  New
                </span>
              )}
            </Link>
          ))}
          
          {!collapsed && <div className="sidebar-divider" />}
          
          <Link 
            to="/settings" 
            className={cn(
              "sidebar-link no-underline",
              collapsed && 'justify-center',
              location.pathname === '/settings' && "active"
            )}
            onClick={() => {
              if (collapsed) setCollapsed(false);
            }}
          >
            <div className="sidebar-icon">
              <FontAwesomeIcon icon={faCog} />
            </div>
            {!collapsed && <span>Paramètres</span>}
          </Link>
        </nav>
        
        {/* User profile */}
        {user && (
          collapsed ? (
            <div
              className="p-4 flex justify-center cursor-pointer"
              onClick={() => setCollapsed(false)}
            >
              <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden ring-2 ring-yale-blue/30">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=134074&color=fff`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <CardFooter
              className="gap-4 p-4 bg-gradient-to-r from-white via-yale-blue/5 to-yale-blue/10 dark:from-oxford-blue dark:via-oxford-blue/60 dark:to-oxford-blue/70 border-t border-border/20"
            >
              <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-yale-blue/30">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=134074&color=fff`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold text-oxford-blue dark:text-white">
                  {user.name}
                </span>
                <span className="text-xs text-berkeley-blue/70 dark:text-yale-blue/50 capitalize">
                  {user.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-berkeley-blue/70 hover:text-white hover:bg-yale-blue/80 focus-visible:ring-0 transition"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span className="sr-only">Déconnexion</span>
              </Button>
            </CardFooter>
          )
        )}
      </aside>
    </>
  );
};

export default Sidebar; 