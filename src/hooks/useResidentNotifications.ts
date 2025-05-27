
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

export const useResidentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Ініціалізація сповіщень для громадян
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Нове повідомлення про комунальні послуги',
        message: 'Ваш рахунок за комунальні послуги готовий до перегляду',
        isRead: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Оновлення статусу звернення',
        message: 'Ваше звернення №12345 перебуває в обробці',
        isRead: false,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Міські новини',
        message: 'Нові зміни в графіку роботи адміністративних служб',
        isRead: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    setNotifications(initialNotifications);
  }, []);

  return { notifications, setNotifications };
};
