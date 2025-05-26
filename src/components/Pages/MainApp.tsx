import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '@/components/Layout/AppSidebar';
import AppHeader from '@/components/Layout/AppHeader';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import InfrastructureModule from '@/components/Employee/Infrastructure/InfrastructureModule';
import ResourcesModule from '@/components/Resident/ResourcesModule';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Employee/Analytics/AnalyticsModule';
import AdministrationModule from '@/components/Employee/Administration/AdministrationModule';
import NewsEventsModule from '@/components/Resident/NewsEventsModule';
import AccountSettingsModule from '@/components/Resident/Account/AccountSettingsModule';
import PaymentsModule from '@/components/Resident/Payments/PaymentsModule';

interface MainAppProps {
  userType: 'employee' | 'resident';
}

const MainApp = ({ userType }: MainAppProps) => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    logout();
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
          <ResourcesModule />
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
        return <AdministrationModule />;
      case 'news':
        return <NewsEventsModule />;
      case 'account':
        return <AccountSettingsModule />;
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
        <AppHeader userType={userType} onLogout={handleLogout} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
