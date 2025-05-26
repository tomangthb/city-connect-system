
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Shield, Key, UserCog, Download, Upload } from 'lucide-react';
import UserAccountsTab from './UserAccountsTab';
import RoleManagementTab from './RoleManagementTab';
import PermissionsTab from './PermissionsTab';
import SessionManagementTab from './SessionManagementTab';
import ImportExportTab from './ImportExportTab';

const UserManagementModule = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'User Management' : 'Управління користувачами'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage user accounts, roles, and permissions' 
            : 'Керуйте обліковими записами користувачів, ролями та дозволами'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'en' ? 'Accounts' : 'Облікові записи'}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {language === 'en' ? 'Roles' : 'Ролі'}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            {language === 'en' ? 'Permissions' : 'Дозволи'}
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            {language === 'en' ? 'Sessions' : 'Сесії'}
          </TabsTrigger>
          <TabsTrigger value="import-export" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {language === 'en' ? 'Import/Export' : 'Імпорт/Експорт'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-6">
          <UserAccountsTab />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RoleManagementTab />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermissionsTab />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <SessionManagementTab />
        </TabsContent>

        <TabsContent value="import-export" className="mt-6">
          <ImportExportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementModule;
