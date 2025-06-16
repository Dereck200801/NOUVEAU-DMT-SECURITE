import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

// Types de documents disponibles
const DOCUMENT_TYPES = [
  "ID", 
  "Licence", 
  "Document", 
  "Certificat", 
  "Permis", 
  "Contrat"
];

interface DocumentFormProps {
  newDocument: {
    name: string;
    type: string;
    date: string;
    file: File | null;
  };
  errors: Record<string, string>;
  editingDocumentId: number | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  newDocument,
  errors,
  editingDocumentId,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h5 className="font-medium mb-3">
        {editingDocumentId !== null ? 'Modifier le document' : 'Nouveau document'}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du document</label>
          <input
            type="text"
            name="name"
            value={newDocument.name}
            onChange={onInputChange}
            className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
            placeholder="Ex: Carte d'identité"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={newDocument.type}
            onChange={onInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            {DOCUMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut / Date</label>
          <input
            type="text"
            name="date"
            value={newDocument.date}
            onChange={onInputChange}
            className={`border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
            placeholder="Ex: Valide jusqu'au 15/10/2025"
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
          <input
            type="file"
            name="file"
            onChange={onInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            accept=".pdf,.png,.jpg,.jpeg"
          />
          {editingDocumentId !== null && (
            <p className="mt-1 text-xs text-gray-500">
              Laissez vide pour conserver le fichier existant
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          type="button"
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm"
          onClick={onCancel}
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Annuler
        </button>
        <button
          type="button"
          className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
          onClick={onSubmit}
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          {editingDocumentId !== null ? 'Mettre à jour' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default DocumentForm; 