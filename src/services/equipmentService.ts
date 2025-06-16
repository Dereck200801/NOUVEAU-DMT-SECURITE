import type { Equipment, NewEquipment } from '../types/equipment';

let EQUIPMENTS: Equipment[] = [
  {
    id: 1,
    name: 'Radio Motorola XTS',
    serialNumber: 'RAD-001',
    category: 'radio',
    status: 'available',
    purchaseDate: '2023-02-15',
    notes: 'Remise annuelle effectuée',
  },
  {
    id: 2,
    name: 'Gilet pare-balles',
    serialNumber: 'GPB-045',
    category: 'protection',
    status: 'assigned',
    assignedTo: 1,
    purchaseDate: '2022-08-10',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const equipmentService = {
  async list(): Promise<Equipment[]> {
    await delay(200);
    return [...EQUIPMENTS];
  },
  async create(data: NewEquipment): Promise<Equipment> {
    await delay(200);
    const eq: Equipment = {
      id: EQUIPMENTS.length ? Math.max(...EQUIPMENTS.map((e) => e.id)) + 1 : 1,
      status: 'available',
      ...data,
      status: data.status ?? 'available',
    };
    EQUIPMENTS.push(eq);
    return eq;
  },
  async update(id: number, data: Partial<Equipment>): Promise<Equipment | null> {
    await delay(200);
    const idx = EQUIPMENTS.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    EQUIPMENTS[idx] = { ...EQUIPMENTS[idx], ...data } as Equipment;
    return EQUIPMENTS[idx];
  },
  async remove(id: number): Promise<boolean> {
    await delay(200);
    const before = EQUIPMENTS.length;
    EQUIPMENTS = EQUIPMENTS.filter((e) => e.id !== id);
    return before > EQUIPMENTS.length;
  },
};

export default equipmentService; 