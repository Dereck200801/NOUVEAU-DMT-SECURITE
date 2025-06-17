import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { useCompliance } from '../context/ComplianceContext';
import { useEmployees } from '../context/EmployeeContext';
import ComplianceForm from '../components/ComplianceForm';
import type { ComplianceRecord, NewComplianceRecord } from '../types/compliance';

const CompliancePage: React.FC = () => {
  const { records, add, update, remove } = useCompliance();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplianceRecord['status']>('all');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; record?: ComplianceRecord }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (record: ComplianceRecord) => setModal({ mode: 'edit', record });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewComplianceRecord | Partial<ComplianceRecord>) => {
    if (modal.mode === 'create') await add(data as NewComplianceRecord);
    else if (modal.mode === 'edit' && modal.record) await update(modal.record.id, data);
    closeModal();
  };

  const filtered = records.filter((r) => {
    const term = search.toLowerCase();
    const match =
      r.title.toLowerCase().includes(term) ||
      r.complianceType.toLowerCase().includes(term) ||
      (r.notes ?? '').toLowerCase().includes(term);
    const statusMatch = statusFilter === 'all' || r.status === statusFilter;
    return match && statusMatch;
  });

  const statusBadge = (status: ComplianceRecord['status']) => {
    const map: Record<ComplianceRecord['status'], string> = {
      pending: 'bg-gray-200 text-gray-500',
      in_progress: 'bg-warning/20 text-warning',
      passed: 'bg-success/20 text-success',
      failed: 'bg-danger/20 text-danger',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>{status.replace(/_/g,' ')}</span>;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Conformité & Audits</h1>
        <button onClick={openCreate} className="bg-yale-blue hover:bg-berkeley-blue text-white py-2 px-4 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouvel enregistrement
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
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="passed">Validé</option>
          <option value="failed">Échoué</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Titre</th>
              <th className="text-left py-3 px-6 font-medium">Type</th>
              <th className="text-left py-3 px-6 font-medium">Date cible</th>
              <th className="text-left py-3 px-6 font-medium">Responsable</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const owner = employees.find((e) => e.id === r.ownerId);
              return (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="py-3 px-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClipboardList} className="text-gray-400" /> {r.title}
                  </td>
                  <td className="py-3 px-6">{r.complianceType}</td>
                  <td className="py-3 px-6">{r.targetDate}</td>
                  <td className="py-3 px-6">{owner ? owner.name : '—'}</td>
                  <td className="py-3 px-6">{statusBadge(r.status)}</td>
                  <td className="py-3 px-6">
                    <button onClick={() => openEdit(r)} className="text-yale-blue hover:text-berkeley-blue mr-3">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer cet enregistrement ?')) remove(r.id);
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
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Aucun enregistrement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.mode && (
        <ComplianceForm
          record={modal.record}
          isEdit={modal.mode === 'edit'}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CompliancePage; 