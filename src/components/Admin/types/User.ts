
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  user_type: 'employee' | 'resident';
  address?: string;
  phone?: string;
  created_at: string;
  roles?: string[];
  status?: string;
  avatar_url?: string;
  full_name?: string;
  updated_at?: string;
}
