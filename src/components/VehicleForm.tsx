import React, { useState } from 'react';
import type { Vehicle, NewVehicle } from '../types/vehicle';

interface VehicleFormProps {
  vehicle?: Vehicle;
  isEdit?: boolean;
  onSubmit: (data: NewVehicle | Partial<Vehicle>) => Promise<void> | void;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, isEdit, onSubmit, onCancel }) => {
  const [data, setData] = useState<NewVehicle | Partial<Vehicle>>({
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    plate: vehicle?.plate ?? '',
    status: vehicle?.status ?? 'available',
    mileage: vehicle?.mileage ?? 0,
    lastServiceDate: vehicle?.lastServiceDate ?? new Date().toISOString().split('T')[0],
    notes: vehicle?.notes ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                name="make"
                value={data.make}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                name="model"
                value={data.model}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
              <input
                type="text"
                name="plate"
                value={data.plate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="status"
                value={data.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option value="available">Disponible</option>
                <option value="assigned">Assigné</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Hors service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
              <input
                type="number"
                name="mileage"
                value={data.mileage as any}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dernier entretien</label>
              <input
                type="date"
                name="lastServiceDate"
                value={data.lastServiceDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={data.notes}
              onChange={handleChange}
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue"
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm; 