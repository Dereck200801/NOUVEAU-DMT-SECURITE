export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
} 