import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hideCloseButton = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Fermer si on clique sur l'overlay uniquement
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl p-6 animate-scale-in`}
      >
        {/* En-tête */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between mb-4">
            {title && <h2 className="text-lg font-bold text-oxford-blue">{title}</h2>}
            {!hideCloseButton && (
              <button
                className="text-berkeley-blue hover:text-yale-blue transition-colors"
                onClick={onClose}
                aria-label="Fermer la fenêtre"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        )}

        {/* Contenu */}
        {children}
      </div>
    </div>
  );
};

export default Modal; 