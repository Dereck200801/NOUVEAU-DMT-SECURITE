import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faUserCheck, 
  faUserTimes, 
  faPlus, 
  faDownload,
  faCog,
  faUpload,
  faUserPlus,
  faHistory,
  faTimes,
  faPowerOff,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { facialRecognitionService } from '../../services/facialRecognitionService';
import { 
  CameraDevice, 
  FaceDetection, 
  AttendanceRecord 
} from '../../types/facial-recognition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import Modal from '../../components/ui/modal';

// Type local pour l'enregistrement d'une personne
interface PersonRecord {
  id: string;
  name: string;
  imageUrl: string;
  timestamp: string;
  cameraName: string;
  location: string;
}

const FacialRecognition: React.FC = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [detections, setDetections] = useState<FaceDetection[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'live' | 'attendance' | 'settings'>('live');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // Image enregistrée lors de la dernière capture (aperçu)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Affichage de l'historique
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  // Gestion de la base de données de personnes
  const [people, setPeople] = useState<PersonRecord[]>([]);
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);
  const [newPersonName, setNewPersonName] = useState<string>('');
  const [selectedPerson, setSelectedPerson] = useState<PersonRecord | null>(null);
  
  // Charger les caméras au chargement de la page
  useEffect(() => {
    const loadCameras = async () => {
      setIsLoading(true);
      const camerasData = await facialRecognitionService.getCameras();
      setCameras(camerasData);
      if (camerasData.length > 0) {
        setSelectedCamera(camerasData[0]);
      }
      setIsLoading(false);
    };
    
    loadCameras();
  }, []);
  
  // Charger les détections récentes
  useEffect(() => {
    const loadDetections = async () => {
      const detectionsData = await facialRecognitionService.getDetections(10);
      setDetections(detectionsData);
    };
    
    loadDetections();
    // Rafraîchir les détections toutes les 30 secondes
    const interval = setInterval(loadDetections, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Charger les données de présence
  useEffect(() => {
    const loadAttendance = async () => {
      const attendanceData = await facialRecognitionService.getAttendanceRecords(date);
      setAttendanceRecords(attendanceData);
    };
    
    if (activeTab === 'attendance') {
      loadAttendance();
    }
  }, [activeTab, date]);
  
  // Simuler la connexion à une caméra ONVIF
  const connectToCamera = async (camera?: CameraDevice) => {
    if (camera) {
      setSelectedCamera(camera);
    }
    
    setVideoLoading(true);
    
    // Dans un environnement réel, nous utiliserions l'API ONVIF pour nous connecter à la caméra
    // Ici, nous simulons avec la webcam de l'utilisateur pour la démonstration
    try {
      if (videoRef.current) {
        // Arrêter les pistes de la session précédente si nécessaire
        if (videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
            audio: false
          });
        } catch {
          // Fallback sans contraintes spécifiques
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        videoRef.current.srcObject = stream;
        console.log('Flux vidéo obtenu:', stream.getVideoTracks()[0]?.label);
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setCameraActive(true);
            setVideoLoading(false);
          } catch (err) {
            console.error('Lecture vidéo impossible:', err);
          }
        };
        // Si les métadonnées étaient déjà dispo
        if (videoRef.current.readyState >= 1) {
          setCameraActive(true);
          setVideoLoading(false);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra:", error);
      setVideoLoading(false);
    }
  };
  
  // Simuler la capture et la vérification d'un visage
  const captureAndVerify = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setIsProcessing(true);
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      // Capturer l'image de la vidéo
      context.drawImage(
        videoRef.current, 
        0, 0, 
        canvasRef.current.width, 
        canvasRef.current.height
      );
      
      // Dans un environnement réel, nous enverrions cette image à notre API de reconnaissance faciale
      // Pour la démonstration, nous simulons une détection réussie après un délai
      setTimeout(() => {
        const snapshot = canvasRef.current?.toDataURL() || "";
        // Mémoriser l'aperçu pour l'afficher dans l'UI
        setPreviewImage(snapshot);

        const newDetection: FaceDetection = {
          id: `detection-${Date.now()}`,
          timestamp: new Date().toISOString(),
          agentId: 123,
          agentName: "Jean Dupont",
          cameraId: selectedCamera?.id || "",
          cameraName: selectedCamera?.name || "",
          confidence: 0.92,
          status: "verified",
          imageUrl: snapshot,
          location: selectedCamera?.location || ""
        };
        
        // Ajouter la nouvelle détection à la liste
        setDetections(prev => [newDetection, ...prev]);
        setIsProcessing(false);
      }, 1500);
    }
  };
  
  // Exporter les données de présence
  const exportAttendance = async () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    const csvBlob = await facialRecognitionService.exportAttendanceData(startDate, endDate);
    
    if (csvBlob) {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `attendance_${startDate}_to_${endDate}.csv`;
      
      // Ajouter à la page, cliquer, puis nettoyer
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };
  
  // Synchroniser la taille du canvas avec celle de la vidéo dès que les métadonnées sont chargées
  useEffect(() => {
    if (!cameraActive) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const handleLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    if (video.readyState >= 1) {
      // Métadonnées déjà disponibles
      handleLoaded();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, [cameraActive]);

  // Arrêter la caméra lors du démontage du composant
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Gérer l'import d'images pour analyse
  const handleImportImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const imageData = ev.target?.result as string;
        // Simuler une détection sur l'image importée
        const importedDetection: FaceDetection = {
          id: `import-${Date.now()}-${file.name}`,
          timestamp: new Date().toISOString(),
          cameraId: 'upload',
          cameraName: 'Import',
          confidence: 0.88,
          status: 'verified',
          imageUrl: imageData,
          location: 'Upload'
        };
        setDetections(prev => [importedDetection, ...prev]);
        setPreviewImage(imageData);
      };
      reader.readAsDataURL(file);
    });
  };

  // Gestion du glisser-déposer
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImportImages(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Télécharger l'image d'aperçu
  const downloadPreview = () => {
    if (!previewImage) return;
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `capture_${Date.now()}.png`;
    link.click();
  };
  
  // Arrêter manuellement la caméra
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setVideoLoading(false);
  };
  
  // Supprimer une personne de la liste
  const deletePerson = (id: string) => {
    if (confirm('Confirmer la suppression de cette capture ?')) {
      setPeople(prev => prev.filter(p => p.id !== id));
      // Fermer modale si on supprime la personne actuellement affichée
      if (selectedPerson?.id === id) setSelectedPerson(null);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-oxford-blue">Reconnaissance Faciale</h1>
          <p className="text-sm text-berkeley-blue/70 mt-1">
            Système avancé de reconnaissance faciale pour la sécurité
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors"
            onClick={captureAndVerify}
            disabled={!cameraActive || isProcessing}
          >
            <FontAwesomeIcon icon={faCamera} className="mr-2" />
            {isProcessing ? 'Traitement...' : 'Nouvelle capture'}
          </button>
          {cameraActive && (
            <button
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={stopCamera}
            >
              <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
              Couper la caméra
            </button>
          )}
          <button
            className="inline-flex items-center px-4 py-2 bg-yale-blue/10 text-yale-blue border border-yale-blue rounded-lg hover:bg-yale-blue/20 transition-colors"
            onClick={exportAttendance}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export présence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Zone de capture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Capture en direct</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Utilisez la caméra pour capturer des visages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative aspect-video bg-powder-blue/10 rounded-lg flex items-center justify-center border-2 border-dashed border-powder-blue/30 cursor-pointer"
              onClick={() => {
                if (!cameraActive) {
                  if (cameras.length > 0) {
                    connectToCamera(cameras[0]);
                  } else {
                    connectToCamera();
                  }
                }
              }}
            >
              {/* Vidéo toujours dans le DOM pour que videoRef soit défini */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover rounded-lg ${cameraActive ? '' : 'hidden'}`}
              />
              {(!cameraActive || videoLoading) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <FontAwesomeIcon icon={faCamera} className="text-berkeley-blue/50 text-3xl mb-3" />
                  <p className="text-sm text-berkeley-blue/70">
                    {videoLoading ? 'Initialisation de la caméra…' : 'Cliquez pour activer la caméra'}
                  </p>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                  <FontAwesomeIcon icon={faCog} spin className="text-white text-2xl" />
                </div>
              )}
              {/* Canvas caché utilisé pour capturer l'image */}
              <canvas ref={canvasRef} width={640} height={360} className="hidden" />
              {/* Aperçu */}
              {previewImage && !isProcessing && (
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded shadow-lg max-w-[40%]">
                  <img src={previewImage} alt="Aperçu" className="w-full h-auto object-contain rounded" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Zone d'import */}
        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Import d'images</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Importez des photos pour l'analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="aspect-video bg-powder-blue/10 rounded-lg flex items-center justify-center border-2 border-dashed border-powder-blue/30 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-center">
                <FontAwesomeIcon icon={faUpload} className="text-berkeley-blue/50 text-3xl mb-3" />
                <p className="text-sm text-berkeley-blue/70">Glissez-déposez ou cliquez pour importer</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={e => handleImportImages(e.target.files)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Base de données */}
        <Card>
          <CardHeader>
            <CardTitle className="text-oxford-blue">Base de données</CardTitle>
            <CardDescription className="text-berkeley-blue/70">
              Gérez votre base de données de visages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button className="w-full flex items-center p-3 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors"
                onClick={() => {
                  if (!previewImage) {
                    alert('Prenez ou importez d\'abord une photo pour l\'associer à la personne.');
                    return;
                  }
                  setShowAddPersonModal(true);
                }}
                disabled={!previewImage}
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-berkeley-blue mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-oxford-blue">Ajouter une personne</p>
                  <p className="text-xs text-berkeley-blue/70">Créer une nouvelle entrée</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors">
                <FontAwesomeIcon icon={faHistory} className="text-berkeley-blue mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-oxford-blue">Historique</p>
                  <p className="text-xs text-berkeley-blue/70">Voir les détections récentes</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Personnes enregistrées</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">1,234</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">entrées</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Détections aujourd'hui</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">56</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">détections</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-powder-blue/30">
          <div className="text-sm font-medium text-berkeley-blue/70">Précision moyenne</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-3xl font-bold text-oxford-blue">98.7%</div>
            <div className="ml-2 text-sm text-berkeley-blue/70">de précision</div>
          </div>
        </div>
      </div>

      {/* MODAL HISTORIQUE */}
      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title={`Historique des détections (${detections.length})`}
        size="lg"
      >
        {detections.length === 0 ? (
          <p className="text-center text-berkeley-blue/70">Aucune détection disponible.</p>
        ) : (
          <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {detections.map(det => (
              <li key={det.id} className="flex items-center gap-4 bg-powder-blue/10 p-3 rounded-lg">
                <img
                  src={det.imageUrl}
                  alt={det.agentName || det.id}
                  className="w-20 h-20 object-cover rounded-lg border border-powder-blue/30"
                />
                <div className="flex-1">
                  <p className="font-medium text-oxford-blue">{det.agentName || 'Inconnu'}</p>
                  <p className="text-xs text-berkeley-blue/70">
                    {new Date(det.timestamp).toLocaleString()} – Confiance {(det.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-berkeley-blue/70">{det.location}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Liste des personnes enregistrées */}
      {people.length > 0 && (
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
          {people.map(person => (
            <div
              key={person.id}
              className="w-full flex items-center gap-3 bg-white/70 p-2 rounded border border-powder-blue/30 hover:bg-powder-blue/10 transition-colors"
              onClick={() => setSelectedPerson(person)}
            >
              <img src={person.imageUrl} alt={person.name} className="w-12 h-12 object-cover rounded" />
              <div className="text-sm flex-1">
                <p className="font-medium text-oxford-blue">{person.name}</p>
                <p className="text-berkeley-blue/70 text-xs">
                  {new Date(person.timestamp).toLocaleString()} – {person.cameraName || 'Caméra'}
                </p>
              </div>
              <button
                className="text-red-600 hover:text-red-800 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePerson(person.id);
                }}
                aria-label="Supprimer la capture"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout de personne */}
      <Modal isOpen={showAddPersonModal} onClose={() => setShowAddPersonModal(false)} title="Nouvelle personne" size="sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Identité</label>
        <input
          type="text"
          value={newPersonName}
          onChange={e => setNewPersonName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Nom de la personne"
        />
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors"
            disabled={!newPersonName.trim()}
            onClick={() => {
              if (!previewImage) return;
              const record: PersonRecord = {
                id: `person-${Date.now()}`,
                name: newPersonName.trim(),
                imageUrl: previewImage,
                timestamp: new Date().toISOString(),
                cameraName: selectedCamera?.name || 'Caméra locale',
                location: selectedCamera?.location || ''
              };
              setPeople(prev => [record, ...prev]);
              setShowAddPersonModal(false);
              setNewPersonName('');
            }}
          >
            Enregistrer
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg"
            onClick={() => setShowAddPersonModal(false)}
          >
            Annuler
          </button>
        </div>
      </Modal>

      {/* Modal de visualisation de personne */}
      <Modal
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        title={selectedPerson?.name}
        size="md"
      >
        {selectedPerson && (
          <>
            <img
              src={selectedPerson.imageUrl}
              alt={selectedPerson.name}
              className="w-full h-auto object-contain rounded-lg border border-powder-blue/30 mb-4"
            />
            <div className="text-sm text-berkeley-blue/80 space-y-1">
              <p>Date/heure : <span className="font-medium text-oxford-blue">{new Date(selectedPerson.timestamp).toLocaleString()}</span></p>
              <p>Caméra : <span className="font-medium text-oxford-blue">{selectedPerson.cameraName}</span></p>
              {selectedPerson.location && (
                <p>Lieu : <span className="font-medium text-oxford-blue">{selectedPerson.location}</span></p>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FacialRecognition;