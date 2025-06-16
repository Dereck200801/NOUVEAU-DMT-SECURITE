import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Equipment, NewEquipment } from '../types/equipment';
import { useEmployees } from '../context/EmployeeContext';

interface EquipmentFormProps {
  equipment?: Equipment;
  isEdit?: boolean;
  onSubmit: (data: NewEquipment | Partial<Equipment>) => void;
  onCancel: () => void;
}

const defaultData: NewEquipment = {
  name: '',
  serialNumber: '',
  category: 'other',
  purchaseDate: '',
};

const categories = ['uniform', 'radio', 'vehicle', 'protection', 'other'];
const statuses: Equipment['status'][] = ['available', 'assigned', 'maintenance', 'lost'];

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, isEdit = false, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewEquipment | Partial<Equipment>>(defaultData);
  const { employees } = useEmployees();

  useEffect(() => {
    if (equipment) setFormData({ ...equipment });
  }, [equipment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Éditer équipement' : 'Nouvel équipement'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">N° de série</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select name="status" value={formData.status ?? 'available'} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assigné à (ID employé)</label>
              <select name="assignedTo" value={formData.assignedTo ?? ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">-- Aucun --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date d'achat</label>
            <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea name="notes" value={formData.notes ?? ''} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-yale-blue text-white rounded-lg text-sm">
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentForm; 