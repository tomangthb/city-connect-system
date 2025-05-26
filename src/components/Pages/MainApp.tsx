
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/Layout/AppSidebar';
import Header from '@/components/Layout/Header';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import InfrastructureModule from '@/components/Infrastructure/InfrastructureModule';
import ResourcesModule from '@/components/Resources/ResourcesModule';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Analytics/AnalyticsModule';
import AdminModule from '@/components/Admin/AdminModule';
import NewsModule from '@/components/News/NewsModule';
import UserAccountModule from '@/components/User/UserAccountModule';
import PaymentsModule from '@/components/Payments/PaymentsModule';
import { useNotifications } from '@/hooks/useNotifications';

interface MainAppProps {
  userType: 'employee' | 'resident';
}

const MainApp = ({ userType }: MainAppProps) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, setNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState(
    userType === 'employee' ? 'dashboard' : 'home'
  );

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  const handleLogout = () => {
    signOut();
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return userType === 'employee' ? (
          <EmployeeDashboard />
        ) : (
          <ResidentDashboard />
        );
      case 'resources':
        return userType === 'employee' ? (
          <InfrastructureModule />
        ) : (
          <ResourcesModule userType={userType} />
        );
      case 'services':
      case 'services-catalog':
      case 'housing-utilities':
      case 'permits-registration':
      case 'social-services':
      case 'transport-traffic':
      case 'education':
      case 'land-planning':
      case 'environmental':
        return <ServicesModule userType={userType} activeTab={activeTab} />;
      case 'appeals':
        return <AppealsModule userType={userType} />;
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
        return <div>{t('pageNotFound') || 'Page Not Found'}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppSidebar userType={userType} activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="ml-64">
        <Header 
          userType={userType} 
          userName={user?.email || 'User'}
          notifications={notifications}
          setNotifications={setNotifications}
          onOpenSettings={() => handleTabChange('account')}
        />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
