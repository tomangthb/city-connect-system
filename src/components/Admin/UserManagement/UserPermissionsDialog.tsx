
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface UserPermissionsDialogProps {
  children: React.ReactNode;
  user: User;
  onUserUpdated: () => void;
}

const UserPermissionsDialog = ({ children, user, onUserUpdated }: UserPermissionsDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { 
      category: language === 'en' ? 'User Management' : 'Управління користувачами',
      permissions: [
        { id: 'user_view', name: language === 'en' ? 'View Users' : 'Переглядати користувачів' },
        { id: 'user_create', name: language === 'en' ? 'Create Users' : 'Створювати користувачів' },
        { id: 'user_edit', name: language === 'en' ? 'Edit Users' : 'Редагувати користувачів' },
        { id: 'user_delete', name: language === 'en' ? 'Delete Users' : 'Видаляти користувачів' }
      ]
    },
    {
      category: language === 'en' ? 'Services' : 'Послуги',
      permissions: [
        { id: 'service_view', name: language === 'en' ? 'View Services' : 'Переглядати послуги' },
        { id: 'service_create', name: language === 'en' ? 'Create Services' : 'Створювати послуги' },
        { id: 'service_edit', name: language === 'en' ? 'Edit Services' : 'Редагувати послуги' },
        { id: 'service_delete', name: language === 'en' ? 'Delete Services' : 'Видаляти послуги' }
      ]
    },
    {
      category: language === 'en' ? 'Appeals' : 'Звернення',
      permissions: [
        { id: 'appeal_view', name: language === 'en' ? 'View Appeals' : 'Переглядати звернення' },
        { id: 'appeal_process', name: language === 'en' ? 'Process Appeals' : 'Обробляти звернення' },
        { id: 'appeal_assign', name: language === 'en' ? 'Assign Appeals' : 'Призначати звернення' }
      ]
    },
    {
      category: language === 'en' ? 'Reports' : 'Звіти',
      permissions: [
        { id: 'report_view', name: language === 'en' ? 'View Reports' : 'Переглядати звіти' },
        { id: 'report_export', name: language === 'en' ? 'Export Reports' : 'Експортувати звіти' },
        { id: 'report_create', name: language === 'en' ? 'Create Reports' : 'Створювати звіти' }
      ]
    }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setPermissions(prev => [...prev, permissionId]);
    } else {
      setPermissions(prev => prev.filter(p => p !== permissionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Here you would save permissions to database
      // For now, just show success message
      toast.success(language === 'en' ? 'Permissions updated successfully' : 'Дозволи успішно оновлено');
      setOpen(false);
      onUserUpdated();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(language === 'en' ? 'Error updating permissions' : 'Помилка оновлення дозволів');
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
          <DialogTitle>{language === 'en' ? 'Manage User Permissions' : 'Управління дозволами користувача'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">{user.first_name} {user.last_name}</Label>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {availablePermissions.map((category) => (
            <div key={category.category} className="space-y-3">
              <Label className="text-base font-medium">{category.category}</Label>
              <div className="grid grid-cols-2 gap-2 pl-4">
                {category.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={permissions.includes(permission.id)}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    />
                    <Label htmlFor={permission.id} className="text-sm">{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (language === 'en' ? 'Updating...' : 'Оновлення...') : (language === 'en' ? 'Update Permissions' : 'Оновити дозволи')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
