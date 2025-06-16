import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Document } from '../types/agent';

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  // Fonction pour déterminer si le fichier est une image
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };

  // Fonction pour déterminer si le fichier est un PDF
  const isPdfFile = (file: File) => {
    return file.type === 'application/pdf';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header du modal de prévisualisation */}
        <div className="bg-accent text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-semibold">{document.name}</h3>
          <button 
            className="text-white hover:text-gray-200"
            onClick={onClose}
            aria-label="Fermer la prévisualisation"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Contenu de la prévisualisation */}
        <div className="p-6">
          {document.file && isImageFile(document.file) && document.fileUrl && (
            <img 
              src={document.fileUrl} 
              alt={document.name}
              className="max-w-full h-auto mx-auto"
            />
          )}

          {document.file && isPdfFile(document.file) && document.fileUrl && (
            <iframe
              src={document.fileUrl}
              className="w-full h-[70vh]"
              title={document.name}
            />
          )}

          {document.fileUrl && !document.file && (
            <iframe
              src={document.fileUrl}
              className="w-full h-[70vh]"
              title={document.name}
            />
          )}

          {document.file && !isImageFile(document.file) && !isPdfFile(document.file) && (
            <div className="text-center py-10">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="text-4xl text-yellow-500 mb-4"
              />
              <p className="text-lg text-gray-600">
                La prévisualisation n'est pas disponible pour ce type de fichier.
              </p>
              <p className="text-gray-500 mt-2">
                Type de fichier : {document.file.type || "Inconnu"}
              </p>
              {document.fileUrl && (
                <a
                  href={document.fileUrl}
                  download={document.name}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Télécharger le fichier
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview; 