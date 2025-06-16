import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faUser, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import type { Report, ReportModalProps } from '../types/report';

const ReportModal = ({ isOpen, onClose, report, mode, onSave, reportTypes }: ReportModalProps) => {
  const [formData, setFormData] = React.useState<Partial<Report>>(
    report || {
      title: '',
      type: reportTypes[0],
      date: new Date().toLocaleDateString('fr-FR'),
      author: '',
      description: '',
      status: 'Brouillon'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'view' ? 'Détails du rapport' : mode === 'create' ? 'Nouveau rapport' : 'Modifier le rapport'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                readOnly={isViewMode}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={isViewMode}
                required
              >
                {reportTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                readOnly={isViewMode}
                required
              />
            </div>

            {mode === 'view' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {formData.date}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      {formData.author}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <div className="flex items-center">
                    <span className={`${getReportStatusClass(formData.status || '')} text-xs rounded-full px-3 py-1`}>
                      {formData.status}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isViewMode && (
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

// Function to get report status class
const getReportStatusClass = (status: string) => {
  switch (status) {
    case 'Finalisé':
      return 'bg-success/20 text-success';
    case 'En revue':
      return 'bg-warning/20 text-warning';
    case 'Brouillon':
      return 'bg-gray-200 text-gray-500';
    default:
      return 'bg-gray-200 text-gray-500';
  }
};

export default ReportModal; 