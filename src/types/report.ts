export interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  author: string;
  content: string;
  description: string;
  fileUrl?: string;
  size?: string;
  status: 'draft' | 'published' | 'archived' | 'in_review' | 'finalized';
  created_at?: string;
  updated_at?: string;
}

export interface ReportStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  in_review: number;
  finalized: number;
}

export interface ReportFormProps {
  report?: Report;
  onSubmit: (report: Report) => void;
  onCancel: () => void;
}

export interface ReportDetailsProps {
  report: Report;
  onClose: () => void;
}

export type NewReport = Omit<Report, 'id' | 'created_at' | 'updated_at'>;

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: Report;
  mode: 'view' | 'create' | 'edit';
  onSave?: (report: Partial<Report>) => void;
  reportTypes: string[];
} 