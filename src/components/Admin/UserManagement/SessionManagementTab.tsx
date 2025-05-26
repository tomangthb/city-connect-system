
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monitor, Smartphone, Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const SessionManagementTab = () => {
  const { language } = useLanguage();
  
  // Mock active sessions data
  const [sessions] = useState([
    {
      id: '1',
      user: { name: 'Іван Петренко', email: 'ivan.petrenko@example.com' },
      device: 'Chrome на Windows',
      location: 'Львів, Україна',
      ipAddress: '192.168.1.100',
      loginTime: '2024-01-15 09:30:00',
      lastActivity: '2024-01-15 14:25:00',
      status: 'active',
      deviceType: 'desktop'
    },
    {
      id: '2', 
      user: { name: 'Марія Коваленко', email: 'maria.kovalenko@example.com' },
      device: 'Safari на iPhone',
      location: 'Львів, Україна',
      ipAddress: '192.168.1.101',
      loginTime: '2024-01-15 08:15:00',
      lastActivity: '2024-01-15 14:20:00',
      status: 'active',
      deviceType: 'mobile'
    },
    {
      id: '3',
      user: { name: 'Олександр Савченко', email: 'alex.savchenko@example.com' },
      device: 'Firefox на Linux',
      location: 'Львів, Україна',
      ipAddress: '192.168.1.102',
      loginTime: '2024-01-15 10:00:00',
      lastActivity: '2024-01-15 12:00:00',
      status: 'idle',
      deviceType: 'desktop'
    }
  ]);

  const handleTerminateSession = (sessionId: string) => {
    if (confirm(language === 'en' ? 'Are you sure you want to terminate this session?' : 'Ви впевнені, що хочете завершити цю сесію?')) {
      toast.success(language === 'en' ? 'Session terminated successfully' : 'Сесію успішно завершено');
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">{language === 'en' ? 'Active' : 'Активна'}</Badge>;
      case 'idle':
        return <Badge variant="secondary">{language === 'en' ? 'Idle' : 'Неактивна'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {language === 'en' ? 'Active User Sessions' : 'Активні сесії користувачів'}
            </span>
            <Badge variant="outline">
              {sessions.length} {language === 'en' ? 'active sessions' : 'активних сесій'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {getDeviceIcon(session.deviceType)}
                      </div>
                      <div>
                        <h3 className="font-medium">{session.user.name}</h3>
                        <p className="text-sm text-gray-600">{session.user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{session.device}</span>
                          <span className="text-xs text-gray-500">{session.location}</span>
                          <span className="text-xs text-gray-500">{session.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(session.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === 'en' ? 'Login:' : 'Вхід:'} {session.loginTime}
                        </p>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'Last activity:' : 'Остання активність:'} {session.lastActivity}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Session Statistics' : 'Статистика сесій'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">
                {language === 'en' ? 'Active Sessions' : 'Активні сесії'}
              </h3>
              <p className="text-2xl font-bold text-green-900">
                {sessions.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800">
                {language === 'en' ? 'Idle Sessions' : 'Неактивні сесії'}
              </h3>
              <p className="text-2xl font-bold text-yellow-900">
                {sessions.filter(s => s.status === 'idle').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">
                {language === 'en' ? 'Total Sessions' : 'Загальна кількість сесій'}
              </h3>
              <p className="text-2xl font-bold text-blue-900">{sessions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManagementTab;
