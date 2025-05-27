
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const RequestsSection = () => {
  const { language } = useLanguage();

  const myRequests = [
    { 
      id: '001', 
      service: language === 'en' ? 'Street Light Repair' : 'Ремонт вуличного освітлення', 
      status: language === 'en' ? 'In Progress' : 'В процесі', 
      date: '2024-05-10' 
    },
    { 
      id: '002', 
      service: language === 'en' ? 'Pothole Report' : 'Звіт про ями', 
      status: language === 'en' ? 'Completed' : 'Завершено', 
      date: '2024-05-05' 
    },
    { 
      id: '003', 
      service: language === 'en' ? 'Noise Complaint' : 'Скарга на шум', 
      status: language === 'en' ? 'Under Review' : 'На розгляді', 
      date: '2024-05-12' 
    },
  ];

  const getStatusColor = (status: string) => {
    const englishStatus = status === 'Завершено' ? 'Completed' : 
                         status === 'В процесі' ? 'In Progress' : 
                         status === 'На розгляді' ? 'Under Review' : status;
    
    switch (englishStatus) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {myRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{request.service}</p>
                <p className="text-sm text-gray-600">#{request.id} • {request.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          {language === 'en' ? 'View All Requests' : 'Переглянути всі запити'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequestsSection;
