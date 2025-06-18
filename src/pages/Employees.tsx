import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import EmployeeCard from '../components/EmployeeCard';
import type { Employee, NewEmployee } from '../types/employee';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeDetails from '../components/EmployeeDetails';
import agentService from '../services/agentService';
import { useAgents } from '../context/AgentContext';
import AgentSummary from '../components/AgentSummary';
import type { Agent as AgentType } from '../types/agent';

const Employees: React.FC = () => {
  const { employees, add, update, remove, refresh } = useEmployees();
  const { removeAgent, addAgent, refresh: refreshAgents } = useAgents();
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

  // Helper to identify security agents
  const isSecurityAgent = (emp: Employee) => {
    const deptMatch = emp.department?.toLowerCase() === 'sécurité';
    const positionMatch = /agent\s*de\s*sécurité/i.test(emp.position);
    return deptMatch || positionMatch;
  };

  // Separate lists
  const agentsList = filtered.filter(isSecurityAgent);
  const otherEmployeesList = filtered.filter((e) => !isSecurityAgent(e));

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [showAgentSummary, setShowAgentSummary] = useState<AgentType | null>(null);

  const open = (m: 'view'|'create'|'edit', emp?: Employee) => {
    if (emp && isSecurityAgent(emp) && m === 'view') {
      // ouvrir résumé agent
      setShowAgentSummary(emp as unknown as AgentType);
      return;
    }
    setSelected(emp ?? null);
    setMode(m);
  };

  const handleDelete = async (emp: Employee) => {
    setDeletingIds((prev) => new Set(prev).add(emp.id));
    if (isSecurityAgent(emp)) {
      await removeAgent(emp.id);
    }
    await remove(emp.id);
    setDeletingIds((prev) => {
      const s = new Set(prev);
      s.delete(emp.id);
      return s;
    });
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

      {/* Employee grids */}

      {/* Agents section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Agents</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {agentsList.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onView={(e) => open('view', e)}
              onEdit={undefined}
              onDelete={undefined}
              isDeleting={deletingIds.has(emp.id)}
            />
          ))}
          {agentsList.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-6">Aucun agent</p>
          )}
        </div>
      </div>

      {/* Other Employees section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Autres employés</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {otherEmployeesList.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onView={(e) => open('view', e)}
              onEdit={(e) => open('edit', e)}
              onDelete={handleDelete}
              isDeleting={deletingIds.has(emp.id)}
            />
          ))}
          {otherEmployeesList.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-6">Aucun employé</p>
          )}
        </div>
      </div>

      {mode === 'view' && selected && !isSecurityAgent(selected) && (
        <EmployeeDetails
          employee={selected}
          onClose={() => setMode(null)}
          onEdit={() => open('edit', selected)}
          onDelete={() => {
            handleDelete(selected);
            setMode(null);
          }}
        />
      )}

      {/* Dossier agent */}
      {showAgentSummary && (
        <AgentSummary agent={showAgentSummary as AgentType} onClose={() => setShowAgentSummary(null)} />
      )}

      {mode === 'create' && (
        <EmployeeForm
          onCancel={() => setMode(null)}
          onSubmit={async ({ employeeType, data }) => {
            if (employeeType === 'agent') {
              // Map minimal fields to agent structure
              const agentPayload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                status: (data as Employee).status ?? 'active',
                specialty: (data as Employee).position || 'Surveillance',
                joinDate:
                  (data as Employee).contract?.startDate || new Date().toLocaleDateString('fr-FR'),
                documents: (data as Employee).documents,
              } as any;

              try {
                await agentService.create(agentPayload);
                await refreshAgents();
              } catch (err) {
                // Fallback: ajouter localement via contexts
                const localId = Math.max(0, ...employees.map((e) => e.id)) + 1;
                const localEmp: Employee = {
                  id: localId,
                  name: agentPayload.name,
                  email: agentPayload.email,
                  phone: agentPayload.phone,
                  position: 'Agent de sécurité',
                  department: 'Sécurité',
                  status: agentPayload.status as any,
                  contract: { type: 'cdi', startDate: agentPayload.joinDate, status: 'active' },
                  leaveBalance: { annual: 0, remaining: 0 },
                  documents: agentPayload.documents,
                };
                addAgent({
                  id: localId,
                  name: agentPayload.name,
                  email: agentPayload.email,
                  phone: agentPayload.phone,
                  status: agentPayload.status,
                  specialty: agentPayload.specialty,
                  joinDate: agentPayload.joinDate,
                  documents: agentPayload.documents,
                } as any);
                await add(localEmp as unknown as NewEmployee);
              }
              // Rafraîchir EmployeeContext pour refléter l'ajout
              await Promise.all([refreshAgents(), refresh()]);
            } else {
              await add(data as NewEmployee);
            }
            setMode(null);
          }}
        />
      )}
      {mode === 'edit' && selected && (
        <EmployeeForm
          employee={selected}
          isEdit
          onCancel={() => setMode(null)}
          onSubmit={async ({ employeeType, data }) => {
            if (employeeType === 'agent' || isSecurityAgent(selected)) {
              await agentService.update(selected.id, data as any);
              await Promise.all([refreshAgents(), refresh()]);
            } else {
              await update(selected.id, data as Partial<Employee>);
            }
            setMode(null);
          }}
        />
      )}
    </div>
  );
};

export default Employees; 