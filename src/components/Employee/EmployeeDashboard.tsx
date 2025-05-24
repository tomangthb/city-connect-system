
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  DollarSign
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

  // Fetch metrics data
  const { data: metricsData } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching metrics:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch analytics data for charts
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching analytics:', error);
        return [];
      }
      return data || [];
    }
  });

  // Process metrics data for KPI cards
  const getMetricByName = (name: string) => {
    return metricsData?.find(m => m.metric_name === name);
  };

  const kpiData = [
    { 
      title: t('pendingAppeals'), 
      value: getMetricByName('pendingAppeals')?.metric_value || 0,
      target: getMetricByName('pendingAppeals')?.metric_target,
      change: getMetricByName('pendingAppeals')?.metric_change,
      icon: MessageSquare, 
      color: 'text-orange-600',
      onClick: () => onTabChange ? onTabChange('appeals') : toast.info(t('loadingAppeals'))
    },
    { 
      title: t('activeServices'), 
      value: getMetricByName('activeServices')?.metric_value || 0,
      target: getMetricByName('activeServices')?.metric_target,
      change: getMetricByName('activeServices')?.metric_change,
      icon: FileText, 
      color: 'text-blue-600',
      onClick: () => onTabChange ? onTabChange('services') : toast.info(t('loadingServices'))
    },
    { 
      title: t('registeredCitizens'), 
      value: getMetricByName('registeredCitizens')?.metric_value?.toLocaleString() || '0',
      target: getMetricByName('registeredCitizens')?.metric_target,
      change: getMetricByName('registeredCitizens')?.metric_change,
      icon: Users, 
      color: 'text-green-600',
      onClick: () => onTabChange ? onTabChange('administration') : toast.info(t('loadingCitizens'))
    },
    { 
      title: t('monthlyRevenue'), 
      value: `$${getMetricByName('monthlyRevenue')?.metric_value?.toLocaleString() || '0'}`,
      target: getMetricByName('monthlyRevenue')?.metric_target,
      change: getMetricByName('monthlyRevenue')?.metric_change,
      icon: DollarSign, 
      color: 'text-purple-600',
      onClick: () => onTabChange ? onTabChange('analytics') : toast.info(t('loadingFinancial'))
    },
  ];

  // Process analytics data for charts
  const appealsChartData = analyticsData?.filter(d => d.category === 'appeals').map(d => ({
    date: d.date,
    value: d.value
  })) || [];

  const revenueChartData = analyticsData?.filter(d => d.category === 'revenue').map(d => ({
    date: d.date,
    value: d.value
  })) || [];

  const servicesChartData = analyticsData?.filter(d => d.category === 'services').map(d => ({
    date: d.date,
    value: d.value
  })) || [];

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

      {/* Interactive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricsChart 
          title={language === 'en' ? 'Appeals Trend' : 'Тренд звернень'}
          data={appealsChartData}
          type="line"
          color="#f59e0b"
        />
        <MetricsChart 
          title={language === 'en' ? 'Revenue Growth' : 'Зростання доходу'}
          data={revenueChartData}
          type="bar"
          color="#10b981"
        />
        <MetricsChart 
          title={language === 'en' ? 'Active Services' : 'Активні послуги'}
          data={servicesChartData}
          type="line"
          color="#3b82f6"
        />
      </div>

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
