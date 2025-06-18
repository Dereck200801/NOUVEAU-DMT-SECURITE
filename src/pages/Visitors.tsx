import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDoorOpen, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useVisitors } from '../context/VisitorContext';
import { useEmployees } from '../context/EmployeeContext';
import VisitorForm from '../components/VisitorForm';
import type { Visitor, NewVisitor } from '../types/visitor';
import { Link } from 'react-router-dom';

const VisitorsPage: React.FC = () => {
  const { visitors, add, update, remove } = useVisitors();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Visitor['status']>('all');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; visitor?: Visitor }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (visitor: Visitor) => setModal({ mode: 'edit', visitor });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewVisitor | Partial<Visitor>) => {
    if (modal.mode === 'create') await add(data as NewVisitor);
    else if (modal.mode === 'edit' && modal.visitor) await update(modal.visitor.id, data);
    closeModal();
  };

  const handleCheckOut = async (visitor: Visitor) => {
    if (visitor.status !== 'checked_in') return;
    await update(visitor.id, {
      status: 'checked_out',
      checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleCheckIn = async (visitor: Visitor) => {
    if (visitor.status !== 'expected') return;
    await update(visitor.id, {
      status: 'checked_in',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const filtered = visitors.filter((v) => {
    if (v.status === 'checked_out') return false;
    const term = search.toLowerCase();
    const match =
      v.name.toLowerCase().includes(term) ||
      v.company.toLowerCase().includes(term) ||
      (v.purpose ?? '').toLowerCase().includes(term);
    const statusMatch = statusFilter === 'all' || v.status === statusFilter;
    return match && statusMatch;
  });

  const statusBadge = (status: Visitor['status']) => {
    const map: Record<Visitor['status'], string> = {
      expected: 'bg-gray-200 text-gray-500',
      checked_in: 'bg-success/20 text-success',
      checked_out: 'bg-secondary/20 text-secondary',
      blacklisted: 'bg-danger/20 text-danger',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>{status.replace(/_/g,' ')}</span>;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Portail Visiteurs</h1>
          <Link
            to="/visitors/history"
            className="text-sm text-yale-blue hover:underline whitespace-nowrap"
          >
            Voir l'historique
          </Link>
        </div>
        <button onClick={openCreate} className="bg-yale-blue hover:bg-berkeley-blue text-white py-2 px-4 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouveau visiteur
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="expected">Attendu</option>
          <option value="checked_in">Enregistré</option>
          <option value="blacklisted">Blacklisté</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Visiteur</th>
              <th className="mobile-hide text-left py-3 px-6 font-medium">Société</th>
              <th className="mobile-hide text-left py-3 px-6 font-medium">Date</th>
              <th className="mobile-hide text-left py-3 px-6 font-medium">Arrivée</th>
              <th className="mobile-hide text-left py-3 px-6 font-medium">Hôte</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
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
                  <td className="mobile-hide py-3 px-6">{v.company}</td>
                  <td className="mobile-hide py-3 px-6">{v.visitDate}</td>
                  <td className="mobile-hide py-3 px-6">{v.checkInTime ?? '—'}</td>
                  <td className="mobile-hide py-3 px-6">{host ? host.name : '—'}</td>
                  <td className="py-3 px-6">{statusBadge(v.status)}</td>
                  <td className="py-3 px-6 flex gap-3">
                    {v.status === 'expected' && (
                      <button
                        title="Enregistrer l'arrivée"
                        onClick={() => handleCheckIn(v)}
                        className="text-success hover:text-berkeley-blue"
                      >
                        <FontAwesomeIcon icon={faSignInAlt} />
                      </button>
                    )}
                    {v.status === 'checked_in' && (
                      <button
                        title="Marquer sortie"
                        onClick={() => handleCheckOut(v)}
                        className="text-secondary hover:text-berkeley-blue"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                      </button>
                    )}
                    <button onClick={() => openEdit(v)} className="text-yale-blue hover:text-berkeley-blue">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer cet enregistrement visiteur ?')) remove(v.id);
                      }}
                      className="text-danger hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Aucun visiteur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.mode && (
        <VisitorForm
          visitor={modal.visitor}
          isEdit={modal.mode === 'edit'}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default VisitorsPage; 