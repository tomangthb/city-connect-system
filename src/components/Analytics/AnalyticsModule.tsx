
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsModule = () => {
  const { language, t } = useLanguage();
  
  // Sample data for charts
  const monthlyData = [
    { name: language === 'en' ? 'Jan' : 'Січ', services: 120, appeals: 45 },
    { name: language === 'en' ? 'Feb' : 'Лют', services: 135, appeals: 52 },
    { name: language === 'en' ? 'Mar' : 'Бер', services: 142, appeals: 48 },
    { name: language === 'en' ? 'Apr' : 'Кві', services: 155, appeals: 62 },
    { name: language === 'en' ? 'May' : 'Тра', services: 165, appeals: 57 }
  ];
  
  const serviceTypeData = [
    { name: language === 'en' ? 'Construction' : 'Будівництво', value: 35 },
    { name: language === 'en' ? 'Utilities' : 'Комунальні послуги', value: 45 },
    { name: language === 'en' ? 'Infrastructure' : 'Інфраструктура', value: 15 },
    { name: language === 'en' ? 'Recreation' : 'Відпочинок', value: 5 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const dailyAppeals = [
    { day: language === 'en' ? 'Mon' : 'Пн', count: 12 },
    { day: language === 'en' ? 'Tue' : 'Вт', count: 19 },
    { day: language === 'en' ? 'Wed' : 'Ср', count: 15 },
    { day: language === 'en' ? 'Thu' : 'Чт', count: 22 },
    { day: language === 'en' ? 'Fri' : 'Пт', count: 28 },
    { day: language === 'en' ? 'Sat' : 'Сб', count: 9 },
    { day: language === 'en' ? 'Sun' : 'Нд', count: 6 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('analyticsReports')}</h2>
        <p className="text-gray-600">
          {language === 'en'
            ? 'Analyze city data and generate reports'
            : 'Аналізуйте міські дані та створюйте звіти'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services and Appeals Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' 
                ? 'Services and Appeals Over Time' 
                : 'Послуги та звернення з часом'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="services" 
                    stroke="#3b82f6" 
                    name={language === 'en' ? 'Services' : 'Послуги'} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appeals" 
                    stroke="#ef4444" 
                    name={language === 'en' ? 'Appeals' : 'Звернення'} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Service Types Pie Chart */}
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

        {/* Daily Appeals Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Daily Appeals Submitted' : 'Щоденні подані звернення'}
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
                    fill="#8884d8" 
                    name={language === 'en' ? 'Appeals' : 'Звернення'} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsModule;
