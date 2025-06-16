import { useState, useEffect } from 'react';
import { 
  Agent,
  AgentProfileProps
} from '../types/agent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendarAlt, 
  faBriefcase, 
  faMapMarkerAlt,
  faGraduationCap,
  faFileAlt,
  faHistory,
  faPlus,
  faSave
} from '@fortawesome/free-solid-svg-icons';

// Import des hooks personnalisés
import { useDocumentManagement } from '../hooks/useDocumentManagement';
import { useNotification } from '../hooks/useNotification';

// Import des composants
import DocumentForm from './DocumentForm';
import DocumentList from './DocumentList';
import DocumentPreview from './DocumentPreview';
import MissionHistoryTable from './MissionHistoryTable';
import NotificationToast from './NotificationToast';

const AgentProfile = ({ agent: initialAgent, onClose }: AgentProfileProps) => {
  const [completeAgent, setCompleteAgent] = useState<Agent>(initialAgent);
  const [isModified, setIsModified] = useState(false);
  
  // Utilisation des hooks personnalisés
  const { 
    documents, 
    showAddDocument, 
    showPreview, 
    previewFile, 
    newDocument, 
    editingDocumentId,
    errors,
    setShowAddDocument, 
    handleDocumentInputChange, 
    handleAddDocument, 
    handleEditDocument,
    handleDeleteDocument, 
    handlePreviewDocument, 
    handleClosePreview 
  } = useDocumentManagement(initialAgent);
  
  const { notification, showNotification, hideNotification } = useNotification();

  // Mettre à jour l'agent complet quand les documents changent
  useEffect(() => {
    setCompleteAgent(prev => ({
      ...prev,
      documents
    }));
    
    // Marquer comme modifié si les documents ont changé
    if (JSON.stringify(documents) !== JSON.stringify(initialAgent.documents)) {
      setIsModified(true);
    }
  }, [documents, initialAgent.documents]);

  // Fonction pour sauvegarder les modifications
  const handleSaveChanges = () => {
    // Ici, vous pourriez implémenter un appel API pour sauvegarder les modifications
    // Pour l'instant, nous simulons juste une sauvegarde réussie
    showNotification('Modifications enregistrées avec succès', 'success');
    setIsModified(false);
  };

  // Fonction pour afficher le statut avec le bon style
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-success/20 text-success text-xs rounded-full px-3 py-1">Disponible</span>;
      case 'inactive':
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">Inactif</span>;
      case 'on_mission':
        return <span className="bg-accent/20 text-accent text-xs rounded-full px-3 py-1">En mission</span>;
      default:
        return <span className="bg-gray-200 text-gray-500 text-xs rounded-full px-3 py-1">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-y-auto">
        {/* Notification Toast */}
        <NotificationToast 
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />

        {/* Header */}
        <div className="bg-accent text-white p-6 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold">Profil de l'agent</h2>
          <button 
            className="text-white hover:text-gray-200"
            onClick={onClose}
            aria-label="Fermer le profil"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-6">
          {/* Informations principales */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="w-32 h-32 flex-shrink-0">
              <img 
                src={`https://ui-avatars.com/api/?name=${completeAgent.name.replace(' ', '+')}&background=1d4ed8&color=fff&size=128`} 
                alt={completeAgent.name} 
                className="w-full h-full rounded-lg shadow-md"
              />
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{completeAgent.name}</h3>
                {renderStatusBadge(completeAgent.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-3" />
                  <span>{completeAgent.email}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-3" />
                  <span>{completeAgent.phone}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBriefcase} className="text-gray-500 mr-3" />
                  <span>{completeAgent.specialty}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-3" />
                  <span>Embauché le {completeAgent.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-3" />
                  <span>{completeAgent.address}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                  <span>Né le {completeAgent.birthDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button className="inline-block p-4 border-b-2 border-accent text-accent">
                  Dossier complet
                </button>
              </li>
            </ul>
          </div>

          {/* Formation et certifications */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faGraduationCap} className="text-accent mr-2" />
              Formation et certifications
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-3">{completeAgent.education}</p>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Certifications:</h5>
                <ul className="list-disc list-inside">
                  {completeAgent.certifications?.map((cert, index) => (
                    <li key={index} className="mb-1">{cert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-accent mr-2" />
                Documents
              </h4>
              <button 
                className="bg-accent hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center text-sm"
                onClick={() => setShowAddDocument(true)}
                aria-label="Ajouter un document"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Ajouter un document
              </button>
            </div>

            {/* Formulaire d'ajout/modification de document */}
            {showAddDocument && (
              <DocumentForm 
                newDocument={newDocument}
                errors={errors}
                editingDocumentId={editingDocumentId}
                onInputChange={handleDocumentInputChange}
                onSubmit={handleAddDocument}
                onCancel={() => setShowAddDocument(false)}
              />
            )}

            {/* Liste des documents */}
            <DocumentList 
              documents={documents}
              onPreview={handlePreviewDocument}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
            />
          </div>

          {/* Historique des missions */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faHistory} className="text-accent mr-2" />
              Historique des missions
            </h4>
            
            {/* Tableau des missions */}
            <MissionHistoryTable missions={completeAgent.missionHistory || []} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          {isModified && (
            <button 
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 flex items-center"
              onClick={handleSaveChanges}
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Enregistrer les modifications
            </button>
          )}
          <button 
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ${isModified ? 'ml-auto' : ''}`}
            onClick={onClose}
          >
            Fermer
          </button>
        </div>

        {/* Modal de prévisualisation */}
        {showPreview && previewFile && (
          <DocumentPreview 
            document={previewFile}
            onClose={handleClosePreview}
          />
        )}
      </div>
    </div>
  );
};

export default AgentProfile; 