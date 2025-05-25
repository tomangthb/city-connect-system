
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, User, Building, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Asset {
  id: string;
  name: string;
  name_uk: string;
  category: string;
  category_uk: string;
  type: 'asset' | 'infrastructure';
  location?: string;
  status: string;
  condition_status?: string;
  value?: number;
  book_value?: number;
  residual_value?: number;
  acquisition_date?: string;
  commissioning_date?: string;
  next_maintenance_date?: string;
  last_inspection_date?: string;
  warranty_expiry_date?: string;
  responsible_department?: string;
  responsible_person?: string;
  supplier?: string;
  model?: string;
  serial_number?: string;
  service_life_years?: number;
  utilization_rate?: number;
  legal_status?: string;
  gps_coordinates?: string;
  technical_specs?: any;
}

interface AssetDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const AssetDetailsDialog: React.FC<AssetDetailsDialogProps> = ({
  isOpen,
  onClose,
  asset
}) => {
  const { language } = useLanguage();

  if (!asset) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Decommissioned': return 'bg-red-100 text-red-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {language === 'en' ? asset.name : asset.name_uk}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusBadgeColor(asset.status)}>
              {asset.status}
            </Badge>
            <span className="text-sm text-gray-500">
              {language === 'en' ? asset.category : asset.category_uk}
            </span>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              {language === 'en' ? 'General' : 'Загальне'}
            </TabsTrigger>
            <TabsTrigger value="financial">
              {language === 'en' ? 'Financial' : 'Фінанси'}
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              {language === 'en' ? 'Maintenance' : 'Обслуговування'}
            </TabsTrigger>
            <TabsTrigger value="technical">
              {language === 'en' ? 'Technical' : 'Технічне'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Basic Information' : 'Основна інформація'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">{language === 'en' ? 'Type:' : 'Тип:'} </span>
                    {asset.type === 'asset' ? 
                      (language === 'en' ? 'Asset' : 'Актив') : 
                      (language === 'en' ? 'Infrastructure' : 'Інфраструктура')
                    }
                  </div>
                  {asset.model && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Model:' : 'Модель:'} </span>
                      {asset.model}
                    </div>
                  )}
                  {asset.serial_number && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Serial Number:' : 'Серійний номер:'} </span>
                      {asset.serial_number}
                    </div>
                  )}
                  {asset.legal_status && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Legal Status:' : 'Правовий статус:'} </span>
                      {asset.legal_status === 'owned' ? 
                        (language === 'en' ? 'Owned' : 'Власність') : 
                        asset.legal_status
                      }
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Location & Contacts' : 'Розташування та контакти'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {asset.location && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Location:' : 'Розташування:'} </span>
                      {asset.location}
                    </div>
                  )}
                  {asset.gps_coordinates && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'GPS:' : 'GPS:'} </span>
                      {asset.gps_coordinates}
                    </div>
                  )}
                  {asset.responsible_department && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Department:' : 'Відділ:'} </span>
                      {asset.responsible_department}
                    </div>
                  )}
                  {asset.responsible_person && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Responsible Person:' : 'Відповідальна особа:'} </span>
                      {asset.responsible_person}
                    </div>
                  )}
                  {asset.supplier && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Supplier:' : 'Постачальник:'} </span>
                      {asset.supplier}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Financial Information' : 'Фінансова інформація'}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {asset.value && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {asset.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Current Value (UAH)' : 'Поточна вартість (грн)'}
                    </div>
                  </div>
                )}
                {asset.book_value && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {asset.book_value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Book Value (UAH)' : 'Балансова вартість (грн)'}
                    </div>
                  </div>
                )}
                {asset.residual_value && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {asset.residual_value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Residual Value (UAH)' : 'Залишкова вартість (грн)'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Important Dates' : 'Важливі дати'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {asset.acquisition_date && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Acquisition:' : 'Придбання:'} </span>
                      {new Date(asset.acquisition_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                    </div>
                  )}
                  {asset.commissioning_date && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Commissioning:' : 'Введення в експлуатацію:'} </span>
                      {new Date(asset.commissioning_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                    </div>
                  )}
                  {asset.last_inspection_date && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Last Inspection:' : 'Останній огляд:'} </span>
                      {new Date(asset.last_inspection_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                    </div>
                  )}
                  {asset.next_maintenance_date && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Next Maintenance:' : 'Наступне ТО:'} </span>
                      {new Date(asset.next_maintenance_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                    </div>
                  )}
                  {asset.warranty_expiry_date && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Warranty Expires:' : 'Гарантія до:'} </span>
                      {new Date(asset.warranty_expiry_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Operational Status' : 'Експлуатаційний стан'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {asset.condition_status && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Condition:' : 'Стан:'} </span>
                      {asset.condition_status === 'excellent' ? (language === 'en' ? 'Excellent' : 'Відмінний') :
                       asset.condition_status === 'good' ? (language === 'en' ? 'Good' : 'Добрий') :
                       asset.condition_status === 'fair' ? (language === 'en' ? 'Fair' : 'Задовільний') :
                       (language === 'en' ? 'Poor' : 'Поганий')}
                    </div>
                  )}
                  {asset.utilization_rate !== undefined && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Utilization:' : 'Завантаженість:'} </span>
                      {asset.utilization_rate}%
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${asset.utilization_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {asset.service_life_years && (
                    <div>
                      <span className="font-medium">{language === 'en' ? 'Service Life:' : 'Термін служби:'} </span>
                      {asset.service_life_years} {language === 'en' ? 'years' : 'років'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Technical Specifications' : 'Технічні характеристики'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {asset.technical_specs ? (
                  <div className="space-y-2">
                    {Object.entries(asset.technical_specs).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}: </span>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    {language === 'en' ? 'No technical specifications available' : 'Технічні характеристики відсутні'}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsDialog;
