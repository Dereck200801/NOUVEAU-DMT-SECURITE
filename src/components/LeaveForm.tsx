import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import type { Leave, NewLeave } from '../types/leave';

interface LeaveFormProps {
  leave?: Leave;
  isEdit?: boolean;
  onSubmit: (data: NewLeave | Partial<Leave>) => void;
  onCancel: () => void;
}

const defaultData: NewLeave = {
  employeeId: 0,
  startDate: '',
  endDate: '',
  reason: '',
  status: 'pending',
};

const LeaveForm: React.FC<LeaveFormProps> = ({ leave, onSubmit, onCancel, isEdit = false }) => {
  const { employees } = useEmployees();
  const { user } = useAuth();
  const [formData, setFormData] = useState<NewLeave | Partial<Leave>>(defaultData);

  useEffect(() => {
    if (leave) setFormData({ ...leave });
  }, [leave]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Déterminer si l'utilisateur connecté est un administrateur
  const isAdmin = user?.role === 'admin';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Modifier la demande' : 'Nouvelle demande de congé'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employé</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">-- Sélectionner --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Début</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motif</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select
                name="status"
                value={(formData as any).status ?? 'pending'}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-yale-blue text-white rounded-lg text-sm">
              {isEdit ? 'Enregistrer' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm; 