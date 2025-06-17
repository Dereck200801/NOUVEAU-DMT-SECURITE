import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUser, faCalendarAlt, faPlus, faSpinner, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Training } from '../types/training';
import { useTrainings } from '../context/TrainingContext';
import TrainingForm from './TrainingForm';

const colClasses = 'px-4 py-3 flex items-center';

const TrainingsListGrid: React.FC = () => {
  const { trainings, add, update, remove } = useTrainings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | null; training?: Training }>({ mode: null });

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (training: Training) => setModal({ mode: 'edit', training });
  const closeModal = () => setModal({ mode: null });

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (modal.mode === 'create') await add(data);
      else if (modal.mode === 'edit' && modal.training) await update(modal.training.id, data);
      closeModal();
    } catch (e) {
      setError('Erreur sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const statusChip = (s: Training['status']) => {
    const map: Record<Training['status'], string> = {
      completed: 'bg-success/10 text-success',
      in_progress: 'bg-warning/10 text-warning',
      scheduled: 'bg-gray-200 text-gray-600',
    };
    const labels: Record<Training['status'], string> = {
      completed: 'Terminée',
      in_progress: 'En cours',
      scheduled: 'Planifiée',
    };
    return <span className={`${map[s]} text-xs rounded-full px-3 py-1`}>{labels[s]}</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faGraduationCap} /> Formations
        </h2>
        <button onClick={openCreate} className="bg-yale-blue hover:bg-berkeley-blue text-white rounded-lg px-3 py-2 text-sm flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Nouvelle formation
        </button>
      </div>

      {/* Grid Header */}
      <div className="hidden md:grid grid-cols-12 bg-light text-xs text-gray-500 font-medium border-b border-gray-200">
        <div className={`${colClasses} col-span-3`}>Formation</div>
        <div className={`${colClasses} col-span-2`}>Agent</div>
        <div className={`${colClasses} col-span-3`}>Dates</div>
        <div className={`${colClasses} col-span-2`}>Statut</div>
        <div className={`${colClasses} col-span-1 justify-center`}>Score</div>
        <div className={`${colClasses} col-span-1 justify-end`}>Actions</div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-yale-blue text-2xl" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-danger text-sm">{error}</div>
      ) : (
        <div>
          {trainings.map((t) => (
            <div key={t.id} className="grid grid-cols-1 md:grid-cols-12 border-b border-gray-100 hover:bg-gray-50 text-sm">
              <div className={`${colClasses} col-span-3`}>
                <FontAwesomeIcon icon={faGraduationCap} className="text-yale-blue mr-2" /> {t.name}
              </div>
              <div className={`${colClasses} col-span-2`}>
                <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" /> {t.agentName}
              </div>
              <div className={`${colClasses} col-span-3 text-xs`}>
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
              </div>
              <div className={`${colClasses} col-span-2`}>{statusChip(t.status)}</div>
              <div className={`${colClasses} col-span-1 justify-center`}>{t.score ?? '—'}</div>
              <div className={`${colClasses} col-span-1 justify-end space-x-3`}>
                <button onClick={() => openEdit(t)} className="text-yale-blue hover:text-berkeley-blue text-sm">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => { if (confirm('Supprimer cette formation ?')) remove(t.id);} } className="text-danger hover:text-red-700 text-sm">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {trainings.length === 0 && (
            <div className="p-6 text-center text-gray-500">Aucune formation trouvée</div>
          )}
        </div>
      )}

      {modal.mode && (
        <TrainingForm
          training={modal.training}
          isEdit={modal.mode === 'edit'}
          onCancel={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TrainingsListGrid; 