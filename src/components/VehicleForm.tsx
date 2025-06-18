import React, { useState } from 'react';
import type { Vehicle, NewVehicle } from '../types/vehicle';
import { useEmployees } from '../context/EmployeeContext';
import type { Document as VehicleDocument } from '../types/agent';

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
    assignedTo: vehicle?.assignedTo,
    photoUrl: vehicle?.photoUrl ?? '',
    documents: vehicle?.documents ?? [],
  });

  const { employees } = useEmployees();

  const [photoPreview, setPhotoPreview] = useState<string>(vehicle?.photoUrl ?? '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'mileage') {
      setData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'assignedTo') {
      setData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPhotoPreview(url);
      setData((prev) => ({ ...prev, photoUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newDocs: VehicleDocument[] = files.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      type: file.type || 'document',
      date: new Date().toISOString().split('T')[0],
      file,
    }));
    setData((prev) => ({
      ...prev,
      documents: [...(prev.documents ?? []), ...newDocs],
    }));
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
              <select
                name="assignedTo"
                value={data.assignedTo ?? ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option value="">— Non assigné —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo du véhicule</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {photoPreview && (
                <img src={photoPreview} alt="Prévisualisation" className="mt-2 h-32 object-contain rounded" />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Documents du véhicule</label>
              <input
                type="file"
                multiple
                onChange={handleDocumentsChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
              {data.documents && data.documents.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {data.documents.map((doc: VehicleDocument) => (
                    <li key={doc.id}>{doc.name}</li>
                  ))}
                </ul>
              )}
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