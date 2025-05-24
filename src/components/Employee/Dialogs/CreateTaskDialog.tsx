
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface CreateTaskDialogProps {
  children: React.ReactNode;
}

const CreateTaskDialog = ({ children }: CreateTaskDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error(t('titleRequired') || 'Title is required');
      return;
    }

    setIsCreating(true);
    
    try {
      await addActivity({
        title: `${t('taskCreated')}: ${title}`,
        description: description || `New task: ${title}`,
        type: 'event',
        priority,
        status: 'pending'
      });

      toast.success(t('taskCreated'));
      setOpen(false);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      toast.error(t('errorCreatingTask') || 'Error creating task');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createTask')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t('title') || 'Title'}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTaskTitle') || 'Enter task title'}
            />
          </div>
          
          <div>
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enterTaskDescription') || 'Enter task description'}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="priority">{t('priority')}</Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('low')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="high">{t('high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? t('creating') || 'Creating...' : t('create') || 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
