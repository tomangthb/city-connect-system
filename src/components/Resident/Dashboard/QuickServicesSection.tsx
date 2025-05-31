
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  MessageSquare, 
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Service {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  action: () => void;
}

const QuickServicesSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handlePayUtilities = () => {
    navigate('/resident-payments');
    toast.success(`${language === 'en' ? 'Redirecting to Payments & Billing' : 'Перенаправлення на Платежі та рахунки'}`);
  };

  const handleSubmitAppeal = () => {
    navigate('/resident-appeals');
    toast.success(`${language === 'en' ? 'Redirecting to My Appeals' : 'Перенаправлення на Мої звернення'}`);
  };

  const handleBookAppointment = () => {
    navigate('/resident-resources');
    toast.success(`${language === 'en' ? 'Redirecting to City Resources' : 'Перенаправлення на Міські ресурси'}`);
  };

  const quickServices: Service[] = [
    { 
      title: language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні', 
      icon: CreditCard, 
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      action: handlePayUtilities
    },
    { 
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення', 
      icon: MessageSquare, 
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      action: handleSubmitAppeal
    },
    { 
      title: language === 'en' ? 'Book Appointment' : 'Записатися на прийом', 
      icon: Calendar, 
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      action: handleBookAppointment
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {language === 'en' ? 'Quick Services' : 'Швидкі послуги'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer transform hover:scale-105 bg-card border-border theme-transition"
              onClick={service.action}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3 transition-transform duration-200 hover:scale-110`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-foreground">{service.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickServicesSection;
