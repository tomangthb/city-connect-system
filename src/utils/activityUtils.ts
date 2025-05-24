
import { supabase } from '@/integrations/supabase/client';

export interface ActivityData {
  title: string;
  description?: string;
  type: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'completed' | 'scheduled';
}

export const addActivity = async (activityData: ActivityData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('activities')
      .insert([{
        ...activityData,
        user_id: user.id,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error adding activity:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add activity:', error);
    throw error;
  }
};
