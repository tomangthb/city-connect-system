
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface CreateRoleDialogProps {
  children: React.ReactNode;
}

const CreateRoleDialog = ({ children }: CreateRoleDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: 'user_view', name: language === 'en' ? 'View Users' : 'Переглядати користувачів', category: 'Users' },
    { id: 'user_create', name: language === 'en' ? 'Create Users' : 'Створювати користувачів', category: 'Users' },
    { id: 'user_edit', name: language === 'en' ? 'Edit Users' : 'Редагувати користувачів', category: 'Users' },
    { id: 'user_delete', name: language === 'en' ? 'Delete Users' : 'Видаляти користувачів', category: 'Users' },
    { id: 'service_view', name: language === 'en' ? 'View Services' : 'Переглядати послуги', category: 'Services' },
    { id: 'service_create', name: language === 'en' ? 'Create Services' : 'Створювати послуги', category: 'Services' },
    { id: 'service_edit', name: language === 'en' ? 'Edit Services' : 'Редагувати послуги', category: 'Services' },
    { id: 'appeal_view', name: language === 'en' ? 'View Appeals' : 'Переглядати звернення', category: 'Appeals' },
    { id: 'appeal_process', name: language === 'en' ? 'Process Appeals' : 'Обробляти звернення', category: 'Appeals' }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permissionId] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permissionId) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(language === 'en' ? 'Please enter role name' : 'Будь ласка, введіть назву ролі');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would save the role to database
      toast.success(language === 'en' ? 'Role created successfully' : 'Роль успішно створено');
      setFormData({ name: '', description: '', permissions: [] });
      setOpen(false);
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error(language === 'en' ? 'Error creating role' : 'Помилка створення ролі');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Create New Role' : 'Створити нову роль'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{language === 'en' ? 'Role Name' : 'Назва ролі'} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={language === 'en' ? 'Enter role name' : 'Введіть назву ролі'}
            />
          </div>
          
          <div>
            <Label htmlFor="description">{language === 'en' ? 'Description' : 'Опис'}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={language === 'en' ? 'Enter role description' : 'Введіть опис ролі'}
            />
          </div>

          <div>
            <Label className="text-base font-medium">{language === 'en' ? 'Permissions' : 'Дозволи'}</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <Label htmlFor={permission.id} className="text-sm">{permission.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (language === 'en' ? 'Creating...' : 'Створення...') : (language === 'en' ? 'Create Role' : 'Створити роль')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleDialog;
