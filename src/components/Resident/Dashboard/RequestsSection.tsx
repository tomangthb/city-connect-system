
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const RequestsSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" className="shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Completed' : 'Завершено'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Pending' : 'Очікує'}
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="info" className="shadow-sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'In Progress' : 'В процесі'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-border text-muted-foreground">
            {status}
          </Badge>
        );
    }
  };

  const mockRequests = [
    {
      id: 1,
      title: language === 'en' ? 'Street Light Repair' : 'Ремонт вуличного освітлення',
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      title: language === 'en' ? 'Garbage Collection Issue' : 'Проблема з вивозом сміття',
      date: '2024-03-18',
      status: 'in-progress'
    },
    {
      id: 3,
      title: language === 'en' ? 'Park Maintenance Request' : 'Запит на утримання парку',
      date: '2024-03-20',
      status: 'pending'
    }
  ];

  return (
    <Card className="enhanced-card enhanced-card-border">
      <CardHeader>
        <CardTitle className="text-foreground">
          {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{request.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(request.status)}
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
      </CardContent>
    </Card>
  );
};

export default RequestsSection;
