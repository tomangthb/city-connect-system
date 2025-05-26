
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  DollarSign, 
  FileText, 
  Building, 
  Scale, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceDetailDialogProps {
  service: any;
  onClose: () => void;
  onBookAppointment: () => void;
  userType: 'employee' | 'resident';
}

const ServiceDetailDialog = ({ service, onClose, onBookAppointment, userType }: ServiceDetailDialogProps) => {
  const { language, t } = useLanguage();

  const serviceName = language === 'en' ? service.name : (service.name_uk || service.name);
  const serviceDescription = language === 'en' ? service.description : (service.description_uk || service.description);
  const serviceCategory = language === 'en' ? service.category : (service.category_uk || service.category);
  const serviceSubcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
  const requiredDocuments = language === 'en' ? service.required_documents : (service.required_documents_uk || service.required_documents);
  const stepsToObtain = language === 'en' ? service.steps_to_obtain : (service.steps_to_obtain_uk || service.steps_to_obtain);
  const providingAuthority = language === 'en' ? service.providing_authority : (service.providing_authority_uk || service.providing_authority);
  const legalBasis = language === 'en' ? service.legal_basis : (service.legal_basis_uk || service.legal_basis);
  const targetAudience = language === 'en' ? service.target_audience : (service.target_audience_uk || service.target_audience);
  const cost = language === 'en' ? service.cost : (service.cost_uk || service.cost);
  const lifeSituations = language === 'en' ? service.life_situations : (service.life_situations_uk || service.life_situations);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {serviceName}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{serviceCategory}</Badge>
            {serviceSubcategory && <Badge variant="outline">{serviceSubcategory}</Badge>}
            <Badge variant={service.status === 'Available' ? 'default' : 'destructive'}>
              {service.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {language === 'en' ? 'Service Description' : 'Опис послуги'}
              </h3>
              <p className="text-gray-700">{serviceDescription}</p>
            </div>

            {/* Required Documents */}
            {requiredDocuments && requiredDocuments.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('requiredDocuments') || 'Необхідні документи'}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {requiredDocuments.map((doc: string, index: number) => (
                    <li key={index} className="text-gray-700">{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps to Obtain */}
            {stepsToObtain && stepsToObtain.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('stepsToObtain') || 'Кроки для отримання'}
                </h3>
                <ol className="list-decimal list-inside space-y-2">
                  {stepsToObtain.map((step: string, index: number) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Life Situations */}
            {lifeSituations && lifeSituations.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('lifeSituations') || 'Життєві ситуації'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lifeSituations.map((situation: string, index: number) => (
                    <Badge key={index} variant="outline">{situation}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg">
                {language === 'en' ? 'Quick Information' : 'Швидка інформація'}
              </h3>

              {service.processing_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('processingTime') || 'Термін обробки'}</p>
                    <p className="text-sm text-gray-600">{service.processing_time}</p>
                  </div>
                </div>
              )}

              {cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('serviceCost') || 'Вартість послуги'}</p>
                    <p className="text-sm text-gray-600">{cost}</p>
                  </div>
                </div>
              )}

              {providingAuthority && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('providingAuthority') || 'Надавач послуги'}</p>
                    <p className="text-sm text-gray-600">{providingAuthority}</p>
                  </div>
                </div>
              )}

              {targetAudience && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('targetAudience') || 'Цільова аудиторія'}</p>
                    <p className="text-sm text-gray-600">{targetAudience}</p>
                  </div>
                </div>
              )}

              {legalBasis && (
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{t('legalBasis') || 'Правова основа'}</p>
                    <p className="text-sm text-gray-600">{legalBasis}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {service.contact_info && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-lg">
                  {t('contactInfo') || 'Контактна інформація'}
                </h3>

                {service.contact_info.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <a href={`tel:${service.contact_info.phone}`} className="text-blue-600 hover:underline">
                      {service.contact_info.phone}
                    </a>
                  </div>
                )}

                {service.contact_info.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <a href={`mailto:${service.contact_info.email}`} className="text-blue-600 hover:underline">
                      {service.contact_info.email}
                    </a>
                  </div>
                )}

                {service.contact_info.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <p className="text-sm text-gray-700">{service.contact_info.address}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {userType === 'resident' && (
                <Button onClick={onBookAppointment} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('bookAppointment') || 'Записатися на прийом'}
                </Button>
              )}
              
              <Button variant="outline" onClick={onClose} className="w-full">
                {language === 'en' ? 'Close' : 'Закрити'}
              </Button>
            </div>

            {/* Rating and Reviews */}
            {service.average_rating && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {t('rating') || 'Рейтинг'}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold">{service.average_rating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">
                      {service.total_reviews} {t('reviews') || 'відгуків'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailDialog;
