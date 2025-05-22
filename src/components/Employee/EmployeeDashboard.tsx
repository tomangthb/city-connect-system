
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EmployeeDashboard = () => {
  const { language, t } = useLanguage();

  // Fetch services count
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'Available');
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch appeals count
  const { data: appealsData } = useQuery({
    queryKey: ['appeals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appeals')
        .select('*')
        .eq('status', 'Under Review');
      
      if (error) {
        console.error('Error fetching appeals:', error);
        return [];
      }
      return data || [];
    }
  });

  const kpiData = [
    { 
      title: t('pendingAppeals'), 
      value: appealsData?.length || '23', 
      icon: MessageSquare, 
      color: 'text-orange-600' 
    },
    { 
      title: t('activeServices'), 
      value: servicesData?.length || '156', 
      icon: FileText, 
      color: 'text-blue-600' 
    },
    { 
      title: t('registeredCitizens'), 
      value: '12,430', 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      title: t('monthlyRevenue'), 
      value: '$45,200', 
      icon: TrendingUp, 
      color: 'text-purple-600' 
    },
  ];

  const recentActivities = [
    { title: language === 'en' ? 'New citizen appeal submitted' : 'Подано нове звернення громадянина', time: language === 'en' ? '5 min ago' : '5 хв тому', type: 'appeal' },
    { title: language === 'en' ? 'Park maintenance completed' : 'Завершено обслуговування парку', time: language === 'en' ? '1 hour ago' : '1 год тому', type: 'service' },
    { title: language === 'en' ? 'Budget report generated' : 'Створено звіт про бюджет', time: language === 'en' ? '2 hours ago' : '2 год тому', type: 'report' },
    { title: language === 'en' ? 'Public meeting scheduled' : 'Заплановано громадські збори', time: language === 'en' ? '3 hours ago' : '3 год тому', type: 'event' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard')}</h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Welcome back! Here\'s what\'s happening in your city today.' 
            : 'Ласкаво просимо! Ось що відбувається у вашому місті сьогодні.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.type === 'appeal' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                    {activity.type === 'service' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.type === 'report' && <FileText className="h-5 w-5 text-blue-600" />}
                    {activity.type === 'event' && <AlertCircle className="h-5 w-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-16 flex flex-col">
                <FileText className="h-6 w-6 mb-1" />
                <span className="text-xs">{t('generateReport')}</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <MessageSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">{t('reviewAppeals')}</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Users className="h-6 w-6 mb-1" />
                <span className="text-xs">{t('manageUsers')}</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <TrendingUp className="h-6 w-6 mb-1" />
                <span className="text-xs">{t('viewAnalytics')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
