
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAppeals = () => {
  return useQuery({
    queryKey: ['appeals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appeals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching appeals:', error);
        return [];
      }
      return data || [];
    }
  });
};
