
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ActivityFilter from './ActivityFilter';

const CollapsibleRecentActivities = () => {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch activities with filtering
  const { data: activitiesData } = useQuery({
    queryKey: ['activities', typeFilter, priorityFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Load more activities for scrolling

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
    
    if (diffInHours < 1) return t('justNow');
    if (diffInHours < 24) return `${diffInHours}${t('hoursAgo')}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}${t('daysAgo')}`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'pending': return t('pending');
      case 'scheduled': return t('scheduled');
      default: return status;
    }
  };

  return (
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
        <ScrollArea className="h-96 w-full pr-4">
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
                        {getStatusText(activity.status)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('noActivitiesFound')}</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CollapsibleRecentActivities;
