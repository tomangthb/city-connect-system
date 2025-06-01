
import { supabase } from '@/integrations/supabase/client';

export const sendAppealStatusNotification = async (
  appealId: string, 
  newStatus: string, 
  userEmail: string,
  appealTitle: string
) => {
  try {
    // Create notification record in database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_email: userEmail,
        title: 'Appeal Status Update',
        title_uk: 'Оновлення статусу звернення',
        message: `Your appeal "${appealTitle}" status has been updated to: ${newStatus}`,
        message_uk: `Статус вашого звернення "${appealTitle}" було оновлено на: ${newStatus}`,
        type: 'appeal',
        related_id: appealId,
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
