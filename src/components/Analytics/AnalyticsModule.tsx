
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Calendar, Download } from 'lucide-react';

const AnalyticsModule = () => {
  const { language } = useLanguage();
  const [dateRange, setDateRange] = useState('month');

  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: appeals } = useQuery({
    queryKey: ['appeals-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appeals')
        .select('status, category, created_at');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: services } = useQuery({
    queryKey: ['services-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('category, requests, name');

      if (error) throw error;
      return data || [];
    }
  });

  // Process data for charts
  const appealsByStatus = React.useMemo(() => {
    if (!appeals) return [];
    
    const statusCounts = appeals.reduce((acc, appeal) => {
      const status = appeal.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: language === 'en' ? status : status,
      count
    }));
  }, [appeals, language]);

  const serviceRequests = React.useMemo(() => {
    if (!services) return [];
    
    return services
      .filter(service => service.requests > 0)
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)
      .map(service => ({
        name: language === 'en' ? service.name : service.name,
        requests: service.requests || 0
      }));
  }, [services, language]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>{language === 'en' ? 'Loading analytics...' : 'Завантаження аналітики...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Analytics & Reports' : 'Аналітика та звіти'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' ? 'System performance and usage statistics' : 'Продуктивність системи та статистика використання'}
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Export Report' : 'Експорт звіту'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Appeals' : 'Загальна кількість звернень'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{appeals?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Active Services' : 'Активні послуги'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{services?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'This Month' : 'Цього місяця'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {appeals?.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Growth Rate' : 'Темп зростання'}
                </p>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">{language === 'en' ? 'Overview' : 'Огляд'}</TabsTrigger>
          <TabsTrigger value="appeals">{language === 'en' ? 'Appeals' : 'Звернення'}</TabsTrigger>
          <TabsTrigger value="services">{language === 'en' ? 'Services' : 'Послуги'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Appeals by Status' : 'Звернення за статусом'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appealsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {appealsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Most Requested Services' : 'Найзапитуваніші послуги'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceRequests.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appeals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Appeals Analytics' : 'Аналітика звернень'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">
                    {language === 'en' ? 'Under Review' : 'На розгляді'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {appeals?.filter(a => a.status === 'Under Review').length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800">
                    {language === 'en' ? 'Resolved' : 'Вирішено'}
                  </h3>
                  <p className="text-2xl font-bold text-green-900">
                    {appeals?.filter(a => a.status === 'Resolved').length || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800">
                    {language === 'en' ? 'In Progress' : 'В процесі'}
                  </h3>
                  <p className="text-2xl font-bold text-yellow-900">
                    {appeals?.filter(a => a.status === 'In Progress').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Services Performance' : 'Продуктивність послуг'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={serviceRequests}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsModule;
