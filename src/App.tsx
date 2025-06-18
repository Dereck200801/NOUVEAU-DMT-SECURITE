import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ClientProvider } from './context/ClientContext';
import { AgentProvider } from './context/AgentContext';
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
import Forbidden from './pages/Forbidden';
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
import VisitorHistory from './pages/VisitorHistory';
import Compliance from './pages/Compliance';
import Training from './pages/Training';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';
import HelpDesk from './pages/HelpDesk';
import RiskManagement from './pages/RiskManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { Permission } from './auth/rbac';

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
  faHistory,
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
  faHistory,
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ClientProvider>
          <AgentProvider>
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
                                    <Route
                                      path="/dashboard"
                                      element={
                                        <ProtectedRoute perm={Permission.DASHBOARD_VIEW}>
                                          <Dashboard />
                                        </ProtectedRoute>
                                      }
                                    />
                                    <Route
                                      path="/agents"
                                      element={<ProtectedRoute perm={Permission.EMPLOYEES_VIEW}><Agents /></ProtectedRoute>} />
                                    <Route
                                      path="/missions"
                                      element={
                                        <ProtectedRoute perm={Permission.MISSIONS_VIEW}>
                                          <Missions />
                                        </ProtectedRoute>
                                      }
                                    />
                                    <Route
                                      path="/calendar"
                                      element={<ProtectedRoute perm={Permission.MISSIONS_VIEW}><Calendar/></ProtectedRoute>} />
                                    <Route
                                      path="/clients"
                                      element={<ProtectedRoute perm={Permission.CLIENTS_VIEW}><Clients/></ProtectedRoute>} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route
                                      path="/employees"
                                      element={<ProtectedRoute perm={Permission.EMPLOYEES_VIEW}><Employees/></ProtectedRoute>} />
                                    
                                    {/* Premium Module Routes */}
                                    <Route path="/premium/facial-recognition" element={<FacialRecognition />} />
                                    <Route path="/premium/accreditations" element={<Accreditations />} />
                                    <Route path="/premium/crisis-simulator" element={<CrisisSimulator />} />

                                    {/* New placeholder pages */}
                                    <Route
                                      path="/planning"
                                      element={<ProtectedRoute perm={Permission.MISSIONS_VIEW}><Planning/></ProtectedRoute>} />
                                    <Route
                                      path="/leaves"
                                      element={<ProtectedRoute perm={Permission.EMPLOYEES_VIEW}><Leaves/></ProtectedRoute>} />
                                    <Route
                                      path="/equipment"
                                      element={<ProtectedRoute perm={Permission.EQUIPMENT_VIEW}><Equipment/></ProtectedRoute>} />
                                    <Route
                                      path="/fleet"
                                      element={<ProtectedRoute perm={Permission.FLEET_VIEW}><Fleet/></ProtectedRoute>} />
                                    <Route
                                      path="/visitors"
                                      element={<ProtectedRoute perm={Permission.VISITORS_VIEW}><Visitors/></ProtectedRoute>} />
                                    <Route
                                      path="/visitors/history"
                                      element={<ProtectedRoute perm={Permission.VISITORS_VIEW}><VisitorHistory/></ProtectedRoute>} />
                                    <Route
                                      path="/compliance"
                                      element={<ProtectedRoute perm={Permission.REPORTS_VIEW}><Compliance/></ProtectedRoute>} />
                                    <Route
                                      path="/training"
                                      element={<ProtectedRoute perm={Permission.EMPLOYEES_VIEW}><Training/></ProtectedRoute>} />
                                    <Route
                                      path="/analytics"
                                      element={<ProtectedRoute perm={Permission.DASHBOARD_VIEW}><Analytics/></ProtectedRoute>} />
                                    <Route
                                      path="/billing"
                                      element={<ProtectedRoute perm={Permission.CLIENTS_VIEW}><Billing/></ProtectedRoute>} />
                                    <Route
                                      path="/helpdesk"
                                      element={
                                        <ProtectedRoute perm={Permission.TICKETS_VIEW}>
                                          <HelpDesk />
                                        </ProtectedRoute>
                                      }
                                    />
                                    <Route
                                      path="/risk-management"
                                      element={<ProtectedRoute perm={Permission.MISSIONS_VIEW}><RiskManagement/></ProtectedRoute>} />
                                  </Route>
                                  
                                  {/* Access denied */}
                                  <Route path="/403" element={<Forbidden />} />

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
          </AgentProvider>
        </ClientProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
