
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServicesFilterDialogProps {
  children: React.ReactNode;
  onFiltersApplied: (filters: {
    category: string;
    status: string;
    processingTime: string;
  }) => void;
}

const ServicesFilterDialog = ({ children, onFiltersApplied }: ServicesFilterDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [processingTime, setProcessingTime] = useState('all');

  const handleApplyFilters = () => {
    onFiltersApplied({
      category,
      status,
      processingTime
    });
    setOpen(false);
  };

  const handleClearFilters = () => {
    setCategory('all');
    setStatus('all');
    setProcessingTime('all');
    onFiltersApplied({
      category: 'all',
      status: 'all',
      processingTime: 'all'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Filter Services' : 'Фільтрувати послуги'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{t('category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'All categories' : 'Всі категорії'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All categories' : 'Всі категорії'}</SelectItem>
                <SelectItem value="financial">{language === 'en' ? 'Financial' : 'Фінансові'}</SelectItem>
                <SelectItem value="administrative">{language === 'en' ? 'Administrative' : 'Адміністративні'}</SelectItem>
                <SelectItem value="technical">{language === 'en' ? 'Technical' : 'Технічні'}</SelectItem>
                <SelectItem value="social">{language === 'en' ? 'Social' : 'Соціальні'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'All statuses' : 'Всі статуси'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All statuses' : 'Всі статуси'}</SelectItem>
                <SelectItem value="Available">{language === 'en' ? 'Available' : 'Доступна'}</SelectItem>
                <SelectItem value="Unavailable">{language === 'en' ? 'Unavailable' : 'Недоступна'}</SelectItem>
                <SelectItem value="Maintenance">{language === 'en' ? 'Maintenance' : 'Технічне обслуговування'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{language === 'en' ? 'Processing Time' : 'Час обробки'}</Label>
            <Select value={processingTime} onValueChange={setProcessingTime}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'All processing times' : 'Всі терміни обробки'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All processing times' : 'Всі терміни обробки'}</SelectItem>
                <SelectItem value="fast">{language === 'en' ? 'Fast (1-3 days)' : 'Швидко (1-3 дні)'}</SelectItem>
                <SelectItem value="medium">{language === 'en' ? 'Medium (1-2 weeks)' : 'Середньо (1-2 тижні)'}</SelectItem>
                <SelectItem value="slow">{language === 'en' ? 'Slow (2+ weeks)' : 'Повільно (2+ тижні)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClearFilters}>
              {language === 'en' ? 'Clear' : 'Очистити'}
            </Button>
            <Button onClick={handleApplyFilters}>
              {language === 'en' ? 'Apply Filters' : 'Застосувати фільтри'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServicesFilterDialog;
