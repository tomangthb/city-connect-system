
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPlus } from 'lucide-react';
import CreateUserDialog from './CreateUserDialog';
import UserFilters from './UserFilters';
import UserSearch from './UserSearch';
import UsersListView from './UsersListView';
import { useUserData } from './hooks/useUserData';

const UserAccountsTab = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    department: 'all'
  });

  const { data: users, isLoading, refetch } = useUserData();

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
            <div>
              <span>
                {language === 'en' ? 'User Accounts' : 'Облікові записи користувачів'}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'en' 
                  ? `Total users: ${users?.length || 0}` 
                  : `Всього користувачів: ${users?.length || 0}`}
              </p>
            </div>
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
            <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <UserFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <UsersListView 
            users={filteredUsers} 
            isLoading={isLoading} 
            onUserUpdated={refetch} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountsTab;
