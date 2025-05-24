
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppealReviewFormProps {
  status: string;
  priority: string;
  response: string;
  isUpdating: boolean;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onResponseChange: (response: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AppealReviewForm = ({
  status,
  priority,
  response,
  isUpdating,
  onStatusChange,
  onPriorityChange,
  onResponseChange,
  onSubmit,
  onCancel
}: AppealReviewFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="border-t pt-6 space-y-4">
      <h4 className="font-semibold">{t('reviewResponse') || 'Review Response'}</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">{t('status')}</Label>
          <Select value={status} onValueChange={onStatusChange}>
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
          <Select value={priority} onValueChange={onPriorityChange}>
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
          onChange={(e) => onResponseChange(e.target.value)}
          placeholder={t('enterResponse') || 'Enter your response to the citizen...'}
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating}>
          {isUpdating ? (t('updating') || 'Updating...') : (t('updateAppeal') || 'Update Appeal')}
        </Button>
      </div>
    </div>
  );
};

export default AppealReviewForm;
