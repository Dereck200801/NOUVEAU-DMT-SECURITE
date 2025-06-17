import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ClientProvider } from './context/ClientContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { ShiftProvider } from './context/ShiftContext';
import { ReportProvider } from './context/ReportContext';
import { LeaveProvider } from './context/LeaveContext';
import { EquipmentProvider } from './context/EquipmentContext';
import { VehicleProvider } from './context/VehicleContext';
import { VisitorProvider } from './context/VisitorContext';
import { ComplianceProvider } from './context/ComplianceContext';
import { TrainingProvider } from './context/TrainingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Missions from './pages/Missions';
import Calendar from './pages/Calendar';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Employees from './pages/Employees';

// Premium Module Pages
import FacialRecognition from './pages/premium/FacialRecognition';
import Accreditations from './pages/premium/Accreditations';
import CrisisSimulator from './pages/premium/CrisisSimulator';

// New placeholder pages
import Planning from './pages/Planning';
import Leaves from './pages/Leaves';
import Equipment from './pages/Equipment';
import Fleet from './pages/Fleet';
import Visitors from './pages/Visitors';
import Compliance from './pages/Compliance';
import Training from './pages/Training';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import HelpDesk from './pages/HelpDesk';
import RiskManagement from './pages/RiskManagement';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUserShield, 
  faTasks, 
  faBuilding, 
  faFileAlt, 
  faCog, 
  faTachometerAlt, 
  faSignOutAlt, 
  faShieldAlt,
  faBars,
  faBell,
  faClipboardCheck,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faUser,
  faLock,
  faSearch,
  faPlus,
  faEllipsisV,
  faEdit,
  faTrash,
  faEye,
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faDownload,
  faGlobe,
  faSave,
  faTimes,
  faCheck,
  faCheckDouble,
  faExclamationTriangle as fasExclamationTriangle,
  faChevronLeft,
  faChevronRight,
  // Nouvelles icônes pour les modules premium
  faCamera,
  faIdCard,
  faSimCard,
  faCertificate,
  faFire,
  faCreditCard,
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
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
  faUserShield, 
  faTasks, 
  faBuilding, 
  faFileAlt, 
  faCog, 
  faTachometerAlt, 
  faSignOutAlt, 
  faShieldAlt,
  faBars,
  faBell,
  faClipboardCheck,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faUser,
  faLock,
  faSearch,
  faPlus,
  faEllipsisV,
  faEdit,
  faTrash,
  faEye,
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faDownload,
  faGlobe,
  faSave,
  faTimes,
  faCheck,
  faCheckDouble,
  fasExclamationTriangle,
  faChevronLeft,
  faChevronRight,
  // Nouvelles icônes pour les modules premium
  faCamera,
  faIdCard,
  faSimCard,
  faCertificate,
  faFire,
  faCreditCard,
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
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ClientProvider>
          <EmployeeProvider>
            <TrainingProvider>
              <LeaveProvider>
                <ShiftProvider>
                  <EquipmentProvider>
                    <VehicleProvider>
                      <VisitorProvider>
                        <ComplianceProvider>
                          <ReportProvider>
                            <Router>
                              <Routes>
                                {/* Auth Route */}
                                <Route path="/login" element={<Login />} />
                                
                                {/* Root route redirects to login */}
                                <Route path="/" element={<Navigate to="/login" replace />} />
                                
                                {/* Protected Routes with Layout */}
                                <Route element={<Layout title="Tableau de Bord" />}>
                                  <Route path="/dashboard" element={<Dashboard />} />
                                  <Route path="/agents" element={<Agents />} />
                                  <Route path="/missions" element={<Missions />} />
                                  <Route path="/calendar" element={<Calendar />} />
                                  <Route path="/clients" element={<Clients />} />
                                  <Route path="/reports" element={<Reports />} />
                                  <Route path="/settings" element={<Settings />} />
                                  <Route path="/employees" element={<Employees />} />
                                  
                                  {/* Premium Module Routes */}
                                  <Route path="/premium/facial-recognition" element={<FacialRecognition />} />
                                  <Route path="/premium/accreditations" element={<Accreditations />} />
                                  <Route path="/premium/crisis-simulator" element={<CrisisSimulator />} />

                                  {/* New placeholder pages */}
                                  <Route path="/planning" element={<Planning />} />
                                  <Route path="/leaves" element={<Leaves />} />
                                  <Route path="/equipment" element={<Equipment />} />
                                  <Route path="/fleet" element={<Fleet />} />
                                  <Route path="/visitors" element={<Visitors />} />
                                  <Route path="/compliance" element={<Compliance />} />
                                  <Route path="/training" element={<Training />} />
                                  <Route path="/analytics" element={<Analytics />} />
                                  <Route path="/billing" element={<Billing />} />
                                  <Route path="/helpdesk" element={<HelpDesk />} />
                                  <Route path="/risk-management" element={<RiskManagement />} />
                                </Route>
                                
                                {/* Catch-all route */}
                                <Route path="*" element={<Navigate to="/login" replace />} />
                              </Routes>
                            </Router>
                            <ToastContainer
                              position="top-right"
                              autoClose={3000}
                              hideProgressBar={false}
                              newestOnTop
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                            />
                          </ReportProvider>
                        </ComplianceProvider>
                      </VisitorProvider>
                    </VehicleProvider>
                  </EquipmentProvider>
                </ShiftProvider>
              </LeaveProvider>
            </TrainingProvider>
          </EmployeeProvider>
        </ClientProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
