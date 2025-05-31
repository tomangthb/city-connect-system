
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import WelcomeSection from './Dashboard/WelcomeSection';
import StatsSection from './Dashboard/StatsSection';
import QuickServicesSection from './Dashboard/QuickServicesSection';
import QuickActionsSection from './Dashboard/QuickActionsSection';
import CityMapSection from './Dashboard/CityMapSection';
import NewsSection from './Dashboard/NewsSection';
import RequestsSection from './Dashboard/RequestsSection';

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
    <div className="p-6 space-y-6 bg-gradient-to-br from-background to-gray-50/50 dark:to-gray-900/50 min-h-screen">
      <WelcomeSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <StatsSection />

      <QuickServicesSection />

      <QuickActionsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CityMapSection />
          <NewsSection />
        </div>
        <div className="space-y-6">
          <RequestsSection />
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
