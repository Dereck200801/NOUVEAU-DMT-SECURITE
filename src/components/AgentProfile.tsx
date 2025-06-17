import { useState, useEffect, useRef } from 'react';
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
import ProfessionalCard from './ProfessionalCard';
import html2canvas from 'html2canvas';
import { toSvg } from 'html-to-image';
import EditableText from './ui/editableText';

const AgentProfile = ({ agent: initialAgent, onClose, isNew = false }: AgentProfileProps) => {
  const [completeAgent, setCompleteAgent] = useState<Agent>(initialAgent);
  const [isModified, setIsModified] = useState(false);
  
  // Ref for professional card
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  
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
    handleClosePreview,
    addDocumentFromFile
  } = useDocumentManagement(initialAgent);
  
  const { notification, showNotification, hideNotification } = useNotification();

  // Add state for avatar
  const [avatarUrl, setAvatarUrl] = useState<string>(`https://ui-avatars.com/api/?name=${completeAgent.name.replace(' ', '+')}&background=1d4ed8&color=fff&size=128`);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      addDocumentFromFile(file, 'Photo identité', 'ID');
      // mark modified
      setIsModified(true);
    }
  };

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
    const err = validateAgent();
    if (err) {
      showNotification(err, 'error');
      return;
    }
    showNotification(isNew ? 'Agent créé avec succès' : 'Modifications enregistrées avec succès', 'success');
    setIsModified(false);
    onClose(completeAgent);
  };

  const handleCancel = () => {
    onClose();
  };

  // --- Impression / Exportation de la carte professionnelle ---
  const printCard = () => {
    if (!cardsContainerRef.current) return;
    const stylesheetLink = (document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement)?.href;
    const printWindow = window.open('', 'PRINT', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Carte Professionnelle</title>${
      stylesheetLink ? `<link rel="stylesheet" href="${stylesheetLink}">` : ''
    }<style>@page { size: 85.6mm 54mm; margin: 0; } body { margin: 0; display: flex; justify-content: center; align-items: center; }</style></head><body>${cardsContainerRef.current.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const exportCard = async () => {
    if (!cardsContainerRef.current) return;
    try {
      const canvas = await html2canvas(cardsContainerRef.current);
      const link = document.createElement('a');
      link.download = `${completeAgent.name.replace(' ', '_')}_dmt.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erreur export carte:', error);
    }
  };

  const exportCardSvg = async () => {
    if (!cardsContainerRef.current) return;
    try {
      const svgString = await toSvg(cardsContainerRef.current, { cacheBust: true });
      let url = '';
      if (svgString.startsWith('data:image/svg+xml')) {
        // html-to-image already returned a data URI
        url = svgString;
      } else {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        url = URL.createObjectURL(blob);
      }
      const link = document.createElement('a');
      link.download = `${completeAgent.name.replace(' ', '_')}_dmt.svg`;
      link.href = url;
      link.click();
      // Cleanup
      if (!svgString.startsWith('data:image/svg+xml')) {
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur export SVG:', error);
    }
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

  // Handle inline personal info edits
  const handlePersonalChange = (field: keyof Agent, value: string) => {
    setCompleteAgent(prev => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  // Small component for info items
  const InfoItem: React.FC<{ icon: any; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
      <FontAwesomeIcon icon={icon} className="text-accent mt-0.5" />
      <div>
        <span className="block text-xs uppercase text-gray-400 leading-none">{label}</span>
        <span className="block text-sm">{children}</span>
      </div>
    </div>
  );

  const validateAgent = () => {
    if (!completeAgent.name.trim()) return 'Le nom est requis';
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(completeAgent.email)) return 'Email invalide';
    if (!completeAgent.phone.trim()) return 'Téléphone requis';
    if (!completeAgent.specialty.trim()) return 'Spécialité requise';
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-y-auto relative">
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
            onClick={handleCancel}
            aria-label="Fermer le profil"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-6">
          {/* Informations principales */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              <div className="relative w-full h-full">
                <img
                  src={avatarUrl}
                  alt={completeAgent.name}
                  className="w-full h-full rounded-lg shadow-md object-cover cursor-pointer"
                  onClick={handleAvatarClick}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <EditableText
                  value={completeAgent.name}
                  onChange={val => handlePersonalChange('name', val)}
                  className="text-2xl font-bold"
                />
                <select
                  value={completeAgent.status}
                  onChange={e => handlePersonalChange('status', e.target.value as any)}
                  className="border-none bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent rounded"
                >
                  <option value="active">Disponible</option>
                  <option value="inactive">Inactif</option>
                  <option value="on_mission">En mission</option>
                </select>
                {renderStatusBadge(completeAgent.status)}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                <InfoItem icon={faEnvelope} label="Email">
                  <input
                    type="email"
                    value={completeAgent.email}
                    onChange={e => handlePersonalChange('email', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                    required
                  />
                </InfoItem>
                <InfoItem icon={faPhone} label="Téléphone">
                  <input
                    type="tel"
                    value={completeAgent.phone}
                    onChange={e => handlePersonalChange('phone', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                    required
                  />
                </InfoItem>
                <InfoItem icon={faBriefcase} label="Spécialité">
                  <select
                    value={completeAgent.specialty}
                    onChange={e => handlePersonalChange('specialty', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                  >
                    <option value="Surveillance">Surveillance</option>
                    <option value="Protection Rapprochée">Protection Rapprochée</option>
                    <option value="Contrôle d'Accès">Contrôle d'Accès</option>
                    <option value="Autre">Autre</option>
                  </select>
                </InfoItem>
                <InfoItem icon={faCalendarAlt} label="Date d'embauche">
                  <input
                    type="date"
                    value={completeAgent.joinDate}
                    onChange={e => handlePersonalChange('joinDate', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                  />
                </InfoItem>
                <InfoItem icon={faMapMarkerAlt} label="Adresse">
                  <input
                    type="text"
                    value={completeAgent.address || ''}
                    onChange={e => handlePersonalChange('address', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                  />
                </InfoItem>
                <InfoItem icon={faUser} label="Date de naissance">
                  <input
                    type="date"
                    value={completeAgent.birthDate || ''}
                    onChange={e => handlePersonalChange('birthDate', e.target.value)}
                    className="w-full border-b border-gray-300 bg-transparent focus:border-accent focus:outline-none text-sm py-0.5"
                  />
                </InfoItem>
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

          {/* Cartes professionnelles */}
          <div className="mt-10 flex flex-col items-center">
            <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfessionalCard variant="front" />
              <ProfessionalCard agent={completeAgent} variant="back" avatarUrl={avatarUrl} />
            </div>
            <div className="flex space-x-2 mt-4">
              <button onClick={printCard} className="px-3 py-2 bg-accent text-white rounded hover:bg-blue-700 text-sm">Imprimer</button>
              <button onClick={exportCard} className="px-3 py-2 bg-accent text-white rounded hover:bg-blue-700 text-sm">Exporter PNG</button>
              <button onClick={exportCardSvg} className="px-3 py-2 bg-accent text-white rounded hover:bg-blue-700 text-sm">Exporter SVG</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={handleCancel}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
            onClick={handleSaveChanges}
            disabled={!!validateAgent()}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isNew ? 'Créer' : 'Enregistrer'}
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