
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KPICard from './KPICard';
import MetricsChart from './MetricsChart';
import ActivityFilter from './ActivityFilter';
import QuickActions from './QuickActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, MessageSquare, Clock, ThumbsUp } from 'lucide-react';

interface EmployeeDashboardProps {
  onTabChange?: (tab: string) => void;
  onOpenSettings?: () => void;
}

const EmployeeDashboard = ({ onTabChange, onOpenSettings }: EmployeeDashboardProps) => {
  const { t } = useLanguage();

  // Activity filter state
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample KPI data with required icon and color props
  const kpiData = [
    { 
      title: t('totalAppeals'), 
      value: '1,234', 
      change: 12, 
      icon: FileText, 
      color: 'text-blue-600' 
    },
    { 
      title: t('resolvedAppeals'), 
      value: '987', 
      change: 8, 
      icon: MessageSquare, 
      color: 'text-green-600' 
    },
    { 
      title: t('avgResponseTime'), 
      value: '2.4h', 
      change: -15, 
      icon: Clock, 
      color: 'text-orange-600' 
    },
    { 
      title: t('citizenSatisfaction'), 
      value: '94%', 
      change: 3, 
      icon: ThumbsUp, 
      color: 'text-purple-600' 
    },
  ];

  // Sample chart data
  const chartData = [
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 120 },
    { date: '2024-01-03', value: 90 },
    { date: '2024-01-04', value: 140 },
    { date: '2024-01-05', value: 160 },
    { date: '2024-01-06', value: 130 },
    { date: '2024-01-07', value: 180 },
  ];

  // Sample recent activity data
  const recentActivities = [
    { id: 1, action: t('newAppealSubmitted'), user: 'Ivan Petrov', time: '5 min ago', status: 'new' },
    { id: 2, action: t('appealStatusUpdated'), user: 'Maria Kovalenko', time: '15 min ago', status: 'updated' },
    { id: 3, action: t('documentProcessed'), user: 'System', time: '1 hour ago', status: 'completed' },
    { id: 4, action: t('userRegistered'), user: 'Oleksandr Shevchenko', time: '2 hours ago', status: 'new' },
  ];

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('employeeDashboard')}</h1>
        <p className="text-gray-600">{t('dashboardDescription')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricsChart 
            title={t('weeklyActivity') || 'Weekly Activity'} 
            data={chartData} 
            type="line"
            color="#3b82f6"
          />
        </div>
        <QuickActions onTabChange={onTabChange} onOpenSettings={onOpenSettings} />
      </div>

      {/* Recent Activities and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('recentActivities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'updated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('filters') || 'Filters'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFilter
                selectedType={selectedType}
                selectedPriority={selectedPriority}
                selectedStatus={selectedStatus}
                onTypeChange={setSelectedType}
                onPriorityChange={setSelectedPriority}
                onStatusChange={setSelectedStatus}
                onClearFilters={handleClearFilters}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
