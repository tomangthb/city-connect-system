
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import WelcomeSection from './Dashboard/WelcomeSection';
import QuickServicesSection from './Dashboard/QuickServicesSection';
import NewsSection from './Dashboard/NewsSection';
import RequestsSection from './Dashboard/RequestsSection';
import CityMapSection from './Dashboard/CityMapSection';

const ResidentDashboard = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`${language === 'en' ? 'Searching for' : 'Пошук'}: ${searchQuery}`);
    } else {
      toast.error(language === 'en' ? 'Please enter a search query' : 'Будь ласка, введіть запит для пошуку');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <WelcomeSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <QuickServicesSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsSection />
        <RequestsSection />
      </div>

      <CityMapSection />
    </div>
  );
};

export default ResidentDashboard;
