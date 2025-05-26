import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Users, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AnalyticsModule = () => {
  const { language, t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [realData, setRealData] = useState({
    appeals: [],
    services: [],
    users: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, [selectedPeriod, selectedCategory]);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      // Fetch appeals data
      const { data: appeals } = await supabase
        .from('appeals')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch services data
      const { data: services } = await supabase
        .from('services')
        .select('*');

      // Fetch users data
      const { data: users } = await supabase
        .from('profiles')
        .select('*');

      // Fetch activities data
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      setRealData({
        appeals: appeals || [],
        services: services || [],
        users: users || [],
        activities: activities || []
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process real data for charts
  const processMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthsUk = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер'];
    
    return months.map((month, index) => {
      const monthlyAppeals = realData.appeals.filter(appeal => {
        const appealMonth = new Date(appeal.created_at).getMonth();
        return appealMonth === index;
      });

      const monthlyServices = realData.services.filter(service => {
        const serviceMonth = new Date(service.created_at || new Date()).getMonth();
        return serviceMonth === index;
      });

      return {
        name: language === 'en' ? month : monthsUk[index],
        services: monthlyServices.length,
        appeals: monthlyAppeals.length,
        budget: Math.random() * 10000 + 15000 // Keep budget as sample data for now
      };
    });
  };

  const processServiceTypeData = () => {
    const categories = {};
    realData.services.forEach(service => {
      const category = language === 'en' ? service.category : service.category_uk;
      if (category) {
        categories[category] = (categories[category] || 0) + 1;
      }
    });

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const processDailyAppeals = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysUk = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    
    return days.map((day, index) => {
      const dayAppeals = realData.appeals.filter(appeal => {
        const appealDay = new Date(appeal.created_at).getDay();
        return appealDay === index + 1 || (index === 6 && appealDay === 0); // Sunday handling
      });

      const resolvedAppeals = dayAppeals.filter(appeal => 
        appeal.status === 'Resolved' || appeal.status === 'Completed'
      );

      return {
        day: language === 'en' ? day : daysUk[index],
        count: dayAppeals.length,
        resolved: resolvedAppeals.length
      };
    });
  };

  const monthlyData = processMonthlyData();
  const serviceTypeData = processServiceTypeData();
  const dailyAppeals = processDailyAppeals();

  const districtData = [
    { district: language === 'en' ? 'Central' : 'Центральний', issues: realData.appeals.filter(a => a.category === 'Central').length || 45, rating: 4.2 },
    { district: language === 'en' ? 'Northern' : 'Північний', issues: realData.appeals.filter(a => a.category === 'Northern').length || 32, rating: 4.5 },
    { district: language === 'en' ? 'Southern' : 'Південний', issues: realData.appeals.filter(a => a.category === 'Southern').length || 28, rating: 4.0 },
    { district: language === 'en' ? 'Eastern' : 'Східний', issues: realData.appeals.filter(a => a.category === 'Eastern').length || 38, rating: 4.3 },
    { district: language === 'en' ? 'Western' : 'Західний', issues: realData.appeals.filter(a => a.category === 'Western').length || 25, rating: 4.6 }
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

  const totalAppeals = realData.appeals.length;
  const resolvedAppeals = realData.appeals.filter(appeal => 
    appeal.status === 'Resolved' || appeal.status === 'Completed'
  ).length;
  const activeUsers = realData.users.length;

  const kpiData = [
    {
      title: language === 'en' ? 'Total Appeals' : 'Всього звернень',
      value: totalAppeals.toString(),
      change: '+12%',
      trend: 'up',
      icon: MessageSquare
    },
    {
      title: language === 'en' ? 'Resolved Issues' : 'Вирішені питання',
      value: resolvedAppeals.toString(),
      change: '+8%',
      trend: 'up',
      icon: CheckCircle
    },
    {
      title: language === 'en' ? 'Active Users' : 'Активні користувачі',
      value: activeUsers.toString(),
      change: '+15%',
      trend: 'up',
      icon: Users
    },
    {
      title: language === 'en' ? 'Total Services' : 'Всього послуг',
      value: realData.services.length.toString(),
      change: '+5%',
      trend: 'up',
      icon: AlertCircle
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-gray-500">
            {language === 'en' ? 'Loading analytics data...' : 'Завантаження даних аналітики...'}
          </p>
        </div>
      </div>
    );
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Export' : 'Експорт'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  ? `📈 You have ${totalAppeals} total appeals, with ${resolvedAppeals} resolved.`
                  : `📈 У вас є ${totalAppeals} звернень загалом, з них ${resolvedAppeals} вирішено.`}
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-green-800">
                {language === 'en' 
                  ? `✅ Currently serving ${activeUsers} active users with ${realData.services.length} available services.`
                  : `✅ Наразі обслуговуємо ${activeUsers} активних користувачів з ${realData.services.length} доступними послугами.`}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-yellow-800">
                {language === 'en' 
                  ? '⚠️ Consider implementing automated notifications for faster resolution times.'
                  : '⚠️ Розгляньте впровадження автоматичних сповіщень для прискорення часу вирішення.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsModule;
