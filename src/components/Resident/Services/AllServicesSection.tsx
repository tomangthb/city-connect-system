
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './ServiceCard';

interface AllServicesSectionProps {
  services: any[];
  onServiceSelect: (service: any) => void;
}

const AllServicesSection = ({ services, onServiceSelect }: AllServicesSectionProps) => {
  const { language } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'All Services' : 'Всі послуги'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onServiceSelect={onServiceSelect}
          />
        ))}
      </div>
      
      {services.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {language === 'en' ? 'No services found' : 'Послуги не знайдено'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllServicesSection;
