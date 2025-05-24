
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface GenerateReportDialogProps {
  children: React.ReactNode;
}

const GenerateReportDialog = ({ children }: GenerateReportDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!reportType || !dateRange) {
      toast.error(t('fillAllFields') || 'Please fill all fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add activity
      await addActivity({
        title: `${t('reportGenerated')}: ${reportType}`,
        description: `Generated ${reportType} report for ${dateRange}`,
        type: 'report',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(t('reportGenerated'));
      setOpen(false);
      setReportType('');
      setDateRange('');
    } catch (error) {
      toast.error(t('errorGeneratingReport') || 'Error generating report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('generateReport')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportType">{t('reportType')}</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectReportType') || 'Select report type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">{t('financialReport') || 'Financial Report'}</SelectItem>
                <SelectItem value="appeals">{t('appealsReport') || 'Appeals Report'}</SelectItem>
                <SelectItem value="services">{t('servicesReport') || 'Services Report'}</SelectItem>
                <SelectItem value="analytics">{t('analyticsReport') || 'Analytics Report'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="dateRange">{t('dateRange') || 'Date Range'}</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectDateRange') || 'Select date range'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">{t('last7Days') || 'Last 7 days'}</SelectItem>
                <SelectItem value="last30days">{t('last30Days') || 'Last 30 days'}</SelectItem>
                <SelectItem value="last3months">{t('last3Months') || 'Last 3 months'}</SelectItem>
                <SelectItem value="lastyear">{t('lastYear') || 'Last year'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? t('generating') || 'Generating...' : t('generate') || 'Generate'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportDialog;
