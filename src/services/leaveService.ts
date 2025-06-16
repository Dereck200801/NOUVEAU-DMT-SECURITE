import type { Leave, NewLeave } from '../types/leave';

let LEAVES: Leave[] = [
  {
    id: 1,
    employeeId: 1,
    startDate: '2024-07-01',
    endDate: '2024-07-10',
    reason: 'Vacances',
    status: 'approved',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const leaveService = {
  async list(): Promise<Leave[]> {
    await delay(300);
    return [...LEAVES];
  },

  async create(data: NewLeave): Promise<Leave> {
    await delay(300);
    const leave: Leave = {
      id: LEAVES.length ? Math.max(...LEAVES.map((l) => l.id)) + 1 : 1,
      status: 'pending',
      ...data,
      status: data.status ?? 'pending',
    };
    LEAVES.push(leave);
    return leave;
  },

  async update(id: number, data: Partial<Leave>): Promise<Leave | null> {
    await delay(300);
    const idx = LEAVES.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    LEAVES[idx] = { ...LEAVES[idx], ...data } as Leave;
    return LEAVES[idx];
  },

  async remove(id: number): Promise<boolean> {
    await delay(300);
    const before = LEAVES.length;
    LEAVES = LEAVES.filter((l) => l.id !== id);
    return LEAVES.length < before;
  },
};

export default leaveService; 