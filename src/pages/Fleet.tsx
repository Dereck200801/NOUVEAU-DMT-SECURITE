import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCarSide } from '@fortawesome/free-solid-svg-icons';
import { useVehicles } from '../context/VehicleContext';
import { useEmployees } from '../context/EmployeeContext';
import VehicleForm from '../components/VehicleForm';
import type { Vehicle, NewVehicle } from '../types/vehicle';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const FleetPage: React.FC = () => {
  const { vehicles, add, update, remove } = useVehicles();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>('all');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; vehicle?: Vehicle }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (vehicle: Vehicle) => setModal({ mode: 'edit', vehicle });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: NewVehicle | Partial<Vehicle>) => {
    if (modal.mode === 'create') await add(data as NewVehicle);
    else if (modal.mode === 'edit' && modal.vehicle) await update(modal.vehicle.id, data);
    closeModal();
  };

  const filtered = vehicles.filter((v) => {
    const term = search.toLowerCase();
    const match =
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.plate.toLowerCase().includes(term) ||
      (v.notes ?? '').toLowerCase().includes(term);
    const statusMatch = statusFilter === 'all' || v.status === statusFilter;
    return match && statusMatch;
  });

  const statusBadge = (status: Vehicle['status']) => {
    const map: Record<
      Vehicle['status'],
      'success' | 'secondary' | 'warning' | 'destructive'
    > = {
      available: 'success',
      assigned: 'secondary',
      maintenance: 'warning',
      out_of_service: 'destructive',
    } as const;
    return (
      <Badge variant={map[status]} className="capitalize">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion de la Flotte</h1>
        <Button onClick={openCreate} className="gap-2 bg-yale-blue hover:bg-berkeley-blue text-white">
          <FontAwesomeIcon icon={faPlus} /> Nouveau véhicule
        </Button>
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
          <option value="available">Disponible</option>
          <option value="assigned">Assigné</option>
          <option value="maintenance">Maintenance</option>
          <option value="out_of_service">Hors service</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-yale-blue to-berkeley-blue text-sm text-white">
            <tr>
              <th className="text-left py-3 px-6 font-medium">Véhicule</th>
              <th className="text-left py-3 px-6 font-medium">Immatriculation</th>
              <th className="text-left py-3 px-6 font-medium">Statut</th>
              <th className="text-left py-3 px-6 font-medium hidden sm:table-cell">Assigné à</th>
              <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Km</th>
              <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Dernier entretien</th>
              <th className="text-left py-3 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const emp = employees.find((e) => e.id === v.assignedTo);
              return (
                <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm odd:bg-gray-50">
                  <td className="py-2.5 md:px-6 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCarSide} className="text-gray-400" /> {v.make} {v.model}
                  </td>
                  <td className="py-2.5 md:px-6">{v.plate}</td>
                  <td className="py-2.5 md:px-6">{statusBadge(v.status)}</td>
                  <td className="py-2.5 md:px-6 hidden sm:table-cell">{emp ? emp.name : '—'}</td>
                  <td className="py-2.5 md:px-6 hidden lg:table-cell">{v.mileage?.toLocaleString()} km</td>
                  <td className="py-2.5 md:px-6 hidden lg:table-cell">{v.lastServiceDate}</td>
                  <td className="py-2.5 md:px-6">
                    <button onClick={() => openEdit(v)} className="text-yale-blue hover:text-berkeley-blue mr-3">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce véhicule ?')) remove(v.id);
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
                  Aucun véhicule correspondant
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.mode && (
        <VehicleForm
          vehicle={modal.vehicle}
          isEdit={modal.mode === 'edit'}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default FleetPage; 