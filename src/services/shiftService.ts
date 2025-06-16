import type { Shift, NewShift } from '../types/shift';

let SHIFTS: Shift[] = [
  {
    id: 1,
    employeeId: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '16:00',
    location: 'Site A',
    status: 'planned',
  },
  {
    id: 2,
    employeeId: 2,
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '00:00',
    location: 'Site B',
    status: 'planned',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const shiftService = {
  async list(): Promise<Shift[]> {
    await delay(300);
    return [...SHIFTS];
  },

  async create(data: NewShift): Promise<Shift> {
    await delay(300);
    const newShift: Shift = {
      id: SHIFTS.length ? Math.max(...SHIFTS.map((s) => s.id)) + 1 : 1,
      status: 'planned',
      ...data,
      status: data.status ?? 'planned',
    };
    SHIFTS.push(newShift);
    return newShift;
  },

  async update(id: number, data: Partial<Shift>): Promise<Shift | null> {
    await delay(300);
    const idx = SHIFTS.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    SHIFTS[idx] = { ...SHIFTS[idx], ...data } as Shift;
    return SHIFTS[idx];
  },

  async remove(id: number): Promise<boolean> {
    await delay(300);
    const before = SHIFTS.length;
    SHIFTS = SHIFTS.filter((s) => s.id !== id);
    return SHIFTS.length < before;
  },
};

export default shiftService; 