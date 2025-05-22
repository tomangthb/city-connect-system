
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export default function NotificationsPopover() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications data
  useEffect(() => {
    // In a real app, fetch notifications from the server
    const mockNotifications = [
      {
        id: '1',
        title: language === 'uk' ? 'Нове повідомлення' : 'New message',
        message: language === 'uk' ? 'Ваше звернення було розглянуто' : 'Your appeal has been reviewed',
        date: '2025-05-22T10:30:00',
        read: false
      },
      {
        id: '2',
        title: language === 'uk' ? 'Оновлення статусу' : 'Status update',
        message: language === 'uk' ? 'Зміна статусу сервісу: "Оформлення документів"' : 'Service status change: "Document processing"',
        date: '2025-05-21T14:45:00',
        read: false
      },
      {
        id: '3',
        title: language === 'uk' ? 'Нагадування' : 'Reminder',
        message: language === 'uk' ? 'Нагадування про майбутню подію' : 'Reminder about upcoming event',
        date: '2025-05-20T09:15:00',
        read: true
      }
    ];
    
    setNotifications(mockNotifications);
    
    // Count unread notifications
    const unread = mockNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  }, [language]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    // Update unread count
    const unread = notifications.filter(notification => !notification.read && notification.id !== id).length;
    setUnreadCount(unread);
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    toast({
      title: t('allNotificationsRead'),
      description: t('markedAllAsRead')
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return language === 'uk' ? 'Сьогодні' : 'Today';
    } else if (diffDays === 1) {
      return language === 'uk' ? 'Вчора' : 'Yesterday';
    } else {
      return new Date(dateString).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US');
    }
  };

  const getTimeFromDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(
      language === 'uk' ? 'uk-UA' : 'en-US', 
      { hour: '2-digit', minute: '2-digit' }
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="p-4 bg-muted/50 flex items-center justify-between">
          <h3 className="font-medium">{t('notifications')}</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification, index) => (
                <div key={notification.id} className={`p-4 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(notification.date)} {getTimeFromDate(notification.date)}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{notification.message}</p>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)} 
                      className="text-xs text-primary mt-2"
                    >
                      {t('markAsRead')}
                    </Button>
                  )}
                  {index < notifications.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {t('noNotifications')}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
