import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import CreateUserDialog from './CreateUserDialog';
import EditUserDialog from './EditUserDialog';
import UserFilters from './UserFilters';

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

const UserAccountsTab = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    department: 'all'
  });

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      
      // First, get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw authError;
      }

      console.log('Auth users found:', authUsers.users.length);
      console.log('Auth users data:', authUsers.users);

      if (!authUsers.users || authUsers.users.length === 0) {
        return [];
      }

      // Get profiles for all users
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
          phone,
          created_at
        `);

      if (profilesError) {
        console.error('Profiles error:', profilesError);
      }

      console.log('Profiles found:', profiles?.length || 0);
      console.log('Profiles data:', profiles);

      // Combine auth users with their profiles
      const usersWithProfiles = await Promise.all(
        authUsers.users.map(async (authUser) => {
          const profile = profiles?.find(p => p.id === authUser.id);
          
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', authUser.id);

            if (roleError) {
              console.error('Role error for user:', authUser.id, roleError);
            }

            // Create user object with auth data as fallback
            const userObject: User = {
              id: authUser.id,
              email: profile?.email || authUser.email || '',
              first_name: profile?.first_name || authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'Unknown',
              last_name: profile?.last_name || authUser.user_metadata?.last_name || '',
              patronymic: profile?.patronymic || authUser.user_metadata?.patronymic || '',
              user_type: profile?.user_type || authUser.user_metadata?.user_type || 'resident',
              address: profile?.address || authUser.user_metadata?.address || '',
              phone: profile?.phone || authUser.user_metadata?.phone || '',
              created_at: profile?.created_at || authUser.created_at,
              roles: roleData?.map(r => r.role) || [],
              status: 'active'
            };

            console.log('Processed user:', userObject);
            return userObject;
          } catch (roleError) {
            console.error('Error fetching roles for user:', authUser.id, roleError);
            
            // Return user even if role fetch fails
            return {
              id: authUser.id,
              email: profile?.email || authUser.email || '',
              first_name: profile?.first_name || authUser.user_metadata?.first_name || authUser.email?.split('@')[0] || 'Unknown',
              last_name: profile?.last_name || authUser.user_metadata?.last_name || '',
              patronymic: profile?.patronymic || authUser.user_metadata?.patronymic || '',
              user_type: profile?.user_type || authUser.user_metadata?.user_type || 'resident',
              address: profile?.address || authUser.user_metadata?.address || '',
              phone: profile?.phone || authUser.user_metadata?.phone || '',
              created_at: profile?.created_at || authUser.created_at,
              roles: [],
              status: 'active'
            } as User;
          }
        })
      );

      console.log('Final users with profiles:', usersWithProfiles);
      return usersWithProfiles;
    }
  });

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const nameMatch = (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                       (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                       (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const roleMatch = filters.role === 'all' || user.roles?.includes(filters.role);
      const statusMatch = filters.status === 'all' || user.status === filters.status;
      
      return nameMatch && roleMatch && statusMatch;
    });
  }, [users, searchTerm, filters]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'Ви впевнені, що хочете видалити цього користувача?')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getUserTypeText = (userType: string) => {
    switch (userType) {
      case 'employee':
        return language === 'en' ? 'Employee' : 'Співробітник';
      case 'resident':
        return language === 'en' ? 'Resident' : 'Мешканець';
      default:
        return userType;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 
          (language === 'en' ? 'Active' : 'Активний') : 
          (language === 'en' ? 'Inactive' : 'Неактивний')
        }
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {language === 'en' ? 'User Accounts' : 'Облікові записи користувачів'}
            </span>
            <CreateUserDialog onUserCreated={refetch}>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Create User' : 'Створити користувача'}
              </Button>
            </CreateUserDialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'en' ? 'Search users...' : 'Пошук користувачів...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <UserFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'en' ? 'Loading users...' : 'Завантаження користувачів...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                {language === 'en' ? `Found ${filteredUsers.length} users` : `Знайдено ${filteredUsers.length} користувачів`}
              </div>
              
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">
                          {user.first_name} {user.last_name}
                          {user.patronymic && ` ${user.patronymic}`}
                        </h3>
                        {getStatusBadge(user.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Email:</span> {user.email}
                        </p>
                        <p>
                          <span className="font-medium">
                            {language === 'en' ? 'Type:' : 'Тип:'}
                          </span> {getUserTypeText(user.user_type)}
                        </p>
                        {user.phone && (
                          <p>
                            <span className="font-medium">
                              {language === 'en' ? 'Phone:' : 'Телефон:'}
                            </span> {user.phone}
                          </p>
                        )}
                        {user.address && (
                          <p>
                            <span className="font-medium">
                              {language === 'en' ? 'Address:' : 'Адреса:'}
                            </span> {user.address}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">
                            {language === 'en' ? 'Roles:' : 'Ролі:'}
                          </span> {user.roles.length > 0 ? user.roles.join(', ') : (language === 'en' ? 'No roles' : 'Без ролей')}
                        </p>
                        <p>
                          <span className="font-medium">
                            {language === 'en' ? 'Created:' : 'Створено:'}
                          </span> {new Date(user.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <EditUserDialog user={user} onUserUpdated={refetch}>
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
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' ? 'No users found' : 'Користувачі не знайдені'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountsTab;
