
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  user_type: 'employee' | 'resident';
  address?: string;
  created_at: string;
  roles?: string[];
}
