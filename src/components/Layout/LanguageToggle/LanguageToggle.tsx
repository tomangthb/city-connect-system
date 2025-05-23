
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      <Globe className="h-5 w-5 mr-1" />
      {language === 'en' ? 'UA' : 'EN'}
    </Button>
  );
};

export default LanguageToggle;
