
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import ResourcesModule from '@/components/Resources/ResourcesModule';
import NewsModule from '@/components/News/NewsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Analytics/AnalyticsModule';
import AdminModule from '@/components/Admin/AdminModule';
import UserAccountModule from '@/components/User/UserAccountModule';
import PaymentsModule from '@/components/Payments/PaymentsModule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const Index = () => {
  const [userType, setUserType] = useState<'employee' | 'resident' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { language, setLanguage, t } = useLanguage();

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  // Login selection screen
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('appTitle')}</h1>
            <p className="text-xl text-gray-600">{t('selectUserType')}</p>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              {language === 'en' ? t('ukrainian') : t('english')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee Portal */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserType('employee')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0h4" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-blue-900">{t('employeePortal')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">{language === 'en' ? 
                  'Access administrative tools, manage city resources, and handle citizen requests efficiently.' : 
                  'Доступ до адміністративних інструментів, управління міськими ресурсами та ефективне опрацювання запитів громадян.'}
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>{language === 'en' ? '• Dashboard with KPIs and analytics' : '• Панель управління з KPI та аналітикою'}</li>
                  <li>{language === 'en' ? '• Resource and service management' : '• Управління ресурсами та послугами'}</li>
                  <li>{language === 'en' ? '• Citizens appeals processing' : '• Обробка звернень громадян'}</li>
                  <li>{language === 'en' ? '• Document management system' : '• Система управління документами'}</li>
                  <li>{language === 'en' ? '• Reporting and administration tools' : '• Інструменти звітності та адміністрування'}</li>
                </ul>
                <Button className="w-full mt-6">{t('accessEmployeePortal')}</Button>
              </CardContent>
            </Card>

            {/* Resident Portal */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserType('resident')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl text-green-900">{t('residentPortal')}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">{language === 'en' ? 
                  'Access city services, submit requests, and stay informed about community news and events.' : 
                  'Доступ до міських послуг, подання запитів та отримання інформації про новини та події громади.'}
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>{language === 'en' ? '• Personal dashboard and account' : '• Особиста панель та обліковий запис'}</li>
                  <li>{language === 'en' ? '• Access to city services' : '• Доступ до міських послуг'}</li>
                  <li>{language === 'en' ? '• Submit appeals and requests' : '• Подання звернень та запитів'}</li>
                  <li>{language === 'en' ? '• City news and events' : '• Міські новини та події'}</li>
                  <li>{language === 'en' ? '• Interactive city map and resources' : '• Інтерактивна карта міста та ресурси'}</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">{t('accessResidentPortal')}</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              {t('needHelp')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return userType === 'employee' ? <EmployeeDashboard /> : <ResidentDashboard />;
      case 'services':
        return <ServicesModule userType={userType} />;
      case 'appeals':
        return <AppealsModule userType={userType} />;
      case 'resources':
        return <ResourcesModule userType={userType} />;
      case 'documents':
        return <DocumentsModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'administration':
        return <AdminModule />;
      case 'news':
        return <NewsModule />;
      case 'account':
        return <UserAccountModule />;
      case 'payments':
        return <PaymentsModule />;
      default:
        return userType === 'employee' ? <EmployeeDashboard /> : <ResidentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userType={userType} 
        userName={userType === 'employee' ? 'Admin User' : 'John Doe'} 
      />
      <div className="flex flex-1">
        <Sidebar userType={userType} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
