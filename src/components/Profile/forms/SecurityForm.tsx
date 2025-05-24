
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SecurityFormProps {
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData: React.Dispatch<React.SetStateAction<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>>;
  onPasswordChange: () => void;
  twoFactorEnabled: boolean;
  onTwoFactorChange: (checked: boolean) => void;
}

const SecurityForm = ({ 
  passwordData, 
  setPasswordData, 
  onPasswordChange,
  twoFactorEnabled,
  onTwoFactorChange
}: SecurityFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
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
          <Button onClick={onPasswordChange}>
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
              checked={twoFactorEnabled} 
              onCheckedChange={onTwoFactorChange}
            />
          </div>
          {!twoFactorEnabled && (
            <Button variant="outline" className="mt-4">
              {t('enable2FA')}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityForm;
