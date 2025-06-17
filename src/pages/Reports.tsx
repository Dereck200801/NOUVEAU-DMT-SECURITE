import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faDownload, 
  faEye, 
  faFileAlt, 
  faCalendarAlt, 
  faUserShield, 
  faBuilding,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import DashboardCard from '../components/DashboardCard';
import ReportModal from '../components/ReportModal';
import NotificationToast from '../components/NotificationToast';
import { useReports } from '../hooks/useReports';
import { useNotifications } from '../context/NotificationContext';
import type { Report } from '../types/report';
import { exportReportsToPdf } from '../utils/pdfUtils';

// Function to get report status class
const getReportStatusClass = (status: Report['status']) => {
  switch (status) {
    case 'finalized':
      return 'bg-success/20 text-success';
    case 'in_review':
      return 'bg-warning/20 text-warning';
    case 'draft':
      return 'bg-gray-200 text-gray-500';
    case 'published':
      return 'bg-accent/20 text-accent';
    case 'archived':
      return 'bg-gray-200 text-gray-500';
    default:
      return 'bg-gray-200 text-gray-500';
  }
};

const Reports: React.FC = () => {
  const {
    reports,
    currentPage,
    totalPages,
    reportTypes,
    setCurrentPage,
    addReport,
    updateReport,
    deleteReport,
    downloadReport,
    getPaginatedReports,
  } = useReports();

  const {
    notifications,
    addNotification,
    removeNotification
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'view' | 'create' | 'edit';
    report?: Report;
  }>({
    isOpen: false,
    mode: 'view'
  });

  // Filter reports based on search term and type filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const currentMonthReports = reports.filter(report => {
    const reportDate = new Date(report.date.split('/').reverse().join('-'));
    const currentDate = new Date();
    return reportDate.getMonth() === currentDate.getMonth() &&
           reportDate.getFullYear() === currentDate.getFullYear();
  });

  const incidentReports = reports.filter(report => report.type === 'Incident');
  const finalizedReports = reports.filter(report => report.status === 'finalized');
  const inReviewReports = reports.filter(report => report.status === 'in_review');

  const handleSave = (reportData: Partial<Report>) => {
    if (modalState.mode === 'create') {
      addReport(reportData);
      addNotification({
        type: 'success',
        title: 'Rapport créé',
        message: `Le rapport "${reportData.title}" a été créé avec succès.`
      });
    } else if (modalState.mode === 'edit' && modalState.report) {
      updateReport(modalState.report.id, reportData);
      addNotification({
        type: 'success',
        title: 'Rapport modifié',
        message: `Le rapport "${reportData.title}" a été modifié avec succès.`
      });
    }
  };

  const handleDelete = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      deleteReport(id);
      addNotification({
        type: 'warning',
        title: 'Rapport supprimé',
        message: `Le rapport "${report?.title}" a été supprimé.`
      });
    }
  };

  const handleDownload = (id: number) => {
    downloadReport(id);
    const report = reports.find(r => r.id === id);
    addNotification({
      type: 'info',
      title: 'Téléchargement démarré',
      message: `Le rapport "${report?.title}" est en cours de téléchargement.`
    });
  };

  const handleExportPdf = () => {
    exportReportsToPdf('rapports.pdf', reports).then(() => {
      addNotification({
        type: 'success',
        title: 'Export PDF',
        message: 'Le fichier rapports.pdf a été généré et téléchargé.'
      });
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Rapports et Documents</h1>
        <div className="flex gap-3">
          <button 
            className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={() => setModalState({ isOpen: true, mode: 'create' })}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouveau rapport
          </button>
          <button
            className="bg-success hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={handleExportPdf}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Rapports ce mois"
          value={currentMonthReports.length}
          icon={faFileAlt}
          iconBgColor="bg-blue-100"
          iconColor="text-accent"
          borderColor="accent"
          change={{
            value: "25%",
            isPositive: true,
            text: "depuis le mois dernier"
          }}
        />
        
        <DashboardCard 
          title="Rapports d'incidents"
          value={incidentReports.length}
          icon={faFileAlt}
          iconBgColor="bg-red-100"
          iconColor="text-danger"
          borderColor="danger"
          change={{
            value: "1",
            isPositive: false,
            text: "depuis le mois dernier"
          }}
        />
        
        <DashboardCard 
          title="Rapports finalisés"
          value={finalizedReports.length}
          icon={faFileAlt}
          iconBgColor="bg-green-100"
          iconColor="text-success"
          borderColor="success"
          change={{
            value: "5",
            isPositive: true,
            text: "ce mois"
          }}
        />
        
        <DashboardCard 
          title="Rapports en revue"
          value={inReviewReports.length}
          icon={faFileAlt}
          iconBgColor="bg-yellow-100"
          iconColor="text-warning"
          borderColor="warning"
          change={{
            value: "2",
            isPositive: false,
            text: "en attente"
          }}
        />
      </div>
      
      {/* Filters section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Type filter */}
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Reports table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">TITRE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">TYPE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">DATE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">AUTEUR</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">TAILLE</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">STATUT</th>
                <th className="text-left py-4 px-6 font-medium text-sm text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedReports().map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="bg-accent/20 p-2 rounded mr-3">
                        <FontAwesomeIcon icon={faFileAlt} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{report.type}</td>
                  <td className="py-4 px-6 text-sm">{report.date}</td>
                  <td className="py-4 px-6 text-sm">{report.author}</td>
                  <td className="py-4 px-6 text-sm">{report.size}</td>
                  <td className="py-4 px-6">
                    <span className={`${getReportStatusClass(report.status)} text-xs rounded-full px-3 py-1`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        className="text-accent hover:text-blue-700"
                        onClick={() => setModalState({ isOpen: true, mode: 'view', report })}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        className="text-accent hover:text-blue-700"
                        onClick={() => handleDownload(report.id)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button
                        className="text-accent hover:text-blue-700"
                        onClick={() => import('../utils/pdfUtils').then(m => m.exportReportDetailsToPdf(report))}
                        title="Exporter le rapport en PDF"
                      >
                        <FontAwesomeIcon icon={faFileAlt} />
                      </button>
                      <button 
                        className="text-accent hover:text-blue-700"
                        onClick={() => setModalState({ isOpen: true, mode: 'edit', report })}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="text-danger hover:text-red-700"
                        onClick={() => handleDelete(report.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">{getPaginatedReports().length}</span> rapports sur <span className="font-medium">{filteredReports.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                  currentPage === page ? 'bg-accent text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'view' })}
        mode={modalState.mode}
        report={modalState.report}
        onSave={handleSave}
        reportTypes={reportTypes}
      />

      {/* Notifications */}
      {notifications.map((n) => (
        <NotificationToast
          key={n.id}
          show={true}
          message={n.message}
          type={n.type === 'danger' ? 'error' : n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
};

export default Reports; 