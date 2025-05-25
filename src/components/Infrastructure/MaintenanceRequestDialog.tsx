
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

interface MaintenanceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSuccess: () => void;
}

const MaintenanceRequestDialog: React.FC<MaintenanceRequestDialogProps> = ({
  isOpen,
  onClose,
  asset,
  onSuccess
}) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    request_type: 'repair',
    priority: 'medium',
    title: '',
    title_uk: '',
    description: '',
    description_uk: '',
    estimated_cost: '',
    scheduled_date: ''
  });

  const requestTypes = [
    { value: 'repair', label: language === 'en' ? 'Repair' : 'Ремонт' },
    { value: 'maintenance', label: language === 'en' ? 'Maintenance' : 'Обслуговування' },
    { value: 'inspection', label: language === 'en' ? 'Inspection' : 'Огляд' }
  ];

  const priorities = [
    { value: 'low', label: language === 'en' ? 'Low' : 'Низький' },
    { value: 'medium', label: language === 'en' ? 'Medium' : 'Середній' },
    { value: 'high', label: language === 'en' ? 'High' : 'Високий' },
    { value: 'urgent', label: language === 'en' ? 'Urgent' : 'Терміновий' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset || !formData.title.trim()) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .insert({
          asset_id: asset.id,
          request_type: formData.request_type,
          priority: formData.priority,
          title: formData.title,
          title_uk: formData.title_uk || formData.title,
          description: formData.description || null,
          description_uk: formData.description_uk || formData.description || null,
          estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
          scheduled_date: formData.scheduled_date || null
        });

      if (error) throw error;
      
      toast.success(language === 'en' ? 'Request created successfully' : 'Заявку успішно створено');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      toast.error(language === 'en' ? 'Error creating request' : 'Помилка створення заявки');
    }
  };

  const resetForm = () => {
    setFormData({
      request_type: 'repair',
      priority: 'medium',
      title: '',
      title_uk: '',
      description: '',
      description_uk: '',
      estimated_cost: '',
      scheduled_date: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Create Maintenance Request' : 'Створити заявку на обслуговування'}
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
              <Label htmlFor="request_type">
                {language === 'en' ? 'Request Type' : 'Тип заявки'} *
              </Label>
              <Select
                value={formData.request_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, request_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                {language === 'en' ? 'Priority' : 'Пріоритет'}
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {language === 'en' ? 'Title (English)' : 'Назва (англійською)'} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title_uk">
                {language === 'en' ? 'Title (Ukrainian)' : 'Назва (українською)'}
              </Label>
              <Input
                id="title_uk"
                value={formData.title_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, title_uk: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_cost">
                {language === 'en' ? 'Estimated Cost (UAH)' : 'Орієнтовна вартість (грн)'}
              </Label>
              <Input
                id="estimated_cost"
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: e.target.value }))}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">
                {language === 'en' ? 'Scheduled Date' : 'Запланована дата'}
              </Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                {language === 'en' ? 'Description (English)' : 'Опис (англійською)'}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description_uk">
                {language === 'en' ? 'Description (Ukrainian)' : 'Опис (українською)'}
              </Label>
              <Textarea
                id="description_uk"
                value={formData.description_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, description_uk: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit">
              {language === 'en' ? 'Create Request' : 'Створити заявку'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceRequestDialog;
