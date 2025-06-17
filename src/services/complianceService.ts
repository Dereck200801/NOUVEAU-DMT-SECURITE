import type { ComplianceRecord, NewComplianceRecord } from '../types/compliance';

let RECORDS: ComplianceRecord[] = [
  {
    id: 1,
    title: 'Audit interne Q2',
    complianceType: 'Audit interne',
    targetDate: '2024-07-31',
    status: 'in_progress',
    ownerId: 1,
  },
  {
    id: 2,
    title: 'Certification ISO 9001',
    complianceType: 'ISO 9001',
    targetDate: '2024-12-15',
    status: 'pending',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const complianceService = {
  async list(): Promise<ComplianceRecord[]> {
    await delay(150);
    return [...RECORDS];
  },
  async create(data: NewComplianceRecord): Promise<ComplianceRecord> {
    await delay(150);
    const rec: ComplianceRecord = {
      id: RECORDS.length ? Math.max(...RECORDS.map((r) => r.id)) + 1 : 1,
      status: 'pending',
      ...data,
    } as ComplianceRecord;
    RECORDS.push(rec);
    return rec;
  },
  async update(id: number, data: Partial<ComplianceRecord>): Promise<ComplianceRecord | null> {
    await delay(150);
    const idx = RECORDS.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    RECORDS[idx] = { ...RECORDS[idx], ...data } as ComplianceRecord;
    return RECORDS[idx];
  },
  async remove(id: number): Promise<boolean> {
    await delay(150);
    const before = RECORDS.length;
    RECORDS = RECORDS.filter((r) => r.id !== id);
    return before > RECORDS.length;
  },
};

export default complianceService; 