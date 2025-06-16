import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Visitor, NewVisitor } from '../types/visitor';
import visitorService from '../services/visitorService';

interface VisitorContextType {
  visitors: Visitor[];
  refresh: () => Promise<void>;
  add: (data: NewVisitor) => Promise<void>;
  update: (id: number, data: Partial<Visitor>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  getById: (id: number) => Visitor | undefined;
}

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  const refresh = async () => {
    const list = await visitorService.list();
    setVisitors(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewVisitor) => {
    const v = await visitorService.create(data);
    if (v) setVisitors((prev) => [...prev, v]);
  };

  const update = async (id: number, data: Partial<Visitor>) => {
    const v = await visitorService.update(id, data);
    if (v) setVisitors((prev) => prev.map((e) => (e.id === id ? v : e)));
  };

  const remove = async (id: number) => {
    const ok = await visitorService.remove(id);
    if (ok) setVisitors((prev) => prev.filter((e) => e.id !== id));
  };

  const getById = (id: number) => visitors.find((v) => v.id === id);

  const value: VisitorContextType = { visitors, refresh, add, update, remove, getById };

  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>;
};

export const useVisitors = () => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitors must be used within VisitorProvider');
  return ctx;
}; 