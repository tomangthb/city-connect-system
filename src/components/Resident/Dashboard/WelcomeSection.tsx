
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
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white rounded-lg p-6 theme-transition">
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
            className="pl-10 bg-gray-800 dark:bg-gray-900 text-white placeholder:text-gray-400 border-gray-600 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="secondary" 
          onClick={onSearch}
          className="bg-white/10 text-white hover:bg-white/20 border-white/20 theme-transition"
        >
          {language === 'en' ? 'Search' : 'Пошук'}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeSection;
