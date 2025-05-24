
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUserType = () => {
  const { user, userType: authUserType } = useAuth();
  const [userType, setUserType] = useState<'employee' | 'resident' | null>(null);

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
