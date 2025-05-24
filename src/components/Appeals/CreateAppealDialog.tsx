
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface CreateAppealDialogProps {
  onAppealCreated: () => void;
}

const CreateAppealDialog = ({ onAppealCreated }: CreateAppealDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    submitted_by: '',
    priority: 'Medium',
    status: 'Under Review'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category || !formData.submitted_by) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('appeals')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await addActivity({
        title: `Нове звернення створено: ${formData.title}`,
        description: `Створено звернення від ${formData.submitted_by} в категорії ${formData.category}`,
        type: 'appeal',
        priority: formData.priority.toLowerCase() as 'low' | 'medium' | 'high',
        status: 'pending'
      });

      toast.success('Звернення успішно створено');
      setOpen(false);
      setFormData({
        title: '',
        content: '',
        category: '',
        submitted_by: '',
        priority: 'Medium',
        status: 'Under Review'
      });
      onAppealCreated();
    } catch (error) {
      console.error('Error creating appeal:', error);
      toast.error('Помилка при створенні звернення');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Додати звернення
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Створити нове звернення</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submitted_by">Ім'я заявника *</Label>
              <Input
                id="submitted_by"
                value={formData.submitted_by}
                onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
                placeholder="Введіть ім'я заявника"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категорія *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть категорію" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Технічне</SelectItem>
                  <SelectItem value="administrative">Адміністративне</SelectItem>
                  <SelectItem value="complaint">Скарга</SelectItem>
                  <SelectItem value="suggestion">Пропозиція</SelectItem>
                  <SelectItem value="other">Інше</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Тема звернення *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введіть тему звернення"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Повний текст звернення *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Введіть детальний опис звернення"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Пріоритет</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Низький</SelectItem>
                  <SelectItem value="Medium">Середній</SelectItem>
                  <SelectItem value="High">Високий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under Review">В обробці</SelectItem>
                  <SelectItem value="In Progress">Виконується</SelectItem>
                  <SelectItem value="Completed">Вирішено</SelectItem>
                  <SelectItem value="rejected">Відхилено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Створення...' : 'Створити звернення'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppealDialog;
