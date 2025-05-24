
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Shield, Bell, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLanguageChange = (newLanguage: 'en' | 'uk') => {
    setLanguage(newLanguage);
    toast.success(language === 'en' ? 'Language updated' : 'Мову оновлено');
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(language === 'en' ? 'Please fill in all password fields' : 'Заповніть всі поля паролю');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error(language === 'en' ? 'New passwords do not match' : 'Нові паролі не співпадають');
      return;
    }

    // Simulate password change
    toast.success(language === 'en' ? 'Password updated successfully' : 'Пароль успішно оновлено');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationToggle = (type: 'email' | 'push', value: boolean) => {
    if (type === 'email') {
      setEmailNotifications(value);
      toast.success(language === 'en' ? 
        `Email notifications ${value ? 'enabled' : 'disabled'}` : 
        `Email сповіщення ${value ? 'увімкнено' : 'вимкнено'}`
      );
    } else {
      setPushNotifications(value);
      toast.success(language === 'en' ? 
        `Push notifications ${value ? 'enabled' : 'disabled'}` : 
        `Push сповіщення ${value ? 'увімкнено' : 'вимкнено'}`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {language === 'en' ? 'Settings' : 'Налаштування'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {language === 'en' ? 'Profile' : 'Профіль'}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              {language === 'en' ? 'Security' : 'Безпека'}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              {language === 'en' ? 'Notifications' : 'Сповіщення'}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'Preferences' : 'Налаштування'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div>
              <Label>{language === 'en' ? 'Email' : 'Email'}</Label>
              <Input value={user?.email || ''} disabled />
            </div>
            <div>
              <Label>{language === 'en' ? 'Full Name' : 'Повне ім\'я'}</Label>
              <Input placeholder={language === 'en' ? 'Enter your full name' : 'Введіть ваше повне ім\'я'} />
            </div>
            <div>
              <Label>{language === 'en' ? 'Position' : 'Посада'}</Label>
              <Input placeholder={language === 'en' ? 'Enter your position' : 'Введіть вашу посаду'} />
            </div>
            <Button>{language === 'en' ? 'Update Profile' : 'Оновити профіль'}</Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div>
              <Label>{language === 'en' ? 'Current Password' : 'Поточний пароль'}</Label>
              <Input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>{language === 'en' ? 'New Password' : 'Новий пароль'}</Label>
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>{language === 'en' ? 'Confirm New Password' : 'Підтвердіть новий пароль'}</Label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handlePasswordChange}>
              {language === 'en' ? 'Change Password' : 'Змінити пароль'}
            </Button>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">
                {language === 'en' ? 'Two-Factor Authentication' : 'Двофакторна автентифікація'}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'en' ? 'Add an extra layer of security to your account' : 'Додайте додатковий рівень безпеки до вашого облікового запису'}
              </p>
              <Button variant="outline">
                {language === 'en' ? 'Enable 2FA' : 'Увімкнути 2FA'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{language === 'en' ? 'Email Notifications' : 'Email сповіщення'}</Label>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Receive notifications via email' : 'Отримувати сповіщення на email'}
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{language === 'en' ? 'Push Notifications' : 'Push сповіщення'}</Label>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Receive push notifications in browser' : 'Отримувати push сповіщення в браузері'}
                </p>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div>
              <Label>{language === 'en' ? 'Language' : 'Мова'}</Label>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </Button>
                <Button 
                  variant={language === 'uk' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('uk')}
                >
                  Українська
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>{language === 'en' ? 'Dark Mode' : 'Темна тема'}</Label>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Switch to dark theme' : 'Перемкнути на темну тему'}
                </p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
