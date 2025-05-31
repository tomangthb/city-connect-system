
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WelcomeSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

const WelcomeSection = ({ searchQuery, setSearchQuery, onSearch }: WelcomeSectionProps) => {
  const { language } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white rounded-lg p-6 theme-transition shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-white">
        {language === 'en' ? 'Welcome to the City Portal' : 'Ласкаво просимо до Міського порталу'}
      </h2>
      <p className="mb-4 text-white/90">
        {language === 'en' 
          ? 'Access city services, submit requests, and stay informed about community news.' 
          : 'Отримайте доступ до міських послуг, подавайте запити та будьте в курсі новин громади.'}
      </p>
      <div className="flex space-x-4 max-w-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search services, information...' : 'Пошук послуг, інформації...'}
            className="pl-10 search-input-enhanced"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="success" 
          onClick={onSearch}
          className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {language === 'en' ? 'Search' : 'Пошук'}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeSection;
