import React, { useState } from 'react';
import Modal from '../ui/modal';
import { Agent } from '../../types/agent';

interface Props {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (missionId: number) => Promise<void>;
}

/**
 * Small dialog to assign an agent to a mission.
 * Uses a simple numeric input for mission id (can be evolved later).
 */
const AssignAgentModal: React.FC<Props> = ({ agent, isOpen, onClose, onAssign }) => {
  const [missionId, setMissionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const id = parseInt(missionId, 10);
    if (!id) return;
    setSubmitting(true);
    try {
      await onAssign(id);
      setMissionId('');
      onClose();
    } catch (err) {
      console.error(err);
      // Maybe show toast
      alert("Impossible d'affecter l'agent. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Affecter ${agent?.name || ''}`} size="sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="missionId" className="block text-sm font-medium text-gray-700">
            ID de la mission
          </label>
          <input
            id="missionId"
            type="number"
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="123"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-muted hover:bg-gray-200 text-sm"
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm"
            disabled={submitting || !missionId}
          >
            {submitting ? '...' : 'Affecter'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignAgentModal; 