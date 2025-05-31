
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationsPopover from '@/components/Layout/Notifications/NotificationsPopover';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

interface ResidentHeaderProps {
  userName: string;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onLogout: () => void;
}

const ResidentHeader = ({ userName, notifications, setNotifications, onLogout }: ResidentHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-green-900">
            {language === 'en' ? 'Resident Portal' : 'Портал громадянина'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={toggleLanguage} className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            {language === 'en' ? 'УКР' : 'ENG'}
          </Button>
          
          <NotificationsPopover 
            notifications={notifications}
            setNotifications={setNotifications}
          />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {language === 'en' ? 'Welcome,' : 'Вітаємо,'} {userName}
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Logout' : 'Вийти'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResidentHeader;
