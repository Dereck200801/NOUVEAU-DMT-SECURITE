import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faExclamationTriangle,
  faShieldAlt,
  faCheckCircle,
  faEye,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import DashboardCard from '../components/DashboardCard';
import { useRisks } from '../hooks/useRisks';
import type { Risk } from '../types/risk';
import RiskModal from '../components/RiskModal';

// Utility to get color classes for severity
const getSeverityClass = (severity: Risk['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-danger/20 text-danger';
    case 'medium':
      return 'bg-warning/20 text-warning';
    case 'low':
    default:
      return 'bg-success/20 text-success';
  }
};

const RiskManagement: React.FC = () => {
  const {
    risks,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    addRisk,
    updateRisk,
    deleteRisk,
    riskCategories,
  } = useRisks();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | Risk['severity']>('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'view' | 'create' | 'edit';
    risk?: Risk;
  }>({
    isOpen: false,
    mode: 'view',
  });

  // Filtered risks
  const filteredRisks = risks.filter((risk) => {
    const matchesSearch =
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || risk.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Paginated risks based on filters
  const paginatedRisks = filteredRisks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const highRisks = risks.filter((r) => r.severity === 'high');
  const mitigatedRisks = risks.filter((r) => r.status === 'mitigated');

  const handleSave = (riskData: Partial<Risk>) => {
    if (modalState.mode === 'create') {
      addRisk(riskData);
    } else if (modalState.mode === 'edit' && modalState.risk) {
      updateRisk(modalState.risk.id, riskData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce risque ?')) {
      deleteRisk(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Risques & Cartographie des Menaces</h1>
        <button
          className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          onClick={() => setModalState({ isOpen: true, mode: 'create' })}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nouveau risque
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Risques totaux"
          value={risks.length}
          icon={faExclamationTriangle}
          iconBgColor="bg-red-100"
          iconColor="text-danger"
          borderColor="danger"
        />
        <DashboardCard
          title="Risques élevés"
          value={highRisks.length}
          icon={faExclamationTriangle}
          iconBgColor="bg-yellow-100"
          iconColor="text-warning"
          borderColor="warning"
        />
        <DashboardCard
          title="Risques mitigés"
          value={mitigatedRisks.length}
          icon={faCheckCircle}
          iconBgColor="bg-green-100"
          iconColor="text-success"
          borderColor="success"
        />
        <DashboardCard
          title="Catégories"
          value={riskCategories.length}
          icon={faShieldAlt}
          iconBgColor="bg-blue-100"
          iconColor="text-accent"
          borderColor="accent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un risque..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-52">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="all">Toutes les sévérités</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>
      </div>

      {/* Risks table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sévérité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedRisks.map((risk) => (
                <tr key={risk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {risk.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {risk.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getSeverityClass(risk.severity)} text-xs rounded-full px-3 py-1 capitalize`}>
                      {risk.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {risk.dateIdentified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-700">
                    {risk.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        className="text-accent hover:text-blue-700"
                        onClick={() => setModalState({ isOpen: true, mode: 'view', risk })}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="text-accent hover:text-blue-700"
                        onClick={() => setModalState({ isOpen: true, mode: 'edit', risk })}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="text-danger hover:text-red-700"
                        onClick={() => handleDelete(risk.id)}
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
        <div className="p-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Affichage de {paginatedRisks.length} risque{paginatedRisks.length > 1 ? 's' : ''} sur {filteredRisks.length}
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </button>
            {Array.from({ length: Math.ceil(filteredRisks.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage === Math.ceil(filteredRisks.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Risk Modal */}
      <RiskModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'view' })}
        mode={modalState.mode}
        risk={modalState.risk}
        onSave={handleSave}
        categories={riskCategories}
      />
    </div>
  );
};

export default RiskManagement; 