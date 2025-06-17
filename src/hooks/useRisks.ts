import { useState, useCallback } from 'react';
import type { Risk } from '../types/risk';

// Sample initial risks – used until backend API is connected
const INITIAL_RISKS: Risk[] = [
  {
    id: 1,
    title: 'Intrusion non autorisée – Siège social',
    description: 'Accès non autorisé détecté à l\'entrée principale du siège social durant la nuit.',
    category: 'Physical',
    severity: 'high',
    likelihood: 'medium',
    impact: 'high',
    status: 'active',
    owner: 'Service Sécurité',
    dateIdentified: '05/12/2023',
  },
  {
    id: 2,
    title: 'Panne prolongée du système CCTV',
    description: 'Les caméras de vidéosurveillance du dépôt sont restées hors service pendant plus de 3 heures.',
    category: 'Operational',
    severity: 'medium',
    likelihood: 'high',
    impact: 'medium',
    status: 'mitigated',
    owner: 'IT & Sécurité',
    dateIdentified: '12/11/2023',
  },
  {
    id: 3,
    title: 'Fuite de données client',
    description: 'Export non autorisé de la base de données clients détecté.',
    category: 'Cyber',
    severity: 'high',
    likelihood: 'low',
    impact: 'high',
    status: 'active',
    owner: 'DSI',
    dateIdentified: '20/10/2023',
  },
];

export const useRisks = () => {
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const addRisk = useCallback((newRisk: Partial<Risk>) => {
    const risk: Risk = {
      id: Math.max(...risks.map(r => r.id)) + 1,
      title: newRisk.title || 'Nouveau risque',
      description: newRisk.description || '',
      category: newRisk.category || 'Operational',
      severity: newRisk.severity || 'low',
      likelihood: newRisk.likelihood || 'low',
      impact: newRisk.impact || 'low',
      status: newRisk.status || 'active',
      owner: newRisk.owner || 'Non assigné',
      dateIdentified: new Date().toLocaleDateString('fr-FR'),
    };

    setRisks(prev => [...prev, risk]);
  }, [risks]);

  const updateRisk = useCallback((id: number, updatedRisk: Partial<Risk>) => {
    setRisks(prev => prev.map(risk => (risk.id === id ? { ...risk, ...updatedRisk } : risk)));
  }, []);

  const deleteRisk = useCallback((id: number) => {
    setRisks(prev => prev.filter(risk => risk.id !== id));
  }, []);

  // Pagination helpers
  const getPaginatedRisks = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return risks.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, risks]);

  const totalPages = Math.ceil(risks.length / itemsPerPage);

  const riskCategories = [...new Set(risks.map(r => r.category))];

  return {
    risks,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    addRisk,
    updateRisk,
    deleteRisk,
    getPaginatedRisks,
    riskCategories,
  };
};

export type { Risk }; 