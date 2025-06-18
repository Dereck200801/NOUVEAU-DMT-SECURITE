import React from 'react';
import { Agent } from '../types/agent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faPhone, faBriefcase, faCalendarAlt, faFileAlt, faGraduationCap, faHistory } from '@fortawesome/free-solid-svg-icons';
import ProfessionalCard from './ProfessionalCard';
import MissionHistoryTable from './MissionHistoryTable';

interface AgentSummaryProps {
  agent: Agent;
  onClose: () => void;
}

const AgentSummary: React.FC<AgentSummaryProps> = ({ agent, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Dossier Agent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="p-6 space-y-8 md:space-y-10 overflow-y-auto">
          <div className="flex items-center gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${agent.name.replace(' ', '+')}&background=1d4ed8&color=fff&size=96`}
              alt={agent.name}
              className="w-24 h-24 rounded-full shadow-md"
            />
            <div>
              <h3 className="text-2xl font-semibold mb-1">{agent.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{agent.specialty}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700 border-b pb-4">
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="text-accent mr-2" /> {agent.email}
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="text-accent mr-2" /> {agent.phone}
            </p>
            <p>
              <FontAwesomeIcon icon={faBriefcase} className="text-accent mr-2" /> Statut : {agent.status}
            </p>
            <p>
              <FontAwesomeIcon icon={faCalendarAlt} className="text-accent mr-2" /> Embauché le : {agent.joinDate}
            </p>
          </div>

          {/* Cartes professionnelles */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">Carte Professionnelle</h4>
            <div className="grid sm:grid-cols-2 gap-6 place-items-center">
              <ProfessionalCard variant="front" />
              <ProfessionalCard agent={agent} />
            </div>
          </div>

          {/* Formation & certifications */}
          {(agent.education || (agent.certifications && agent.certifications.length)) && (
            <div>
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-accent" /> Formation & Certifications
              </h4>
              {agent.education && <p className="mb-2 text-sm">{agent.education}</p>}
              {agent.certifications && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {agent.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Accréditations */}
          {agent.specializations && agent.specializations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faBriefcase} className="text-accent" /> Spécialisations / Accréditations
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {agent.specializations.map((s,i)=>(<li key={i}>{s}</li>))}
              </ul>
            </div>
          )}

          {/* Deux colonnes de contenu détaillé */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Documents */}
              {agent.documents && agent.documents.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileAlt} className="text-accent" /> Documents ({agent.documents.length})
                  </h4>
                  <ul className="text-sm space-y-1">
                    {agent.documents.map((doc) => (
                      <li key={doc.id} className="flex justify-between border-b pb-0.5">
                        <span>{doc.name}</span>
                        <span className="text-gray-500">{doc.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missions */}
              {agent.missionHistory && agent.missionHistory.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-accent" /> Missions
                  </h4>
                  <MissionHistoryTable missions={agent.missionHistory} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSummary; 