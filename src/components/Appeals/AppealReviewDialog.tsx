
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          {/* Appeal Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{appeal.title}</h3>
              <p className="text-sm text-gray-600">ID: {appeal.id}</p>
            </div>
            
            <div className="flex space-x-2">
              <Badge className={getStatusColor(appeal.status)}>
                {appeal.status}
              </Badge>
              <Badge className={getPriorityColor(appeal.priority)}>
                {appeal.priority}
              </Badge>
            </div>

            <div>
              <Label>{t('description')}</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{appeal.content || appeal.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>{t('submittedBy') || 'Submitted by'}</Label>
                <p className="text-gray-700">{appeal.submitted_by}</p>
              </div>
              <div>
                <Label>{t('category')}</Label>
                <p className="text-gray-700">{appeal.category}</p>
              </div>
              <div>
                <Label>{t('submittedDate') || 'Submitted'}</Label>
                <p className="text-gray-700">
                  {new Date(appeal.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label>{t('lastUpdated') || 'Last updated'}</Label>
                <p className="text-gray-700">
                  {new Date(appeal.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-semibold">{t('reviewResponse') || 'Review Response'}</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">{t('status')}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under Review">{t('underReview') || 'Under Review'}</SelectItem>
                    <SelectItem value="In Progress">{t('inProgress') || 'In Progress'}</SelectItem>
                    <SelectItem value="Completed">{t('completed')}</SelectItem>
                    <SelectItem value="Rejected">{t('rejected') || 'Rejected'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">{t('priority')}</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">{t('low')}</SelectItem>
                    <SelectItem value="Medium">{t('medium')}</SelectItem>
                    <SelectItem value="High">{t('high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="response">{t('response') || 'Response'} *</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={t('enterResponse') || 'Enter your response to the citizen...'}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isUpdating}>
              {isUpdating ? (t('updating') || 'Updating...') : (t('updateAppeal') || 'Update Appeal')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppealReviewDialog;
