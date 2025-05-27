
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useUserType = () => {
  const [userType, setUserType] = useState<'employee' | 'resident' | null>(null);
  
  // Safely get data from AuthContext
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    // If AuthContext is not available, return basic values
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
