
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, MapPin, Phone, Mail, FileText, Users, Euro, Building, Scale, Star } from 'lucide-react';
import BookAppointmentDialog from './BookAppointmentDialog';
import ServiceReviewsSection from './ServiceReviewsSection';

interface ServiceDetailDialogProps {
  children: React.ReactNode;
  service: any;
  userType: 'employee' | 'resident';
}

const ServiceDetailDialog = ({ children, service, userType }: ServiceDetailDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">{name}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{category}</Badge>
                {subcategory && <Badge variant="outline">{subcategory}</Badge>}
              </div>
            </div>
            {service.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{service.average_rating.toFixed(1)}</span>
                <span className="text-gray-500">({service.total_reviews})</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основна інформація */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Service Description' : 'Опис послуги'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{description}</p>
            </CardContent>
          </Card>

          {/* Деталі послуги */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetAudience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {language === 'en' ? 'Target Audience' : 'Цільова аудиторія'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{targetAudience}</p>
                </CardContent>
              </Card>
            )}

            {service.processing_time && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {language === 'en' ? 'Processing Time' : 'Терміни надання'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.processing_time}</p>
                </CardContent>
              </Card>
            )}

            {cost && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    {language === 'en' ? 'Cost' : 'Вартість'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{cost}</p>
                </CardContent>
              </Card>
            )}

            {providingAuthority && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {language === 'en' ? 'Providing Authority' : 'Орган, що надає послугу'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{providingAuthority}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Необхідні документи */}
          {requiredDocuments && requiredDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'en' ? 'Required Documents' : 'Необхідні документи'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {requiredDocuments.map((doc: string, index: number) => (
                    <li key={index} className="text-sm">{doc}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Кроки для отримання */}
          {stepsToObtain && stepsToObtain.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Steps to Obtain' : 'Кроки для отримання послуги'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {stepsToObtain.map((step: string, index: number) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Життєві ситуації */}
          {lifeSituations && lifeSituations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Life Situations' : 'Життєві ситуації'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lifeSituations.map((situation: string, index: number) => (
                    <Badge key={index} variant="outline">{situation}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Контактна інформація */}
          {service.contact_info && (
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Contact Information' : 'Контактна інформація'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {service.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{service.contact_info.phone}</span>
                    </div>
                  )}
                  {service.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{service.contact_info.email}</span>
                    </div>
                  )}
                  {service.contact_info.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{service.contact_info.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Нормативно-правова база */}
          {legalBasis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  {language === 'en' ? 'Legal Basis' : 'Нормативно-правова база'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{legalBasis}</p>
              </CardContent>
            </Card>
          )}

          {/* Відгуки та оцінки */}
          <ServiceReviewsSection serviceId={service.id} />

          {/* Дії */}
          <div className="flex gap-4 pt-4">
            {userType === 'resident' && service.status === 'Available' && (
              <BookAppointmentDialog service={service}>
                <Button className="flex-1">
                  {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
                </Button>
              </BookAppointmentDialog>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailDialog;
