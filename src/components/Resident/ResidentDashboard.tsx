
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Calendar, 
  FileText, 
  MessageSquare,
  CreditCard,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentDashboard = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const quickServices = [
    { 
      title: language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні', 
      icon: CreditCard, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення', 
      icon: MessageSquare, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      title: language === 'en' ? 'Book Appointment' : 'Записатися на прийом', 
      icon: Calendar, 
      color: 'bg-purple-100 text-purple-600' 
    },
    { 
      title: language === 'en' ? 'View Documents' : 'Переглянути документи', 
      icon: FileText, 
      color: 'bg-orange-100 text-orange-600' 
    },
  ];

  const cityNews = [
    {
      title: language === 'en' ? 'New Park Opening This Weekend' : 'Відкриття нового парку на вихідних',
      date: '2024-05-20',
      summary: language === 'en' 
        ? 'Central Park renovation completed. Grand opening ceremony...' 
        : 'Завершена реконструкція Центрального парку. Урочисте відкриття...'
    },
    {
      title: language === 'en' ? 'Road Construction Updates' : 'Оновлення дорожнього будівництва',
      date: '2024-05-18',
      summary: language === 'en' 
        ? 'Main Street construction will continue through next month...' 
        : 'Будівництво на Головній вулиці триватиме наступний місяць...'
    },
    {
      title: language === 'en' ? 'Public Meeting Notice' : 'Повідомлення про громадські збори',
      date: '2024-05-15',
      summary: language === 'en' 
        ? 'Community budget discussion scheduled for next Tuesday...' 
        : 'Обговорення громадського бюджету заплановано на наступний вівторок...'
    }
  ];

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
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'en' ? 'Welcome to the City Portal' : 'Ласкаво просимо до Міського порталу'}
        </h2>
        <p className="mb-4">
          {language === 'en' 
            ? 'Access city services, submit requests, and stay informed about community news.' 
            : 'Отримайте доступ до міських послуг, подавайте запити та будьте в курсі новин громади.'}
        </p>
        <div className="flex space-x-4 max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={language === 'en' ? 'Search services, information...' : 'Пошук послуг, інформації...'}
              className="pl-10 bg-white text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary">
            {language === 'en' ? 'Search' : 'Пошук'}
          </Button>
        </div>
      </div>

      {/* Quick Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Quick Services' : 'Швидкі послуги'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{service.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City News & Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityNews.map((news, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                  <p className="text-xs text-gray-500">{news.date}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              {language === 'en' ? 'View All News' : 'Переглянути всі новини'}
            </Button>
          </CardContent>
        </Card>

        {/* My Requests */}
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
      </div>

      {/* Interactive City Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Interactive City Map' : 'Інтерактивна карта міста'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Interactive map with city services and locations' 
                  : 'Інтерактивна карта з міськими послугами та локаціями'}
              </p>
              <Button className="mt-3">
                {language === 'en' ? 'Explore Map' : 'Дослідити карту'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDashboard;
