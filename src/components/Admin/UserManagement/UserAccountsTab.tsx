
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserPlus, Filter } from 'lucide-react';
import CreateUserDialog from './CreateUserDialog';
import UsersList from './UsersList';
import UserFilters from './UserFilters';

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
          phone,
          created_at
        `);

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

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

            return {
              ...profile,
              roles: roleData?.map(r => r.role) || [],
              status: 'active'
            };
          } catch (roleError) {
            console.error('Error fetching roles for user:', profile.id, roleError);
            return {
              ...profile,
              roles: [],
              status: 'active'
            };
          }
        })
      );

      console.log('Users with roles:', usersWithRoles);
      return usersWithRoles;
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
            <UsersList users={filteredUsers} onUserUpdated={refetch} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountsTab;
