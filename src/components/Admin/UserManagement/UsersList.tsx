
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Shield, Ban, Trash2, Key } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EditUserDialog from './EditUserDialog';
import UserPermissionsDialog from './UserPermissionsDialog';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  user_type: 'employee' | 'resident';
  address?: string;
  phone?: string;
  created_at: string;
  roles?: string[];
  status: string;
}

interface UsersListProps {
  users: User[];
  onUserUpdated: () => void;
}

const UsersList = ({ users, onUserUpdated }: UsersListProps) => {
  const { language } = useLanguage();

  const handleDeleteUser = async (user: User) => {
    if (!confirm(language === 'en' ? 
      `Are you sure you want to delete user ${user.first_name} ${user.last_name}?` : 
      `Ви впевнені, що хочете видалити користувача ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      toast.success(language === 'en' ? 'User deleted successfully' : 'Користувача успішно видалено');
      onUserUpdated();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(language === 'en' ? 'Error deleting user' : 'Помилка видалення користувача');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(
        language === 'en' 
          ? `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
          : `Користувача ${newStatus === 'active' ? 'активовано' : 'деактивовано'} успішно`
      );
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(language === 'en' ? 'Error updating user status' : 'Помилка оновлення статусу користувача');
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {language === 'en' ? 'No users found' : 'Користувачі не знайдені'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">
                    {user.first_name} {user.last_name} {user.patronymic}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.phone && (
                    <p className="text-xs text-gray-400">{user.phone}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                      {language === 'en' ? 'Roles:' : 'Ролі:'} {user.roles?.join(', ') || 'None'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Badge variant={user.user_type === 'employee' ? 'default' : 'secondary'}>
                    {user.user_type === 'employee' ? 
                      (language === 'en' ? 'Employee' : 'Працівник') : 
                      (language === 'en' ? 'Resident' : 'Мешканець')
                    }
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status === 'active' ? 
                      (language === 'en' ? 'Active' : 'Активний') : 
                      (language === 'en' ? 'Inactive' : 'Неактивний')
                    }
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {language === 'en' ? 'Joined:' : 'Приєднався:'} {new Date(user.created_at).toLocaleDateString()}
                </span>
                <EditUserDialog user={user} onUserUpdated={onUserUpdated}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditUserDialog>
                <UserPermissionsDialog user={user} onUserUpdated={onUserUpdated}>
                  <Button variant="ghost" size="sm">
                    <Key className="h-4 w-4" />
                  </Button>
                </UserPermissionsDialog>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleToggleUserStatus(user)}
                  className={user.status === 'active' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                >
                  <Ban className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteUser(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsersList;
