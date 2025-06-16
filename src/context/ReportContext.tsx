import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Report, ReportStats } from '../types/report';
import { reportService } from '../services/reportService';

// Sample data for development (will be replaced by API calls)
const SAMPLE_REPORTS: Report[] = [
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
  {
    id: 3,
    title: 'Évaluation de mission - Protection VIP',
    type: 'Évaluation',
    date: '20/11/2023',
    author: 'Jean Koumba',
    size: '3.2 MB',
    status: 'in_review',
    description: 'Évaluation de la mission de protection VIP pour le Ministère de l\'Intérieur'
  },
  {
    id: 4,
    title: 'Rapport d\'activité - Zone Industrielle',
    type: 'Activité',
    date: '22/11/2023',
    author: 'Marc Bivigou',
    size: '1.5 MB',
    status: 'finalized',
    description: 'Rapport des activités et rondes effectuées dans la Zone Industrielle d\'Oloumi'
  },
  {
    id: 5,
    title: 'Rapport hebdomadaire - Semaine 47',
    type: 'Hebdomadaire',
    date: '26/11/2023',
    author: 'Admin DMT',
    size: '1.9 MB',
    status: 'finalized',
    description: 'Résumé des activités de la semaine 47 (20/11 au 26/11)'
  },
  {
    id: 6,
    title: 'Audit de sécurité - BGFI Bank',
    type: 'Audit',
    date: '18/11/2023',
    author: 'Sophie Ndong',
    size: '4.5 MB',
    status: 'in_review',
    description: 'Audit complet des mesures de sécurité en place à la BGFI Bank'
  },
  {
    id: 7,
    title: 'Rapport de formation - Total Gabon',
    type: 'Formation',
    date: '05/11/2023',
    author: 'Robert Ekomi',
    size: '2.1 MB',
    status: 'draft',
    description: 'Rapport sur la formation de sécurité dispensée aux employés de Total Gabon'
  },
  {
    id: 8,
    title: 'Évaluation des risques - Port de Libreville',
    type: 'Risques',
    date: '10/11/2023',
    author: 'Marie Ondo',
    size: '3.7 MB',
    status: 'finalized',
    description: 'Évaluation complète des risques de sécurité au Port de Libreville'
  }
];

// Sample stats for development
const SAMPLE_STATS: ReportStats = {
  totalMonthly: 12,
  incidents: 3,
  finalized: 8,
  inReview: 4
};

interface ReportContextType {
  reports: Report[];
  reportStats: ReportStats;
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  refreshStats: () => Promise<void>;
  addReport: (report: Omit<Report, 'id'>) => Promise<Report | null>;
  updateReport: (id: number, reportData: Partial<Report>) => Promise<Report | null>;
  deleteReport: (id: number) => Promise<boolean>;
  getReportById: (id: number) => Report | undefined;
  getReportTypes: () => string[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportStats, setReportStats] = useState<ReportStats>(SAMPLE_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(true); // Set to false when API is ready

  // Fetch reports from API or use sample data
  const refreshReports = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Use sample data for development
        setReports(SAMPLE_REPORTS);
      } else {
        // Use real API for production
        const data = await reportService.getAllReports();
        setReports(data);
      }
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch report stats
  const refreshStats = async (): Promise<void> => {
    try {
      if (useMockData) {
        // Use sample stats for development
        setReportStats(SAMPLE_STATS);
      } else {
        // Use real API for production
        const data = await reportService.getReportStats();
        setReportStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch report stats:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    refreshReports();
    refreshStats();
  }, []);

  // Add a new report
  const addReportHandler = async (reportData: Omit<Report, 'id'>): Promise<Report | null> => {
    try {
      if (useMockData) {
        // Mock adding report for development
        const newId = Math.max(...reports.map(r => r.id), 0) + 1;
        const newReport = { ...reportData, id: newId };
        setReports([...reports, newReport]);
        return newReport;
      } else {
        // Use real API for production
        const newReport = await reportService.createReport(reportData);
        if (newReport) {
          setReports([...reports, newReport]);
          await refreshStats();
        }
        return newReport;
      }
    } catch (err) {
      console.error('Failed to add report:', err);
      return null;
    }
  };

  // Update an existing report
  const updateReportHandler = async (id: number, reportData: Partial<Report>): Promise<Report | null> => {
    try {
      if (useMockData) {
        // Mock updating report for development
        const updatedReports = reports.map(report => 
          report.id === id ? { ...report, ...reportData } : report
        );
        setReports(updatedReports);
        const updatedReport = updatedReports.find(r => r.id === id);
        return updatedReport || null;
      } else {
        // Use real API for production
        const updatedReport = await reportService.updateReport(id, reportData);
        if (updatedReport) {
          setReports(reports.map(report => 
            report.id === id ? updatedReport : report
          ));
          await refreshStats();
        }
        return updatedReport;
      }
    } catch (err) {
      console.error(`Failed to update report ${id}:`, err);
      return null;
    }
  };

  // Delete a report
  const deleteReportHandler = async (id: number): Promise<boolean> => {
    try {
      if (useMockData) {
        // Mock deleting report for development
        setReports(reports.filter(report => report.id !== id));
        return true;
      } else {
        // Use real API for production
        const success = await reportService.deleteReport(id);
        if (success) {
          setReports(reports.filter(report => report.id !== id));
          await refreshStats();
        }
        return success;
      }
    } catch (err) {
      console.error(`Failed to delete report ${id}:`, err);
      return false;
    }
  };

  // Get a report by ID
  const getReportById = (id: number): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  // Get all unique report types
  const getReportTypes = (): string[] => {
    const types = new Set(reports.map(report => report.type));
    return Array.from(types);
  };

  return (
    <ReportContext.Provider value={{
      reports,
      reportStats,
      loading,
      error,
      refreshReports,
      refreshStats,
      addReport: addReportHandler,
      updateReport: updateReportHandler,
      deleteReport: deleteReportHandler,
      getReportById,
      getReportTypes,
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}; 