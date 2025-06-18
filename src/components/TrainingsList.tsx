import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faUser, faCalendarAlt, faGraduationCap, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import trainingService from '../services/trainingService';
import type { Training, TrainingFilters } from '../types/training';
import Loader from './ui/loader';

const TrainingsList: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Training['status']>('all');

  const fetchTrainings = async (filters?: TrainingFilters) => {
    try {
      setLoading(true);
      const data = await trainingService.getAllTrainings(filters);
      if (Array.isArray(data)) {
        setTrainings(data);
        setError(null);
      } else {
        console.warn('Les données reçues ne sont pas un tableau');
        setTrainings([]);
        setError('Format de données incorrect');
      }
    } catch (e) {
      console.error(e);
      setError('Impossible de charger les formations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters: TrainingFilters = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;
    fetchTrainings(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: TrainingFilters = {};
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;
    fetchTrainings(filters);
  };

  const statusBadge = (status: Training['status']) => {
    const map: Record<Training['status'], string> = {
      completed: 'bg-success/20 text-success',
      in_progress: 'bg-warning/20 text-warning',
      scheduled: 'bg-gray-200 text-gray-600',
    };
    const labelMap: Record<Training['status'], string> = {
      completed: 'Terminée',
      in_progress: 'En cours',
      scheduled: 'Planifiée',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1`}>{labelMap[status]}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header & actions */}
      <div className="border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faGraduationCap} /> Formations
        </h2>
        <button className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-3 py-2 text-sm flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouvelle formation
        </button>
      </div>

      {/* Filtres */}
      <div className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center relative">
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yale-blue"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 text-gray-400" />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="completed">Terminée</option>
          <option value="in_progress">En cours</option>
          <option value="scheduled">Planifiée</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center">
          <Loader label="Chargement des formations..." />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-danger">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-light text-xs text-gray-500">
              <tr>
                <th className="text-left py-3 px-6 font-medium">Formation</th>
                <th className="text-left py-3 px-6 font-medium">Agent</th>
                <th className="text-left py-3 px-6 font-medium">Dates</th>
                <th className="text-left py-3 px-6 font-medium">Statut</th>
                <th className="text-left py-3 px-6 font-medium">Score</th>
                <th className="text-left py-3 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 flex items-center gap-2 align-middle whitespace-nowrap">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-yale-blue" /> {t.name}
                  </td>
                  <td className="py-3 px-6 flex items-center gap-2 align-middle whitespace-nowrap">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" /> {t.agentName}
                  </td>
                  <td className="py-3 px-6 align-middle whitespace-nowrap text-xs">
                    <div className="flex items-center gap-2 text-xs">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                      {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-6 align-middle">{statusBadge(t.status)}</td>
                  <td className="py-3 px-6 text-center align-middle whitespace-nowrap">{t.score ?? '—'}</td>
                  <td className="py-3 px-6 text-right space-x-3 align-middle">
                    <button className="text-yale-blue hover:text-berkeley-blue"><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="text-danger hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                  </td>
                </tr>
              ))}
              {trainings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Aucune formation trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainingsList; 