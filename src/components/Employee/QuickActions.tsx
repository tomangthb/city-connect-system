
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Users, TrendingUp, Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import GenerateReportDialog from './Dialogs/GenerateReportDialog';
import CreateTaskDialog from './Dialogs/CreateTaskDialog';

interface QuickActionsProps {
  onTabChange?: (tab: string) => void;
  onOpenSettings?: () => void;
}

const QuickActions = ({ onTabChange, onOpenSettings }: QuickActionsProps) => {
  const { t } = useLanguage();

  const handleReviewAppeals = async () => {
    try {
      await addActivity({
        title: t('appealsReviewStarted') || 'Started reviewing appeals',
        description: 'Opened appeals management section',
        type: 'appeal',
        priority: 'medium',
        status: 'pending'
      });

      if (onTabChange) {
        onTabChange('appeals');
        toast.success(t('appealsRedirect'));
      } else {
        toast.info(t('appealsRedirect'));
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      if (onTabChange) {
        onTabChange('appeals');
      }
    }
  };

  const handleManageUsers = async () => {
    try {
      await addActivity({
        title: t('userManagementAccessed') || 'Accessed user management',
        description: 'Opened user administration panel',
        type: 'event',
        priority: 'medium',
        status: 'pending'
      });

      if (onTabChange) {
        onTabChange('administration');
        toast.success(t('usersManagement'));
      } else {
        toast.info(t('usersManagement'));
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      if (onTabChange) {
        onTabChange('administration');
      }
    }
  };

  const handleViewAnalytics = async () => {
    try {
      await addActivity({
        title: t('analyticsAccessed') || 'Accessed analytics dashboard',
        description: 'Opened analytics and reporting section',
        type: 'report',
        priority: 'low',
        status: 'completed'
      });

      if (onTabChange) {
        onTabChange('analytics');
        toast.success(t('analyticsLoading'));
      } else {
        toast.info(t('analyticsLoading'));
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      if (onTabChange) {
        onTabChange('analytics');
      }
    }
  };

  const handleSettings = async () => {
    try {
      await addActivity({
        title: t('settingsOpened') || 'Opened profile settings',
        description: 'Accessed user profile settings',
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      if (onOpenSettings) {
        onOpenSettings();
      } else {
        toast.success(t('settingsOpened') || 'Settings opened');
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      if (onOpenSettings) {
        onOpenSettings();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <GenerateReportDialog>
            <Button className="h-24 flex flex-col hover:bg-blue-600 transition-colors w-full p-2">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-xs text-center leading-tight">{t('generateReport')}</span>
            </Button>
          </GenerateReportDialog>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col hover:bg-gray-50 transition-colors p-2"
            onClick={handleReviewAppeals}
          >
            <MessageSquare className="h-6 w-6 mb-2" />
            <span className="text-xs text-center leading-tight">{t('reviewAppeals')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col hover:bg-gray-50 transition-colors p-2"
            onClick={handleManageUsers}
          >
            <Users className="h-6 w-6 mb-2" />
            <span className="text-xs text-center leading-tight">{t('manageUsers')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col hover:bg-gray-50 transition-colors p-2"
            onClick={handleViewAnalytics}
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            <span className="text-xs text-center leading-tight">{t('viewAnalytics')}</span>
          </Button>
          
          <CreateTaskDialog>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 transition-colors w-full p-2"
            >
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-xs text-center leading-tight">{t('createTask')}</span>
            </Button>
          </CreateTaskDialog>
          
          <Button 
            variant="outline" 
            className="h-24 flex flex-col hover:bg-gray-50 transition-colors w-full p-2"
            onClick={handleSettings}
          >
            <Settings className="h-6 w-6 mb-2" />
            <span className="text-xs text-center leading-tight">{t('settings')}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
