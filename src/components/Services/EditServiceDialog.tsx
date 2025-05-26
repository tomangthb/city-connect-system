
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';

interface EditServiceDialogProps {
  children: React.ReactNode;
  service: any;
  onServiceUpdated: () => void;
}

const EditServiceDialog = ({ children, service, onServiceUpdated }: EditServiceDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameUk, setNameUk] = useState('');
  const [category, setCategory] = useState('');
  const [categoryUk, setCategoryUk] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionUk, setDescriptionUk] = useState('');
  const [status, setStatus] = useState('Available');
  const [processingTime, setProcessingTime] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (service && open) {
      setName(service.name || '');
      setNameUk(service.name_uk || '');
      setCategory(service.category || '');
      setCategoryUk(service.category_uk || '');
      setDescription(service.description || '');
      setDescriptionUk(service.description_uk || '');
      setStatus(service.status || 'Available');
      setProcessingTime(service.processing_time || '');
    }
  }, [service, open]);

  const handleUpdate = async () => {
    if (!name.trim() || !nameUk.trim()) {
      toast.error(language === 'en' ? 'Service names are required' : 'Назви послуги обов\'язкові');
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name,
          name_uk: nameUk,
          category,
          category_uk: categoryUk,
          description,
          description_uk: descriptionUk,
          status,
          processing_time: processingTime
        })
        .eq('id', service.id);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `Service updated: ${name}` : `Послугу оновлено: ${nameUk}`,
        description: `Updated service: ${name}`,
        type: 'service',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'Service updated successfully' : 'Послугу успішно оновлено');
      setOpen(false);
      onServiceUpdated();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(language === 'en' ? 'Error updating service' : 'Помилка оновлення послуги');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Edit Service' : 'Редагувати послугу'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{language === 'en' ? 'Service Name (EN)' : 'Назва послуги (EN)'}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service name in English"
              />
            </div>
            <div>
              <Label htmlFor="nameUk">{language === 'en' ? 'Service Name (UK)' : 'Назва послуги (UK)'}</Label>
              <Input
                id="nameUk"
                value={nameUk}
                onChange={(e) => setNameUk(e.target.value)}
                placeholder="Введіть назву послуги українською"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{language === 'en' ? 'Category (EN)' : 'Категорія (EN)'}</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category in English"
              />
            </div>
            <div>
              <Label htmlFor="categoryUk">{language === 'en' ? 'Category (UK)' : 'Категорія (UK)'}</Label>
              <Input
                id="categoryUk"
                value={categoryUk}
                onChange={(e) => setCategoryUk(e.target.value)}
                placeholder="Введіть категорію українською"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{language === 'en' ? 'Description (EN)' : 'Опис (EN)'}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description in English"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="descriptionUk">{language === 'en' ? 'Description (UK)' : 'Опис (UK)'}</Label>
              <Textarea
                id="descriptionUk"
                value={descriptionUk}
                onChange={(e) => setDescriptionUk(e.target.value)}
                placeholder="Введіть опис українською"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t('status')}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">{t('available')}</SelectItem>
                  <SelectItem value="Unavailable">{t('unavailable')}</SelectItem>
                  <SelectItem value="Maintenance">{t('maintenance')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="processingTime">{t('processingTime')}</Label>
              <Input
                id="processingTime"
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                placeholder={language === 'en' ? 'e.g., 3-5 business days' : 'наприклад, 3-5 робочих днів'}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (language === 'en' ? 'Updating...' : 'Оновлення...') : (language === 'en' ? 'Update' : 'Оновити')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;