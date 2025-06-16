import { api } from "../api";
import type { Report, ReportStats } from '../types/report';

// Types
export interface CreateReportDTO {
  title: string;
  type: string;
  description: string;
  content?: string;
  attachments?: File[];
}

export interface UpdateReportDTO {
  title?: string;
  type?: string;
  description?: string;
  content?: string;
  status?: Report['status'];
}

export const reportService = {
  // Récupérer tous les rapports
  getAllReports: () => api.get<Report[]>('/reports'),

  // Récupérer un rapport par son ID
  getReportById: (id: number) => api.get<Report>(`/reports/${id}`),

  // Créer un nouveau rapport
  createReport: (data: CreateReportDTO) => {
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'attachments') {
          value.forEach((file: File) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, value);
        }
      });
      return api.post<Report>('/reports', formData);
    }
    return api.post<Report>('/reports', data);
  },

  // Mettre à jour un rapport
  updateReport: (id: number, data: UpdateReportDTO) => api.put<Report>(`/reports/${id}`, data),

  // Supprimer un rapport
  deleteReport: (id: number) => api.delete<void>(`/reports/${id}`),

  // Télécharger un rapport
  downloadReport: async (id: number): Promise<Blob> => {
    try {
      const response = await fetch(`http://localhost:3001/api/reports/${id}/download`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      return await response.blob();
    } catch (error) {
      console.error(`Error downloading report with id ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les types de rapports disponibles
  getReportTypes: () => api.get<string[]>('/reports/types'),

  // Ajouter une pièce jointe à un rapport
  addAttachment: (reportId: number, file: File) => {
    const formData = new FormData();
    formData.append('attachment', file);
    return api.post<{ attachmentUrl: string }>(`/reports/${reportId}/attachments`, formData);
  },

  // Supprimer une pièce jointe d'un rapport
  removeAttachment: (reportId: number, attachmentId: string) => 
    api.delete<void>(`/reports/${reportId}/attachments/${attachmentId}`),

  // Changer le statut d'un rapport
  updateStatus: (reportId: number, status: Report['status']) => 
    api.put<Report>(`/reports/${reportId}/status`, { status }),

  // Get report statistics
  getReportStats: async (): Promise<ReportStats> => {
    try {
      const response = await api.get('/reports/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching report stats:', error);
      return {
        totalMonthly: 0,
        incidents: 0,
        finalized: 0,
        inReview: 0
      };
    }
  }
}; 