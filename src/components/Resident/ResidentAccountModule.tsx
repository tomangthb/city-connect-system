
import React from 'react';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentAccountModule = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
        </h2>
      </div>
      <ProfileSettings />
    </div>
  );
};

export default ResidentAccountModule;
