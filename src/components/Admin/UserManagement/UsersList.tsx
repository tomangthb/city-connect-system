
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
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
}

interface UsersListProps {
  users: User[];
  onUserUpdated: () => void;
}

const UsersList = ({ users, onUserUpdated }: UsersListProps) => {
  const { language } = useLanguage();

  const handleDeleteUser = async (userId: string) => {
    // Implementation for user deletion
    console.log('Delete user:', userId);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Type:' : 'Тип:'} {user.user_type}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Roles:' : 'Ролі:'} {user.roles.join(', ')}
              </p>
            </div>
            <div className="flex gap-2">
              <EditUserDialog user={user} onUserUpdated={onUserUpdated}>
                <Button variant="outline" size="sm">
                  {language === 'en' ? 'Edit' : 'Редагувати'}
                </Button>
              </EditUserDialog>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteUser(user.id)}
              >
                {language === 'en' ? 'Delete' : 'Видалити'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
