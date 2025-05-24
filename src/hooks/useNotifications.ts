
import { useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Appeal Submitted',
      message: 'A new citizen appeal has been submitted for review.',
      isRead: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: '2',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin at 2:00 AM tonight.',
      isRead: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    }
  ]);

  return { notifications, setNotifications };
};
