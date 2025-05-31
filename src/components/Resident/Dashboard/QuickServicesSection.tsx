
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  MessageSquare, 
  Calendar,
  Home,
  Car,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Service {
  title: string;
  description: string;
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

  const handleHousingServices = () => {
    navigate('/resident-services');
    toast.success(`${language === 'en' ? 'Opening housing services' : 'Відкриття житлових послуг'}`);
  };

  const handleTransportServices = () => {
    navigate('/resident-services');
    toast.success(`${language === 'en' ? 'Opening transport services' : 'Відкриття транспортних послуг'}`);
  };

  const handleEducationServices = () => {
    navigate('/resident-services');
    toast.success(`${language === 'en' ? 'Opening education services' : 'Відкриття освітніх послуг'}`);
  };

  const quickServices: Service[] = [
    { 
      title: language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні',
      description: language === 'en' ? 'Water, gas, electricity' : 'Вода, газ, електрика',
      icon: CreditCard, 
      color: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400',
      action: handlePayUtilities
    },
    { 
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення',
      description: language === 'en' ? 'Report issues, requests' : 'Повідомити про проблеми',
      icon: MessageSquare, 
      color: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400',
      action: handleSubmitAppeal
    },
    { 
      title: language === 'en' ? 'Book Appointment' : 'Записатися на прийом',
      description: language === 'en' ? 'Meet with officials' : 'Зустріч з чиновниками',
      icon: Calendar, 
      color: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-600 dark:text-purple-400',
      action: handleBookAppointment
    },
    {
      title: language === 'en' ? 'Housing Services' : 'Житлові послуги',
      description: language === 'en' ? 'Registration, permits' : 'Реєстрація, дозволи',
      icon: Home,
      color: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400',
      action: handleHousingServices
    },
    {
      title: language === 'en' ? 'Transport & Traffic' : 'Транспорт та рух',
      description: language === 'en' ? 'Parking, violations' : 'Паркування, порушення',
      icon: Car,
      color: 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-600 dark:text-red-400',
      action: handleTransportServices
    },
    {
      title: language === 'en' ? 'Education' : 'Освіта',
      description: language === 'en' ? 'Schools, kindergartens' : 'Школи, садочки',
      icon: GraduationCap,
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 text-indigo-600 dark:text-indigo-400',
      action: handleEducationServices
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {language === 'en' ? 'Popular Services' : 'Популярні послуги'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <Card 
              key={index} 
              className="enhanced-card enhanced-card-border cursor-pointer transform hover:scale-105 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 group"
              onClick={service.action}
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mx-auto mb-4 transition-all duration-200 group-hover:scale-110 shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">{service.title}</p>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickServicesSection;
