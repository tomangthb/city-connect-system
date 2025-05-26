
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Edit } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import EditServiceDialog from './EditServiceDialog';

interface Service {
  id: string;
  name: string;
  name_uk: string;
  description?: string;
  description_uk?: string;
  category: string;
  category_uk: string;
  subcategory?: string;
  subcategory_uk?: string;
  status: string;
  cost?: string;
  cost_uk?: string;
  processing_time?: string;
  providing_authority?: string;
  providing_authority_uk?: string;
  target_audience?: string;
  target_audience_uk?: string;
  average_rating?: number;
  total_reviews?: number;
}

interface ServiceCardProps {
  service: Service;
  userType: 'employee' | 'resident';
  onServiceUpdated?: () => void;
}

const ServiceCard = ({ service, userType, onServiceUpdated }: ServiceCardProps) => {
  const { language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return language === 'en' ? 'Available' : 'Доступна';
      case 'unavailable':
        return language === 'en' ? 'Unavailable' : 'Недоступна';
      case 'maintenance':
        return language === 'en' ? 'Under Maintenance' : 'На обслуговуванні';
      default:
        return status;
    }
  };

  const handleScheduleAppointment = () => {
    // Implementation for scheduling appointment
    console.log('Schedule appointment for service:', service.id);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">
            {language === 'en' ? service.name : service.name_uk}
          </CardTitle>
          <Badge className={getStatusColor(service.status)}>
            {getStatusText(service.status)}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          {language === 'en' ? service.category : service.category_uk}
          {service.subcategory && (
            <span> • {language === 'en' ? service.subcategory : service.subcategory_uk}</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 line-clamp-3">
          {language === 'en' ? service.description : service.description_uk}
        </p>
        
        {service.average_rating && service.total_reviews ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{service.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({service.total_reviews} {language === 'en' ? 'reviews' : 'відгуків'})
            </span>
          </div>
        ) : null}
        
        <div className="space-y-2 text-sm">
          {service.cost && (
            <div>
              <span className="font-medium">{language === 'en' ? 'Cost:' : 'Вартість:'} </span>
              <span>{language === 'en' ? service.cost : service.cost_uk}</span>
            </div>
          )}
          
          {service.processing_time && (
            <div>
              <span className="font-medium">{language === 'en' ? 'Processing time:' : 'Час обробки:'} </span>
              <span>{service.processing_time}</span>
            </div>
          )}
          
          {service.providing_authority && (
            <div>
              <span className="font-medium">{language === 'en' ? 'Authority:' : 'Орган:'} </span>
              <span>{language === 'en' ? service.providing_authority : service.providing_authority_uk}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          {userType === 'resident' && service.status === 'Available' && (
            <Button 
              className="flex-1" 
              onClick={handleScheduleAppointment}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Schedule' : 'Записатися'}
            </Button>
          )}
          
          {userType === 'employee' && onServiceUpdated && (
            <EditServiceDialog service={service} onServiceUpdated={onServiceUpdated}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Edit' : 'Редагувати'}
              </Button>
            </EditServiceDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
