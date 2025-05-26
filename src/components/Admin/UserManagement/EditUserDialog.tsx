
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  user_type: 'employee' | 'resident';
  address: string;
  phone: string;
  created_at: string;
  roles: string[];
}

interface EditUserDialogProps {
  children: React.ReactNode;
  user: User;
  onUserUpdated: () => void;
}

const EditUserDialog = ({ children, user, onUserUpdated }: EditUserDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    patronymic: user.patronymic || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    user_type: user.user_type || 'resident'
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);

  const availableRoles = ['admin', 'employee', 'resident'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update roles - first delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new roles one by one
      for (const role of selectedRoles) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: role as 'admin' | 'employee' | 'resident' }]);

        if (insertError) throw insertError;
      }

      toast.success(language === 'en' ? 'User updated successfully' : 'Користувача оновлено успішно');
      setOpen(false);
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(language === 'en' ? 'Error updating user' : 'Помилка оновлення користувача');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Edit User' : 'Редагувати користувача'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{language === 'en' ? 'First Name' : "Ім'я"}</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">{language === 'en' ? 'Last Name' : 'Прізвище'}</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patronymic">{language === 'en' ? 'Patronymic' : 'По батькові'}</Label>
            <Input
              id="patronymic"
              value={formData.patronymic}
              onChange={(e) => setFormData({ ...formData, patronymic: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{language === 'en' ? 'Phone' : 'Телефон'}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{language === 'en' ? 'Address' : 'Адреса'}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_type">{language === 'en' ? 'User Type' : 'Тип користувача'}</Label>
            <Select 
              value={formData.user_type} 
              onValueChange={(value) => setFormData({ ...formData, user_type: value as 'employee' | 'resident' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">{language === 'en' ? 'Employee' : 'Співробітник'}</SelectItem>
                <SelectItem value="resident">{language === 'en' ? 'Resident' : 'Мешканець'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === 'en' ? 'Roles' : 'Ролі'}</Label>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                  />
                  <Label htmlFor={role} className="capitalize">{role}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (language === 'en' ? 'Updating...' : 'Оновлення...') : (language === 'en' ? 'Update User' : 'Оновити користувача')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
