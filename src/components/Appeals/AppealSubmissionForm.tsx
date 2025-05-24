
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface AppealSubmissionFormProps {
  onAppealSubmitted: () => void;
}

const AppealSubmissionForm = ({ onAppealSubmitted }: AppealSubmissionFormProps) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    title: '',
    category: '',
    content: ''
  });

  const handleSubmitAppeal = async () => {
    if (!newAppeal.title.trim() || !newAppeal.category || !newAppeal.content.trim()) {
      toast.error(t('fillAllFields') || 'Please fill all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('appeals')
        .insert([{
          ...newAppeal,
          user_id: user?.id,
          submitted_by: user?.email || 'Unknown User',
          status: 'Under Review',
          priority: 'Medium'
        }]);

      if (error) throw error;

      await addActivity({
        title: `New appeal submitted: ${newAppeal.title}`,
        description: `Appeal "${newAppeal.title}" has been submitted for review`,
        type: 'appeal',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(t('appealSubmitted') || 'Appeal submitted successfully');
      setShowForm(false);
      setNewAppeal({ title: '', category: '', content: '' });
      onAppealSubmitted();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      toast.error(t('errorSubmittingAppeal') || 'Error submitting appeal');
    }
  };

  return (
    <>
      <Button onClick={() => setShowForm(!showForm)}>
        <Plus className="h-4 w-4 mr-2" />
        {t('submitAppeal') || 'Submit Appeal'}
      </Button>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('submitAppealTitle') || 'Submit New Appeal'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('subject') || 'Subject'}
              </label>
              <Input 
                placeholder={t('subject') || 'Subject'}
                value={newAppeal.title}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('category')}
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAppeal.category}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">{t('selectCategory') || 'Select category'}</option>
                <option value="Infrastructure">{t('infrastructure') || 'Infrastructure'}</option>
                <option value="Public Order">{t('publicOrder') || 'Public Order'}</option>
                <option value="Roads">{t('roads') || 'Roads'}</option>
                <option value="Environment">{t('environment') || 'Environment'}</option>
                <option value="Other">{t('other') || 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')}
              </label>
              <Textarea 
                placeholder={t('description')}
                rows={4}
                value={newAppeal.content}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSubmitAppeal}>
                {t('submitAppealButton') || 'Submit Appeal'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AppealSubmissionForm;
