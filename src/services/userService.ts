import { ProfileFormData, NotificationSettings } from '../types/user';

class UserService {
  /** Returns the current logged-in user object from localStorage */
  getCurrent(): any {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  /** Persists the provided user object in both `user` and `appUsers` localStorage keys */
  persist(userObj: any) {
    localStorage.setItem('user', JSON.stringify(userObj));
    const allStr = localStorage.getItem('appUsers') || '[]';
    const list = JSON.parse(allStr);
    const idx = list.findIndex((u: any) => u.id === userObj.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...userObj };
    else list.push(userObj);
    localStorage.setItem('appUsers', JSON.stringify(list));
  }

  async getProfile() {
    return this.getCurrent();
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    const user = this.getCurrent();
    if (!user) return null;
    const updated = { ...user, notification_settings: settings };
    this.persist(updated);
    return updated;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const user = this.getCurrent();
    if (!user || user.pwd !== currentPassword) throw new Error('Mot de passe actuel incorrect');
    user.pwd = newPassword;
    this.persist(user);
    return true;
  }
}

export const userService = new UserService(); 