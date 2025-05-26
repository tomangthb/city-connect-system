
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus,
  Clock,
  User,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import ComprehensiveAppealsModule from './ComprehensiveAppealsModule';

interface AppealsModuleProps {
  userType: 'employee' | 'resident';
}

const AppealsModule = ({ userType }: AppealsModuleProps) => {
  const { t } = useLanguage();

  // For employees, show the comprehensive module
  if (userType === 'employee') {
    return <ComprehensiveAppealsModule />;
  }

  // For residents, show the original functionality
  const [showForm, setShowForm] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    title: '',
    category: '',
    content: ''
  });

  const { data: appeals, isLoading, refetch } = useQuery({
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
      refetch();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      toast.error(t('errorSubmittingAppeal') || 'Error submitting appeal');
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

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div>{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('citizensAppeals') || 'Citizens Appeals'}</h2>
          <p className="text-gray-600">
            {t('submitTrack') || 'Submit and track your appeals'}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('submitAppeal') || 'Submit Appeal'}
        </Button>
      </div>

      {/* New Appeal Form for Residents */}
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

      {/* Appeals List */}
      <div className="space-y-4">
        {appeals && appeals.length > 0 ? (
          appeals.map((appeal) => (
            <Card key={appeal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{appeal.title}</h3>
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
                </div>

                <p className="text-gray-700 mb-4">{appeal.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {appeal.submitted_by}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(appeal.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {appeal.category}
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('viewDetails') || 'View Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('noAppealsFound') || 'No appeals found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealsModule;
