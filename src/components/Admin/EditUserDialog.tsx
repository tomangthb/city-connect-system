
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface EditUserDialogProps {
  children: React.ReactNode;
  user: any;
  onUserUpdated: (user: any) => void;
}

const EditUserDialog = ({ children, user, onUserUpdated }: EditUserDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        ...formData,
        permissions: formData.role === 'employee' ? ['read', 'write'] : ['read']
      };

      await addActivity({
        title: language === 'en' ? `User updated: ${formData.name}` : `Оновлено користувача: ${formData.name}`,
        description: `Updated user: ${formData.email}`,
        type: 'event',
        priority: 'medium',
        status: 'completed'
      });

      onUserUpdated(updatedUser);
      setOpen(false);
      toast.success(language === 'en' ? 'User updated successfully' : 'Користувача успішно оновлено');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(language === 'en' ? 'Error updating user' : 'Помилка оновлення користувача');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Edit User' : 'Редагувати користувача'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{language === 'en' ? 'Full Name' : 'Повне ім\'я'} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'en' ? 'Enter full name' : 'Введіть повне ім\'я'}
            />
          </div>
          
          <div>
            <Label htmlFor="email">{language === 'en' ? 'Email' : 'Електронна пошта'} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder={language === 'en' ? 'Enter email address' : 'Введіть електронну адресу'}
            />
          </div>
          
          <div>
            <Label>{language === 'en' ? 'Role' : 'Роль'}</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">{language === 'en' ? 'Resident' : 'Мешканець'}</SelectItem>
                <SelectItem value="employee">{language === 'en' ? 'Employee' : 'Працівник'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (language === 'en' ? 'Updating...' : 'Оновлення...') : (language === 'en' ? 'Update User' : 'Оновити користувача')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
