
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import UserActions from './UserActions';

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

interface UserCardProps {
  user: User;
  onUserUpdated: () => void;
}

const UserCard = ({ user, onUserUpdated }: UserCardProps) => {
  const { language } = useLanguage();

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
    <div className="border rounded-lg p-4">
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
        
        <UserActions user={user} onUserUpdated={onUserUpdated} />
      </div>
    </div>
  );
};

export default UserCard;
