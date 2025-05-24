
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useProfileSettings = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactor: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Пароль успішно оновлено');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Помилка зміни пароля');
    }
  };

  return {
    settings,
    passwordData,
    setPasswordData,
    handleSettingChange,
    handleLanguageChange,
    handlePasswordChange,
    language
  };
};
