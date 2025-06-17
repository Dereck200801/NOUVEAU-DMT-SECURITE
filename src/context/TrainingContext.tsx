import React, { createContext, useContext, useEffect, useState } from 'react';
import trainingService from '../services/trainingService';
import type { Training } from '../types/training';

interface TrainingContextType {
  trainings: Training[];
  refresh: () => Promise<void>;
  add: (data: Omit<Training, 'id'>) => Promise<void>;
  update: (id: number, data: Partial<Training>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Training | undefined;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainings, setTrainings] = useState<Training[]>([]);

  const refresh = async () => {
    const list = await trainingService.getAllTrainings();
    setTrainings(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: Omit<Training, 'id'>) => {
    const created = await trainingService.createTraining(data);
    setTrainings((prev) => [...prev, created]);
  };

  const update = async (id: number, data: Partial<Training>) => {
    const updated = await trainingService.updateTraining(id, data);
    setTrainings((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const remove = async (id: number) => {
    await trainingService.deleteTraining(id);
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const getById = (id: number) => trainings.find((t) => t.id === id);

  const value: TrainingContextType = { trainings, refresh, add, update, remove, getById };

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
};

export const useTrainings = () => {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error('useTrainings must be used within TrainingProvider');
  return ctx;
}; 