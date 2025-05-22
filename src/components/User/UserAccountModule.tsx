
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const UserAccountModule = () => {
  const { language, t } = useLanguage();
  
  // Sample user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+380 12 345 6789',
    address: '123 Main Street, City Center',
    notifications: true,
    twoFactor: false
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('myAccount')}</h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage your personal information and account settings' 
            : 'Керуйте своєю особистою інформацією та налаштуваннями облікового запису'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Full Name' : 'Повне ім\'я'}
                  </Label>
                  <Input id="name" defaultValue={userData.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Email Address' : 'Електронна пошта'}
                  </Label>
                  <Input id="email" defaultValue={userData.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Phone Number' : 'Номер телефону'}
                  </Label>
                  <Input id="phone" defaultValue={userData.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Address' : 'Адреса'}
                  </Label>
                  <Input id="address" defaultValue={userData.address} />
                </div>
              </div>
              <Button className="mt-4">
                {language === 'en' ? 'Save Changes' : 'Зберегти зміни'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Account Settings' : 'Налаштування облікового запису'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? 'Notifications' : 'Сповіщення'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' 
                        ? 'Receive email notifications' 
                        : 'Отримувати сповіщення електронною поштою'}
                    </p>
                  </div>
                </div>
                <div className="form-switch">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    className="sr-only" 
                    defaultChecked={userData.notifications} 
                  />
                  <label 
                    htmlFor="notifications" 
                    className={`block w-10 h-6 rounded-full transition-colors ${userData.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span 
                      className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform ${userData.notifications ? 'transform translate-x-4' : ''}`}>
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? 'Two-Factor Authentication' : 'Двофакторна автентифікація'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' 
                        ? 'Add an extra layer of security' 
                        : 'Додайте додатковий рівень безпеки'}
                    </p>
                  </div>
                </div>
                <div className="form-switch">
                  <input 
                    type="checkbox" 
                    id="twoFactor" 
                    className="sr-only" 
                    defaultChecked={userData.twoFactor} 
                  />
                  <label 
                    htmlFor="twoFactor" 
                    className={`block w-10 h-6 rounded-full transition-colors ${userData.twoFactor ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span 
                      className={`block w-4 h-4 mt-1 ml-1 bg-white rounded-full transition-transform ${userData.twoFactor ? 'transform translate-x-4' : ''}`}>
                    </span>
                  </label>
                </div>
              </div>

              <Button variant="outline" className="mt-4 w-full">
                {language === 'en' ? 'Change Password' : 'Змінити пароль'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAccountModule;
