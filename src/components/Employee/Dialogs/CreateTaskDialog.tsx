
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  children: React.ReactNode;
}

const CreateTaskDialog = ({ children }: CreateTaskDialogProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = async () => {
    if (!taskName || !description || !deadline) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    if (!user) {
      toast.error(language === 'en' ? 'You must be logged in' : 'Необхідно увійти в систему');
      return;
    }

    setIsCreating(true);
    
    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          title: taskName,
          description: `${description}${assignee ? `\nAssignee: ${assignee}` : ''}${category ? `\nCategory: ${category}` : ''}`,
          type: 'event',
          priority: priority,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success(language === 'en' ? 'Task created successfully!' : 'Завдання успішно створено!');
      setOpen(false);
      
      // Reset form
      setTaskName('');
      setDescription('');
      setAssignee('');
      setDeadline('');
      setPriority('medium');
      setCategory('');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(language === 'en' ? 'Failed to create task' : 'Помилка створення завдання');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {language === 'en' ? 'Create New Task' : 'Створити нове завдання'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">
              {language === 'en' ? 'Task Name' : 'Назва завдання'} *
            </Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={language === 'en' ? 'Enter task name' : 'Введіть назву завдання'}
            />
          </div>

          <div>
            <Label htmlFor="description">
              {language === 'en' ? 'Description' : 'Опис'} *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'en' ? 'Describe the task details' : 'Опишіть деталі завдання'}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">
                {language === 'en' ? 'Assignee' : 'Виконавець'}
              </Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder={language === 'en' ? 'Assign to...' : 'Призначити...'}
              />
            </div>
            <div>
              <Label htmlFor="category">
                {language === 'en' ? 'Category' : 'Категорія'}
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select category' : 'Оберіть категорію'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">{language === 'en' ? 'Maintenance' : 'Обслуговування'}</SelectItem>
                  <SelectItem value="infrastructure">{language === 'en' ? 'Infrastructure' : 'Інфраструктура'}</SelectItem>
                  <SelectItem value="administrative">{language === 'en' ? 'Administrative' : 'Адміністративне'}</SelectItem>
                  <SelectItem value="event">{language === 'en' ? 'Event' : 'Подія'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">
                {language === 'en' ? 'Deadline' : 'Термін виконання'} *
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="priority">
                {language === 'en' ? 'Priority' : 'Пріоритет'}
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{language === 'en' ? 'Low' : 'Низький'}</SelectItem>
                  <SelectItem value="medium">{language === 'en' ? 'Medium' : 'Середній'}</SelectItem>
                  <SelectItem value="high">{language === 'en' ? 'High' : 'Високий'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button onClick={handleCreateTask} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Calendar className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'en' ? 'Creating...' : 'Створення...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Create Task' : 'Створити завдання'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
