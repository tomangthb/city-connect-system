
import React, { useState } from 'react';
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

interface AddServiceDialogProps {
  children: React.ReactNode;
  onServiceAdded?: () => void;
}

const AddServiceDialog = ({ children, onServiceAdded }: AddServiceDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_uk: '',
    category: '',
    category_uk: '',
    description: '',
    description_uk: '',
    processing_time: '',
    status: 'Available'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error(t('fillRequiredFields') || 'Please fill required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert([formData]);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `New service added: ${formData.name}` : `Нова послуга додана: ${formData.name_uk || formData.name}`,
        description: `Service "${formData.name}" has been added to the system`,
        type: 'service',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(t('serviceAdded') || 'Service added successfully');
      setOpen(false);
      setFormData({
        name: '',
        name_uk: '',
        category: '',
        category_uk: '',
        description: '',
        description_uk: '',
        processing_time: '',
        status: 'Available'
      });
      onServiceAdded?.();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error(t('errorAddingService') || 'Error adding service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addNewService') || 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('serviceName')} (EN) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Service name in English"
                required
              />
            </div>
            <div>
              <Label htmlFor="name_uk">{t('serviceName')} (UK)</Label>
              <Input
                id="name_uk"
                value={formData.name_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, name_uk: e.target.value }))}
                placeholder="Назва послуги українською"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t('category')} (EN) *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category in English"
                required
              />
            </div>
            <div>
              <Label htmlFor="category_uk">{t('category')} (UK)</Label>
              <Input
                id="category_uk"
                value={formData.category_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, category_uk: e.target.value }))}
                placeholder="Категорія українською"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{t('description')} (EN)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Service description in English"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description_uk">{t('description')} (UK)</Label>
              <Textarea
                id="description_uk"
                value={formData.description_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, description_uk: e.target.value }))}
                placeholder="Опис послуги українською"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processing_time">{t('processingTime') || 'Processing Time'}</Label>
              <Input
                id="processing_time"
                value={formData.processing_time}
                onChange={(e) => setFormData(prev => ({ ...prev, processing_time: e.target.value }))}
                placeholder="e.g., 5-7 business days"
              />
            </div>
            <div>
              <Label htmlFor="status">{t('status')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">{t('available') || 'Available'}</SelectItem>
                  <SelectItem value="Unavailable">{t('unavailable') || 'Unavailable'}</SelectItem>
                  <SelectItem value="Maintenance">{t('maintenance') || 'Maintenance'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (t('adding') || 'Adding...') : (t('addService') || 'Add Service')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
