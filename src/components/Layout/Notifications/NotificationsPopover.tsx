
import React from 'react';
import { Bell, X } from 'lucide-react';
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

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast.success(t('allNotificationsMarkedAsRead') || 'All notifications marked as read');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 max-h-[500px] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {t('notifications') || 'Сповіщення'}
              </h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount} нових
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 h-auto p-1"
                    onClick={markAllAsRead}
                  >
                    Позначити всі
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 h-auto p-1"
                  onClick={clearAllNotifications}
                >
                  <X className="h-3 w-3 mr-1" />
                  {t('clearAll') || 'Очистити'}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium mb-1">Немає сповіщень</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Коли з'являться нові сповіщення, ви побачите їх тут
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
