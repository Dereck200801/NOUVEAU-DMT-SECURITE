import { api } from '../api';
import type { Employee, NewEmployee } from '../types/employee';

const BASE = '/employees';

const employeeService = {
  async list(): Promise<Employee[]> {
    const res = await api.get<Employee[]>(BASE);
    return res.data ?? [];
  },

  async get(id: number): Promise<Employee | null> {
    const res = await api.get<Employee>(`${BASE}/${id}`);
    return res.data ?? null;
  },

  async create(employee: NewEmployee): Promise<Employee | null> {
    const res = await api.post<Employee>(BASE, employee);
    return res.data ?? null;
  },

  async update(id: number, employee: Partial<Employee>): Promise<Employee | null> {
    const res = await api.put<Employee>(`${BASE}/${id}`, employee);
    return res.data ?? null;
  },

  async remove(id: number): Promise<boolean> {
    const res = await api.delete<void>(`${BASE}/${id}`);
    return res.success;
  },
};

export default employeeService; 