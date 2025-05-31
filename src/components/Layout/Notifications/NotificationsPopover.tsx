
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import NotificationItem from './NotificationItem';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationsPopover = ({ 
  notifications, 
  setNotifications 
}: NotificationsPopoverProps) => {
  const { t } = useLanguage();
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    toast.success(t('notificationMarkedAsRead') || 'Notification marked as read');
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success(t('allNotificationsCleared') || 'All notifications cleared');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-96 overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('notifications')}</h3>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={clearAllNotifications}
              >
                {t('clearAll')}
              </Button>
            )}
          </div>
        </div>
        
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>{t('noNotifications')}</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
