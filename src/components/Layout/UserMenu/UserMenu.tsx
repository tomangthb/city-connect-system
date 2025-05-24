
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
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface UserMenuProps {
  userName: string;
}

const UserMenu = ({ userName }: UserMenuProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await signOut();
      
      // Force navigation to root and reset any state
      window.location.href = '/';
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(t('logoutError') || 'Error during logout');
    }
  };
  
  // Handle settings
  const handleSettings = () => {
    toast.success(t('settingsOpened') || 'Settings opened');
    // For now just show a toast, we can implement the settings page later
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

  return (
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
  );
};

export default UserMenu;
