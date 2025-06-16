export type RecognitionStatus = 'detected' | 'verified' | 'unknown' | 'error';

export interface BiometricData {
  id: string;
  agentId: number;
  faceVectors: number[];
  createdAt: string;
  updatedAt: string;
}

export interface FaceDetection {
  id: string;
  timestamp: string;
  agentId?: number;
  agentName?: string;
  cameraId: string;
  cameraName: string;
  confidence: number;
  status: RecognitionStatus;
  imageUrl?: string;
  location?: string;
}

export interface AttendanceRecord {
  id: string;
  agentId: number;
  agentName: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  status: 'present' | 'absent' | 'late' | 'early-leave';
  verificationMethod: 'facial' | 'manual' | 'badge';
  location: string;
  missionId?: number;
}

export interface CameraDevice {
  id: string;
  name: string;
  url: string;
  location: string;
  status: 'online' | 'offline' | 'error';
  type: 'onvif' | 'rtsp' | 'http';
  credentials?: {
    username: string;
    password: string;
  };
}

export interface FacialRecognitionSettings {
  minConfidence: number;
  enableAttendanceTracking: boolean;
  retentionPeriodDays: number;
  enableNotifications: boolean;
  allowedCameras: string[];
  scheduleEnabled: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  privacyMaskingEnabled: boolean;
} 