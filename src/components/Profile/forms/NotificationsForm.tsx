
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationsFormProps {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  onSettingChange: (setting: string, value: boolean) => void;
}

const NotificationsForm = ({ settings, onSettingChange }: NotificationsFormProps) => {
  const { t } = useLanguage();

  return (
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
            onCheckedChange={(checked) => onSettingChange('emailNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('pushNotifications')}</Label>
            <p className="text-sm text-gray-600">{t('receivePushNotifications')}</p>
          </div>
          <Switch 
            checked={settings.pushNotifications} 
            onCheckedChange={(checked) => onSettingChange('pushNotifications', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsForm;
