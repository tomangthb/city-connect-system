
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { Server, Database, Wifi, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SystemStatusDialogProps {
  children: React.ReactNode;
}

const SystemStatusDialog = ({ children }: SystemStatusDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const systemServices = [
    { name: language === 'en' ? 'Web Server' : 'Веб-сервер', status: 'healthy', uptime: '99.9%', icon: Server },
    { name: language === 'en' ? 'Database' : 'База даних', status: 'healthy', uptime: '99.8%', icon: Database },
    { name: language === 'en' ? 'Network' : 'Мережа', status: 'warning', uptime: '98.5%', icon: Wifi },
    { name: language === 'en' ? 'Security' : 'Безпека', status: 'healthy', uptime: '100%', icon: Shield }
  ];

  const recentEvents = [
    { 
      time: '10:30', 
      event: language === 'en' ? 'Database backup completed' : 'Резервне копіювання БД завершено',
      type: 'success'
    },
    { 
      time: '09:15', 
      event: language === 'en' ? 'Network latency spike detected' : 'Виявлено сплеск затримки мережі',
      type: 'warning'
    },
    { 
      time: '08:00', 
      event: language === 'en' ? 'System maintenance completed' : 'Обслуговування системи завершено',
      type: 'info'
    }
  ];

  const handleRefreshStatus = async () => {
    try {
      await addActivity({
        title: language === 'en' ? 'System status refreshed' : 'Статус системи оновлено',
        description: 'Refreshed system status information',
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'System status refreshed' : 'Статус системи оновлено');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">{language === 'en' ? 'Healthy' : 'Здоровий'}</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">{language === 'en' ? 'Warning' : 'Попередження'}</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">{language === 'en' ? 'Error' : 'Помилка'}</Badge>;
      default:
        return <Badge variant="secondary">{language === 'en' ? 'Unknown' : 'Невідомо'}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'System Status' : 'Статус системи'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                {language === 'en' ? 'Overall System Health' : 'Загальний стан системи'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">98.8%</p>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'System Uptime' : 'Час роботи системи'}</p>
                </div>
                <Button onClick={handleRefreshStatus}>
                  {language === 'en' ? 'Refresh Status' : 'Оновити статус'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Service Status' : 'Статус сервісів'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {systemServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3 text-gray-600" />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{language === 'en' ? 'Uptime:' : 'Час роботи:'} {service.uptime}</p>
                        </div>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Recent Events' : 'Останні події'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-gray-50">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-mono">{event.time}</span>
                      <span className="ml-3">{event.event}</span>
                    </div>
                    {event.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {event.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {event.type === 'info' && <Clock className="h-4 w-4 text-blue-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SystemStatusDialog;
