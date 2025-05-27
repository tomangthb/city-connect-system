
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const NewsSection = () => {
  const { language } = useLanguage();

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

  return (
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
  );
};

export default NewsSection;
