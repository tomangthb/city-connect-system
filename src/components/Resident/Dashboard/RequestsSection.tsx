
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const RequestsSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch user's appeals from Supabase
  const { data: appeals, isLoading } = useQuery({
    queryKey: ['user-appeals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('appeals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3); // Show only the 3 most recent appeals
      
      if (error) {
        console.error('Error fetching appeals:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user
  });

  const getStatusBadge = (status: string) => {
    const getStatusText = (status: string) => {
      if (language === 'uk') {
        switch (status) {
          case 'Completed': return 'Завершено';
          case 'In Progress': return 'В процесі';
          case 'Under Review': return 'На розгляді';
          case 'Rejected': return 'Відхилено';
          default: return status;
        }
      }
      return status;
    };

    switch (status) {
      case 'Completed':
        return (
          <Badge variant="success" className="shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            {getStatusText(status)}
          </Badge>
        );
      case 'Under Review':
        return (
          <Badge variant="warning" className="shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            {getStatusText(status)}
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant="info" className="shadow-sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            {getStatusText(status)}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border text-muted-foreground">
            {getStatusText(status)}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US');
  };

  if (isLoading) {
    return (
      <Card className="enhanced-card enhanced-card-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">
              {language === 'en' ? 'Loading...' : 'Завантаження...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="enhanced-card enhanced-card-border">
      <CardHeader>
        <CardTitle className="text-foreground">
          {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appeals && appeals.length > 0 ? (
          <>
            {appeals.map((appeal) => (
              <div key={appeal.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{appeal.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(appeal.created_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(appeal.status)}
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-4 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => navigate('/resident-appeals')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === 'en' ? 'View All Appeals' : 'Переглянути всі звернення'}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {language === 'en' ? 'No requests found' : 'Запитів не знайдено'}
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/resident-appeals')}
            >
              {language === 'en' ? 'Submit Your First Request' : 'Подати перший запит'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsSection;
