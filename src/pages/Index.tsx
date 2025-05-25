
import React from 'react';
import LoginSelection from '@/components/Pages/LoginSelection';
import MainApp from '@/components/Pages/MainApp';
import { useAuth } from '@/contexts/AuthContext';
import { useUserType } from '@/hooks/useUserType';

const Index = () => {
  // Безпечне отримання даних з useAuth
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    // Показуємо сторінку входу якщо є проблеми з контекстом
    return <LoginSelection onUserTypeSelect={() => {}} />;
  }

  const { user } = authData;
  const { userType, setUserType } = useUserType();

  // Show login selection if not authenticated or no user type selected
  if (!userType || !user) {
    return <LoginSelection onUserTypeSelect={setUserType} />;
  }

  // Show main application
  return <MainApp userType={userType} />;
};

export default Index;
