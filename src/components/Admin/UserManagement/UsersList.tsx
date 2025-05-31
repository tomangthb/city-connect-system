
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Edit, Trash2, Shield } from 'lucide-react';
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
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this user?' : 'Ви впевнені, що хочете видалити цього користувача?')) {
      return;
    }
    
    try {
      // Implementation for user deletion would go here
      console.log('Delete user:', userId);
      onUserUpdated();
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

  const getUserTypeBadge = (userType: string) => {
    return (
      <Badge variant={userType === 'employee' ? 'default' : 'secondary'}>
        {getUserTypeText(userType)}
      </Badge>
    );
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
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-lg">
                  {user.first_name} {user.last_name}
                  {user.patronymic && ` ${user.patronymic}`}
                </h3>
                {getUserTypeBadge(user.user_type)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {user.email || 'N/A'}
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
                  </span> {user.roles && user.roles.length > 0 ? user.roles.join(', ') : (language === 'en' ? 'No roles' : 'Без ролей')}
                </p>
                <p>
                  <span className="font-medium">
                    {language === 'en' ? 'Created:' : 'Створено:'}
                  </span> {new Date(user.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <EditUserDialog user={user} onUserUpdated={onUserUpdated}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Edit' : 'Редагувати'}
                </Button>
              </EditUserDialog>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Roles' : 'Ролі'}
              </Button>
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
    </div>
  );
};

export default UsersList;
