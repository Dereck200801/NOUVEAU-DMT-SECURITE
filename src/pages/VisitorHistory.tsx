import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { useVisitors } from '../context/VisitorContext';
import { useEmployees } from '../context/EmployeeContext';
import type { Visitor } from '../types/visitor';
import { Link } from 'react-router-dom';

const VisitorHistoryPage: React.FC = () => {
  const { visitors } = useVisitors();
  const { employees } = useEmployees();

  // Filtres et états de recherche
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Visitor['status']>('all');

  const filtered = visitors
    .filter((v) => {
      // Recherche plein-texte
      const term = search.toLowerCase();
      const match =
        v.name.toLowerCase().includes(term) ||
        v.company.toLowerCase().includes(term) ||
        (v.purpose ?? '').toLowerCase().includes(term);

      // Filtres de dates
      const afterFrom = !fromDate || v.visitDate >= fromDate;
      const beforeTo = !toDate || v.visitDate <= toDate;

      // Filtre de statut
      const statusMatch = statusFilter === 'all' || v.status === statusFilter;

      return match && afterFrom && beforeTo && statusMatch;
    })
    .sort((a, b) => b.visitDate.localeCompare(a.visitDate));

  const statusBadge = (status: Visitor['status']) => {
    const map: Record<Visitor['status'], string> = {
      expected: 'bg-gray-200 text-gray-500',
      checked_in: 'bg-success/20 text-success',
      checked_out: 'bg-secondary/20 text-secondary',
      blacklisted: 'bg-danger/20 text-danger',
    };
    return (
      <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faHistory} className="text-yale-blue" />
          <h1 className="text-2xl font-bold">Historique des visites</h1>
        </div>
        <Link
          to="/visitors"
          className="text-sm text-yale-blue hover:underline whitespace-nowrap"
        >
          Retour au portail visiteurs
        </Link>
      </div>

      {/* Filtres */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Du"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Au"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="expected">Attendu</option>
          <option value="checked_in">Enregistré</option>
          <option value="checked_out">Sorti</option>
          <option value="blacklisted">Blacklisté</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Visiteur</th>
              <th className="text-left py-3 px-6 font-medium">Société</th>
              <th className="text-left py-3 px-6 font-medium">Date</th>
              <th className="text-left py-3 px-6 font-medium">Arrivée</th>
              <th className="text-left py-3 px-6 font-medium">Départ</th>
              <th className="text-left py-3 px-6 font-medium">Hôte</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const host = employees.find((e) => e.id === v.hostId);
              return (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="py-3 px-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDoorOpen} className="text-gray-400" /> {v.name}
                  </td>
                  <td className="py-3 px-6">{v.company}</td>
                  <td className="py-3 px-6">{v.visitDate}</td>
                  <td className="py-3 px-6">{v.checkInTime ?? '—'}</td>
                  <td className="py-3 px-6">{v.checkOutTime ?? '—'}</td>
                  <td className="py-3 px-6">{host ? host.name : '—'}</td>
                  <td className="py-3 px-6">{statusBadge(v.status)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Aucun enregistrement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorHistoryPage; 