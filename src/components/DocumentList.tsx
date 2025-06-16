import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faTrash, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Document } from '../types/agent';

interface DocumentListProps {
  documents: Document[];
  onPreview: (doc: Document) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onPreview,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les documents en fonction du terme de recherche
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      
      {/* Tableau des documents */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="py-3 px-4">{doc.name}</td>
                  <td className="py-3 px-4">{doc.type}</td>
                  <td className="py-3 px-4">{doc.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {doc.fileUrl && (
                        <a 
                          href={doc.fileUrl} 
                          download={doc.name}
                          className="text-accent hover:text-blue-700"
                          aria-label={`Télécharger ${doc.name}`}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                      )}
                      {(doc.file || doc.fileUrl) && (
                        <button 
                          className="text-accent hover:text-blue-700"
                          onClick={() => onPreview(doc)}
                          aria-label={`Prévisualiser ${doc.name}`}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      )}
                      <button 
                        className="text-accent hover:text-blue-700"
                        onClick={() => onEdit(doc.id)}
                        aria-label={`Modifier ${doc.name}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDelete(doc.id)}
                        aria-label={`Supprimer ${doc.name}`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  {searchTerm 
                    ? "Aucun document ne correspond à votre recherche" 
                    : "Aucun document disponible"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DocumentList; 