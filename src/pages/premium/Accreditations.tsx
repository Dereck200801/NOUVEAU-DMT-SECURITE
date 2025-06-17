import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIdCard, 
  faUpload, 
  faSearch, 
  faExclamationTriangle, 
  faCheck, 
  faPlus,
  faDownload,
  faEye,
  faFilter,
  faCheckCircle,
  faTimesCircle,
  faHistory,
  faFileAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { accreditationService } from '../../services/accreditationService';
import { 
  Accreditation, 
  AccreditationDocument, 
  AccreditationStats 
} from '../../types/accreditation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import AccreditationForm from '../../components/AccreditationForm';

const Accreditations: React.FC = () => {
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [filteredAccreditations, setFilteredAccreditations] = useState<Accreditation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAccreditation, setSelectedAccreditation] = useState<Accreditation | null>(null);
  const [documentDetails, setDocumentDetails] = useState<AccreditationDocument | null>(null);
  const [stats, setStats] = useState<AccreditationStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'valid' | 'expiring' | 'expired'>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  
  // Charger les accréditations au chargement de la page
  useEffect(() => {
    const loadAccreditations = async () => {
      setIsLoading(true);
      const accreditationsData = await accreditationService.getAccreditations();
      setAccreditations(accreditationsData);
      setFilteredAccreditations(accreditationsData);
      
      const statsData = await accreditationService.getAccreditationStats();
      setStats(statsData);
      
      setIsLoading(false);
    };
    
    loadAccreditations();
  }, []);
  
  // Filtrer les accréditations en fonction du terme de recherche et de l'onglet actif
  useEffect(() => {
    let filtered = accreditations;
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(acc => 
        acc.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par onglet actif
    if (activeTab === 'valid') {
      filtered = filtered.filter(acc => acc.status === 'valid');
    } else if (activeTab === 'expiring') {
      filtered = filtered.filter(acc => acc.status === 'expiring');
    } else if (activeTab === 'expired') {
      filtered = filtered.filter(acc => acc.status === 'expired' || acc.status === 'revoked');
    }
    
    setFilteredAccreditations(filtered);
  }, [searchTerm, activeTab, accreditations]);
  
  // Afficher les détails d'un document
  const viewDocument = async (accreditationId: string) => {
    const document = await accreditationService.getAccreditationDocument(accreditationId);
    setDocumentDetails(document);
    setShowDocumentModal(true);
  };
  
  // Simuler le téléchargement d'un document
  const downloadDocument = (documentId: string, fileName: string) => {
    // Dans un environnement réel, nous téléchargerions le document
    // Pour la démonstration, nous simulons simplement une alerte
    alert(`Téléchargement du document ${fileName}`);
  };
  
  // Simuler l'analyse OCR d'un document
  const scanDocument = async (file: File) => {
    // Dans un environnement réel, nous enverrions le document à notre API OCR
    // Pour la démonstration, nous simulons une réponse après un délai
    return new Promise<{success: boolean, data?: any}>(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            fullText: "CERTIFICAT DE QUALIFICATION PROFESSIONNELLE\nAgent de Sécurité\nDélivré à: Jean Dupont\nDate d'émission: 15/01/2023\nDate d'expiration: 15/01/2026\nN° 12345-ABC",
            fields: {
              name: "CERTIFICAT DE QUALIFICATION PROFESSIONNELLE",
              holderName: "Jean Dupont",
              issueDate: "15/01/2023",
              expiryDate: "15/01/2026",
              documentNumber: "12345-ABC"
            },
            confidence: 0.89
          }
        });
      }, 2000);
    });
  };
  
  // Composant modal pour afficher le document
  const DocumentModal: React.FC<{ document: AccreditationDocument; onClose: () => void }> = ({ document, onClose }) => {
    if (!document) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg p-6 animate-fade-in relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="text-xl font-bold text-oxford-blue mb-4">{document.fileName}</h2>
          <div className="space-y-2 text-sm text-berkeley-blue/80">
            <p>Type de fichier: <span className="font-medium text-oxford-blue">{document.fileType}</span></p>
            <p>Taille: <span className="font-medium text-oxford-blue">{(document.fileSize / 1024).toFixed(2)} Ko</span></p>
            <p>Téléversé le: <span className="font-medium text-oxford-blue">{new Date(document.uploadDate).toLocaleDateString()}</span> par {document.uploadedBy}</p>
            <p>Statut du scan: <span className="font-medium text-oxford-blue">{document.scanStatus}</span></p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors"
            >
              Ouvrir le document
            </a>
            <button
              className="px-4 py-2 border border-powder-blue/30 rounded-lg text-berkeley-blue hover:bg-powder-blue/10 transition-colors"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
          {document.ocrData && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-oxford-blue mb-2">Données OCR</h3>
              <pre className="whitespace-pre-wrap bg-powder-blue/10 p-4 rounded-lg text-xs text-berkeley-blue/90 max-h-60 overflow-y-auto">
                {JSON.stringify(document.ocrData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Handler for creating a new accreditation
  const handleAddAccreditation = async (
    data: Omit<Accreditation, 'id' | 'status' | 'verificationStatus' | 'documentId'> & { file?: File }
  ) => {
    // Create the accreditation first
    const { file, ...accreditationData } = data as any;
    const newAcc = await accreditationService.createAccreditation({ ...accreditationData });
    if (newAcc) {
      // If a file was provided, upload it and link to accreditation
      if (file) {
        const uploadedDoc = await accreditationService.uploadDocument(newAcc.id, file);
        if (uploadedDoc) {
          newAcc.documentId = uploadedDoc.id;
        }
      }
      // Update local state
      setAccreditations((prev) => [...prev, newAcc]);
      setShowUploadModal(false);
      // refresh stats
      const statsData = await accreditationService.getAccreditationStats();
      setStats(statsData);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-oxford-blue">Accréditations</h1>
          <p className="text-sm text-berkeley-blue/70 mt-1">
            Gestion des accréditations et des autorisations
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors"
          onClick={() => setShowUploadModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Nouvelle accréditation
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-berkeley-blue/50" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une accréditation..."
            className="block w-full pl-10 pr-3 py-2 border border-powder-blue/30 rounded-lg focus:ring-2 focus:ring-yale-blue focus:border-yale-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-powder-blue/30 rounded-lg text-berkeley-blue hover:bg-powder-blue/10 transition-colors">
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          Filtres
        </button>
      </div>

      {/* Onglets de statut */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'valid', label: 'Valides' },
          { key: 'expiring', label: 'Bientôt expirées' },
          { key: 'expired', label: 'Expirées/Révoc.' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-yale-blue text-white'
                : 'bg-powder-blue/10 text-berkeley-blue hover:bg-powder-blue/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Total accréditations</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">{stats?.total ?? '--'}</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">enregistrées</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">En attente</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">{stats?.pending ?? '--'}</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">demandes</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Expirent bientôt</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">{stats?.expiring ?? '--'}</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">à renouveler</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Expirées/Révoc.</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">{stats ? stats.expired + stats.revoked : '--'}</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">total</div>
          </div>
        </div>
      </div>

      {/* Liste des accréditations */}
      <div className="bg-white rounded-lg border border-powder-blue/30 overflow-x-auto">
        {isLoading ? (
          <div className="p-6 text-center text-berkeley-blue/70">Chargement...</div>
        ) : filteredAccreditations.length === 0 ? (
          <div className="p-6 text-center text-berkeley-blue/70">Aucune accréditation trouvée</div>
        ) : (
          <table className="min-w-full divide-y divide-powder-blue/20 text-sm">
            <thead className="bg-powder-blue/10 text-berkeley-blue/70">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Agent</th>
                <th className="px-4 py-2 text-left font-medium">Accréditation</th>
                <th className="px-4 py-2 text-left font-medium">Émetteur</th>
                <th className="px-4 py-2 text-left font-medium">Emise</th>
                <th className="px-4 py-2 text-left font-medium">Expire</th>
                <th className="px-4 py-2 text-left font-medium">Statut</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-powder-blue/20">
              {filteredAccreditations.map((acc) => (
                <tr key={acc.id} className="hover:bg-powder-blue/5">
                  <td className="px-4 py-2 text-oxford-blue font-medium">{acc.agentName}</td>
                  <td className="px-4 py-2">{acc.name}</td>
                  <td className="px-4 py-2">{acc.issuer}</td>
                  <td className="px-4 py-2">{new Date(acc.issueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(acc.expiryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        acc.status === 'valid'
                          ? 'bg-green-100 text-green-800'
                          : acc.status === 'expiring'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      title="Voir le document"
                      className="text-yale-blue hover:text-berkeley-blue"
                      onClick={() => viewDocument(acc.id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      title="Télécharger"
                      className="text-yale-blue hover:text-berkeley-blue"
                      onClick={() => downloadDocument(acc.documentId, acc.name)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Demandes récentes</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Dernières demandes d'accréditation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-powder-blue/10 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yale-blue/10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faIdCard} className="text-yale-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-oxford-blue">Agent {index + 1}</p>
                      <p className="text-xs text-berkeley-blue/70">Zone sécurisée niveau {index + 2}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Historique</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Activité récente des accréditations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center p-3 bg-powder-blue/10 rounded-lg">
                  <div className="w-10 h-10 bg-yale-blue/10 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faHistory} className="text-yale-blue" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-oxford-blue">Accréditation modifiée</p>
                    <p className="text-xs text-berkeley-blue/70">Il y a {index + 1} heure{index > 0 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Documents</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Documents et formulaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Formulaire de demande',
                'Guide des accréditations',
                'Règlement intérieur'
              ].map((doc, index) => (
                <button key={index} className="w-full flex items-center p-3 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors">
                  <div className="w-10 h-10 bg-yale-blue/10 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-yale-blue" />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-oxford-blue">{doc}</p>
                    <p className="text-xs text-berkeley-blue/70">PDF • Mis à jour récemment</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de document */}
      {showDocumentModal && documentDetails && (
        <DocumentModal
          document={documentDetails}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      {/* Modal for adding a new accreditation */}
      {showUploadModal && (
        <AccreditationForm
          onCancel={() => setShowUploadModal(false)}
          onSubmit={handleAddAccreditation}
        />
      )}
    </div>
  );
};

export default Accreditations;