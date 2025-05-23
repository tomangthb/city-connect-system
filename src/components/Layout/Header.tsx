
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from './LanguageToggle/LanguageToggle';
import NotificationsPopover from './Notifications/NotificationsPopover';
import UserMenu from './UserMenu/UserMenu';

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
  const { t } = useLanguage();
  
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
          <LanguageToggle />
          <NotificationsPopover 
            notifications={notifications} 
            setNotifications={setNotifications} 
          />
          <UserMenu userName={userName} />
        </div>
      </div>
    </header>
  );
};

export default Header;
