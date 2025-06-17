import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt, faUser, faDownload } from '@fortawesome/free-solid-svg-icons';
import type { Report, ReportModalProps } from '../types/report';

const ReportModal = ({ isOpen, onClose, report, mode, onSave, reportTypes }: ReportModalProps) => {
  const [formData, setFormData] = React.useState<Partial<Report>>(
    report || {
      title: '',
      type: reportTypes[0],
      date: new Date().toLocaleDateString('fr-FR'),
      author: '',
      description: '',
      status: 'draft'
    }
  );

  // Local state for the selected file (only used while creating / editing)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create an object URL so we can preview / download the file from memory
    const url = URL.createObjectURL(file);

    // Compute the human-readable size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    setFormData(prev => ({
      ...prev,
      fileUrl: url,
      size: `${sizeInMB} MB`,
    }));
  };

  // Clean up object URL when modal unmounts or file changes
  useEffect(() => {
    return () => {
      if (selectedFile && formData.fileUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(formData.fileUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

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
          <div className="flex items-center gap-3">
            {isViewMode && report && (
              <button
                onClick={() => import('../utils/pdfUtils').then(m => m.exportReportDetailsToPdf(report))}
                className="text-accent hover:text-blue-700 flex items-center gap-1 text-sm border border-accent px-3 py-1 rounded"
              >
                <FontAwesomeIcon icon={faDownload} /> Export PDF
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
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

            {/* File upload (create / edit modes) */}
            {!isViewMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fichier (PDF ou Word)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-2">{selectedFile.name} – {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                )}
              </div>
            )}

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
                {/* File preview */}
                {formData.fileUrl && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aperçu du fichier</label>
                    {(() => {
                      const ext = formData.fileUrl.split('.').pop()?.toLowerCase();
                      if (ext === 'pdf') {
                        return (
                          <div className="flex flex-col">
                            <iframe
                              src={formData.fileUrl}
                              title="Prévisualisation PDF"
                              className="w-full h-96 border rounded-lg mb-2"
                            />
                            <a
                              href={formData.fileUrl}
                              download
                              className="self-start text-accent hover:underline text-sm"
                            >
                              Télécharger le document
                            </a>
                          </div>
                        );
                      }
                      return (
                        <div className="w-full h-48 flex flex-col items-center justify-center border rounded-lg text-center text-sm text-gray-500 p-4">
                          <p className="mb-2">Aperçu non disponible pour ce type de fichier.</p>
                          <a
                            href={formData.fileUrl}
                            download
                            className="text-accent hover:underline"
                          >
                            Télécharger le document
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                )}
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
    case 'finalized':
      return 'bg-success/20 text-success';
    case 'in_review':
      return 'bg-warning/20 text-warning';
    case 'draft':
      return 'bg-gray-200 text-gray-500';
    case 'published':
      return 'bg-accent/20 text-accent';
    case 'archived':
      return 'bg-gray-200 text-gray-500';
    default:
      return 'bg-gray-200 text-gray-500';
  }
};

export default ReportModal; 