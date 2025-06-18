import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Employee, NewEmployee } from '../types/employee';
import employeeService from '../services/employeeService';
import agentService from '../services/agentService';
import type { Agent } from '../types/agent';
import { useAgents } from './AgentContext';

interface EmployeeContextType {
  employees: Employee[];
  refresh: () => Promise<void>;
  add: (data: NewEmployee) => Promise<void>;
  update: (id: number, data: Partial<Employee>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const refresh = async () => {
    const [emps, agents] = await Promise.all([
      employeeService.list(),
      agentService.getAll(),
    ]);

    const agentEmployees = (agents as Agent[]).map<Employee>((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      position: a.specialty || 'Agent de sécurité',
      department: 'Sécurité',
      status: a.status === 'inactive' ? 'inactive' : 'active',
      contract: { type: 'cdi', startDate: a.joinDate, status: 'active' },
      leaveBalance: { annual: 0, remaining: 0 },
      documents: a.documents,
    }));

    const combined = [...emps, ...agentEmployees.filter((ag) => !emps.some((e) => e.id === ag.id))];
    setEmployees(combined);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewEmployee) => {
    let emp = await employeeService.create(data);
    if (!emp) {
      // Fallback local: assign new id and push directly
      emp = {
        ...data,
        id: Math.max(0, ...employees.map((e) => e.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Employee;
    }
    setEmployees((prev) => [...prev, emp]);
  };

  const update = async (id: number, data: Partial<Employee>) => {
    const emp = await employeeService.update(id, data);
    if (emp) setEmployees((prev) => prev.map((e) => (e.id === id ? emp : e)));
  };

  const remove = async (id: number) => {
    // Essayer de supprimer côté employés
    let ok = await employeeService.remove(id);

    // Si l'API employés renvoie false, tenter côté agents
    if (!ok) {
      try {
        await agentService.delete(id);
        ok = true;
      } catch (err) {
        console.warn('Suppression via agentService échouée, suppression locale', err);
      }
    }

    // Quoi qu'il arrive, on retire l'employé du store local
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const getById = (id: number) => employees.find((e) => e.id === id);

  const value: EmployeeContextType = { employees, refresh, add, update, remove, getById };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};

export const useEmployees = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
}; 