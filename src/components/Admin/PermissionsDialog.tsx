
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface PermissionsDialogProps {
  children: React.ReactNode;
  user: any;
  onPermissionsUpdated: (userId: number, permissions: string[]) => void;
}

const PermissionsDialog = ({ children, user, onPermissionsUpdated }: PermissionsDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState(user.permissions);

  const availablePermissions = [
    { id: 'read', name: language === 'en' ? 'Read' : 'Читання' },
    { id: 'write', name: language === 'en' ? 'Write' : 'Запис' },
    { id: 'admin', name: language === 'en' ? 'Admin' : 'Адміністратор' },
    { id: 'delete', name: language === 'en' ? 'Delete' : 'Видалення' }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setPermissions((prev: string[]) => [...prev, permissionId]);
    } else {
      setPermissions((prev: string[]) => prev.filter(p => p !== permissionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await addActivity({
        title: language === 'en' ? `Permissions updated: ${user.name}` : `Оновлено права: ${user.name}`,
        description: `Updated permissions for user: ${user.email}`,
        type: 'event',
        priority: 'high',
        status: 'completed'
      });

      onPermissionsUpdated(user.id, permissions);
      setOpen(false);
      toast.success(language === 'en' ? 'Permissions updated successfully' : 'Права успішно оновлено');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(language === 'en' ? 'Error updating permissions' : 'Помилка оновлення прав');
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
          <DialogTitle>{language === 'en' ? 'Manage Permissions' : 'Управління правами'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-base font-medium">{user.name}</Label>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="space-y-3">
            <Label className="text-base">{language === 'en' ? 'Permissions' : 'Права доступу'}</Label>
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  id={permission.id}
                  checked={permissions.includes(permission.id)}
                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                />
                <Label htmlFor={permission.id}>{permission.name}</Label>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (language === 'en' ? 'Updating...' : 'Оновлення...') : (language === 'en' ? 'Update Permissions' : 'Оновити права')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsDialog;
