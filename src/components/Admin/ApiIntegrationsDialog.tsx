
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Key, Plus, Settings, Eye, EyeOff } from 'lucide-react';

interface ApiIntegrationsDialogProps {
  children: React.ReactNode;
}

const ApiIntegrationsDialog = ({ children }: ApiIntegrationsDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const apiIntegrations = [
    {
      id: 'payment-gateway',
      name: language === 'en' ? 'Payment Gateway' : 'Платіжний шлюз',
      description: language === 'en' ? 'Process online payments for services' : 'Обробка онлайн-платежів за послуги',
      status: 'active',
      apiKey: 'pk_live_xxxxxxxxxxxxxxxxxxx',
      lastUsed: '2024-05-25'
    },
    {
      id: 'email-service',
      name: language === 'en' ? 'Email Service' : 'Поштова служба',
      description: language === 'en' ? 'Send notifications and communications' : 'Надсилання сповіщень та повідомлень',
      status: 'active',
      apiKey: 'sg_xxxxxxxxxxxxxxxxxxx',
      lastUsed: '2024-05-26'
    },
    {
      id: 'sms-gateway',
      name: language === 'en' ? 'SMS Gateway' : 'SMS шлюз',
      description: language === 'en' ? 'Send SMS notifications to citizens' : 'Надсилання SMS сповіщень громадянам',
      status: 'inactive',
      apiKey: '',
      lastUsed: 'Never'
    },
    {
      id: 'maps-api',
      name: language === 'en' ? 'Maps API' : 'API карт',
      description: language === 'en' ? 'Display interactive city maps and locations' : 'Відображення інтерактивних карт міста та локацій',
      status: 'active',
      apiKey: 'AIzaSyxxxxxxxxxxxxxxxxx',
      lastUsed: '2024-05-26'
    }
  ];

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskApiKey = (key: string) => {
    if (!key) return language === 'en' ? 'Not configured' : 'Не налаштовано';
    return key.substring(0, 8) + 'x'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            {language === 'en' ? 'API Integrations' : 'API інтеграції'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Manage API keys and third-party service integrations' 
                : 'Керуйте ключами API та інтеграціями сторонніх сервісів'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Integration' : 'Додати інтеграцію'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'en' ? 'Total Integrations' : 'Всього інтеграцій'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiIntegrations.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'en' ? 'Active' : 'Активні'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {apiIntegrations.filter(api => api.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'en' ? 'Inactive' : 'Неактивні'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {apiIntegrations.filter(api => api.status === 'inactive').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {language === 'en' ? 'Last Updated' : 'Останнє оновлення'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {language === 'en' ? 'Today' : 'Сьогодні'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {apiIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        <Badge 
                          variant={integration.status === 'active' ? 'default' : 'secondary'}
                          className={integration.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {integration.status === 'active' ? 
                            (language === 'en' ? 'Active' : 'Активно') : 
                            (language === 'en' ? 'Inactive' : 'Неактивно')
                          }
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Configure' : 'Налаштувати'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`api-key-${integration.id}`}>
                        {language === 'en' ? 'API Key' : 'Ключ API'}
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`api-key-${integration.id}`}
                          type={showKeys[integration.id] ? 'text' : 'password'}
                          value={showKeys[integration.id] ? integration.apiKey : maskApiKey(integration.apiKey)}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(integration.id)}
                        >
                          {showKeys[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {language === 'en' ? 'Last Used' : 'Останнє використання'}
                      </Label>
                      <div className="text-sm text-gray-600 py-2">
                        {integration.lastUsed === 'Never' ? 
                          (language === 'en' ? 'Never' : 'Ніколи') : 
                          integration.lastUsed
                        }
                      </div>
                    </div>
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

export default ApiIntegrationsDialog;
