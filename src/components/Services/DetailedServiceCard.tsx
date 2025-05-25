
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
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react';
import BookAppointmentDialog from './BookAppointmentDialog';
import ServiceReviewsSection from './ServiceReviewsSection';

interface DetailedServiceCardProps {
  service: any;
  userType: 'employee' | 'resident';
  onRequestService: (service: any) => void;
  onEdit: (service: any) => void;
  onDelete: (service: any) => void;
}

const DetailedServiceCard = ({ service, userType, onRequestService, onEdit, onDelete }: DetailedServiceCardProps) => {
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
    <Card className="bg-gray-50 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2">{name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {subcategory && <Badge variant="outline" className="text-sm">{subcategory}</Badge>}
              <Badge 
                variant={service.status === 'Available' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {service.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {service.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{service.average_rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({service.total_reviews})</span>
              </div>
            )}
            {userType === 'employee' && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(service)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Опис */}
        {description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Description:' : 'Опис:'}
            </h4>
            <p className="text-gray-700">{description}</p>
          </div>
        )}

        {/* Основна інформація в сітці */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {targetAudience && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Who can receive:' : 'Хто може отримати:'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{targetAudience}</p>
            </div>
          )}

          {service.processing_time && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Processing time:' : 'Терміни:'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{service.processing_time}</p>
            </div>
          )}

          {cost && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Euro className="h-4 w-4 text-purple-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Cost:' : 'Вартість:'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{cost}</p>
            </div>
          )}

          {providingAuthority && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">
                  {language === 'en' ? 'Providing authority:' : 'Орган:'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{providingAuthority}</p>
            </div>
          )}
        </div>

        {/* Документи */}
        {requiredDocuments && requiredDocuments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="font-medium">
                {language === 'en' ? 'Documents:' : 'Документи:'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
              {requiredDocuments.map((doc: string, index: number) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Правова база */}
        {legalBasis && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-gray-600" />
              <span className="font-medium">
                {language === 'en' ? 'Legal basis:' : 'Правова база:'}
              </span>
            </div>
            <p className="text-sm text-gray-600">{legalBasis}</p>
          </div>
        )}

        {/* Кроки */}
        {stepsToObtain && stepsToObtain.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">
              {language === 'en' ? 'Steps:' : 'Кроки:'}
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-4">
              {stepsToObtain.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Контакти */}
        {service.contact_info && (
          <div>
            <h4 className="font-medium mb-3">
              {language === 'en' ? 'Contact:' : 'Контакт:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        <Separator />

        {/* Відгуки - компактна версія */}
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
                onClick={() => onRequestService(service)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {language === 'en' ? 'Request Service' : 'Запитати послугу'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedServiceCard;
