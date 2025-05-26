
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import KPICard from './KPICard';
import MetricsChart from './MetricsChart';
import QuickActions from './QuickActions';
import CollapsibleRecentActivities from './CollapsibleRecentActivities';
import { toast } from 'sonner';

interface EmployeeDashboardProps {
  onTabChange?: (tab: string) => void;
  onOpenSettings?: () => void;
}

const EmployeeDashboard = ({ onTabChange, onOpenSettings }: EmployeeDashboardProps) => {
  const { language, t } = useLanguage();

  // Fetch real data from Supabase
  const { data: appealsData } = useQuery({
    queryKey: ['appeals-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appeals')
        .select('id, status, created_at')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching appeals:', error);
        return { total: 0, pending: 0, chartData: [] };
      }
      
      const pending = data?.filter(appeal => 
        appeal.status === 'Under Review' || appeal.status === 'Pending'
      ).length || 0;

      // Create chart data for appeals trend (last 7 days)
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayAppeals = data?.filter(appeal => 
          appeal.created_at?.startsWith(dateStr)
        ).length || 0;
        
        chartData.push({
          date: dateStr,
          value: dayAppeals
        });
      }
      
      return { total: data?.length || 0, pending, chartData };
    }
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, status, created_at')
        .eq('status', 'Available');
      
      if (error) {
        console.error('Error fetching services:', error);
        return { count: 0, chartData: [] };
      }

      // Create chart data for active services (last 7 days)
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayServices = data?.filter(service => 
          service.created_at?.startsWith(dateStr)
        ).length || 0;
        
        chartData.push({
          date: dateStr,
          value: dayServices
        });
      }

      return { count: data?.length || 0, chartData };
    }
  });

  const { data: citizensData } = useQuery({
    queryKey: ['citizens-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'resident');
      
      if (error) {
        console.error('Error fetching citizens:', error);
        return 0;
      }
      return data?.length || 0;
    }
  });

  const kpiData = [
    { 
      title: t('pendingAppeals'), 
      value: appealsData?.pending || 0,
      change: 5,
      icon: MessageSquare, 
      color: 'text-orange-600',
      onClick: () => onTabChange ? onTabChange('appeals') : toast.info(t('loadingAppeals'))
    },
    { 
      title: t('activeServices'), 
      value: servicesData?.count || 0,
      change: 2,
      icon: FileText, 
      color: 'text-blue-600',
      onClick: () => onTabChange ? onTabChange('services') : toast.info(t('loadingServices'))
    },
    { 
      title: t('registeredCitizens'), 
      value: (citizensData || 0).toLocaleString(),
      change: 120,
      icon: Users, 
      color: 'text-green-600',
      onClick: () => onTabChange ? onTabChange('administration') : toast.info(t('loadingCitizens'))
    }
  ];

  const districtRankingData = [
    {
      rank: 1,
      name: 'Галицький',
      features: 'Історичний центр, високі ціни, культурне життя, обмежені зелені зони.',
      rating: 4.7,
      status: 'Відмінно'
    },
    {
      rank: 2,
      name: 'Франківський',
      features: 'Багато парків, добре розвинена інфраструктура, престижний район, вищі ціни.',
      rating: 4.5,
      status: 'Відмінно'
    },
    {
      rank: 3,
      name: 'Личаківський',
      features: 'Зелені зони, поєднання старої/нової забудови, спокійніші райони.',
      rating: 4.3,
      status: 'Добре'
    },
    {
      rank: 4,
      name: 'Шевченківський',
      features: 'Доступніша нерухомість, розвинена соціальна інфраструктура, великий розмір.',
      rating: 4.1,
      status: 'Добре'
    },
    {
      rank: 5,
      name: 'Сихівський',
      features: 'Найбільший спальний район, бюджетні ціни, висока щільність населення, віддаленість від центру.',
      rating: 3.8,
      status: 'Добре'
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={kpi.onClick}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{kpi.change}</span>
                    <span className="text-sm text-gray-500 ml-1">
                      {language === 'en' ? 'vs last month' : 'до минулого місяця'}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section - Only Appeals Trend and Active Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart 
          title={language === 'en' ? 'Appeals Trend' : 'Тренд звернень'}
          data={appealsData?.chartData || []}
          type="line"
          color="#f59e0b"
        />
        <MetricsChart 
          title={language === 'en' ? 'Active Services' : 'Активні послуги'}
          data={servicesData?.chartData || []}
          type="line"
          color="#3b82f6"
        />
      </div>

      {/* District Performance Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'District Performance Ranking' : 'Рейтинг продуктивності районів'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{language === 'en' ? 'Rank' : 'Місце'}</th>
                  <th className="text-left p-2">{language === 'en' ? 'District Name' : 'Назва району'}</th>
                  <th className="text-left p-2">{language === 'en' ? 'Features and Criteria' : 'Особливості та критерії'}</th>
                  <th className="text-left p-2">{language === 'en' ? 'Rating (out of 5)' : 'Оцінка (з 5)'}</th>
                  <th className="text-left p-2">{language === 'en' ? 'Status' : 'Статус'}</th>
                </tr>
              </thead>
              <tbody>
                {districtRankingData.map((district) => (
                  <tr key={district.rank} className="border-b">
                    <td className="p-2 font-semibold">{district.rank}</td>
                    <td className="p-2 font-medium">{district.name}</td>
                    <td className="p-2 text-sm text-gray-600 max-w-md">{district.features}</td>
                    <td className="p-2">
                      <span className="font-semibold text-yellow-600">{district.rating}</span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        district.status === 'Відмінно'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {district.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collapsible Recent Activities */}
        <CollapsibleRecentActivities />

        {/* Enhanced Quick Actions */}
        <QuickActions onTabChange={onTabChange} onOpenSettings={onOpenSettings} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
