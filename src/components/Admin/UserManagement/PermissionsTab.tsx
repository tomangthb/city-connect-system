
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Key, Shield, Users, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PermissionsTab = () => {
  const { language } = useLanguage();
  
  const permissionCategories = [
    {
      id: 'users',
      name: language === 'en' ? 'User Management' : 'Управління користувачами',
      icon: Users,
      permissions: [
        { id: 'user_view', name: language === 'en' ? 'View Users' : 'Переглядати користувачів', roles: ['admin', 'employee'] },
        { id: 'user_create', name: language === 'en' ? 'Create Users' : 'Створювати користувачів', roles: ['admin'] },
        { id: 'user_edit', name: language === 'en' ? 'Edit Users' : 'Редагувати користувачів', roles: ['admin'] },
        { id: 'user_delete', name: language === 'en' ? 'Delete Users' : 'Видаляти користувачів', roles: ['admin'] }
      ]
    },
    {
      id: 'services',
      name: language === 'en' ? 'Services Management' : 'Управління послугами',
      icon: Shield,
      permissions: [
        { id: 'service_view', name: language === 'en' ? 'View Services' : 'Переглядати послуги', roles: ['admin', 'employee', 'resident'] },
        { id: 'service_create', name: language === 'en' ? 'Create Services' : 'Створювати послуги', roles: ['admin', 'employee'] },
        { id: 'service_edit', name: language === 'en' ? 'Edit Services' : 'Редагувати послуги', roles: ['admin', 'employee'] },
        { id: 'service_delete', name: language === 'en' ? 'Delete Services' : 'Видаляти послуги', roles: ['admin'] }
      ]
    },
    {
      id: 'appeals',
      name: language === 'en' ? 'Appeals Management' : 'Управління зверненнями',
      icon: FileText,
      permissions: [
        { id: 'appeal_view', name: language === 'en' ? 'View Appeals' : 'Переглядати звернення', roles: ['admin', 'employee', 'moderator'] },
        { id: 'appeal_create', name: language === 'en' ? 'Create Appeals' : 'Створювати звернення', roles: ['admin', 'employee', 'resident'] },
        { id: 'appeal_process', name: language === 'en' ? 'Process Appeals' : 'Обробляти звернення', roles: ['admin', 'employee', 'moderator'] },
        { id: 'appeal_assign', name: language === 'en' ? 'Assign Appeals' : 'Призначати звернення', roles: ['admin', 'moderator'] }
      ]
    },
    {
      id: 'reports',
      name: language === 'en' ? 'Reports & Analytics' : 'Звіти та аналітика',
      icon: Key,
      permissions: [
        { id: 'report_view', name: language === 'en' ? 'View Reports' : 'Переглядати звіти', roles: ['admin', 'employee'] },
        { id: 'report_export', name: language === 'en' ? 'Export Reports' : 'Експортувати звіти', roles: ['admin', 'employee'] },
        { id: 'report_create', name: language === 'en' ? 'Create Reports' : 'Створювати звіти', roles: ['admin'] }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'System Permissions Overview' : 'Огляд системних дозволів'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {permissionCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium text-lg">{category.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{permission.name}</span>
                          <div className="flex gap-1">
                            {permission.roles.map((role) => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsTab;
