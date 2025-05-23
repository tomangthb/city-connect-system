import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User, LogOut, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface HeaderProps {
  userType: 'employee' | 'resident';
  userName?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

const Header = ({ userType, userName = 'User' }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  // Sample notifications for demonstration
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: t('newTaskAssigned'),
      message: t('youHaveNewTask'),
      isRead: false,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: '2',
      title: t('documentUpdated'),
      message: t('documentWasUpdated'),
      isRead: false,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: '3',
      title: t('meetingReminder'),
      message: t('teamMeetingScheduled'),
      isRead: true,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
    }
  ]);

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Navigate to the portal selection screen
  };

  // Handle change portal
  const handleChangePortal = () => {
    navigate('/'); // Navigate to the portal selection screen
  };
  
  // Handle settings
  const handleSettings = () => {
    toast.success(t('settingsOpened') || 'Settings opened');
    // For now just show a toast, we can implement the settings page later
  };
  
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
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    
    // If user has email, use the first letter
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/placeholder.svg" alt="City Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('appTitle')}</h1>
            <p className="text-sm text-gray-600">
              {userType === 'employee' ? t('employeePortal') : t('residentPortal')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            <Globe className="h-5 w-5 mr-1" />
            {language === 'en' ? 'UA' : 'EN'}
          </Button>
          
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
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.isRead ? 'bg-white' : 'bg-blue-50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>{t('noNotifications')}</p>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
              <DropdownMenuItem onClick={handleChangePortal}>
                <User className="h-4 w-4 mr-2" />
                {t('changePortal') || 'Change Portal'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="h-4 w-4 mr-2" />
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
