
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServicesCatalog from './ServicesCatalog';
import ServiceCategoryPage from './ServiceCategoryPage';
import ServiceDetailDialog from './ServiceDetailDialog';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
  activeTab?: string;
}

const ServicesModule = ({ userType, activeTab = 'services-catalog' }: ServicesModuleProps) => {
  const { language } = useLanguage();
  const [selectedService, setSelectedService] = useState<any>(null);

  const categoryMapping: Record<string, { category: string; title: string }> = {
    'housing-utilities': {
      category: language === 'en' ? 'Housing and Utilities' : 'Житлово-комунальні послуги',
      title: language === 'en' ? 'Housing and Utilities' : 'Житлово-комунальні послуги'
    },
    'permits-registration': {
      category: language === 'en' ? 'Permits and Registration' : 'Дозвільні та реєстраційні послуги',
      title: language === 'en' ? 'Permits and Registration' : 'Дозвільні та реєстраційні послуги'
    },
    'social-services': {
      category: language === 'en' ? 'Social Services' : 'Соціальні послуги',
      title: language === 'en' ? 'Social Services' : 'Соціальні послуги'
    },
    'transport-traffic': {
      category: language === 'en' ? 'Transport and Traffic' : 'Транспорт та дорожній рух',
      title: language === 'en' ? 'Transport and Traffic' : 'Транспорт та дорожній рух'
    },
    'education': {
      category: language === 'en' ? 'Education' : 'Освіта',
      title: language === 'en' ? 'Education' : 'Освіта'
    },
    'land-planning': {
      category: language === 'en' ? 'Land Use and Urban Planning' : 'Землекористування та містобудування',
      title: language === 'en' ? 'Land Use and Urban Planning' : 'Землекористування та містобудування'
    },
    'environmental': {
      category: language === 'en' ? 'Environmental Services' : 'Екологічні послуги',
      title: language === 'en' ? 'Environmental Services' : 'Екологічні послуги'
    }
  };

  const renderContent = () => {
    if (activeTab === 'services-catalog' || activeTab === 'services') {
      return (
        <ServicesCatalog
          userType={userType}
          onServiceSelect={setSelectedService}
        />
      );
    }

    if (categoryMapping[activeTab]) {
      const { category, title } = categoryMapping[activeTab];
      return (
        <ServiceCategoryPage
          userType={userType}
          category={category}
          categoryTitle={title}
          onServiceSelect={setSelectedService}
        />
      );
    }

    // Fallback to catalog
    return (
      <ServicesCatalog
        userType={userType}
        onServiceSelect={setSelectedService}
      />
    );
  };

  return (
    <>
      {renderContent()}
      
      {selectedService && (
        <ServiceDetailDialog
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookAppointment={() => setSelectedService(null)}
          userType={userType}
        />
      )}
    </>
  );
};

export default ServicesModule;
