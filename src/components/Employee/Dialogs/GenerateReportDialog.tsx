
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, FileText, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface GenerateReportDialogProps {
  children: React.ReactNode;
}

const GenerateReportDialog = ({ children }: GenerateReportDialogProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!reportType || !startDate || !endDate) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(language === 'en' ? 'Report generated successfully!' : 'Звіт успішно згенеровано!');
      setOpen(false);
      
      // Reset form
      setReportType('');
      setStartDate('');
      setEndDate('');
      setFormat('pdf');
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to generate report' : 'Помилка генерації звіту');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {language === 'en' ? 'Generate Report' : 'Згенерувати звіт'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportType">
              {language === 'en' ? 'Report Type' : 'Тип звіту'}
            </Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select report type' : 'Оберіть тип звіту'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{language === 'en' ? 'Monthly Report' : 'Місячний звіт'}</SelectItem>
                <SelectItem value="quarterly">{language === 'en' ? 'Quarterly Report' : 'Квартальний звіт'}</SelectItem>
                <SelectItem value="annual">{language === 'en' ? 'Annual Report' : 'Річний звіт'}</SelectItem>
                <SelectItem value="appeals">{language === 'en' ? 'Appeals Report' : 'Звіт по зверненнях'}</SelectItem>
                <SelectItem value="services">{language === 'en' ? 'Services Report' : 'Звіт по послугах'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">
                {language === 'en' ? 'Start Date' : 'Дата початку'}
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">
                {language === 'en' ? 'End Date' : 'Дата закінчення'}
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="format">
              {language === 'en' ? 'Format' : 'Формат'}
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Calendar className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'en' ? 'Generating...' : 'Генерація...'}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Generate' : 'Згенерувати'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportDialog;
