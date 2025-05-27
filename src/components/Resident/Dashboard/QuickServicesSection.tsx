
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  FileText 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Service {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

const QuickServicesSection = () => {
  const { language } = useLanguage();

  const handleServiceClick = (serviceName: string) => {
    toast.success(`${serviceName} ${language === 'en' ? 'clicked' : 'натиснуто'}`);
  };

  const quickServices: Service[] = [
    { 
      title: language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні', 
      icon: CreditCard, 
      color: 'bg-blue-100 text-blue-600',
      action: () => handleServiceClick(language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні')
    },
    { 
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення', 
      icon: MessageSquare, 
      color: 'bg-green-100 text-green-600',
      action: () => handleServiceClick(language === 'en' ? 'Submit Appeal' : 'Подати звернення')
    },
    { 
      title: language === 'en' ? 'Book Appointment' : 'Записатися на прийом', 
      icon: Calendar, 
      color: 'bg-purple-100 text-purple-600',
      action: () => handleServiceClick(language === 'en' ? 'Book Appointment' : 'Записатися на прийом')
    },
    { 
      title: language === 'en' ? 'View Documents' : 'Переглянути документи', 
      icon: FileText, 
      color: 'bg-orange-100 text-orange-600',
      action: () => handleServiceClick(language === 'en' ? 'View Documents' : 'Переглянути документи')
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Quick Services' : 'Швидкі послуги'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={service.action}
            >
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
  );
};

export default QuickServicesSection;
