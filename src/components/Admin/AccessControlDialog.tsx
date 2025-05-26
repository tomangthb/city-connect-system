
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Users, Settings } from 'lucide-react';

interface AccessControlDialogProps {
  children: React.ReactNode;
}

const AccessControlDialog = ({ children }: AccessControlDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const accessRules = [
    {
      name: language === 'en' ? 'Admin Panel Access' : 'Доступ до панелі адміністратора',
      description: language === 'en' ? 'Full system administration rights' : 'Повні права адміністрування системи',
      roles: ['admin'],
      enabled: true
    },
    {
      name: language === 'en' ? 'User Management' : 'Управління користувачами',
      description: language === 'en' ? 'Create, edit, and delete user accounts' : 'Створення, редагування та видалення облікових записів',
      roles: ['admin', 'moderator'],
      enabled: true
    },
    {
      name: language === 'en' ? 'Appeals Management' : 'Управління зверненнями',
      description: language === 'en' ? 'Review and respond to citizen appeals' : 'Розгляд та відповідь на звернення громадян',
      roles: ['admin', 'moderator', 'employee'],
      enabled: true
    },
    {
      name: language === 'en' ? 'Services Management' : 'Управління послугами',
      description: language === 'en' ? 'Add, edit, and manage city services' : 'Додавання, редагування та управління міськими послугами',
      roles: ['admin', 'employee'],
      enabled: true
    },
    {
      name: language === 'en' ? 'Analytics Access' : 'Доступ до аналітики',
      description: language === 'en' ? 'View system analytics and reports' : 'Перегляд системної аналітики та звітів',
      roles: ['admin', 'moderator'],
      enabled: false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Access Control' : 'Контроль доступу'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Total Rules' : 'Всього правил'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessRules.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Active Rules' : 'Активні правила'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {accessRules.filter(rule => rule.enabled).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Role Types' : 'Типи ролей'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Access Rules' : 'Правила доступу'}
            </h3>
            
            {accessRules.map((rule, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <div className="flex space-x-1">
                          {rule.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <Switch checked={rule.enabled} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
            <Button>
              {language === 'en' ? 'Save Changes' : 'Зберегти зміни'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessControlDialog;
