
import React from 'react';
import { LogOut } from 'lucide-react';
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
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import SettingsDialog from '@/components/Employee/Dialogs/SettingsDialog';

interface UserMenuProps {
  userName: string;
  onOpenSettings?: () => void;
}

const UserMenu = ({ userName, onOpenSettings }: UserMenuProps) => {
  const { signOut, user } = useAuth();
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
        <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md z-50">
        <SettingsDialog>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {t('settings')}
          </DropdownMenuItem>
        </SettingsDialog>
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
