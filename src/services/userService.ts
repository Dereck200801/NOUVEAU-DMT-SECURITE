import { ProfileFormData, NotificationSettings } from '../types/user';

class UserService {
  async getProfile() {
    // TODO: Implement actual API call
    return {
      notification_settings: {
        emailAlerts: true,
        missionUpdates: true,
        weeklyReports: true,
        systemAlerts: false,
        newClients: true
      }
    };
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    // TODO: Implement actual API call
    return settings;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    // TODO: Implement actual API call
    return true;
  }
}

export const userService = new UserService(); 