import React, { useState } from 'react';
import type { Visitor, NewVisitor } from '../types/visitor';
import { useEmployees } from '../context/EmployeeContext';

interface VisitorFormProps {
  visitor?: Visitor;
  isEdit?: boolean;
  onSubmit: (data: NewVisitor | Partial<Visitor>) => Promise<void> | void;
  onCancel: () => void;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ visitor, isEdit, onSubmit, onCancel }) => {
  const { employees } = useEmployees();

  const [data, setData] = useState<NewVisitor | Partial<Visitor>>({
    name: visitor?.name ?? '',
    company: visitor?.company ?? '',
    visitDate: visitor?.visitDate ?? new Date().toISOString().split('T')[0],
    hostId: visitor?.hostId,
    purpose: visitor?.purpose ?? '',
    badgeNumber: visitor?.badgeNumber ?? '',
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
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Modifier un visiteur' : 'Enregistrer un visiteur'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Société</label>
              <input
                type="text"
                name="company"
                value={data.company}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de visite</label>
              <input
                type="date"
                name="visitDate"
                value={data.visitDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hôte</label>
              <select
                name="hostId"
                value={data.hostId ?? ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              >
                <option value="">-- Sélectionner --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
              <input
                type="text"
                name="purpose"
                value={data.purpose}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                type="text"
                name="badgeNumber"
                value={data.badgeNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            </div>
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

export default VisitorForm; 