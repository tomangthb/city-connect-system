
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProfileSettings from '@/components/Profile/ProfileSettings';

const ResidentAccountModule = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
          {language === 'en' ? 'Account Settings' : 'Налаштування облікового запису'}
        </h2>
        <p className="text-gray-200 dark:text-gray-200">
          {language === 'en' 
            ? 'Manage your personal information and account preferences.' 
            : 'Керуйте своєю особистою інформацією та налаштуваннями облікового запису.'}
        </p>
      </div>
      <ProfileSettings />
    </div>
  );
};

export default ResidentAccountModule;
