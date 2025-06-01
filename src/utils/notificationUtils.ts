
import { supabase } from '@/integrations/supabase/client';

export const sendAppealStatusNotification = async (
  appealId: string, 
  newStatus: string, 
  userId: string,
  appealTitle: string
) => {
  try {
    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Appeal Status Update',
        content: `Your appeal "${appealTitle}" status has been updated to: ${newStatus}`,
        is_read: false
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return;
    }

    console.log('Appeal status notification sent successfully');
  } catch (error) {
    console.error('Error sending appeal status notification:', error);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
