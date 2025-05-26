
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServicesCatalog from './ServicesCatalog';
import ServiceCategoryPage from './ServiceCategoryPage';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
  activeTab?: string;
}

const ServicesModule = ({ userType, activeTab }: ServicesModuleProps) => {
  const { language } = useLanguage();
  const [selectedService, setSelectedService] = useState<any>(null);

  // Category mappings for different tabs
  const categoryMappings = {
    'housing-utilities': {
      category: 'Housing and Utilities',
      categoryUk: 'Житлово-комунальні послуги',
      title: language === 'en' ? 'Housing and Utilities' : 'Житлово-комунальні послуги'
    },
    'permits-registration': {
      category: 'Permits and Registration',
      categoryUk: 'Дозвільні та реєстраційні послуги',
      title: language === 'en' ? 'Permits and Registration' : 'Дозвільні та реєстраційні послуги'
    },
    'social-services': {
      category: 'Social Services',
      categoryUk: 'Соціальні послуги',
      title: language === 'en' ? 'Social Services' : 'Соціальні послуги'
    },
    'transport-traffic': {
      category: 'Transport and Traffic',
      categoryUk: 'Транспорт та дорожній рух',
      title: language === 'en' ? 'Transport and Traffic' : 'Транспорт та дорожній рух'
    },
    'education': {
      category: 'Education',
      categoryUk: 'Освіта',
      title: language === 'en' ? 'Education' : 'Освіта'
    },
    'land-planning': {
      category: 'Land Use and Urban Planning',
      categoryUk: 'Землекористування та містобудування',
      title: language === 'en' ? 'Land Use and Urban Planning' : 'Землекористування та містобудування'
    },
    'environmental': {
      category: 'Environmental Services',
      categoryUk: 'Екологічні послуги',
      title: language === 'en' ? 'Environmental Services' : 'Екологічні послуги'
    }
  };

  // Render services catalog for main services page
  if (activeTab === 'services' || activeTab === 'services-catalog') {
    return (
      <ServicesCatalog
        userType={userType}
        onServiceSelect={setSelectedService}
      />
    );
  }

  // Render specific category page
  const categoryConfig = categoryMappings[activeTab as keyof typeof categoryMappings];
  if (categoryConfig) {
    return (
      <ServiceCategoryPage
        userType={userType}
        category={categoryConfig.category}
        categoryTitle={categoryConfig.title}
        onServiceSelect={setSelectedService}
      />
    );
  }

  // Fallback to services catalog
  return (
    <ServicesCatalog
      userType={userType}
      onServiceSelect={setSelectedService}
    />
  );
};

export default ServicesModule;
