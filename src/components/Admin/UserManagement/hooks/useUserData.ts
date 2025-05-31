
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string;
  created_at: string;
  user_metadata?: any;
}

interface AdminUsersResponse {
  data: {
    users: AuthUser[];
  } | null;
  error: any;
}

export const useUserData = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching real registered users...');
      
      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers() as AdminUsersResponse;
        
        if (authError) {
          console.error('Auth users error:', authError);
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
                } as User;
              } catch (roleError) {
                console.error('Error fetching roles for user:', profile.id, roleError);
                return {
                  ...profile,
                  roles: [],
                  status: 'active'
                } as User;
              }
            })
          );

          console.log('Users from profiles:', usersWithRoles);
          return usersWithRoles;
        }

        const realUsers = authResponse.users.filter((user: AuthUser) => 
          user.email && 
          user.email_confirmed_at && 
          !user.email?.includes('test') &&
          !user.email?.includes('fake')
        );

        console.log('Real auth users:', realUsers);

        if (realUsers.length === 0) {
          return [];
        }

        const userIds = realUsers.map((user: AuthUser) => user.id);
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
          `)
          .in('id', userIds);

        if (profilesError) {
          console.error('Profiles error:', profilesError);
        }

        const usersWithProfiles = await Promise.all(
          realUsers.map(async (authUser: AuthUser) => {
            const profile = profiles?.find(p => p.id === authUser.id);
            
            try {
              const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', authUser.id);

              if (roleError) {
                console.error('Role error for user:', authUser.id, roleError);
              }

              return {
                id: authUser.id,
                email: authUser.email || '',
                first_name: profile?.first_name || authUser.user_metadata?.first_name || '',
                last_name: profile?.last_name || authUser.user_metadata?.last_name || '',
                patronymic: profile?.patronymic || authUser.user_metadata?.patronymic || '',
                user_type: profile?.user_type || authUser.user_metadata?.user_type || 'resident',
                address: profile?.address || authUser.user_metadata?.address || '',
                phone: profile?.phone || authUser.user_metadata?.phone || '',
                created_at: authUser.created_at,
                roles: roleData?.map(r => r.role) || [],
                status: 'active'
              } as User;
            } catch (roleError) {
              console.error('Error fetching roles for user:', authUser.id, roleError);
              return {
                id: authUser.id,
                email: authUser.email || '',
                first_name: profile?.first_name || authUser.user_metadata?.first_name || '',
                last_name: profile?.last_name || authUser.user_metadata?.last_name || '',
                patronymic: profile?.patronymic || authUser.user_metadata?.patronymic || '',
                user_type: profile?.user_type || authUser.user_metadata?.user_type || 'resident',
                address: profile?.address || authUser.user_metadata?.address || '',
                phone: profile?.phone || authUser.user_metadata?.phone || '',
                created_at: authUser.created_at,
                roles: [],
                status: 'active'
              } as User;
            }
          })
        );

        console.log('Final users with profiles and roles:', usersWithProfiles);
        return usersWithProfiles;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });
};
