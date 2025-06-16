import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLeaves } from '../context/LeaveContext';
import { useEmployees } from '../context/EmployeeContext';
import LeaveForm from '../components/LeaveForm';
import type { Leave, NewLeave } from '../types/leave';

const Leaves: React.FC = () => {
  const { leaves, add, update, remove } = useLeaves();
  const { employees } = useEmployees();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; leave?: Leave }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (leave: Leave) => setModal({ mode: 'edit', leave });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewLeave | Partial<Leave>) => {
    if (modal.mode === 'create') await add(data as NewLeave);
    else if (modal.mode === 'edit' && modal.leave) await update(modal.leave.id, data);
    closeModal();
  };

  const filtered = leaves.filter((l) => (filter === 'all' ? true : l.status === filter));

  const statusBadge = (status: Leave['status']) => {
    const map: Record<Leave['status'], string> = {
      pending: 'bg-warning/20 text-warning',
      approved: 'bg-success/20 text-success',
      rejected: 'bg-danger/20 text-danger',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>{status}</span>;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Congés & Indisponibilités</h1>
        <button
          onClick={openCreate}
          className="bg-yale-blue hover:bg-berkeley-blue text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouvelle demande
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
              filter === s ? 'bg-yale-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'Toutes' : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Employé</th>
              <th className="text-left py-3 px-6 font-medium">Période</th>
              <th className="text-left py-3 px-6 font-medium">Motif</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((leave) => {
              const emp = employees.find((e) => e.id === leave.employeeId);
              return (
                <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="py-3 px-6">{emp?.name ?? '—'}</td>
                  <td className="py-3 px-6">
                    {leave.startDate} → {leave.endDate}
                  </td>
                  <td className="py-3 px-6">{leave.reason}</td>
                  <td className="py-3 px-6">{statusBadge(leave.status)}</td>
                  <td className="py-3 px-6 flex items-center gap-3">
                    {leave.status === 'pending' && (
                      <>
                        <button
                          title="Approuver"
                          className="text-success hover:text-green-700"
                          onClick={() => update(leave.id, { status: 'approved' })}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          title="Rejeter"
                          className="text-danger hover:text-red-700"
                          onClick={() => update(leave.id, { status: 'rejected' })}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    )}
                    <button
                      title="Modifier"
                      className="text-yale-blue hover:text-berkeley-blue"
                      onClick={() => openEdit(leave)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      title="Supprimer"
                      className="text-danger hover:text-red-700"
                      onClick={() => {
                        if (confirm('Supprimer cette demande ?')) remove(leave.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Aucune demande
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.mode && (
        <LeaveForm
          isEdit={modal.mode === 'edit'}
          leave={modal.leave}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Leaves; 