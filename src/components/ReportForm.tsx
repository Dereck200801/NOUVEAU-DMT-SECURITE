import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Report, NewReport, ReportFormProps } from '../types/report';

interface ReportFormProps {
  report?: Report;
  onSubmit: (reportData: Omit<Report, 'id'> | Partial<Report>) => void;
  onCancel: () => void;
  isEdit?: boolean;
  existingTypes: string[];
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  report, 
  onSubmit, 
  onCancel, 
  isEdit = false,
  existingTypes 
}) => {
  const [formData, setFormData] = useState<Omit<Report, 'id'> | Partial<Report>>({
    title: '',
    type: '',
    date: new Date().toISOString().split('T')[0].split('-').reverse().join('/'),
    author: '',
    size: '0 KB',
    status: 'Brouillon',
    description: ''
  });
  
  const [customType, setCustomType] = useState<string>('');
  const [showCustomType, setShowCustomType] = useState<boolean>(false);

  // Initialize form if editing
  useEffect(() => {
    if (report && isEdit) {
      setFormData({
        title: report.title,
        type: report.type,
        date: report.date,
        author: report.author,
        size: report.size,
        status: report.status,
        description: report.description
      });
    }
  }, [report, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type' && value === 'custom') {
      setShowCustomType(true);
    } else if (name === 'type') {
      setShowCustomType(false);
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use custom type if selected
    const dataToSubmit = {
      ...formData,
      type: showCustomType ? customType : formData.type
    };
    
    onSubmit(dataToSubmit);
  };
  
  const allTypes = [...new Set([...existingTypes, 'Mensuel', 'Hebdomadaire', 'Incident', 'Audit', 'Évaluation', 'Formation', 'Risques', 'Activité'])];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-light p-5 rounded-t-xl flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold">
            {isEdit ? 'Modifier le rapport' : 'Nouveau rapport'}
          </h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du rapport*
                </label>
                <input
                  type="text"
                  name="title"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de rapport*
                </label>
                <select
                  name="type"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={showCustomType ? 'custom' : formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un type</option>
                  {allTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="custom">Autre (préciser)</option>
                </select>
                
                {showCustomType && (
                  <input
                    type="text"
                    className="mt-2 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Spécifier le type"
                    required
                  />
                )}
              </div>
              
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur*
                </label>
                <input
                  type="text"
                  name="author"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  name="date"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="JJ/MM/AAAA"
                />
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="En revue">En revue</option>
                  <option value="Finalisé">Finalisé</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              {/* File Upload (not functional in this demo) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier du rapport
                </label>
                <input
                  type="file"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: PDF, DOCX, XLSX (max 10MB)
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-light p-5 rounded-b-xl flex justify-end gap-3 border-t">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm; 