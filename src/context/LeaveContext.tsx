import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Leave, NewLeave } from '../types/leave';
import leaveService from '../services/leaveService';

interface LeaveContextType {
  leaves: Leave[];
  refresh: () => Promise<void>;
  add: (data: NewLeave) => Promise<void>;
  update: (id: number, data: Partial<Leave>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Leave | undefined;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const refresh = async () => {
    const list = await leaveService.list();
    setLeaves(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewLeave) => {
    const leave = await leaveService.create(data);
    if (leave) setLeaves((prev) => [...prev, leave]);
  };

  const update = async (id: number, data: Partial<Leave>) => {
    const leave = await leaveService.update(id, data);
    if (leave) setLeaves((prev) => prev.map((l) => (l.id === id ? leave : l)));
  };

  const remove = async (id: number) => {
    const ok = await leaveService.remove(id);
    if (ok) setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  const getById = (id: number) => leaves.find((l) => l.id === id);

  const value: LeaveContextType = { leaves, refresh, add, update, remove, getById };

  return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
};

export const useLeaves = () => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error('useLeaves must be used within LeaveProvider');
  return ctx;
}; 