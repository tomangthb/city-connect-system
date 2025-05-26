
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Shield, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';
import EditUserDialog from './EditUserDialog';
import PermissionsDialog from './PermissionsDialog';
import { User } from './types/User';

interface UsersListProps {
  users: User[];
  loading: boolean;
  onUserUpdated: () => void;
  language: string;
}

const UsersList = ({ users, loading, onUserUpdated, language }: UsersListProps) => {
  const handleDeleteUser = async (user: User) => {
    if (!confirm(language === 'en' ? 
      `Are you sure you want to delete user ${user.first_name} ${user.last_name}?` : 
      `Ви впевнені, що хочете видалити користувача ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `User deleted: ${user.first_name} ${user.last_name}` : `Користувача видалено: ${user.first_name} ${user.last_name}`,
        description: `Deleted user: ${user.email}`,
        type: 'event',
        priority: 'high',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'User deleted successfully' : 'Користувача успішно видалено');
      onUserUpdated();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(language === 'en' ? 'Error deleting user' : 'Помилка видалення користувача');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    toast.info(language === 'en' ? 'User status feature coming soon' : 'Функція статусу користувача незабаром');
  };

  const handleEditUser = async (user: User) => {
    try {
      await addActivity({
        title: language === 'en' ? `User edit initiated: ${user.first_name} ${user.last_name}` : `Ініційовано редагування користувача: ${user.first_name} ${user.last_name}`,
        description: `Started editing user: ${user.email}`,
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(language === 'en' ? 'User edit form opened' : 'Відкрито форму редагування користувача');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleManagePermissions = async (user: User) => {
    try {
      await addActivity({
        title: language === 'en' ? `Permissions management opened: ${user.first_name} ${user.last_name}` : `Відкрито управління правами: ${user.first_name} ${user.last_name}`,
        description: `Opened permissions management for user: ${user.email}`,
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      toast.info(language === 'en' ? 'Permissions management opened' : 'Відкрито управління правами');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {language === 'en' ? 'Loading users...' : 'Завантаження користувачів...'}
        </p>
      </div>
    );
  }

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
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
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
                  <p className="text-xs text-gray-400">
                    {language === 'en' ? 'Roles:' : 'Ролі:'} {user.roles?.join(', ') || 'None'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={user.user_type === 'employee' ? 'default' : 'secondary'}>
                    {user.user_type === 'employee' ? 
                      (language === 'en' ? 'Employee' : 'Працівник') : 
                      (language === 'en' ? 'Resident' : 'Мешканець')
                    }
                  </Badge>
                  <Badge variant="default">
                    {language === 'en' ? 'Active' : 'Активний'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {language === 'en' ? 'Joined:' : 'Приєднався:'} {new Date(user.created_at).toLocaleDateString()}
                </span>
                <EditUserDialog user={user} onUserUpdated={onUserUpdated}>
                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditUserDialog>
                <PermissionsDialog user={user} onPermissionsUpdated={onUserUpdated}>
                  <Button variant="ghost" size="sm" onClick={() => handleManagePermissions(user)}>
                    <Shield className="h-4 w-4" />
                  </Button>
                </PermissionsDialog>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleToggleUserStatus(user)}
                  className="text-yellow-600 hover:text-yellow-700"
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
