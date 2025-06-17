import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import type { Training } from '../types/training';
import { useEmployees } from '../context/EmployeeContext';

interface TrainingFormProps {
  training?: Training;
  onSubmit: (data: Omit<Training, 'id'> | Partial<Training>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ training, onSubmit, onCancel, isEdit = false }) => {
  const { employees } = useEmployees();

  const [formData, setFormData] = useState<Omit<Training, 'id'>>({
    name: '',
    description: '',
    agentId: employees[0]?.id ?? 0,
    agentName: employees[0]?.name ?? '',
    startDate: '',
    endDate: '',
    status: 'scheduled',
    score: undefined,
    provider: '',
    notes: '',
  });

  useEffect(() => {
    if (training) {
      const { id, ...rest } = training;
      setFormData({ ...rest });
    }
  }, [training]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = Number(e.target.value);
    const emp = employees.find((emp) => emp.id === empId);
    setFormData((prev) => ({ ...prev, agentId: empId, agentName: emp ? emp.name : '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Modifier une formation' : 'Ajouter une formation'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre de la formation</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Agent concerné</label>
            <select
              value={formData.agentId}
              onChange={handleEmployeeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="scheduled">Planifiée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Score (optionnel)</label>
            <input
              type="number"
              name="score"
              value={formData.score ?? ''}
              onChange={handleChange}
              min={0}
              max={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fournisseur / organisme</label>
            <input
              type="text"
              name="provider"
              value={formData.provider || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-4 py-2 text-sm">{isEdit ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingForm; 