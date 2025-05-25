
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Users, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

const AnalyticsModule = () => {
  const { language, t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Sample data for various charts
  const monthlyData = [
    { name: language === 'en' ? 'Jan' : 'Січ', services: 120, appeals: 45, budget: 15000 },
    { name: language === 'en' ? 'Feb' : 'Лют', services: 135, appeals: 52, budget: 18000 },
    { name: language === 'en' ? 'Mar' : 'Бер', services: 142, appeals: 48, budget: 16500 },
    { name: language === 'en' ? 'Apr' : 'Кві', services: 155, appeals: 62, budget: 19200 },
    { name: language === 'en' ? 'May' : 'Тра', services: 165, appeals: 57, budget: 17800 },
    { name: language === 'en' ? 'Jun' : 'Чер', services: 178, appeals: 68, budget: 21000 }
  ];

  const serviceTypeData = [
    { name: language === 'en' ? 'Utilities' : 'Комунальні послуги', value: 35, color: '#0088FE' },
    { name: language === 'en' ? 'Construction' : 'Будівництво', value: 25, color: '#00C49F' },
    { name: language === 'en' ? 'Infrastructure' : 'Інфраструктура', value: 20, color: '#FFBB28' },
    { name: language === 'en' ? 'Recreation' : 'Відпочинок', value: 12, color: '#FF8042' },
    { name: language === 'en' ? 'Other' : 'Інше', value: 8, color: '#8884d8' }
  ];

  const dailyAppeals = [
    { day: language === 'en' ? 'Mon' : 'Пн', count: 12, resolved: 8 },
    { day: language === 'en' ? 'Tue' : 'Вт', count: 19, resolved: 15 },
    { day: language === 'en' ? 'Wed' : 'Ср', count: 15, resolved: 12 },
    { day: language === 'en' ? 'Thu' : 'Чт', count: 22, resolved: 18 },
    { day: language === 'en' ? 'Fri' : 'Пт', count: 28, resolved: 22 },
    { day: language === 'en' ? 'Sat' : 'Сб', count: 9, resolved: 7 },
    { day: language === 'en' ? 'Sun' : 'Нд', count: 6, resolved: 5 }
  ];

  const districtData = [
    { district: language === 'en' ? 'Central' : 'Центральний', issues: 45, rating: 4.2 },
    { district: language === 'en' ? 'Northern' : 'Північний', issues: 32, rating: 4.5 },
    { district: language === 'en' ? 'Southern' : 'Південний', issues: 28, rating: 4.0 },
    { district: language === 'en' ? 'Eastern' : 'Східний', issues: 38, rating: 4.3 },
    { district: language === 'en' ? 'Western' : 'Західний', issues: 25, rating: 4.6 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleExportReport = async (format: string) => {
    try {
      await addActivity({
        title: language === 'en' ? `Analytics report exported (${format.toUpperCase()})` : `Експортовано аналітичний звіт (${format.toUpperCase()})`,
        description: `Exported analytics report in ${format} format`,
        type: 'report',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(language === 'en' ? `Report exported to ${format.toUpperCase()}` : `Звіт експортовано у ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error(language === 'en' ? 'Error exporting report' : 'Помилка експорту звіту');
    }
  };

  const kpiData = [
    {
      title: language === 'en' ? 'Total Appeals' : 'Всього звернень',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: MessageSquare
    },
    {
      title: language === 'en' ? 'Resolved Issues' : 'Вирішені питання',
      value: '1,089',
      change: '+8%',
      trend: 'up',
      icon: CheckCircle
    },
    {
      title: language === 'en' ? 'Active Users' : 'Активні користувачі',
      value: '2,547',
      change: '+15%',
      trend: 'up',
      icon: Users
    },
    {
      title: language === 'en' ? 'Avg. Processing Time' : 'Сер. час обробки',
      value: '2.4 ' + (language === 'en' ? 'days' : 'дні'),
      change: '-5%',
      trend: 'down',
      icon: AlertCircle
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('analyticsReports')}</h2>
          <p className="text-gray-600">
            {language === 'en'
              ? 'Comprehensive analytics and reporting dashboard'
              : 'Комплексна панель аналітики та звітності'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Filters' : 'Фільтри'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'en' ? 'Period' : 'Період'}
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">{language === 'en' ? 'Last Week' : 'Останній тиждень'}</SelectItem>
                  <SelectItem value="month">{language === 'en' ? 'Last Month' : 'Останній місяць'}</SelectItem>
                  <SelectItem value="quarter">{language === 'en' ? 'Last Quarter' : 'Останній квартал'}</SelectItem>
                  <SelectItem value="year">{language === 'en' ? 'Last Year' : 'Останній рік'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'en' ? 'Category' : 'Категорія'}
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'en' ? 'All Categories' : 'Всі категорії'}</SelectItem>
                  <SelectItem value="utilities">{language === 'en' ? 'Utilities' : 'Комунальні послуги'}</SelectItem>
                  <SelectItem value="construction">{language === 'en' ? 'Construction' : 'Будівництво'}</SelectItem>
                  <SelectItem value="infrastructure">{language === 'en' ? 'Infrastructure' : 'Інфраструктура'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === 'en' ? 'District' : 'Район'}
              </label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'en' ? 'All Districts' : 'Всі райони'}</SelectItem>
                  <SelectItem value="central">{language === 'en' ? 'Central' : 'Центральний'}</SelectItem>
                  <SelectItem value="northern">{language === 'en' ? 'Northern' : 'Північний'}</SelectItem>
                  <SelectItem value="southern">{language === 'en' ? 'Southern' : 'Південний'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change} {language === 'en' ? 'vs last period' : 'від минулого періоду'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services and Appeals Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' 
                ? 'Services and Appeals Trend' 
                : 'Тенденція послуг та звернень'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="services" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    name={language === 'en' ? 'Services' : 'Послуги'} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="appeals" 
                    stackId="1"
                    stroke="#ef4444" 
                    fill="#ef4444"
                    name={language === 'en' ? 'Appeals' : 'Звернення'} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Trends */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Budget Expenditure Trend' : 'Тенденція витрат бюджету'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₴${value}`, language === 'en' ? 'Budget' : 'Бюджет']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name={language === 'en' ? 'Budget (₴)' : 'Бюджет (₴)'} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Service Types Distribution' : 'Розподіл типів послуг'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Appeals */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Daily Appeals Activity' : 'Щоденна активність звернень'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyAppeals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6" 
                    name={language === 'en' ? 'Submitted' : 'Подано'} 
                  />
                  <Bar 
                    dataKey="resolved" 
                    fill="#10b981" 
                    name={language === 'en' ? 'Resolved' : 'Вирішено'} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District Performance */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'District Performance Ranking' : 'Рейтинг районів за продуктивністю'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtData.map((district, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{district.district}</h4>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Issues:' : 'Питання:'} {district.issues}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium">{district.rating}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    district.rating >= 4.5 ? 'bg-green-100 text-green-800' :
                    district.rating >= 4.0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {district.rating >= 4.5 ? (language === 'en' ? 'Excellent' : 'Відмінно') :
                     district.rating >= 4.0 ? (language === 'en' ? 'Good' : 'Добре') :
                     (language === 'en' ? 'Needs Improvement' : 'Потребує покращення')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Key Insights' : 'Ключові інсайти'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-blue-800">
                {language === 'en' 
                  ? '📈 Appeals have increased by 12% this month, with utilities being the most common category.'
                  : '📈 Звернення зросли на 12% цього місяця, при цьому найпоширенішою категорією є комунальні послуги.'}
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-green-800">
                {language === 'en' 
                  ? '✅ Processing time has improved by 5%, now averaging 2.4 days per appeal.'
                  : '✅ Час обробки покращився на 5%, тепер в середньому становить 2,4 дні на звернення.'}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-yellow-800">
                {language === 'en' 
                  ? '⚠️ Central district shows highest activity but needs attention for faster resolution.'
                  : '⚠️ Центральний район показує найвищу активність, але потребує уваги для швидшого вирішення.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsModule;
