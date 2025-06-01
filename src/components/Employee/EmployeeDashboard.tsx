
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Activity,
  Plus,
  BarChart3,
  Settings
} from 'lucide-react';
import KPICard from './KPICard';
import QuickActions from './QuickActions';
import MetricsChart from './MetricsChart';
import CollapsibleRecentActivities from './CollapsibleRecentActivities';

interface EmployeeDashboardProps {
  onTabChange: (tab: string) => void;
  onOpenSettings: () => void;
}

const EmployeeDashboard = ({ onTabChange, onOpenSettings }: EmployeeDashboardProps) => {
  const { language } = useLanguage();

  // Fetch real data from database
  const { data: appealsData } = useQuery({
    queryKey: ['appeals-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appeals')
        .select('status, created_at, category');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('status, requests');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: documentsData } = useQuery({
    queryKey: ['documents-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('created_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate statistics
  const totalAppeals = appealsData?.length || 0;
  const pendingAppeals = appealsData?.filter(appeal => appeal.status === 'Under Review')?.length || 0;
  const resolvedAppeals = appealsData?.filter(appeal => appeal.status === 'Resolved')?.length || 0;
  const activeServices = servicesData?.filter(service => service.status === 'Available')?.length || 0;
  const totalDocuments = documentsData?.length || 0;

  // Calculate monthly appeals
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyAppeals = appealsData?.filter(appeal => {
    const appealDate = new Date(appeal.created_at);
    return appealDate.getMonth() === currentMonth && appealDate.getFullYear() === currentYear;
  })?.length || 0;

  const kpiData = [
    {
      title: language === 'en' ? 'Total Appeals' : 'Загальна кількість звернень',
      value: totalAppeals,
      change: '+12%',
      trend: 'up' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: language === 'en' ? 'Pending Appeals' : 'Звернення на розгляді',
      value: pendingAppeals,
      change: '-5%',
      trend: 'down' as const,
      icon: Clock,
      color: 'yellow'
    },
    {
      title: language === 'en' ? 'Active Services' : 'Активні послуги',
      value: activeServices,
      change: '+8%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: language === 'en' ? 'This Month' : 'Цього місяця',
      value: monthlyAppeals,
      change: '+15%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'purple'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Employee Dashboard' : 'Панель працівника'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Overview of system performance and recent activities' : 'Огляд продуктивності системи та останніх активностей'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onTabChange('analytics')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Analytics' : 'Аналітика'}
          </Button>
          <Button variant="outline" onClick={onOpenSettings}>
            <Settings className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Settings' : 'Налаштування'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions onTabChange={onTabChange} />
        </div>

        {/* Metrics Chart */}
        <div className="lg:col-span-2">
          <MetricsChart />
        </div>
      </div>

      {/* Recent Activities */}
      <CollapsibleRecentActivities />

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Appeal Status' : 'Статус звернень'}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Resolved' : 'Вирішено'}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {resolvedAppeals}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'In Progress' : 'В процесі'}
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {appealsData?.filter(appeal => appeal.status === 'In Progress')?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Pending' : 'На розгляді'}
                </span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {pendingAppeals}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'Service Categories' : 'Категорії послуг'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Housing & Utilities' : 'Житлово-комунальні'}
                </span>
                <Badge variant="outline">
                  {servicesData?.filter(service => service.status === 'Available')?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Permits' : 'Дозволи'}
                </span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Social Services' : 'Соціальні послуги'}
                </span>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'en' ? 'System Health' : 'Стан системи'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Uptime' : 'Час роботи'}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  99.9%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Response Time' : 'Час відповіді'}
                </span>
                <Badge variant="outline">120ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Active Users' : 'Активні користувачі'}
                </span>
                <Badge variant="outline">245</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
