import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import EmployeeCard from '../components/EmployeeCard';
import type { Employee, NewEmployee } from '../types/employee';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeDetails from '../components/EmployeeDetails';

const Employees: React.FC = () => {
  const { employees, add, update, remove } = useEmployees();
  const [selected, setSelected] = useState<Employee | null>(null);
  const [mode, setMode] = useState<'view' | 'create' | 'edit' | null>(null);

  // Search & filter states for dynamic listing
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Employee['status']>('all');

  // Compute filtered employees list
  const filtered = employees.filter((emp) => {
    const term = search.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.phone.includes(term) ||
      emp.position.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const open = (m: 'view'|'create'|'edit', emp?: Employee) => {
    setSelected(emp ?? null);
    setMode(m);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Employés</h1>
        <button onClick={() => open('create')} className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue">+ Ajouter</button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'on_leave'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                statusFilter === s ? 'bg-yale-blue text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'Tous' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(emp => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onView={(e) => open('view', e)}
            onEdit={(e) => open('edit', e)}
            onDelete={(e) => remove(e.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-6">Aucun employé</p>
        )}
      </div>

      {mode === 'view' && selected && (
        <EmployeeDetails
          employee={selected}
          onClose={() => setMode(null)}
          onEdit={() => open('edit', selected)}
          onDelete={() => {
            remove(selected.id);
            setMode(null);
          }}
        />
      )}
      {mode === 'create' && (
        <EmployeeForm
          onCancel={() => setMode(null)}
          onSubmit={async (data) => {
            await add(data as NewEmployee);
            setMode(null);
          }}
        />
      )}
      {mode === 'edit' && selected && (
        <EmployeeForm
          employee={selected}
          isEdit
          onCancel={() => setMode(null)}
          onSubmit={async (data) => {
            await update(selected.id, data as Partial<Employee>);
            setMode(null);
          }}
        />
      )}
    </div>
  );
};

export default Employees; 