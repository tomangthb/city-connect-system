
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUserType = () => {
  const [userType, setUserType] = useState<'employee' | 'resident' | null>(null);
  
  // Безпечно отримуємо дані з AuthContext
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    // Якщо AuthContext недоступний, повертаємо базові значення
    console.warn('AuthContext not available:', error);
    return { userType: null, setUserType: () => {} };
  }

  const { user, userType: authUserType } = authData;

  // Reset userType when user logs out
  useEffect(() => {
    if (!user) {
      setUserType(null);
    } else if (authUserType) {
      setUserType(authUserType);
    }
  }, [user, authUserType]);

  return { userType, setUserType };
};
