
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
import { Edit } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_uk: string;
  description?: string;
  description_uk?: string;
  category: string;
  category_uk: string;
  subcategory?: string;
  subcategory_uk?: string;
  status: string;
  cost?: string;
  cost_uk?: string;
  processing_time?: string;
  providing_authority?: string;
  providing_authority_uk?: string;
  target_audience?: string;
  target_audience_uk?: string;
}

interface EditServiceDialogProps {
  service: Service;
  onServiceUpdated: () => void;
  children: React.ReactNode;
}

const EditServiceDialog = ({ service, onServiceUpdated, children }: EditServiceDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_uk: '',
    description: '',
    description_uk: '',
    category: '',
    category_uk: '',
    subcategory: '',
    subcategory_uk: '',
    status: 'Available',
    cost: '',
    cost_uk: '',
    processing_time: '',
    providing_authority: '',
    providing_authority_uk: '',
    target_audience: '',
    target_audience_uk: ''
  });

  useEffect(() => {
    if (service && open) {
      setFormData({
        name: service.name || '',
        name_uk: service.name_uk || '',
        description: service.description || '',
        description_uk: service.description_uk || '',
        category: service.category || '',
        category_uk: service.category_uk || '',
        subcategory: service.subcategory || '',
        subcategory_uk: service.subcategory_uk || '',
        status: service.status || 'Available',
        cost: service.cost || '',
        cost_uk: service.cost_uk || '',
        processing_time: service.processing_time || '',
        providing_authority: service.providing_authority || '',
        providing_authority_uk: service.providing_authority_uk || '',
        target_audience: service.target_audience || '',
        target_audience_uk: service.target_audience_uk || ''
      });
    }
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: formData.name,
          name_uk: formData.name_uk,
          description: formData.description || null,
          description_uk: formData.description_uk || null,
          category: formData.category,
          category_uk: formData.category_uk,
          subcategory: formData.subcategory || null,
          subcategory_uk: formData.subcategory_uk || null,
          status: formData.status,
          cost: formData.cost || null,
          cost_uk: formData.cost_uk || null,
          processing_time: formData.processing_time || null,
          providing_authority: formData.providing_authority || null,
          providing_authority_uk: formData.providing_authority_uk || null,
          target_audience: formData.target_audience || null,
          target_audience_uk: formData.target_audience_uk || null
        })
        .eq('id', service.id);

      if (error) throw error;

      toast.success(language === 'en' ? 'Service updated successfully' : 'Послугу успішно оновлено');
      setOpen(false);
      onServiceUpdated();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(language === 'en' ? 'Error updating service' : 'Помилка оновлення послуги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Edit Service' : 'Редагувати послугу'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'en' ? 'Service Name (English)' : 'Назва послуги (англійська)'}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_uk">
                {language === 'en' ? 'Service Name (Ukrainian)' : 'Назва послуги (українська)'}
              </Label>
              <Input
                id="name_uk"
                value={formData.name_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, name_uk: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {language === 'en' ? 'Category (English)' : 'Категорія (англійська)'}
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_uk">
                {language === 'en' ? 'Category (Ukrainian)' : 'Категорія (українська)'}
              </Label>
              <Input
                id="category_uk"
                value={formData.category_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, category_uk: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory">
                {language === 'en' ? 'Subcategory (English)' : 'Підкатегорія (англійська)'}
              </Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory_uk">
                {language === 'en' ? 'Subcategory (Ukrainian)' : 'Підкатегорія (українська)'}
              </Label>
              <Input
                id="subcategory_uk"
                value={formData.subcategory_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory_uk: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                {language === 'en' ? 'Description (English)' : 'Опис (англійський)'}
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
                {language === 'en' ? 'Description (Ukrainian)' : 'Опис (український)'}
              </Label>
              <Textarea
                id="description_uk"
                value={formData.description_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, description_uk: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                {language === 'en' ? 'Status' : 'Статус'}
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">
                    {language === 'en' ? 'Available' : 'Доступна'}
                  </SelectItem>
                  <SelectItem value="Unavailable">
                    {language === 'en' ? 'Unavailable' : 'Недоступна'}
                  </SelectItem>
                  <SelectItem value="Maintenance">
                    {language === 'en' ? 'Under Maintenance' : 'На обслуговуванні'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">
                {language === 'en' ? 'Cost (English)' : 'Вартість (англійська)'}
              </Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_uk">
                {language === 'en' ? 'Cost (Ukrainian)' : 'Вартість (українська)'}
              </Label>
              <Input
                id="cost_uk"
                value={formData.cost_uk}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_uk: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 
                (language === 'en' ? 'Updating...' : 'Оновлення...') : 
                (language === 'en' ? 'Update Service' : 'Оновити послугу')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
