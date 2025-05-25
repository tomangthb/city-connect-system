
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  name_uk: string;
}

interface MaintenanceScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSuccess: () => void;
}

const MaintenanceScheduleDialog: React.FC<MaintenanceScheduleDialogProps> = ({
  isOpen,
  onClose,
  asset,
  onSuccess
}) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    maintenance_type: 'inspection',
    frequency_days: '30',
    next_due: '',
    responsible_team: '',
    estimated_duration_hours: '',
    checklist: ''
  });

  const maintenanceTypes = [
    { value: 'inspection', label: language === 'en' ? 'Inspection' : 'Огляд' },
    { value: 'preventive', label: language === 'en' ? 'Preventive' : 'Профілактичне' },
    { value: 'predictive', label: language === 'en' ? 'Predictive' : 'Прогнозне' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset || !formData.next_due) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      // Parse checklist as JSON array
      let checklist = null;
      if (formData.checklist.trim()) {
        try {
          checklist = formData.checklist.split('\n').filter(item => item.trim()).map(item => ({ task: item.trim(), completed: false }));
        } catch {
          checklist = [{ task: formData.checklist, completed: false }];
        }
      }

      const { error } = await supabase
        .from('maintenance_schedules')
        .insert({
          asset_id: asset.id,
          maintenance_type: formData.maintenance_type,
          frequency_days: parseInt(formData.frequency_days),
          next_due: formData.next_due,
          responsible_team: formData.responsible_team || null,
          estimated_duration_hours: formData.estimated_duration_hours ? parseFloat(formData.estimated_duration_hours) : null,
          checklist: checklist
        });

      if (error) throw error;
      
      toast.success(language === 'en' ? 'Maintenance schedule created successfully' : 'Графік обслуговування успішно створено');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      toast.error(language === 'en' ? 'Error creating schedule' : 'Помилка створення графіку');
    }
  };

  const resetForm = () => {
    setFormData({
      maintenance_type: 'inspection',
      frequency_days: '30',
      next_due: '',
      responsible_team: '',
      estimated_duration_hours: '',
      checklist: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Schedule Maintenance' : 'Запланувати обслуговування'}
          </DialogTitle>
          {asset && (
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Asset: ' : 'Актив: '}
              {language === 'en' ? asset.name : asset.name_uk}
            </p>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">
                {language === 'en' ? 'Maintenance Type' : 'Тип обслуговування'} *
              </Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency_days">
                {language === 'en' ? 'Frequency (days)' : 'Частота (днів)'} *
              </Label>
              <Input
                id="frequency_days"
                type="number"
                value={formData.frequency_days}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency_days: e.target.value }))}
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="next_due">
                {language === 'en' ? 'Next Due Date' : 'Наступна дата'} *
              </Label>
              <Input
                id="next_due"
                type="date"
                value={formData.next_due}
                onChange={(e) => setFormData(prev => ({ ...prev, next_due: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimated_duration_hours">
                {language === 'en' ? 'Duration (hours)' : 'Тривалість (години)'}
              </Label>
              <Input
                id="estimated_duration_hours"
                type="number"
                value={formData.estimated_duration_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration_hours: e.target.value }))}
                placeholder="0"
                step="0.5"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible_team">
              {language === 'en' ? 'Responsible Team' : 'Відповідальна команда'}
            </Label>
            <Input
              id="responsible_team"
              value={formData.responsible_team}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible_team: e.target.value }))}
              placeholder={language === 'en' ? 'Enter team name' : 'Введіть назву команди'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checklist">
              {language === 'en' ? 'Checklist (one item per line)' : 'Контрольний список (по одному пункту на рядок)'}
            </Label>
            <Textarea
              id="checklist"
              value={formData.checklist}
              onChange={(e) => setFormData(prev => ({ ...prev, checklist: e.target.value }))}
              rows={4}
              placeholder={language === 'en' 
                ? 'Check oil level\nInspect filters\nTest functionality'
                : 'Перевірити рівень масла\nОглянути фільтри\nПеревірити працездатність'
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit">
              {language === 'en' ? 'Create Schedule' : 'Створити графік'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceScheduleDialog;
