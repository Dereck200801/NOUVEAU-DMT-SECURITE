import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faUserShield, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import type { Risk } from '../types/risk';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk?: Risk;
  mode: 'view' | 'create' | 'edit';
  onSave?: (risk: Partial<Risk>) => void;
  categories: string[];
}

const RiskModal: React.FC<RiskModalProps> = ({ isOpen, onClose, risk, mode, onSave, categories }) => {
  const [formData, setFormData] = React.useState<Partial<Risk>>(
    risk || {
      title: '',
      category: categories[0] || 'Operational',
      severity: 'low',
      likelihood: 'low',
      impact: 'low',
      status: 'active',
      description: '',
      owner: '',
    }
  );

  const isViewMode = mode === 'view';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  const severityOptions: Risk['severity'][] = ['low', 'medium', 'high'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'view' ? 'Détails du risque' : mode === 'create' ? 'Nouveau risque' : 'Modifier le risque'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              name="title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={formData.title}
              onChange={handleChange}
              readOnly={isViewMode}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              name="category"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={formData.category}
              onChange={handleChange}
              disabled={isViewMode}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Severity, Likelihood, Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['severity', 'likelihood', 'impact'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <select
                  name={field}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  disabled={isViewMode}
                >
                  {severityOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <input
              type="text"
              name="owner"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={formData.owner}
              onChange={handleChange}
              readOnly={isViewMode}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={formData.description}
              onChange={handleChange}
              readOnly={isViewMode}
            />
          </div>

          {isViewMode && risk && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Identifié le {risk.dateIdentified}
              </div>
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                {risk.owner}
              </div>
              <div className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                Gravité : {risk.severity}
              </div>
            </div>
          )}

          {mode !== 'view' && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
              >
                {mode === 'create' ? 'Créer' : 'Enregistrer'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RiskModal; 