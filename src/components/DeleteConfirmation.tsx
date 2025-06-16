import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface DeleteConfirmationProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-light p-5 rounded-t-xl flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold text-danger">{title}</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className="bg-danger bg-opacity-20 p-3 rounded-full mr-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger text-xl" />
            </div>
            <p className="text-gray-700">{message}</p>
          </div>
          <p className="text-sm text-gray-500">
            Cette action ne peut pas être annulée. Toutes les données associées seront définitivement supprimées.
          </p>
        </div>
        
        {/* Actions */}
        <div className="bg-light p-5 rounded-b-xl flex justify-end gap-3 border-t">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-danger hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 