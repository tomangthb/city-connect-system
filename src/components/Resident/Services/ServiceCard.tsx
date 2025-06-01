
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BookAppointmentDialog from '@/components/Services/BookAppointmentDialog';

interface ServiceCardProps {
  service: any;
  onServiceSelect: (service: any) => void;
  isPopular?: boolean;
}

const ServiceCard = ({ service, onServiceSelect, isPopular = false }: ServiceCardProps) => {
  const { language } = useLanguage();

  if (isPopular) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {language === 'en' ? service.name : service.name_uk}
            </h3>
            <Badge variant="secondary" className="ml-2">
              <Users className="h-3 w-3 mr-1" />
              {service.requests}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {language === 'en' ? service.description : service.description_uk}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {service.average_rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {service.average_rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onServiceSelect(service)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <BookAppointmentDialog service={service}>
              <Button className="flex-1" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
              </Button>
            </BookAppointmentDialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-tight">
              {language === 'en' ? service.name : service.name_uk}
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              {language === 'en' ? service.category : service.category_uk}
            </p>
          </div>
          <Badge 
            variant={service.status === 'Available' ? 'success' : 'destructive'}
            className="ml-2"
          >
            {service.status === 'Available' 
              ? (language === 'en' ? 'Available' : 'Доступно')
              : (language === 'en' ? 'Unavailable' : 'Недоступно')
            }
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {language === 'en' ? service.description : service.description_uk}
        </p>
        
        <div className="space-y-2 mb-4">
          {service.processing_time && (
            <div className="flex items-center text-sm text-gray-500">
              <span>
                {language === 'en' ? 'Processing time: ' : 'Час обробки: '}
                {service.processing_time}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {service.average_rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {service.average_rating.toFixed(1)} ({service.total_reviews})
                  </span>
                </div>
              )}
            </div>
            
            {service.requests > 0 && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {service.requests} {language === 'en' ? 'requests' : 'запитів'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => onServiceSelect(service)}
          >
            {language === 'en' ? 'View Details' : 'Переглянути деталі'}
          </Button>
          <BookAppointmentDialog service={service}>
            <Button className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
            </Button>
          </BookAppointmentDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
