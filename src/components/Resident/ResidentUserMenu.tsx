
import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ResidentUserMenuProps {
  userName: string;
}

const ResidentUserMenu = ({ userName }: ResidentUserMenuProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await signOut();
      window.location.href = '/resident-auth';
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(language === 'en' ? 'Error during logout' : 'Помилка при виході');
    }
  };
  
  const handleSettings = () => {
    navigate('/resident-account');
  };
  
  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0 theme-transition">
          <Avatar className="h-8 w-8 avatar-shadow">
            <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium theme-transition">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-background border border-border shadow-md z-50 theme-transition"
      >
        <DropdownMenuItem 
          onClick={handleSettings}
          className="hover:bg-accent theme-transition"
        >
          <Settings className="h-4 w-4 mr-2" />
          {language === 'en' ? 'My Account' : 'Мій акаунт'}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="hover:bg-accent theme-transition text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Logout' : 'Вийти'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResidentUserMenu;
