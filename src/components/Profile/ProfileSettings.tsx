
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProfileInfoCard from './ProfileInfoCard';
import PersonalInfoForm from './forms/PersonalInfoForm';
import SecurityForm from './forms/SecurityForm';
import NotificationsForm from './forms/NotificationsForm';
import PreferencesForm from './forms/PreferencesForm';
import { useProfileData } from './hooks/useProfileData';
import { useProfileSettings } from './hooks/useProfileSettings';

const ProfileSettings = () => {
  const { language, t } = useLanguage();
  
  const {
    formData,
    isLoading,
    isUpdating,
    isUploadingAvatar,
    handleInputChange,
    handleAvatarUpload,
    handleUpdateProfile,
    getUserInitials
  } = useProfileData();

  const {
    settings,
    passwordData,
    setPasswordData,
    handleSettingChange,
    handleLanguageChange,
    handlePasswordChange
  } = useProfileSettings();

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
        <div className="lg:col-span-1">
          <ProfileInfoCard profileData={formData} />
        </div>

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
                  <PersonalInfoForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                    onAvatarUpload={handleAvatarUpload}
                    getUserInitials={getUserInitials}
                    isUploadingAvatar={isUploadingAvatar}
                  />
                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating || isUploadingAvatar}
                      className="flex items-center min-w-[150px]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isUpdating ? 'Збереження...' : (language === 'en' ? 'Save Changes' : 'Зберегти зміни')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityForm 
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onPasswordChange={handlePasswordChange}
                twoFactorEnabled={settings.twoFactor}
                onTwoFactorChange={(checked) => handleSettingChange('twoFactor', checked)}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationsForm 
                settings={settings}
                onSettingChange={handleSettingChange}
              />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <PreferencesForm 
                language={language}
                onLanguageChange={handleLanguageChange}
                darkMode={settings.darkMode}
                onDarkModeChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
