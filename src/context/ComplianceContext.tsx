import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ComplianceRecord, NewComplianceRecord } from '../types/compliance';
import complianceService from '../services/complianceService';

interface ComplianceContextType {
  records: ComplianceRecord[];
  refresh: () => Promise<void>;
  add: (data: NewComplianceRecord) => Promise<void>;
  update: (id: number, data: Partial<ComplianceRecord>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  const refresh = async () => {
    const list = await complianceService.list();
    setRecords(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (data: NewComplianceRecord) => {
    const rec = await complianceService.create(data);
    if (rec) setRecords((prev) => [...prev, rec]);
  };

  const update = async (id: number, data: Partial<ComplianceRecord>) => {
    const rec = await complianceService.update(id, data);
    if (rec) setRecords((prev) => prev.map((r) => (r.id === id ? rec : r)));
  };

  const remove = async (id: number) => {
    const ok = await complianceService.remove(id);
    if (ok) setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const value: ComplianceContextType = { records, refresh, add, update, remove };

  return <ComplianceContext.Provider value={value}>{children}</ComplianceContext.Provider>;
};

export const useCompliance = () => {
  const ctx = useContext(ComplianceContext);
  if (!ctx) throw new Error('useCompliance must be used within ComplianceProvider');
  return ctx;
}; 