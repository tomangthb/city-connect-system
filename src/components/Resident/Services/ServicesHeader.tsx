
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ServicesHeader = () => {
  const { language } = useLanguage();

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {language === 'en' ? 'City Services' : 'Міські послуги'}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {language === 'en' 
          ? 'Access all municipal services and administrative procedures online. Fast, convenient, and available 24/7.'
          : 'Отримайте доступ до всіх муніципальних послуг та адміністративних процедур онлайн. Швидко, зручно та доступно цілодобово.'}
      </p>
    </div>
  );
};

export default ServicesHeader;
