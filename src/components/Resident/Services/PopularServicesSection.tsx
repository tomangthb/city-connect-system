
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './ServiceCard';

interface PopularServicesSectionProps {
  services: any[];
  onServiceSelect: (service: any) => void;
}

const PopularServicesSection = ({ services, onServiceSelect }: PopularServicesSectionProps) => {
  const { language } = useLanguage();

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Popular Services' : 'Популярні послуги'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onServiceSelect={onServiceSelect}
            isPopular={true}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularServicesSection;
