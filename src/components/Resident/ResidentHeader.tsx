
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import NotificationsPopover from '@/components/Layout/Notifications/NotificationsPopover';
import ResidentUserMenu from './ResidentUserMenu';
import ThemeToggle from '@/components/Layout/ThemeToggle/ThemeToggle';

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

const ResidentHeader = ({ userName, notifications, setNotifications }: ResidentHeaderProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4 theme-transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">
            {language === 'en' ? 'Resident Portal' : 'Портал громадянина'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={toggleLanguage} 
            className="flex items-center theme-transition hover:bg-accent"
          >
            <Globe className="h-5 w-5 mr-2" />
            {language === 'en' ? 'УКР' : 'ENG'}
          </Button>
          
          <ThemeToggle />
          
          <NotificationsPopover 
            notifications={notifications}
            setNotifications={setNotifications}
          />
          
          <ResidentUserMenu userName={userName} />
        </div>
      </div>
    </header>
  );
};

export default ResidentHeader;
