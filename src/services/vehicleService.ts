import type { Vehicle, NewVehicle } from '../types/vehicle';

let VEHICLES: Vehicle[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Hilux',
    plate: 'AA-123-BB',
    status: 'available',
    mileage: 45200,
    lastServiceDate: '2023-09-12',
  },
  {
    id: 2,
    make: 'Ford',
    model: 'Ranger',
    plate: 'CC-456-DD',
    status: 'maintenance',
    mileage: 60000,
    lastServiceDate: '2023-11-02',
    notes: 'Prochaine vidange à 65 000 km',
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const vehicleService = {
  async list(): Promise<Vehicle[]> {
    await delay(150);
    return [...VEHICLES];
  },
  async create(data: NewVehicle): Promise<Vehicle> {
    await delay(150);
    const veh: Vehicle = {
      id: VEHICLES.length ? Math.max(...VEHICLES.map((v) => v.id)) + 1 : 1,
      status: data.status ?? 'available',
      mileage: data.mileage ?? 0,
      lastServiceDate: data.lastServiceDate ?? new Date().toISOString().split('T')[0],
      ...data,
    } as Vehicle;
    VEHICLES.push(veh);
    return veh;
  },
  async update(id: number, data: Partial<Vehicle>): Promise<Vehicle | null> {
    await delay(150);
    const idx = VEHICLES.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    VEHICLES[idx] = { ...VEHICLES[idx], ...data } as Vehicle;
    return VEHICLES[idx];
  },
  async remove(id: number): Promise<boolean> {
    await delay(150);
    const before = VEHICLES.length;
    VEHICLES = VEHICLES.filter((v) => v.id !== id);
    return before > VEHICLES.length;
  },
};

export default vehicleService; 