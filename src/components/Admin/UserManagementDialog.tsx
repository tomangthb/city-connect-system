
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { Search, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CreateUserDialog from './CreateUserDialog';
import UsersList from './UsersList';
import { User } from './types/User';

interface UserManagementDialogProps {
  children: React.ReactNode;
}

const UserManagementDialog = ({ children }: UserManagementDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!open) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users...');
      
      const { data: profiles, error: profilesError } = await supabase
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

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      console.log('Fetched profiles:', profiles);

      if (!profiles || profiles.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      // Fetch user roles for each user
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id);

            if (roleError) {
              console.error('Role error for user:', profile.id, roleError);
            }

            const userType = profile.user_type === 'employee' ? 'employee' : 'resident';

            return {
              ...profile,
              user_type: userType,
              roles: roleData?.map(r => r.role) || []
            } as User;
          } catch (roleError) {
            console.error('Error fetching roles for user:', profile.id, roleError);
            return {
              ...profile,
              user_type: profile.user_type === 'employee' ? 'employee' : 'resident',
              roles: []
            } as User;
          }
        })
      );

      console.log('Users with roles:', usersWithRoles);
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage = language === 'en' ? 'Error loading users' : 'Помилка завантаження користувачів';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      console.log('Dialog opened, fetching users...');
      fetchUsers();
    }
  }, [open]);

  const filteredUsers = users.filter(user => 
    (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'User Management' : 'Управління користувачами'}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Header Actions */}
          <div className="flex justify-between items-center flex-shrink-0">
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex-shrink-0">
              {error}
            </div>
          )}

          {/* Users List */}
          <div className="flex-1 overflow-hidden">
            <UsersList 
              users={filteredUsers}
              loading={loading}
              onUserUpdated={fetchUsers}
              language={language}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
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
