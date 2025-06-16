import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Vehicle, NewVehicle } from '../types/vehicle';
import vehicleService from '../services/vehicleService';

interface VehicleContextType {
  vehicles: Vehicle[];
  refresh: () => Promise<void>;
  add: (data: NewVehicle) => Promise<void>;
  update: (id: number, data: Partial<Vehicle>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Vehicle | undefined;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const refresh = async () => {
    const list = await vehicleService.list();
    setVehicles(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewVehicle) => {
    const v = await vehicleService.create(data);
    if (v) setVehicles((prev) => [...prev, v]);
  };

  const update = async (id: number, data: Partial<Vehicle>) => {
    const v = await vehicleService.update(id, data);
    if (v) setVehicles((prev) => prev.map((e) => (e.id === id ? v : e)));
  };

  const remove = async (id: number) => {
    const ok = await vehicleService.remove(id);
    if (ok) setVehicles((prev) => prev.filter((e) => e.id !== id));
  };

  const getById = (id: number) => vehicles.find((v) => v.id === id);

  const value: VehicleContextType = { vehicles, refresh, add, update, remove, getById };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};

export const useVehicles = () => {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error('useVehicles must be used within VehicleProvider');
  return ctx;
}; 