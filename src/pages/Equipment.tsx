import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { useEquipments } from '../context/EquipmentContext';
import { useEmployees } from '../context/EmployeeContext';
import EquipmentForm from '../components/EquipmentForm';
import type { Equipment, NewEquipment } from '../types/equipment';

const EquipmentPage: React.FC = () => {
  const { equipments, add, update, remove } = useEquipments();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Equipment['status']>('all');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; eq?: Equipment }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (eq: Equipment) => setModal({ mode: 'edit', eq });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewEquipment | Partial<Equipment>) => {
    if (modal.mode === 'create') await add(data as NewEquipment);
    else if (modal.mode === 'edit' && modal.eq) await update(modal.eq.id, data);
    closeModal();
  };

  const filtered = equipments.filter((e) => {
    const term = search.toLowerCase();
    const match =
      e.name.toLowerCase().includes(term) ||
      e.serialNumber.toLowerCase().includes(term) ||
      (e.notes ?? '').toLowerCase().includes(term);
    const statusMatch = filterStatus === 'all' || e.status === filterStatus;
    return match && statusMatch;
  });

  const statusBadge = (status: Equipment['status']) => {
    const map: Record<Equipment['status'], string> = {
      available: 'bg-success/20 text-success',
      assigned: 'bg-accent/20 text-accent',
      maintenance: 'bg-warning/20 text-warning',
      lost: 'bg-danger/20 text-danger',
    };
    return <span className={`${map[status]} text-xs rounded-full px-3 py-1 capitalize`}>{status}</span>;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Inventaire des Équipements</h1>
        <button onClick={openCreate} className="bg-yale-blue hover:bg-berkeley-blue text-white py-2 px-4 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouvel équipement
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="assigned">Assigné</option>
          <option value="maintenance">Maintenance</option>
          <option value="lost">Perdu</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-light text-sm text-gray-500">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Nom</th>
              <th className="text-left py-3 px-6 font-medium">Catégorie</th>
              <th className="text-left py-3 px-6 font-medium">N° Série</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium">Assigné à</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq) => {
              const emp = employees.find((e) => e.id === eq.assignedTo);
              return (
                <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                  <td className="py-3 px-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400" /> {eq.name}
                  </td>
                  <td className="py-3 px-6 capitalize">{eq.category}</td>
                  <td className="py-3 px-6">{eq.serialNumber}</td>
                  <td className="py-3 px-6">{statusBadge(eq.status)}</td>
                  <td className="py-3 px-6">{emp ? emp.name : '—'}</td>
                  <td className="py-3 px-6">
                    <button onClick={() => openEdit(eq)} className="text-yale-blue hover:text-berkeley-blue mr-3">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer cet équipement ?')) remove(eq.id);
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
                  Aucun équipement
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.mode && (
        <EquipmentForm
          equipment={modal.eq}
          isEdit={modal.mode === 'edit'}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default EquipmentPage; 