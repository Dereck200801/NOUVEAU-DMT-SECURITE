import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Shift, NewShift } from '../types/shift';
import shiftService from '../services/shiftService';

interface ShiftContextType {
  shifts: Shift[];
  refresh: () => Promise<void>;
  add: (data: NewShift) => Promise<void>;
  update: (id: number, data: Partial<Shift>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Shift | undefined;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  const refresh = async () => {
    const list = await shiftService.list();
    setShifts(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewShift) => {
    const sh = await shiftService.create(data);
    if (sh) setShifts((prev) => [...prev, sh]);
  };

  const update = async (id: number, data: Partial<Shift>) => {
    const sh = await shiftService.update(id, data);
    if (sh) setShifts((prev) => prev.map((s) => (s.id === id ? sh : s)));
  };

  const remove = async (id: number) => {
    const ok = await shiftService.remove(id);
    if (ok) setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const getById = (id: number) => shifts.find((s) => s.id === id);

  const value: ShiftContextType = { shifts, refresh, add, update, remove, getById };

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
};

export const useShifts = () => {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error('useShifts must be used within ShiftProvider');
  return ctx;
}; 