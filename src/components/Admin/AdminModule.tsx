
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { UserCog, Shield, Settings, Users, Key } from 'lucide-react';
import UserManagementModule from './UserManagement/UserManagementModule';
import AccessControlDialog from './AccessControlDialog';
import ApiIntegrationsDialog from './ApiIntegrationsDialog';
import SystemStatusDialog from './SystemStatusDialog';

interface AdminModuleProps {
  onOpenSettings?: () => void;
}

const AdminModule = ({ onOpenSettings }: AdminModuleProps) => {
  const { language, t } = useLanguage();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  
  const adminSections = [
    { 
      id: 'user-management', 
      title: language === 'en' ? 'User Management' : 'Управління користувачами',
      icon: Users,
      description: language === 'en' 
        ? 'Create, edit and delete user accounts. Manage user roles and permissions.' 
        : 'Створюйте, редагуйте та видаляйте облікові записи користувачів. Керуйте ролями та дозволами.',
      component: 'user-management'
    },
    { 
      id: 'access-control', 
      title: language === 'en' ? 'Access Control' : 'Контроль доступу',
      icon: Shield,
      description: language === 'en' 
        ? 'Define access rules and security policies for the system.' 
        : 'Визначте правила доступу та політики безпеки для системи.',
      component: 'access-control'
    },
    { 
      id: 'system-settings', 
      title: language === 'en' ? 'System Settings' : 'Налаштування системи',
      icon: Settings,
      description: language === 'en' 
        ? 'Configure system-wide settings and preferences.' 
        : 'Налаштуйте загальносистемні параметри та налаштування.',
      component: 'system-settings'
    },
    { 
      id: 'api-keys', 
      title: language === 'en' ? 'API Integrations' : 'API інтеграції',
      icon: Key,
      description: language === 'en' 
        ? 'Manage API keys and third-party service integrations.' 
        : 'Керуйте ключами API та інтеграціями сторонніх сервісів.',
      component: 'api-integrations'
    }
  ];

  const handleSectionClick = (section: any) => {
    if (section.component === 'system-settings' && onOpenSettings) {
      onOpenSettings();
    } else if (section.component === 'user-management') {
      setActiveSection('user-management');
    }
  };

  if (activeSection === 'user-management') {
    return (
      <div>
        <div className="mb-4">
          <Button variant="outline" onClick={() => setActiveSection(null)}>
            ← {language === 'en' ? 'Back to Administration' : 'Назад до адміністрування'}
          </Button>
        </div>
        <UserManagementModule />
      </div>
    );
  }

  const renderSectionButton = (section: any) => {
    switch (section.component) {
      case 'user-management':
        return (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSectionClick(section)}
          >
            {language === 'en' ? 'Manage' : 'Керувати'}
          </Button>
        );
      case 'access-control':
        return (
          <AccessControlDialog>
            <Button variant="outline" className="w-full">
              {language === 'en' ? 'Manage' : 'Керувати'}
            </Button>
          </AccessControlDialog>
        );
      case 'api-integrations':
        return (
          <ApiIntegrationsDialog>
            <Button variant="outline" className="w-full">
              {language === 'en' ? 'Manage' : 'Керувати'}
            </Button>
          </ApiIntegrationsDialog>
        );
      default:
        return (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleSectionClick(section)}
          >
            {language === 'en' ? 'Manage' : 'Керувати'}
          </Button>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('administration')}</h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'System administration and configuration' 
              : 'Адміністрування та налаштування системи'}
          </p>
        </div>
        <SystemStatusDialog>
          <Button className="flex items-center">
            <UserCog className="h-4 w-4 mr-2" />
            {language === 'en' ? 'System Status' : 'Статус системи'}
          </Button>
        </SystemStatusDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{section.description}</p>
                {renderSectionButton(section)}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'System Information' : 'Інформація про систему'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">
                {language === 'en' ? 'Version' : 'Версія'}:
              </span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">
                {language === 'en' ? 'Last Updated' : 'Останнє оновлення'}:
              </span>
              <span className="font-medium">
                {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">
                {language === 'en' ? 'Database Status' : 'Статус бази даних'}:
              </span>
              <span className="text-green-600 font-medium">
                {language === 'en' ? 'Connected' : 'Підключено'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {language === 'en' ? 'License' : 'Ліцензія'}:
              </span>
              <span className="font-medium">
                {language === 'en' ? 'City Council License' : 'Ліцензія міської ради'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModule;
