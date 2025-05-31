
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import EditUserDialog from './EditUserDialog';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  user_type: 'employee' | 'resident';
  address: string;
  phone: string;
  created_at: string;
  roles: string[];
  status: string;
}

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
}

const UserActions = ({ user, onUserUpdated }: UserActionsProps) => {
  const { language } = useLanguage();

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'Ви впевнені, що хочете видалити цього користувача?')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      onUserUpdated();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex gap-2 ml-4">
      <EditUserDialog user={user} onUserUpdated={onUserUpdated}>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Edit' : 'Редагувати'}
        </Button>
      </EditUserDialog>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => handleDeleteUser(user.id)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {language === 'en' ? 'Delete' : 'Видалити'}
      </Button>
    </div>
  );
};

export default UserActions;
