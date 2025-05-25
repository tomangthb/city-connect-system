
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface AppealsExportDialogProps {
  children: React.ReactNode;
}

const AppealsExportDialog = ({ children }: AppealsExportDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('all');
  const [includeFields, setIncludeFields] = useState({
    submissionDate: true,
    applicant: true,
    category: true,
    status: true,
    content: true,
    response: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(language === 'en' ? 
        `Appeals exported to ${format.toUpperCase()} successfully` : 
        `Звернення успішно експортовано в ${format.toUpperCase()}`
      );
      
      setOpen(false);
    } catch (error) {
      toast.error(language === 'en' ? 'Export failed' : 'Помилка експорту');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Export Appeals' : 'Експорт звернень'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>{language === 'en' ? 'Export Format' : 'Формат експорту'}</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{language === 'en' ? 'Date Range' : 'Діапазон дат'}</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'en' ? 'All time' : 'Весь час'}</SelectItem>
                <SelectItem value="today">{language === 'en' ? 'Today' : 'Сьогодні'}</SelectItem>
                <SelectItem value="week">{language === 'en' ? 'This week' : 'Цей тиждень'}</SelectItem>
                <SelectItem value="month">{language === 'en' ? 'This month' : 'Цей місяць'}</SelectItem>
                <SelectItem value="quarter">{language === 'en' ? 'This quarter' : 'Цей квартал'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-3 block">{language === 'en' ? 'Include Fields' : 'Включити поля'}</Label>
            <div className="space-y-2">
              {Object.entries(includeFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(value) => 
                      setIncludeFields(prev => ({ ...prev, [field]: !!value }))
                    }
                  />
                  <Label htmlFor={field} className="text-sm">
                    {field === 'submissionDate' && (language === 'en' ? 'Submission Date' : 'Дата подання')}
                    {field === 'applicant' && (language === 'en' ? 'Applicant' : 'Заявник')}
                    {field === 'category' && (language === 'en' ? 'Category' : 'Категорія')}
                    {field === 'status' && (language === 'en' ? 'Status' : 'Статус')}
                    {field === 'content' && (language === 'en' ? 'Content' : 'Зміст')}
                    {field === 'response' && (language === 'en' ? 'Response' : 'Відповідь')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 
                (language === 'en' ? 'Exporting...' : 'Експорт...') : 
                (language === 'en' ? 'Export' : 'Експортувати')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppealsExportDialog;
