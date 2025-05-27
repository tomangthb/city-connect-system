
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
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">
        {language === 'en' ? 'Welcome to the City Portal' : 'Ласкаво просимо до Міського порталу'}
      </h2>
      <p className="mb-4">
        {language === 'en' 
          ? 'Access city services, submit requests, and stay informed about community news.' 
          : 'Отримайте доступ до міських послуг, подавайте запити та будьте в курсі новин громади.'}
      </p>
      <div className="flex space-x-4 max-w-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search services, information...' : 'Пошук послуг, інформації...'}
            className="pl-10 bg-white text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={onSearch}>
          {language === 'en' ? 'Search' : 'Пошук'}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeSection;
