
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentNewsModule = () => {
  const { language } = useLanguage();

  const newsItems = [
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
      </h2>

      <div className="grid gap-4">
        {newsItems.map((news, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Newspaper className="h-5 w-5 mr-2" />
                  {news.title}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {news.date}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{news.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResidentNewsModule;
