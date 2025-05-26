
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

interface CreateUserDialogProps {
  children: React.ReactNode;
  onUserCreated: () => void;
}

const CreateUserDialog = ({ children, onUserCreated }: CreateUserDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    phone: '',
    address: '',
    userType: 'resident' as 'employee' | 'resident',
    role: 'resident' as 'admin' | 'employee' | 'resident'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            patronymic: formData.patronymic,
            phone: formData.phone,
            address: formData.address,
            user_type: formData.userType
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: formData.role
          });

        if (roleError) throw roleError;
      }

      toast.success(language === 'en' ? 'User created successfully' : 'Користувача створено успішно');
      setOpen(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        patronymic: '',
        phone: '',
        address: '',
        userType: 'resident',
        role: 'resident'
      });
      onUserCreated();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || (language === 'en' ? 'Error creating user' : 'Помилка створення користувача'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Create New User' : 'Створити нового користувача'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">
                {language === 'en' ? 'First Name' : "Ім'я"}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">
                {language === 'en' ? 'Last Name' : 'Прізвище'}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="patronymic">
              {language === 'en' ? 'Patronymic' : 'По батькові'}
            </Label>
            <Input
              id="patronymic"
              value={formData.patronymic}
              onChange={(e) => setFormData({...formData, patronymic: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">
              {language === 'en' ? 'Password' : 'Пароль'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">
              {language === 'en' ? 'Phone' : 'Телефон'}
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="address">
              {language === 'en' ? 'Address' : 'Адреса'}
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="userType">
              {language === 'en' ? 'User Type' : 'Тип користувача'}
            </Label>
            <Select
              value={formData.userType}
              onValueChange={(value: 'employee' | 'resident') => setFormData({...formData, userType: value, role: value === 'employee' ? 'employee' : 'resident'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">
                  {language === 'en' ? 'Resident' : 'Мешканець'}
                </SelectItem>
                <SelectItem value="employee">
                  {language === 'en' ? 'Employee' : 'Працівник'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">
              {language === 'en' ? 'Role' : 'Роль'}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'employee' | 'resident') => setFormData({...formData, role: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">
                  {language === 'en' ? 'Resident' : 'Мешканець'}
                </SelectItem>
                <SelectItem value="employee">
                  {language === 'en' ? 'Employee' : 'Працівник'}
                </SelectItem>
                <SelectItem value="admin">
                  {language === 'en' ? 'Administrator' : 'Адміністратор'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 
                (language === 'en' ? 'Creating...' : 'Створюємо...') : 
                (language === 'en' ? 'Create User' : 'Створити користувача')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
