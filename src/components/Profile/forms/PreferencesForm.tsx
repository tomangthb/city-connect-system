
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    toggleTheme();
    onDarkModeChange(checked);
  };

  return (
    <Card className="theme-transition">
      <CardHeader>
        <CardTitle>{t('preferences') || 'Налаштування'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center mb-3 text-foreground">
            {t('language') || 'Мова'}
          </Label>
          <div className="flex gap-2">
            <Button 
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('en')}
              className="theme-transition"
            >
              English
            </Button>
            <Button 
              variant={language === 'uk' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('uk')}
              className="theme-transition"
            >
              Українська
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 theme-transition">
          <div>
            <Label className="text-foreground font-medium">
              {t('darkMode') || 'Темна тема'}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t('switchDarkTheme') || 'Перемкнути на темну тему'}
            </p>
          </div>
          <Switch 
            checked={theme === 'dark'} 
            onCheckedChange={handleThemeToggle}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
