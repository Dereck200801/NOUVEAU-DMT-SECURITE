import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Employee, NewEmployee } from '../types/employee';
import employeeService from '../services/employeeService';

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
    const list = await employeeService.list();
    setEmployees(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewEmployee) => {
    const emp = await employeeService.create(data);
    if (emp) setEmployees((prev) => [...prev, emp]);
  };

  const update = async (id: number, data: Partial<Employee>) => {
    const emp = await employeeService.update(id, data);
    if (emp) setEmployees((prev) => prev.map((e) => (e.id === id ? emp : e)));
  };

  const remove = async (id: number) => {
    const ok = await employeeService.remove(id);
    if (ok) setEmployees((prev) => prev.filter((e) => e.id !== id));
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