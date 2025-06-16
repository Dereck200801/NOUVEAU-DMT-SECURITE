import type { Visitor, NewVisitor } from '../types/visitor';

let VISITORS: Visitor[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    company: 'TechCorp',
    visitDate: '2024-06-15',
    checkInTime: '09:05',
    status: 'checked_in',
    hostId: 2,
    purpose: 'Réunion projet',
    badgeNumber: 'V-001',
  },
  {
    id: 2,
    name: 'Maria Gomez',
    company: 'SecuritySoft',
    visitDate: '2024-06-15',
    status: 'expected',
    hostId: 3,
    purpose: 'Présentation commerciale',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const visitorService = {
  async list(): Promise<Visitor[]> {
    await delay(150);
    return [...VISITORS];
  },
  async create(data: NewVisitor): Promise<Visitor> {
    await delay(150);
    const visitor: Visitor = {
      id: VISITORS.length ? Math.max(...VISITORS.map((v) => v.id)) + 1 : 1,
      status: 'expected',
      ...data,
    } as Visitor;
    VISITORS.push(visitor);
    return visitor;
  },
  async update(id: number, data: Partial<Visitor>): Promise<Visitor | null> {
    await delay(150);
    const idx = VISITORS.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    VISITORS[idx] = { ...VISITORS[idx], ...data } as Visitor;
    return VISITORS[idx];
  },
  async remove(id: number): Promise<boolean> {
    await delay(150);
    const before = VISITORS.length;
    VISITORS = VISITORS.filter((v) => v.id !== id);
    return before > VISITORS.length;
  },
};

export default visitorService; 