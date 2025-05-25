
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServicesFilterDialogProps {
  children: React.ReactNode;
  onFiltersApplied: (filters: any) => void;
}

const ServicesFilterDialog = ({ children, onFiltersApplied }: ServicesFilterDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    processingTime: 'all',
    lifeSituation: 'all'
  });

  const categories = [
    { value: 'Administrative Services', label: language === 'en' ? 'Administrative Services' : 'Адміністративні послуги' },
    { value: 'Social Services', label: language === 'en' ? 'Social Services' : 'Соціальні послуги' },
    { value: 'Municipal Services', label: language === 'en' ? 'Municipal Services' : 'Комунальні послуги' },
    { value: 'Housing Services', label: language === 'en' ? 'Housing Services' : 'Житлові послуги' },
    { value: 'Transport Services', label: language === 'en' ? 'Transport Services' : 'Транспортні послуги' },
    { value: 'Healthcare Services', label: language === 'en' ? 'Healthcare Services' : 'Медичні послуги' },
    { value: 'Education Services', label: language === 'en' ? 'Education Services' : 'Освітні послуги' },
  ];

  const lifeSituations = [
    { value: 'Birth of a child', label: language === 'en' ? 'Birth of a child' : 'Народження дитини' },
    { value: 'Moving to new address', label: language === 'en' ? 'Moving to new address' : 'Зміна місця проживання' },
    { value: 'Marriage', label: language === 'en' ? 'Marriage' : 'Одруження' },
    { value: 'Divorce', label: language === 'en' ? 'Divorce' : 'Розлучення' },
    { value: 'Starting business', label: language === 'en' ? 'Starting business' : 'Відкриття бізнесу' },
    { value: 'Retirement', label: language === 'en' ? 'Retirement' : 'Вихід на пенсію' },
    { value: 'Unemployment', label: language === 'en' ? 'Unemployment' : 'Безробіття' },
    { value: 'Property purchase', label: language === 'en' ? 'Property purchase' : 'Купівля нерухомості' },
  ];

  const statusOptions = [
    { value: 'Available', label: language === 'en' ? 'Available' : 'Доступна' },
    { value: 'Unavailable', label: language === 'en' ? 'Unavailable' : 'Недоступна' },
    { value: 'Maintenance', label: language === 'en' ? 'Maintenance' : 'На обслуговуванні' },
  ];

  const processingTimeOptions = [
    { value: 'fast', label: language === 'en' ? 'Fast (1-3 days)' : 'Швидко (1-3 дні)' },
    { value: 'medium', label: language === 'en' ? 'Medium (1 week)' : 'Середньо (1 тиждень)' },
    { value: 'slow', label: language === 'en' ? 'Slow (2+ weeks)' : 'Повільно (2+ тижні)' },
  ];

  const handleApply = () => {
    onFiltersApplied(filters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      category: 'all',
      status: 'all',
      processingTime: 'all',
      lifeSituation: 'all'
    };
    setFilters(resetFilters);
    onFiltersApplied(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Filter Services' : 'Фільтрувати послуги'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>{language === 'en' ? 'Category' : 'Категорія'}</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All Categories' : 'Всі категорії'}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{language === 'en' ? 'Status' : 'Статус'}</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All Statuses' : 'Всі статуси'}</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{language === 'en' ? 'Processing Time' : 'Час обробки'}</Label>
            <Select value={filters.processingTime} onValueChange={(value) => setFilters(prev => ({ ...prev, processingTime: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'Any Time' : 'Будь-який час'}</SelectItem>
                {processingTimeOptions.map((time) => (
                  <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{language === 'en' ? 'Life Situation' : 'Життєва ситуація'}</Label>
            <Select value={filters.lifeSituation} onValueChange={(value) => setFilters(prev => ({ ...prev, lifeSituation: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All Situations' : 'Всі ситуації'}</SelectItem>
                {lifeSituations.map((situation) => (
                  <SelectItem key={situation.value} value={situation.value}>{situation.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              {language === 'en' ? 'Reset' : 'Скинути'}
            </Button>
            <Button onClick={handleApply} className="flex-1">
              {language === 'en' ? 'Apply' : 'Застосувати'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServicesFilterDialog;
