
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
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!taskName.trim()) {
      toast.error(t('titleRequired') || 'Task name is required');
      return;
    }

    setIsCreating(true);
    
    try {
      await addActivity({
        title: `${t('taskCreated')}: ${taskName}`,
        description: description || `New task: ${taskName}`,
        type: 'event',
        priority,
        status: 'pending'
      });

      toast.success(t('taskCreated'));
      setOpen(false);
      setTaskName('');
      setDescription('');
      setAssignee('');
      setCategory('');
      setDeadline('');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('createTask')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">{t('taskName') || 'Task Name'} *</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t('enterTaskTitle') || 'Enter task name'}
            />
          </div>
          
          <div>
            <Label htmlFor="description">{t('description')} *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('enterTaskDescription') || 'Describe the task details'}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">{t('assignee') || 'Assignee'}</Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder={t('assignTo') || 'Assign to...'}
              />
            </div>

            <div>
              <Label htmlFor="category">{t('category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCategory') || 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrative">{t('administrative') || 'Administrative'}</SelectItem>
                  <SelectItem value="technical">{t('technical') || 'Technical'}</SelectItem>
                  <SelectItem value="maintenance">{t('maintenance') || 'Maintenance'}</SelectItem>
                  <SelectItem value="planning">{t('planning') || 'Planning'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">{t('deadline') || 'Deadline'} *</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? t('creating') || 'Creating...' : t('createTask') || 'Create Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
