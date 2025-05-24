
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Users, TrendingUp, Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import GenerateReportDialog from './Dialogs/GenerateReportDialog';
import CreateTaskDialog from './Dialogs/CreateTaskDialog';
import SettingsDialog from './Dialogs/SettingsDialog';

interface QuickActionsProps {
  onTabChange?: (tab: string) => void;
}

const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const { t } = useLanguage();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <GenerateReportDialog>
            <Button className="h-20 flex flex-col hover:bg-blue-600 transition-colors w-full">
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{t('generateReport')}</span>
            </Button>
          </GenerateReportDialog>
          
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
          
          <CreateTaskDialog>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col hover:bg-green-50 border-green-200 text-green-700 hover:text-green-800 transition-colors w-full"
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{t('createTask')}</span>
            </Button>
          </CreateTaskDialog>
          
          <SettingsDialog>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col hover:bg-gray-50 transition-colors w-full"
            >
              <Settings className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{t('settings')}</span>
            </Button>
          </SettingsDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
