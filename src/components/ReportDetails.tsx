import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faFileAlt, 
  faCalendarAlt, 
  faUserShield, 
  faDownload 
} from '@fortawesome/free-solid-svg-icons';
import type { Report, ReportDetailsProps } from '../types/report';

const ReportDetails = ({ report, onClose, onEdit, onDelete }: ReportDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-light p-5 rounded-t-xl flex justify-between items-center border-b">
          <h3 className="text-xl font-semibold">Détails du rapport</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-accent/20 p-4 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-accent text-3xl" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{report.title}</h2>
              <p className="text-gray-600 mb-4">{report.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{report.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{report.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                    <FontAwesomeIcon icon={faUserShield} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Auteur</p>
                    <p className="font-medium">{report.author}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taille</p>
                    <p className="font-medium">{report.size}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-light p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Statut</h4>
            <div className={`${getReportStatusClass(report.status)} inline-block text-sm rounded-full px-4 py-1`}>
              {report.status}
            </div>
          </div>
          
          <div className="bg-light p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Contenu</h4>
            <p className="text-sm text-gray-600">
              Ce rapport contient des informations détaillées concernant les activités de sécurité.
              Pour consulter le contenu complet, veuillez télécharger le document.
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-light p-5 rounded-b-xl flex flex-wrap gap-3 justify-end border-t">
          <button 
            className="bg-accent hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={() => onEdit(report)}
          >
            Modifier
          </button>
          <button 
            className="bg-danger hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center"
            onClick={() => onDelete(report)}
          >
            Supprimer
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Télécharger
          </button>
        </div>
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

export default ReportDetails; 