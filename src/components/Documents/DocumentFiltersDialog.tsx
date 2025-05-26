
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { Filter, X } from 'lucide-react';

interface DocumentFiltersDialogProps {
  filters: {
    category: string;
    type: string;
    status: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const DocumentFiltersDialog = ({ filters, onFiltersChange }: DocumentFiltersDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      category: 'all',
      type: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Filter' : 'Фільтр'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Filter Documents' : 'Фільтрувати документи'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {language === 'en' ? 'Category' : 'Категорія'}
            </label>
            <Select
              value={localFilters.category}
              onValueChange={(value) => setLocalFilters({...localFilters, category: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Categories' : 'Всі категорії'}
                </SelectItem>
                <SelectItem value="certificates">
                  {language === 'en' ? 'Certificates' : 'Довідки'}
                </SelectItem>
                <SelectItem value="applications">
                  {language === 'en' ? 'Applications' : 'Заяви'}
                </SelectItem>
                <SelectItem value="identity">
                  {language === 'en' ? 'Identity Documents' : 'Документи особи'}
                </SelectItem>
                <SelectItem value="contracts">
                  {language === 'en' ? 'Contracts' : 'Договори'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {language === 'en' ? 'File Type' : 'Тип файлу'}
            </label>
            <Select
              value={localFilters.type}
              onValueChange={(value) => setLocalFilters({...localFilters, type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Types' : 'Всі типи'}
                </SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="xlsx">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {language === 'en' ? 'Status' : 'Статус'}
            </label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters({...localFilters, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Statuses' : 'Всі статуси'}
                </SelectItem>
                <SelectItem value="approved">
                  {language === 'en' ? 'Approved' : 'Схвалено'}
                </SelectItem>
                <SelectItem value="pending">
                  {language === 'en' ? 'Pending' : 'На розгляді'}
                </SelectItem>
                <SelectItem value="rejected">
                  {language === 'en' ? 'Rejected' : 'Відхилено'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {language === 'en' ? 'Date Range' : 'Період'}
            </label>
            <Select
              value={localFilters.dateRange}
              onValueChange={(value) => setLocalFilters({...localFilters, dateRange: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Time' : 'Весь час'}
                </SelectItem>
                <SelectItem value="today">
                  {language === 'en' ? 'Today' : 'Сьогодні'}
                </SelectItem>
                <SelectItem value="week">
                  {language === 'en' ? 'This Week' : 'Цей тиждень'}
                </SelectItem>
                <SelectItem value="month">
                  {language === 'en' ? 'This Month' : 'Цей місяць'}
                </SelectItem>
                <SelectItem value="year">
                  {language === 'en' ? 'This Year' : 'Цей рік'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Reset' : 'Скинути'}
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                {language === 'en' ? 'Cancel' : 'Скасувати'}
              </Button>
              <Button onClick={handleApply}>
                {language === 'en' ? 'Apply' : 'Застосувати'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentFiltersDialog;
