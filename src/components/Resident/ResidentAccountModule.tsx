
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentAccountModule = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' ? 'My Account' : 'Мій акаунт'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Profile Information' : 'Інформація профілю'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Manage your personal information and account settings.' 
                : 'Керуйте своєю особистою інформацією та налаштуваннями акаунту.'}
            </p>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Edit Profile' : 'Редагувати профіль'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Notification Settings' : 'Налаштування сповіщень'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Configure how you receive notifications from the city.' 
                : 'Налаштуйте, як ви отримуєте сповіщення від міста.'}
            </p>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Manage Notifications' : 'Керувати сповіщеннями'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentAccountModule;
