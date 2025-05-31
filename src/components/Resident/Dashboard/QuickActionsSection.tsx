
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Phone, 
  MapPin, 
  Bell,
  Download,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const QuickActionsSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: language === 'en' ? 'Download Certificate' : 'Завантажити довідку',
      description: language === 'en' ? 'Get official documents' : 'Отримати офіційні документи',
      icon: Download,
      action: () => {
        toast.success(language === 'en' ? 'Opening document portal' : 'Відкриття порталу документів');
        // Could navigate to documents section
      }
    },
    {
      title: language === 'en' ? 'Emergency Contacts' : 'Екстрені контакти',
      description: language === 'en' ? 'Important phone numbers' : 'Важливі номери телефонів',
      icon: Phone,
      action: () => {
        toast.info(language === 'en' ? 'Emergency: 102, Gas: 104, Medical: 103' : 'Поліція: 102, Газ: 104, Швидка: 103');
      }
    },
    {
      title: language === 'en' ? 'Find Services' : 'Знайти послуги',
      description: language === 'en' ? 'Search city services' : 'Пошук міських послуг',
      icon: Search,
      action: () => {
        navigate('/resident-services');
        toast.success(language === 'en' ? 'Opening services catalog' : 'Відкриття каталогу послуг');
      }
    },
    {
      title: language === 'en' ? 'City Locations' : 'Міські локації',
      description: language === 'en' ? 'Find nearby offices' : 'Знайти найближчі офіси',
      icon: MapPin,
      action: () => {
        toast.success(language === 'en' ? 'Opening interactive map' : 'Відкриття інтерактивної карти');
      }
    },
    {
      title: language === 'en' ? 'Check Status' : 'Перевірити статус',
      description: language === 'en' ? 'Track your requests' : 'Відстежити ваші запити',
      icon: FileText,
      action: () => {
        navigate('/resident-appeals');
        toast.success(language === 'en' ? 'Opening appeals tracker' : 'Відкриття відстеження звернень');
      }
    },
    {
      title: language === 'en' ? 'Notifications' : 'Сповіщення',
      description: language === 'en' ? 'Manage alerts' : 'Керування сповіщеннями',
      icon: Bell,
      action: () => {
        toast.success(language === 'en' ? 'Opening notification settings' : 'Відкриття налаштувань сповіщень');
      }
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {language === 'en' ? 'Quick Actions' : 'Швидкі дії'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="enhanced-card enhanced-card-border hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={action.action}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsSection;
