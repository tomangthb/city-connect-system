
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

interface PreferencesFormProps {
  language: 'en' | 'uk';
  onLanguageChange: (language: 'en' | 'uk') => void;
  darkMode: boolean;
  onDarkModeChange: (checked: boolean) => void;
}

const PreferencesForm = ({ 
  language, 
  onLanguageChange, 
  darkMode, 
  onDarkModeChange 
}: PreferencesFormProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preferences')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center mb-3">
            {t('language')}
          </Label>
          <div className="flex gap-2">
            <Button 
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('en')}
            >
              English
            </Button>
            <Button 
              variant={language === 'uk' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('uk')}
            >
              Українська
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('darkMode')}</Label>
            <p className="text-sm text-gray-600">{t('switchDarkTheme')}</p>
          </div>
          <Switch 
            checked={darkMode} 
            onCheckedChange={onDarkModeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
