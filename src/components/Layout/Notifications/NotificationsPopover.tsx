
import React from 'react';
import { Bell, BellDot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast.success(t('allNotificationsMarkedAsRead') || 'All notifications marked as read');
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success(t('allNotificationsCleared') || 'All notifications cleared');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-white hover:text-gray-200">
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 max-h-[500px] bg-gray-900 border-gray-700 shadow-xl">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-white text-lg">
              {t('notifications') || 'Повідомлення'}
            </h3>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-blue-400 hover:text-blue-300 h-auto p-1"
                    onClick={markAllAsRead}
                  >
                    {t('markAllRead') || 'Позначити всі як прочитані'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-red-400 hover:text-red-300 h-auto p-1"
                  onClick={clearAllNotifications}
                >
                  <X className="h-3 w-3 mr-1" />
                  {t('clearAll') || 'Очистити все'}
                </Button>
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {t('unreadNotifications') || `${unreadCount} непрочитаних повідомлень`}
            </p>
          )}
        </div>
        
        {notifications.length > 0 ? (
          <ScrollArea className="max-h-96">
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {t('noNotifications') || 'Немає повідомлень'}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {t('notificationsAppearHere') || 'Повідомлення з\'являтимуться тут'}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
