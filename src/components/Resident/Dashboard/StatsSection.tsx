
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  CreditCard 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StatsSection = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  // Fetch user statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [appealsResult, appointmentsResult] = await Promise.all([
        supabase
          .from('appeals')
          .select('status')
          .eq('user_id', user.id),
        supabase
          .from('appointments')
          .select('status')
          .eq('user_id', user.id)
      ]);

      const appeals = appealsResult.data || [];
      const appointments = appointmentsResult.data || [];

      return {
        totalAppeals: appeals.length,
        completedAppeals: appeals.filter(a => a.status === 'Completed').length,
        pendingAppeals: appeals.filter(a => a.status === 'Under Review' || a.status === 'In Progress').length,
        totalAppointments: appointments.length
      };
    },
    enabled: !!user
  });

  const statsData = [
    {
      title: language === 'en' ? 'Total Appeals' : 'Всього звернень',
      value: stats?.totalAppeals || 0,
      icon: MessageSquare,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      title: language === 'en' ? 'Completed' : 'Завершено',
      value: stats?.completedAppeals || 0,
      icon: CheckCircle,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    },
    {
      title: language === 'en' ? 'In Progress' : 'В процесі',
      value: stats?.pendingAppeals || 0,
      icon: Clock,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    },
    {
      title: language === 'en' ? 'Appointments' : 'Записи',
      value: stats?.totalAppointments || 0,
      icon: CreditCard,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    }
  ];

  if (isLoading) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {language === 'en' ? 'My Statistics' : 'Моя статистика'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="enhanced-card enhanced-card-border">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {language === 'en' ? 'My Statistics' : 'Моя статистика'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="enhanced-card enhanced-card-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StatsSection;
