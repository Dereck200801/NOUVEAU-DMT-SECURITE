import React from 'react';
import { Agent } from '../types/agent';

interface ProfessionalCardProps {
  agent?: Agent; // only required for back variant
  variant?: 'front' | 'back';
  avatarUrl?: string;
}

// Default professional card for an agent. The card is sized to match a standard ID card (85.6mm x 54mm)
// using approximate pixel values (340px x 215px @ ~96 DPI). Colors use the design system accent color.

const WIDTH = 'w-[340px]';
const HEIGHT = 'h-[215px]';
const BASE_CLASSES = `${WIDTH} ${HEIGHT} rounded-lg shadow-lg overflow-hidden border border-gray-200 bg-white flex flex-col`;

const ProfessionalCard = React.forwardRef<HTMLDivElement, ProfessionalCardProps>(({ agent, variant = 'back', avatarUrl }, ref) => {
  if (variant === 'front') {
    return (
      <div ref={ref} className={BASE_CLASSES + ' items-center justify-center'}>
        <div className="flex flex-col items-center justify-center text-accent">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h3 className="text-xl font-bold">DMT SÉCURITÉ</h3>
        </div>
      </div>
    );
  }

  if (!agent) return null;
  return (
    <div ref={ref} id="professional-card" className={BASE_CLASSES}>
      {/* Header */}
      <div className="bg-accent flex items-center px-3 py-2 text-white">
        <img
          src="/logo192.png"
          alt="Logo"
          className="w-8 h-8 mr-2"
        />
        <div>
          <h3 className="text-sm font-semibold leading-none">DMT SÉCURITÉ</h3>
          <span className="text-[10px] opacity-80">Carte Professionnelle</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex p-3 gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={avatarUrl ?? `https://ui-avatars.com/api/?name=${agent.name.replace(' ', '+')}&background=1d4ed8&color=fff&size=128`}
            alt={agent.name}
            className="w-24 h-24 rounded-md object-cover border border-gray-300"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between text-[11px] leading-tight flex-1">
          <div>
            <p className="font-bold text-[13px] mb-1">{agent.name}</p>
            <p className="mb-0.5"><span className="font-medium">ID:</span> {agent.id}</p>
            <p className="mb-0.5"><span className="font-medium">Spécialité:</span> {agent.specialty}</p>
            <p className="mb-0.5"><span className="font-medium">Téléphone:</span> {agent.phone}</p>
          </div>
          <div className="text-[10px] text-gray-500">Valide à compter du {agent.joinDate}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-3 py-1 text-[9px] text-gray-600 flex justify-between items-center">
        <span>www.dmtsecurite.com</span>
        <span>Tél: +241 01 02 03 04</span>
      </div>
    </div>
  );
});

export default ProfessionalCard; 