import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Equipment, NewEquipment } from '../types/equipment';
import equipmentService from '../services/equipmentService';

interface EquipmentContextType {
  equipments: Equipment[];
  refresh: () => Promise<void>;
  add: (data: NewEquipment) => Promise<void>;
  update: (id: number, data: Partial<Equipment>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const refresh = async () => {
    const list = await equipmentService.list();
    setEquipments(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewEquipment) => {
    const eq = await equipmentService.create(data);
    if (eq) setEquipments((prev) => [...prev, eq]);
  };

  const update = async (id: number, data: Partial<Equipment>) => {
    const eq = await equipmentService.update(id, data);
    if (eq) setEquipments((prev) => prev.map((e) => (e.id === id ? eq : e)));
  };

  const remove = async (id: number) => {
    const ok = await equipmentService.remove(id);
    if (ok) setEquipments((prev) => prev.filter((e) => e.id !== id));
  };

  const getById = (id: number) => equipments.find((e) => e.id === id);

  const value: EquipmentContextType = { equipments, refresh, add, update, remove, getById };

  return <EquipmentContext.Provider value={value}>{children}</EquipmentContext.Provider>;
};

export const useEquipments = () => {
  const ctx = useContext(EquipmentContext);
  if (!ctx) throw new Error('useEquipments must be used within EquipmentProvider');
  return ctx;
}; 