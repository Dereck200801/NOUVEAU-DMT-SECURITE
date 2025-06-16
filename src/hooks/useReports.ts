import { useState, useCallback } from 'react';
import type { Report } from '../types/report';

// Initial reports data
const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    title: 'Rapport mensuel - Novembre 2023',
    type: 'Mensuel',
    date: '30/11/2023',
    author: 'Admin DMT',
    size: '2.4 MB',
    status: 'finalized',
    description: 'Rapport mensuel des activités et incidents pour le mois de novembre 2023'
  },
  {
    id: 2,
    title: 'Rapport d\'incident - Carrefour Mont-Bouët',
    type: 'Incident',
    date: '15/11/2023',
    author: 'Pierre Mbemba',
    size: '1.8 MB',
    status: 'finalized',
    description: 'Rapport détaillé de l\'incident survenu le 15/11/2023 au Carrefour Mont-Bouët'
  },
  // ... Add other initial reports here
];

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const addReport = useCallback((newReport: Partial<Report>) => {
    const report: Report = {
      ...newReport,
      id: Math.max(...reports.map(r => r.id)) + 1,
      date: new Date().toLocaleDateString('fr-FR'),
      size: '0 KB',
      status: 'Brouillon',
    } as Report;

    setReports(prev => [...prev, report]);
  }, [reports]);

  const updateReport = useCallback((id: number, updatedReport: Partial<Report>) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updatedReport } : report
    ));
  }, []);

  const deleteReport = useCallback((id: number) => {
    setReports(prev => prev.filter(report => report.id !== id));
  }, []);

  const downloadReport = useCallback((id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    // In a real application, this would trigger a download from your backend
    console.log(`Downloading report: ${report.title}`);
    // Simulate download with a dummy PDF
    const dummyContent = `Report Content for ${report.title}`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [reports]);

  // Get paginated reports
  const getPaginatedReports = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return reports.slice(startIndex, endIndex);
  }, [reports, currentPage, itemsPerPage]);

  // Get total pages
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  // Get report types
  const reportTypes = [...new Set(reports.map(report => report.type))];

  return {
    reports,
    currentPage,
    itemsPerPage,
    totalPages,
    reportTypes,
    setCurrentPage,
    addReport,
    updateReport,
    deleteReport,
    downloadReport,
    getPaginatedReports,
  };
};

export type { Report }; 