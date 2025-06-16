export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  notification_settings: NotificationSettings;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  language: string;
  notification_settings: NotificationSettings;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  missionUpdates: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
  newClients: boolean;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 