
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
  Settings,
  UserPlus,
  Eye
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

  // Fetch user profiles data for new registrations
  const { data: profiles } = useQuery({
    queryKey: ['profiles-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, user_type');

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

  // Calculate monthly new user registrations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyNewUsers = profiles?.filter(profile => {
    const registrationDate = new Date(profile.created_at);
    return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear;
  })?.length || 0;

  // Mock data for page views (this would typically come from analytics service)
  const monthlyPageViews = 2847; // This would be real data from analytics

  const kpiData = [
    {
      title: language === 'en' ? 'Total Appeals' : 'Загальна кількість звернень',
      value: totalAppeals,
      change: 12,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: language === 'en' ? 'Pending Appeals' : 'Звернення на розгляді',
      value: pendingAppeals,
      change: -5,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: language === 'en' ? 'Active Services' : 'Активні послуги',
      value: activeServices,
      change: 8,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: language === 'en' ? 'New Registrations' : 'Нові реєстрації',
      value: monthlyNewUsers,
      change: 23,
      icon: UserPlus,
      color: 'text-purple-600'
    }
  ];

  // Sample data for metrics chart
  const chartData = [
    { date: '2024-01-01', value: 10 },
    { date: '2024-01-02', value: 15 },
    { date: '2024-01-03', value: 12 },
    { date: '2024-01-04', value: 20 },
    { date: '2024-01-05', value: 18 },
    { date: '2024-01-06', value: 25 },
    { date: '2024-01-07', value: 22 }
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
          <MetricsChart 
            title={language === 'en' ? 'Weekly Activity' : 'Тижнева активність'}
            data={chartData}
            type="line"
          />
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
              {language === 'en' ? 'Monthly Page Views' : 'Перегляди сторінок'}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Total Views' : 'Всього переглядів'}
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {monthlyPageViews.toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Unique Visitors' : 'Унікальні відвідувачі'}
                </span>
                <Badge variant="outline">1,847</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Bounce Rate' : 'Показник відмов'}
                </span>
                <Badge variant="outline">32%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
