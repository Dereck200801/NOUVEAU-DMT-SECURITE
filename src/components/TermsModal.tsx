import React from 'react';
import Modal from './ui/modal';
import { useNavigate } from 'react-router-dom';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept }) => {
  const navigate = useNavigate();

  const goToLegal = () => {
    // Navigate to settings with legal tab selected
    navigate('/settings?tab=legal');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Conditions & Confidentialité" size="lg" hideCloseButton>
      <div className="space-y-4 text-sm">
        <p>
          Afin de poursuivre l'utilisation de la plateforme <strong>DMT&nbsp;Sécurité</strong>, vous devez prendre
          connaissance et accepter nos Conditions Générales d'Utilisation (CGU) ainsi que notre Politique de
          confidentialité détaillant la collecte et le traitement des données, notamment les images et données
          biométriques issues de la caméra.
        </p>
        <p>
          Les principaux points :
        </p>
        <ul className="list-disc list-inside pl-4 space-y-1">
          <li>Utilisation des caméras pour la détection et la vérification faciale dans un but de sûreté.</li>
          <li>Conservation des images 30&nbsp;jours maximum (sauf obligation légale).</li>
          <li>Chiffrement des données et accès restreint aux personnels habilités.</li>
          <li>Droits RGPD : accès, rectification, effacement, opposition, portabilité.</li>
        </ul>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={goToLegal}
          >
            Lire la politique complète
          </button>
          <button
            className="px-4 py-2 rounded bg-accent text-white text-sm hover:bg-blue-700"
            onClick={onAccept}
          >
            J'accepte
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal; 