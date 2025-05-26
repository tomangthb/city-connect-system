
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  user_type: 'employee' | 'resident';
  address?: string;
  phone?: string;
  roles?: string[];
  status: string;
}

interface EditUserDialogProps {
  children: React.ReactNode;
  user: User;
  onUserUpdated: () => void;
}

const EditUserDialog = ({ children, user, onUserUpdated }: EditUserDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    patronymic: user.patronymic || '',
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    userType: user.user_type,
    roles: user.roles || [],
    status: user.status
  });

  const availableRoles = [
    { id: 'admin', name: language === 'en' ? 'Administrator' : 'Адміністратор' },
    { id: 'employee', name: language === 'en' ? 'Employee' : 'Працівник' },
    { id: 'resident', name: language === 'en' ? 'Resident' : 'Мешканець' },
    { id: 'moderator', name: language === 'en' ? 'Moderator' : 'Модератор' },
    { id: 'operator', name: language === 'en' ? 'Operator' : 'Оператор' },
    { id: 'specialist', name: language === 'en' ? 'Specialist' : 'Спеціаліст' }
  ];

  const handleRoleChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, roles: [...prev.roles, roleId] }));
    } else {
      setFormData(prev => ({ ...prev, roles: prev.roles.filter(r => r !== roleId) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          patronymic: formData.patronymic,
          phone: formData.phone,
          address: formData.address,
          user_type: formData.userType
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update roles - delete existing and add new ones
      await supabase.from('user_roles').delete().eq('user_id', user.id);
      
      if (formData.roles.length > 0) {
        const roleInserts = formData.roles.map(role => ({
          user_id: user.id,
          role: role
        }));
        
        const { error: rolesError } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (rolesError) throw rolesError;
      }

      toast.success(language === 'en' ? 'User updated successfully' : 'Користувача успішно оновлено');
      setOpen(false);
      onUserUpdated();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Edit User' : 'Редагувати користувача'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{language === 'en' ? 'First Name' : 'Ім\'я'} *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">{language === 'en' ? 'Last Name' : 'Прізвище'} *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="patronymic">{language === 'en' ? 'Patronymic' : 'По батькові'}</Label>
            <Input
              id="patronymic"
              value={formData.patronymic}
              onChange={(e) => setFormData(prev => ({ ...prev, patronymic: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="email">{language === 'en' ? 'Email' : 'Електронна пошта'} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="phone">{language === 'en' ? 'Phone' : 'Телефон'}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="address">{language === 'en' ? 'Address' : 'Адреса'}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div>
            <Label>{language === 'en' ? 'User Type' : 'Тип користувача'}</Label>
            <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value as 'employee' | 'resident' }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">{language === 'en' ? 'Resident' : 'Мешканець'}</SelectItem>
                <SelectItem value="employee">{language === 'en' ? 'Employee' : 'Працівник'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">{language === 'en' ? 'Roles' : 'Ролі'}</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.id}
                    checked={formData.roles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                  />
                  <Label htmlFor={role.id}>{role.name}</Label>
                </div>
              ))}
            </div>
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
