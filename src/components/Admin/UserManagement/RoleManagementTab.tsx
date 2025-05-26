
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CreateRoleDialog from './CreateRoleDialog';

const RoleManagementTab = () => {
  const { language } = useLanguage();
  
  // Mock data for roles
  const [roles] = useState([
    {
      id: 'admin',
      name: language === 'en' ? 'Administrator' : 'Адміністратор',
      description: language === 'en' ? 'Full system access' : 'Повний доступ до системи',
      userCount: 2,
      permissions: ['user_manage', 'system_config', 'all_modules']
    },
    {
      id: 'employee',
      name: language === 'en' ? 'Employee' : 'Працівник',
      description: language === 'en' ? 'Standard employee access' : 'Стандартний доступ працівника',
      userCount: 15,
      permissions: ['appeals_process', 'services_manage', 'reports_view']
    },
    {
      id: 'resident',
      name: language === 'en' ? 'Resident' : 'Мешканець',
      description: language === 'en' ? 'Citizen services access' : 'Доступ до громадських послуг',
      userCount: 1250,
      permissions: ['services_request', 'appeals_create', 'documents_view']
    },
    {
      id: 'moderator',
      name: language === 'en' ? 'Appeals Moderator' : 'Модератор звернень',
      description: language === 'en' ? 'Moderate and process appeals' : 'Модерування та обробка звернень',
      userCount: 5,
      permissions: ['appeals_moderate', 'appeals_assign', 'appeals_respond']
    }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {language === 'en' ? 'Role Management' : 'Управління ролями'}
            </span>
            <CreateRoleDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Create Role' : 'Створити роль'}
              </Button>
            </CreateRoleDialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">
                            {role.userCount} {language === 'en' ? 'users' : 'користувачів'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {role.permissions.length} {language === 'en' ? 'permissions' : 'дозволів'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">
                      {language === 'en' ? 'Permissions:' : 'Дозволи:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementTab;
