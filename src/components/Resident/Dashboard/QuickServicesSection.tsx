
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
      color: 'bg-blue-100 text-blue-600',
      action: handlePayUtilities
    },
    { 
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення', 
      icon: MessageSquare, 
      color: 'bg-green-100 text-green-600',
      action: handleSubmitAppeal
    },
    { 
      title: language === 'en' ? 'Book Appointment' : 'Записатися на прийом', 
      icon: Calendar, 
      color: 'bg-purple-100 text-purple-600',
      action: handleBookAppointment
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Quick Services' : 'Швидкі послуги'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
