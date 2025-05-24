
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Users, TrendingUp, Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickActionsProps {
  onTabChange?: (tab: string) => void;
}

const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleGenerateReport = async () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      // Create a new activity for report generation
      const { error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          title: 'Monthly Report Generated',
          description: 'Generated comprehensive monthly report for city operations',
          type: 'report',
          priority: 'medium',
          status: 'completed'
        });

      if (error) throw error;
      
      toast.success(t('reportGenerated'));
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleReviewAppeals = () => {
    if (onTabChange) {
      onTabChange('appeals');
      toast.success(t('appealsRedirect'));
    } else {
      toast.info(t('appealsRedirect'));
    }
  };

  const handleManageUsers = () => {
    if (onTabChange) {
      onTabChange('administration');
      toast.success(t('usersManagement'));
    } else {
      toast.info(t('usersManagement'));
    }
  };

  const handleViewAnalytics = () => {
    if (onTabChange) {
      onTabChange('analytics');
      toast.success(t('analyticsLoading'));
    } else {
      toast.info(t('analyticsLoading'));
    }
  };

  const handleCreateTask = async () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }

    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          title: 'New Task Created',
          description: 'Created new administrative task',
          type: 'event',
          priority: 'medium',
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success(t('taskCreated'));
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleSystemSettings = () => {
    toast.success(t('settingsOpened'));
    // In a real app, this would open a settings modal or navigate to settings page
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Button 
            className="h-20 flex flex-col hover:bg-blue-600 transition-colors"
            onClick={handleGenerateReport}
          >
            <FileText className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('generateReport')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-gray-50 transition-colors"
            onClick={handleReviewAppeals}
          >
            <MessageSquare className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('reviewAppeals')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-gray-50 transition-colors"
            onClick={handleManageUsers}
          >
            <Users className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('manageUsers')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-gray-50 transition-colors"
            onClick={handleViewAnalytics}
          >
            <TrendingUp className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('viewAnalytics')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 transition-colors"
            onClick={handleCreateTask}
          >
            <Plus className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('createTask')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-gray-50 transition-colors"
            onClick={handleSystemSettings}
          >
            <Settings className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">{t('settings')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
