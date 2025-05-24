
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';
import AppealDetailsView from './AppealDetailsView';
import AppealReviewForm from './AppealReviewForm';

interface AppealReviewDialogProps {
  appeal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppealUpdated?: () => void;
}

const AppealReviewDialog = ({ appeal, open, onOpenChange, onAppealUpdated }: AppealReviewDialogProps) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState(appeal?.status || 'Under Review');
  const [priority, setPriority] = useState(appeal?.priority || 'Medium');
  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error(t('responseRequired') || 'Response is required');
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('appeals')
        .update({ 
          status, 
          priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', appeal.id);

      if (error) throw error;

      await addActivity({
        title: `Appeal reviewed: ${appeal.title}`,
        description: `Status changed to ${status}. Response: ${response.substring(0, 100)}...`,
        type: 'appeal',
        priority: priority.toLowerCase() as 'low' | 'medium' | 'high',
        status: status === 'Completed' ? 'completed' : 'pending'
      });

      toast.success(t('appealUpdated') || 'Appeal updated successfully');
      onOpenChange(false);
      onAppealUpdated?.();
      setResponse('');
    } catch (error) {
      console.error('Error updating appeal:', error);
      toast.error(t('errorUpdatingAppeal') || 'Error updating appeal');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!appeal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('reviewAppeal') || 'Review Appeal'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <AppealDetailsView appeal={appeal} />
          
          <AppealReviewForm
            status={status}
            priority={priority}
            response={response}
            isUpdating={isUpdating}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onResponseChange={setResponse}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppealReviewDialog;
