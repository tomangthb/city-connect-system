
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { Search, UserPlus, Edit, Trash2, Shield, Ban, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CreateUserDialog from './CreateUserDialog';
import EditUserDialog from './EditUserDialog';
import PermissionsDialog from './PermissionsDialog';

interface UserManagementDialogProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  user_type: 'employee' | 'resident';
  address?: string;
  created_at: string;
  roles?: string[];
}

const UserManagementDialog = ({ children }: UserManagementDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          patronymic,
          user_type,
          address,
          created_at
        `);

      if (error) throw error;

      // Fetch user roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            ...profile,
            roles: roleData?.map(r => r.role) || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(language === 'en' ? 'Error loading users' : 'Помилка завантаження користувачів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const filteredUsers = users.filter(user => 
    (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (user: User) => {
    if (!confirm(language === 'en' ? 
      `Are you sure you want to delete user ${user.first_name} ${user.last_name}?` : 
      `Ви впевнені, що хочете видалити користувача ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      setUsers(prev => prev.filter(u => u.id !== user.id));

      await addActivity({
        title: language === 'en' ? `User deleted: ${user.first_name} ${user.last_name}` : `Користувача видалено: ${user.first_name} ${user.last_name}`,
        description: `Deleted user: ${user.email}`,
        type: 'event',
        priority: 'high',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'User deleted successfully' : 'Користувача успішно видалено');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(language === 'en' ? 'Error deleting user' : 'Помилка видалення користувача');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    // Since Supabase doesn't have a direct "active/inactive" status, we'll use this as a placeholder
    toast.info(language === 'en' ? 'User status feature coming soon' : 'Функція статусу користувача незабаром');
  };

  const handleAddUser = async () => {
    try {
      await addActivity({
        title: language === 'en' ? 'User creation initiated' : 'Ініційовано створення користувача',
        description: 'Started user creation process',
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(language === 'en' ? 'User creation form opened' : 'Відкрито форму створення користувача');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'User Management' : 'Управління користувачами'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'en' ? 'Search users...' : 'Пошук користувачів...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <CreateUserDialog onUserCreated={fetchUsers}>
              <Button onClick={handleAddUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Add User' : 'Додати користувача'}
              </Button>
            </CreateUserDialog>
          </div>

          {/* Users List */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {language === 'en' ? 'Loading users...' : 'Завантаження користувачів...'}
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {language === 'en' ? 'No users found' : 'Користувачі не знайдені'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
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
                        <EditUserDialog user={user} onUserUpdated={fetchUsers}>
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </EditUserDialog>
                        <PermissionsDialog user={user} onPermissionsUpdated={fetchUsers}>
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
              ))
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {language === 'en' ? 
                `Showing ${filteredUsers.length} users` :
                `Показано ${filteredUsers.length} користувачів`
              }
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
