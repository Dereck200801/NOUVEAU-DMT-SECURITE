import React, { useState } from 'react';
import type { ComplianceRecord, NewComplianceRecord } from '../types/compliance';
import { useEmployees } from '../context/EmployeeContext';

interface ComplianceFormProps {
  record?: ComplianceRecord;
  isEdit?: boolean;
  onSubmit: (data: NewComplianceRecord | Partial<ComplianceRecord>) => Promise<void> | void;
  onCancel: () => void;
}

const ComplianceForm: React.FC<ComplianceFormProps> = ({ record, isEdit, onSubmit, onCancel }) => {
  const { employees } = useEmployees();

  const [data, setData] = useState<NewComplianceRecord | Partial<ComplianceRecord>>({
    title: record?.title ?? '',
    complianceType: record?.complianceType ?? '',
    targetDate: record?.targetDate ?? new Date().toISOString().split('T')[0],
    ownerId: record?.ownerId,
    notes: record?.notes ?? '',
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
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Modifier un enregistrement' : 'Nouvelle conformité'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Titre"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="complianceType"
            value={data.complianceType}
            onChange={handleChange}
            placeholder="Type de conformité / audit"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="targetDate"
              value={data.targetDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
            <select
              name="ownerId"
              value={data.ownerId ?? ''}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            >
              <option value="">Responsable</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <textarea
            name="notes"
            value={data.notes}
            onChange={handleChange}
            placeholder="Notes"
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue">{isEdit ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplianceForm; 