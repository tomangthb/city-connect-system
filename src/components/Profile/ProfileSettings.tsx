import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Camera,
  Save,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ProfileInfoCard from './ProfileInfoCard';

const ProfileSettings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    email: user?.email || '',
    phone: '',
    address: '',
    position: '',
    bio: '',
    avatarUrl: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactor: false
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setFormData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            patronymic: data.patronymic || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            position: data.user_type === 'employee' ? 'Municipal Employee' : 'Resident',
            bio: '',
            avatarUrl: data.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    
    const settingMessages: Record<string, string> = {
      emailNotifications: t('emailNotifications'),
      pushNotifications: t('pushNotifications'),
      darkMode: t('darkMode'),
      twoFactor: t('twoFactorAuth')
    };
    
    toast.success(`${settingMessages[setting]} ${value ? 'увімкнено' : 'вимкнено'}`);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'uk') => {
    setLanguage(newLanguage);
    toast.success(t('language') + ' оновлено');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingAvatar(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      toast.success('Фото профілю успішно оновлено!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Помилка завантаження фото');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      toast.error('Користувач не авторизований');
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          patronymic: formData.patronymic,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
      
      toast.success('Профіль успішно оновлено!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Помилка оновлення профілю');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Заповніть всі поля паролю');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Нові паролі не співпадають');
      return;
    }

    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Пароль успішно оновлено');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Помилка зміни пароля');
    }
  };

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('profileInformation')}</h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage your personal information and account settings' 
            : 'Керуйте своєю особистою інформацією та налаштуваннями облікового запису'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Info Card - Left side */}
        <div className="lg:col-span-1">
          <ProfileInfoCard profileData={formData} />
        </div>

        {/* Settings Tabs - Right side */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('profile')}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('security')}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                {t('notifications')}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                {t('preferences')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? 'Profile Settings' : 'Налаштування профілю'}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {language === 'en' 
                      ? 'Update your personal information and contact details' 
                      : 'Оновіть свою особисту інформацію та контактні дані'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={formData.avatarUrl} />
                        <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <label htmlFor="avatar-upload">
                        <Button 
                          size="sm" 
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          disabled={isUploadingAvatar}
                          asChild
                        >
                          <div>
                            <Camera className="h-4 w-4" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                          </div>
                        </Button>
                      </label>
                    </div>
                    <div>
                      <h3 className="font-medium">Фото профілю</h3>
                      <p className="text-sm text-gray-500">JPG, PNG до 5MB</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {t('firstName')}
                      </Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder={language === 'en' ? 'Enter your first name' : 'Введіть ваше ім\'я'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {t('lastName')}
                      </Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder={language === 'en' ? 'Enter your last name' : 'Введіть ваше прізвище'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patronymic">
                        {t('patronymic')}
                      </Label>
                      <Input 
                        id="patronymic" 
                        value={formData.patronymic}
                        onChange={(e) => handleInputChange('patronymic', e.target.value)}
                        placeholder={language === 'en' ? 'Enter your patronymic' : 'Введіть ваше по-батькові'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">
                        {t('position')}
                      </Label>
                      <Input 
                        id="position" 
                        value={formData.position}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {t('emailAddress')}
                      </Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t('phoneNumber')}
                      </Label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={language === 'en' ? 'Enter your phone number' : 'Введіть ваш номер телефону'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {t('address')}
                    </Label>
                    <Input 
                      id="address" 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={language === 'en' ? 'Enter your address' : 'Введіть вашу адресу'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      Біографія
                    </Label>
                    <Textarea 
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Розкажіть про себе..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isUpdating}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Збереження...' : (language === 'en' ? 'Save Changes' : 'Зберегти зміни')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    {t('changePassword')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('currentPassword')}</Label>
                    <Input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('newPassword')}</Label>
                    <Input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('confirmNewPassword')}</Label>
                    <Input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>
                    {t('changePassword')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('twoFactorAuth')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('twoFactorAuth')}</p>
                      <p className="text-sm text-gray-600">{t('extraSecurityLayer')}</p>
                    </div>
                    <Switch 
                      checked={settings.twoFactor} 
                      onCheckedChange={(checked) => handleSettingChange('twoFactor', checked)}
                    />
                  </div>
                  {!settings.twoFactor && (
                    <Button variant="outline" className="mt-4">
                      {t('enable2FA')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('notifications')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('emailNotifications')}</Label>
                      <p className="text-sm text-gray-600">{t('receiveEmailNotifications')}</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications} 
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('pushNotifications')}</Label>
                      <p className="text-sm text-gray-600">{t('receivePushNotifications')}</p>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications} 
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('preferences')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="flex items-center mb-3">
                      {t('language')}
                    </Label>
                    <div className="flex gap-2">
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
                      <Label>{t('darkMode')}</Label>
                      <p className="text-sm text-gray-600">{t('switchDarkTheme')}</p>
                    </div>
                    <Switch 
                      checked={settings.darkMode} 
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
