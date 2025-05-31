
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import UserCard from './UserCard';

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

interface UsersListViewProps {
  users: User[];
  isLoading: boolean;
  onUserUpdated: () => void;
}

const UsersListView = ({ users, isLoading, onUserUpdated }: UsersListViewProps) => {
  const { language } = useLanguage();

  if (isLoading) {
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
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onUserUpdated={onUserUpdated} />
      ))}
    </div>
  );
};

export default UsersListView;
