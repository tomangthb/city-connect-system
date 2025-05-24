
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Users, TrendingUp, Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const QuickActions = () => {
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
      
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleReviewAppeals = () => {
    toast.info('Redirecting to appeals management...');
    // In a real app, this would navigate to the appeals module
  };

  const handleManageUsers = () => {
    toast.info('Opening user management interface...');
    // In a real app, this would navigate to user management
  };

  const handleViewAnalytics = () => {
    toast.info('Loading advanced analytics dashboard...');
    // In a real app, this would navigate to analytics module
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
      
      toast.success('New task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleSystemSettings = () => {
    toast.info('Opening system settings...');
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
            <span className="text-xs text-center">Create Task</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col hover:bg-gray-50 transition-colors"
            onClick={handleSystemSettings}
          >
            <Settings className="h-6 w-6 mb-1" />
            <span className="text-xs text-center">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
