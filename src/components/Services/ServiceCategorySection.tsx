
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DetailedServiceCard from './DetailedServiceCard';

interface ServiceCategorySectionProps {
  category: string;
  services: any[];
  userType: 'employee' | 'resident';
  onRequestService: (service: any) => void;
  onEdit: (service: any) => void;
  onDelete: (service: any) => void;
}

const ServiceCategorySection = ({ 
  category, 
  services, 
  userType, 
  onRequestService, 
  onEdit, 
  onDelete 
}: ServiceCategorySectionProps) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Folder className="h-6 w-6 text-blue-600" />
            <span>{category}</span>
            <span className="text-sm font-normal text-gray-500">
              ({services.length} {language === 'en' ? 'services' : 'послуг'})
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {services.map((service) => (
              <DetailedServiceCard
                key={service.id}
                service={service}
                userType={userType}
                onRequestService={onRequestService}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ServiceCategorySection;
