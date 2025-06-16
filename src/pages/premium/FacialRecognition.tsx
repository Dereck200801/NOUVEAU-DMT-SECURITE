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
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { facialRecognitionService } from '../../services/facialRecognitionService';
import { 
  CameraDevice, 
  FaceDetection, 
  AttendanceRecord 
} from '../../types/facial-recognition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';

const FacialRecognition: React.FC = () => {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [detections, setDetections] = useState<FaceDetection[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'live' | 'attendance' | 'settings'>('live');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
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
  const connectToCamera = async (camera: CameraDevice) => {
    setSelectedCamera(camera);
    
    // Dans un environnement réel, nous utiliserions l'API ONVIF pour nous connecter à la caméra
    // Ici, nous simulons avec la webcam de l'utilisateur pour la démonstration
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra:", error);
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
        // Simuler une nouvelle détection
        const newDetection: FaceDetection = {
          id: `detection-${Date.now()}`,
          timestamp: new Date().toISOString(),
          agentId: 123,
          agentName: "Jean Dupont",
          cameraId: selectedCamera?.id || "",
          cameraName: selectedCamera?.name || "",
          confidence: 0.92,
          status: "verified",
          imageUrl: canvasRef.current?.toDataURL() || "",
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
        <button className="inline-flex items-center px-4 py-2 bg-yale-blue text-white rounded-lg hover:bg-berkeley-blue transition-colors">
          <FontAwesomeIcon icon={faCamera} className="mr-2" />
          Nouvelle capture
        </button>
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
            <div className="aspect-video bg-powder-blue/10 rounded-lg flex items-center justify-center border-2 border-dashed border-powder-blue/30">
              <div className="text-center">
                <FontAwesomeIcon icon={faCamera} className="text-berkeley-blue/50 text-3xl mb-3" />
                <p className="text-sm text-berkeley-blue/70">Cliquez pour activer la caméra</p>
              </div>
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
            <div className="aspect-video bg-powder-blue/10 rounded-lg flex items-center justify-center border-2 border-dashed border-powder-blue/30">
              <div className="text-center">
                <FontAwesomeIcon icon={faUpload} className="text-berkeley-blue/50 text-3xl mb-3" />
                <p className="text-sm text-berkeley-blue/70">Glissez-déposez ou cliquez pour importer</p>
              </div>
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
              <button className="w-full flex items-center p-3 bg-powder-blue/10 rounded-lg hover:bg-powder-blue/20 transition-colors">
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
    </div>
  );
};

export default FacialRecognition;