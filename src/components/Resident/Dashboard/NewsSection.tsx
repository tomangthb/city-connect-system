
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const NewsSection = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cityNews = [
    {
      id: 1,
      title: language === 'en' ? 'New Park Opening This Weekend' : 'Відкриття нового парку на вихідних',
      date: '2024-05-20',
      summary: language === 'en' 
        ? 'Central Park renovation completed. Grand opening ceremony...' 
        : 'Завершена реконструкція Центрального парку. Урочисте відкриття...',
      comments: 12
    },
    {
      id: 2,
      title: language === 'en' ? 'Road Construction Updates' : 'Оновлення дорожнього будівництва',
      date: '2024-05-18',
      summary: language === 'en' 
        ? 'Main Street construction will continue through next month...' 
        : 'Будівництво на Головній вулиці триватиме наступний місяць...',
      comments: 8
    },
    {
      id: 3,
      title: language === 'en' ? 'Public Meeting Notice' : 'Повідомлення про громадські збори',
      date: '2024-05-15',
      summary: language === 'en' 
        ? 'Community budget discussion scheduled for next Tuesday...' 
        : 'Обговорення громадського бюджету заплановано на наступний вівторок...',
      comments: 5
    },
    {
      id: 4,
      title: language === 'en' ? 'Water System Maintenance' : 'Обслуговування водної системи',
      date: '2024-05-12',
      summary: language === 'en' 
        ? 'Scheduled maintenance will affect water pressure...' 
        : 'Планове обслуговування вплине на тиск води...',
      comments: 15
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : cityNews.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < cityNews.length - 1 ? prev + 1 : 0);
  };

  const handleComments = (newsId: number) => {
    toast.success(`${language === 'en' ? 'Opening comments for news' : 'Відкриваємо коментарі до новини'} #${newsId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {cityNews.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-medium text-gray-900 mb-1">{cityNews[currentIndex].title}</h4>
            <p className="text-sm text-gray-600 mb-2">{cityNews[currentIndex].summary}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{cityNews[currentIndex].date}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleComments(cityNews[currentIndex].id)}
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{cityNews[currentIndex].comments}</span>
              </Button>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4">
          {language === 'en' ? 'View All News' : 'Переглянути всі новини'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
