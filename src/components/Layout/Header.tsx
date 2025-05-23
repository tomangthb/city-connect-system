
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, User, LogOut, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationsPopover from '@/components/Notifications/NotificationsPopover';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userType: 'employee' | 'resident';
  userName?: string;
}

const Header = ({ userType, userName = 'User' }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  // Handle settings click
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img src="/placeholder.svg" alt="City Logo" className="h-10 w-10" />
          </Link>
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
          
          {user ? (
            <>
              <NotificationsPopover />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="h-4 w-4 mr-2" />
                    {t('settings')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              {t('login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
