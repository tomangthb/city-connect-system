
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

interface CreateUserDialogProps {
  children: React.ReactNode;
  onUserCreated: () => void;
}

const CreateUserDialog = ({ children, onUserCreated }: CreateUserDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    userType: 'resident',
    department: '',
    roles: [] as string[],
    isActive: true
  });

  const availableRoles = [
    { id: 'admin', name: language === 'en' ? 'Administrator' : 'Адміністратор' },
    { id: 'employee', name: language === 'en' ? 'Employee' : 'Працівник' },
    { id: 'resident', name: language === 'en' ? 'Resident' : 'Мешканець' },
    { id: 'moderator', name: language === 'en' ? 'Moderator' : 'Модератор' },
    { id: 'operator', name: language === 'en' ? 'Operator' : 'Оператор' },
    { id: 'specialist', name: language === 'en' ? 'Specialist' : 'Спеціаліст' }
  ];

  const departments = [
    { id: 'housing', name: language === 'en' ? 'Housing and Utilities' : 'ЖКГ' },
    { id: 'transport', name: language === 'en' ? 'Transport' : 'Транспорт' },
    { id: 'social', name: language === 'en' ? 'Social Services' : 'Соціальні послуги' },
    { id: 'admin', name: language === 'en' ? 'Administration' : 'Адміністрація' },
    { id: 'it', name: language === 'en' ? 'IT Department' : 'IT відділ' }
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            patronymic: formData.patronymic,
            phone: formData.phone,
            address: formData.address,
            user_type: formData.userType,
            department: formData.department
          }
        }
      });

      if (error) throw error;

      if (data.user && formData.roles.length > 0) {
        for (const role of formData.roles) {
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: role
          });
        }
      }

      toast.success(language === 'en' ? 'User created successfully' : 'Користувача успішно створено');
      setFormData({
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        userType: 'resident',
        department: '',
        roles: [],
        isActive: true
      });
      setOpen(false);
      onUserCreated();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(language === 'en' ? 'Error creating user' : 'Помилка створення користувача');
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
          <DialogTitle>{language === 'en' ? 'Create New User' : 'Створити нового користувача'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{language === 'en' ? 'First Name' : 'Ім\'я'} *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder={language === 'en' ? 'Enter first name' : 'Введіть ім\'я'}
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">{language === 'en' ? 'Last Name' : 'Прізвище'} *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder={language === 'en' ? 'Enter last name' : 'Введіть прізвище'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="patronymic">{language === 'en' ? 'Patronymic' : 'По батькові'}</Label>
            <Input
              id="patronymic"
              value={formData.patronymic}
              onChange={(e) => setFormData(prev => ({ ...prev, patronymic: e.target.value }))}
              placeholder={language === 'en' ? 'Enter patronymic' : 'Введіть по батькові'}
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
            <Label htmlFor="password">{language === 'en' ? 'Password' : 'Пароль'} *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder={language === 'en' ? 'Enter password' : 'Введіть пароль'}
            />
          </div>

          <div>
            <Label htmlFor="phone">{language === 'en' ? 'Phone' : 'Телефон'}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder={language === 'en' ? 'Enter phone number' : 'Введіть номер телефону'}
            />
          </div>

          <div>
            <Label htmlFor="address">{language === 'en' ? 'Address' : 'Адреса'}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder={language === 'en' ? 'Enter address' : 'Введіть адресу'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{language === 'en' ? 'User Type' : 'Тип користувача'}</Label>
              <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}>
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
              <Label>{language === 'en' ? 'Department' : 'Відділ'}</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select department' : 'Оберіть відділ'} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive">{language === 'en' ? 'Account is active' : 'Обліковий запис активний'}</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (language === 'en' ? 'Creating...' : 'Створення...') : (language === 'en' ? 'Create User' : 'Створити користувача')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
