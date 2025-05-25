
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Euro, 
  Building, 
  Scale,
  Star,
  Calendar,
  CheckCircle
} from 'lucide-react';
import BookAppointmentDialog from './BookAppointmentDialog';
import ServiceReviewsSection from './ServiceReviewsSection';

interface ServiceCardProps {
  service: any;
  userType: 'employee' | 'resident';
  onRequestService?: (service: any) => void;
  onEdit?: (service: any) => void;
  onDelete?: (service: any) => void;
}

const ServiceCard = ({ service, userType, onRequestService, onEdit, onDelete }: ServiceCardProps) => {
  const { language } = useLanguage();

  const name = language === 'en' ? service.name : (service.name_uk || service.name);
  const category = language === 'en' ? service.category : (service.category_uk || service.category);
  const subcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
  const description = language === 'en' ? service.description : (service.description_uk || service.description);
  const targetAudience = language === 'en' ? service.target_audience : (service.target_audience_uk || service.target_audience);
  const requiredDocuments = language === 'en' ? service.required_documents : (service.required_documents_uk || service.required_documents);
  const cost = language === 'en' ? service.cost : (service.cost_uk || service.cost);
  const providingAuthority = language === 'en' ? service.providing_authority : (service.providing_authority_uk || service.providing_authority);
  const legalBasis = language === 'en' ? service.legal_basis : (service.legal_basis_uk || service.legal_basis);
  const stepsToObtain = language === 'en' ? service.steps_to_obtain : (service.steps_to_obtain_uk || service.steps_to_obtain);
  const lifeSituations = language === 'en' ? service.life_situations : (service.life_situations_uk || service.life_situations);

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">{name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="text-sm">{category}</Badge>
              {subcategory && <Badge variant="outline" className="text-sm">{subcategory}</Badge>}
              <Badge 
                variant={service.status === 'Available' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {service.status}
              </Badge>
            </div>
          </div>
          {service.average_rating > 0 && (
            <div className="flex items-center gap-1 ml-4">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">{service.average_rating.toFixed(1)}</span>
              <span className="text-gray-500">({service.total_reviews})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Основна інформація */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {language === 'en' ? 'Service Description' : 'Опис послуги'}
          </h4>
          <p className="text-gray-700">{description}</p>
        </div>

        <Separator />

        {/* Детальна інформація в сітці */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetAudience && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Target Audience' : 'Цільова аудиторія'}
                </span>
              </div>
              <p className="text-sm text-gray-600 pl-6">{targetAudience}</p>
            </div>
          )}

          {service.processing_time && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Processing Time' : 'Терміни надання'}
                </span>
              </div>
              <p className="text-sm text-gray-600 pl-6">{service.processing_time}</p>
            </div>
          )}

          {cost && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Cost' : 'Вартість'}
                </span>
              </div>
              <p className="text-sm text-gray-600 pl-6">{cost}</p>
            </div>
          )}

          {providingAuthority && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-sm">
                  {language === 'en' ? 'Providing Authority' : 'Орган надання'}
                </span>
              </div>
              <p className="text-sm text-gray-600 pl-6">{providingAuthority}</p>
            </div>
          )}
        </div>

        {/* Необхідні документи */}
        {requiredDocuments && requiredDocuments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="font-medium">
                {language === 'en' ? 'Required Documents' : 'Необхідні документи'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-6">
              {requiredDocuments.map((doc: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Кроки для отримання */}
        {stepsToObtain && stepsToObtain.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">
              {language === 'en' ? 'Steps to Obtain Service' : 'Кроки для отримання послуги'}
            </h4>
            <ol className="list-decimal list-inside space-y-2 pl-6">
              {stepsToObtain.map((step: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Життєві ситуації */}
        {lifeSituations && lifeSituations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">
              {language === 'en' ? 'Life Situations' : 'Життєві ситуації'}
            </h4>
            <div className="flex flex-wrap gap-2 pl-6">
              {lifeSituations.map((situation: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">{situation}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Контактна інформація */}
        {service.contact_info && (
          <div>
            <h4 className="font-medium mb-3">
              {language === 'en' ? 'Contact Information' : 'Контактна інформація'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
              {service.contact_info.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">{service.contact_info.phone}</span>
                </div>
              )}
              {service.contact_info.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{service.contact_info.email}</span>
                </div>
              )}
              {service.contact_info.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">{service.contact_info.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Нормативно-правова база */}
        {legalBasis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-4 w-4 text-gray-600" />
              <span className="font-medium">
                {language === 'en' ? 'Legal Basis' : 'Нормативно-правова база'}
              </span>
            </div>
            <p className="text-sm text-gray-600 pl-6">{legalBasis}</p>
          </div>
        )}

        <Separator />

        {/* Відгуки та оцінки - компактна версія */}
        <ServiceReviewsSection serviceId={service.id} />

        <Separator />

        {/* Дії */}
        <div className="flex flex-wrap gap-3">
          {userType === 'resident' && service.status === 'Available' && (
            <>
              <BookAppointmentDialog service={service}>
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
                </Button>
              </BookAppointmentDialog>
              
              <Button 
                variant="outline"
                onClick={() => onRequestService?.(service)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {language === 'en' ? 'Request Service' : 'Запитати послугу'}
              </Button>
            </>
          )}

          {userType === 'employee' && (
            <>
              <Button 
                variant="outline"
                onClick={() => onEdit?.(service)}
                className="flex items-center gap-2"
              >
                {language === 'en' ? 'Edit Service' : 'Редагувати'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => onDelete?.(service)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                {language === 'en' ? 'Delete' : 'Видалити'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
