
import React from 'react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu/UserMenu';
import LanguageToggle from './LanguageToggle/LanguageToggle';
import NotificationsPopover from './Notifications/NotificationsPopover';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  userType: 'employee' | 'resident' | null;
  userName: string;
  onOpenSettings?: () => void;
}

const Header = ({ userType, userName, onOpenSettings }: HeaderProps) => {
  const { t } = useLanguage();
  
  const getPortalTitle = () => {
    if (userType === 'employee') {
      return t('employeePortal');
    } else if (userType === 'resident') {
      return t('residentPortal');
    }
    return t('appTitle');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getPortalTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <NotificationsPopover />
          <UserMenu userName={userName} onOpenSettings={onOpenSettings} />
        </div>
      </div>
    </header>
  );
};

export default Header;
