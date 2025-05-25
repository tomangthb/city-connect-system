
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Edit, Trash2, Wrench, AlertTriangle } from 'lucide-react';
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
  next_maintenance_date?: string;
  responsible_department?: string;
  utilization_rate?: number;
}

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onScheduleMaintenance: (asset: Asset) => void;
  onCreateRequest: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  onEdit, 
  onDelete, 
  onScheduleMaintenance,
  onCreateRequest 
}) => {
  const { language } = useLanguage();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Decommissioned': return 'bg-red-100 text-red-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isMaintenanceDue = () => {
    if (!asset.next_maintenance_date) return false;
    const nextDate = new Date(asset.next_maintenance_date);
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {language === 'en' ? asset.name : asset.name_uk}
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onScheduleMaintenance(asset)}
              title={language === 'en' ? 'Schedule Maintenance' : 'Запланувати ТО'}
            >
              <Wrench className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCreateRequest(asset)}
              title={language === 'en' ? 'Create Request' : 'Створити заявку'}
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(asset)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(asset.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge className={getStatusBadgeColor(asset.status)}>
            {asset.status}
          </Badge>
          {asset.condition_status && (
            <Badge className={getConditionBadgeColor(asset.condition_status)}>
              {language === 'en' ? asset.condition_status : 
               asset.condition_status === 'excellent' ? 'Відмінний' :
               asset.condition_status === 'good' ? 'Добрий' :
               asset.condition_status === 'fair' ? 'Задовільний' : 'Поганий'}
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {language === 'en' ? asset.category : asset.category_uk}
          </span>
        </div>

        {isMaintenanceDue() && (
          <div className="flex items-center text-orange-600 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Maintenance due soon' : 'Скоро ТО'}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {asset.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {asset.location}
          </div>
        )}

        {asset.value && (
          <div className="text-sm">
            <span className="font-medium">
              {language === 'en' ? 'Value: ' : 'Вартість: '}
              {asset.value.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
            </span>
          </div>
        )}

        {asset.utilization_rate !== undefined && (
          <div className="text-sm">
            <span className="font-medium">
              {language === 'en' ? 'Utilization: ' : 'Завантаженість: '}
              {asset.utilization_rate}%
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${asset.utilization_rate}%` }}
              ></div>
            </div>
          </div>
        )}

        {asset.responsible_department && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {language === 'en' ? 'Department: ' : 'Відділ: '}
            </span>
            {asset.responsible_department}
          </div>
        )}
        
        {asset.next_maintenance_date && (
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Next maintenance: ' : 'Наступне ТО: '}
            {new Date(asset.next_maintenance_date).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetCard;
