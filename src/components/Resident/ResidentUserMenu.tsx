
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
    toast.success(language === 'en' ? 'Settings opened' : 'Налаштування відкрито');
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
        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-green-100 text-green-600">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md z-50">
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Settings' : 'Налаштування'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Logout' : 'Вийти'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResidentUserMenu;
