import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AccreditationType } from '../types/accreditation';
import { useEmployees } from '../context/EmployeeContext';

interface AccreditationFormData {
  agentId: number;
  agentName: string;
  type: AccreditationType;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  file?: File;
}

interface AccreditationFormProps {
  onSubmit: (data: AccreditationFormData) => void;
  onCancel: () => void;
}

const AccreditationForm: React.FC<AccreditationFormProps> = ({ onSubmit, onCancel }) => {
  const { employees } = useEmployees();

  const [formData, setFormData] = useState<AccreditationFormData>({
    agentId: employees[0]?.id ?? 0,
    agentName: employees[0]?.name ?? '',
    type: 'certification',
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
  });

  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    if (!formData.agentName && employees.length > 0) {
      setFormData((prev) => ({ ...prev, agentId: employees[0].id, agentName: employees[0].name }));
    }
  }, [employees]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = Number(e.target.value);
    const emp = employees.find((emp) => emp.id === empId);
    setFormData((prev) => ({ ...prev, agentId: empId, agentName: emp ? emp.name : '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, file });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Nouvelle accréditation</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block font-medium mb-1">Agent</label>
            <select
              value={formData.agentId}
              onChange={handleEmployeeChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Nom de l'accréditation</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="certification">Certification</option>
              <option value="license">License</option>
              <option value="training">Formation</option>
              <option value="clearance">Habilitation</option>
              <option value="badge">Badge</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Émetteur</label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Date d'émission</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Date d'expiration</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Document (PDF ou image)</label>
            <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-4 py-2"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccreditationForm; 