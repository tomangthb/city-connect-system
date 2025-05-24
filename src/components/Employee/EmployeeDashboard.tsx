
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import KPICard from './KPICard';
import ActivityFilter from './ActivityFilter';
import MetricsChart from './MetricsChart';
import QuickActions from './QuickActions';
import { toast } from 'sonner';

const EmployeeDashboard = () => {
  const { language, t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Fetch activities with filtering
  const { data: activitiesData, refetch: refetchActivities } = useQuery({
    queryKey: ['activities', typeFilter, priorityFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching activities:', error);
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
      onClick: () => toast.info('Loading appeals dashboard...')
    },
    { 
      title: t('activeServices'), 
      value: getMetricByName('activeServices')?.metric_value || 0,
      target: getMetricByName('activeServices')?.metric_target,
      change: getMetricByName('activeServices')?.metric_change,
      icon: FileText, 
      color: 'text-blue-600',
      onClick: () => toast.info('Loading services management...')
    },
    { 
      title: t('registeredCitizens'), 
      value: getMetricByName('registeredCitizens')?.metric_value?.toLocaleString() || '0',
      target: getMetricByName('registeredCitizens')?.metric_target,
      change: getMetricByName('registeredCitizens')?.metric_change,
      icon: Users, 
      color: 'text-green-600',
      onClick: () => toast.info('Loading citizen registry...')
    },
    { 
      title: t('monthlyRevenue'), 
      value: `$${getMetricByName('monthlyRevenue')?.metric_value?.toLocaleString() || '0'}`,
      target: getMetricByName('monthlyRevenue')?.metric_target,
      change: getMetricByName('monthlyRevenue')?.metric_change,
      icon: DollarSign, 
      color: 'text-purple-600',
      onClick: () => toast.info('Loading financial dashboard...')
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

  const clearFilters = () => {
    setTypeFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appeal': return <MessageSquare className="h-5 w-5 text-orange-600" />;
      case 'service': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'report': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'event': return <AlertCircle className="h-5 w-5 text-purple-600" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === 'en' ? 'Just now' : 'Щойно';
    if (diffInHours < 24) return language === 'en' ? `${diffInHours}h ago` : `${diffInHours}г тому`;
    const diffInDays = Math.floor(diffInHours / 24);
    return language === 'en' ? `${diffInDays}d ago` : `${diffInDays}д тому`;
  };

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
          title="Appeals Trend"
          data={appealsChartData}
          type="line"
          color="#f59e0b"
        />
        <MetricsChart 
          title="Revenue Growth"
          data={revenueChartData}
          type="bar"
          color="#10b981"
        />
        <MetricsChart 
          title="Active Services"
          data={servicesChartData}
          type="line"
          color="#3b82f6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities with Filtering */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivities')}</CardTitle>
            <ActivityFilter
              selectedType={typeFilter}
              selectedPriority={priorityFilter}
              selectedStatus={statusFilter}
              onTypeChange={setTypeFilter}
              onPriorityChange={setPriorityFilter}
              onStatusChange={setStatusFilter}
              onClearFilters={clearFilters}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activitiesData && activitiesData.length > 0 ? (
                activitiesData.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} transition-colors hover:shadow-sm`}
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No activities found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
