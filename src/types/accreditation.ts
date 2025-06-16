export type AccreditationType = 'certification' | 'license' | 'training' | 'clearance' | 'badge';
export type AccreditationStatus = 'valid' | 'expiring' | 'expired' | 'revoked' | 'pending';

export interface Accreditation {
  id: string;
  agentId: number;
  agentName: string;
  type: AccreditationType;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  documentId: string;
  status: AccreditationStatus;
  verificationStatus: 'verified' | 'unverified' | 'rejected';
  verificationDate?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface AccreditationDocument {
  id: string;
  accreditationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  scanStatus: 'pending' | 'processed' | 'failed';
  ocrData?: OCRData;
  fileUrl: string;
}

export interface OCRData {
  fullText: string;
  fields: {
    name?: string;
    issuer?: string;
    issueDate?: string;
    expiryDate?: string;
    holderName?: string;
    documentNumber?: string;
    [key: string]: string | undefined;
  };
  confidence: number;
}

export interface AccreditationNotification {
  id: string;
  accreditationId: string;
  agentId: number;
  type: 'expiring' | 'expired' | 'revoked' | 'updated';
  message: string;
  date: string;
  isRead: boolean;
  daysRemaining?: number;
}

export interface AccreditationRequirement {
  id: string;
  name: string;
  description: string;
  type: AccreditationType;
  isRequired: boolean;
  validityPeriod?: number; // in days
  warningThreshold?: number; // in days
  clientId?: number; // if specific to a client
  missionType?: string; // if specific to a mission type
}

export interface AccreditationStats {
  total: number;
  valid: number;
  expiring: number;
  expired: number;
  revoked: number;
  pending: number;
  byType: Record<AccreditationType, number>;
} 