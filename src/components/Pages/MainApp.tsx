
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Layout/AppSidebar';
import ResidentSidebar from '@/components/Layout/ResidentSidebar';
import Header from '@/components/Layout/Header';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import ResidentServicesModule from '@/components/Resident/ResidentServicesModule';
import InfrastructureModule from '@/components/Infrastructure/InfrastructureModule';
import ResourcesModule from '@/components/Resources/ResourcesModule';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Analytics/AnalyticsModule';
import AdminModule from '@/components/Admin/AdminModule';
import NewsModule from '@/components/News/NewsModule';
import ProfileSettings from '@/components/Profile/ProfileSettings';
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
    userType === 'employee' ? 'dashboard' : 'dashboard'
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowSettings(false);
    navigate(`/${tab}`);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    setActiveTab('account');
  };

  const handleLogout = () => {
    signOut();
    navigate('/auth');
  };

  const renderContent = () => {
    if (showSettings || activeTab === 'account') {
      return <ProfileSettings />;
    }

    // Resident-specific rendering
    if (userType === 'resident') {
      switch (activeTab) {
        case 'dashboard':
          return <ResidentDashboard />;
        case 'services':
        case 'services-catalog':
        case 'housing-utilities':
        case 'permits-registration':
        case 'social-services':
        case 'transport-traffic':
        case 'education':
        case 'land-planning':
        case 'environmental':
          return <ResidentServicesModule />;
        case 'appeals':
          return <AppealsModule userType={userType} />;
        case 'resources':
          return <ResourcesModule userType={userType} />;
        case 'news':
          return <NewsModule />;
        case 'payments':
          return <PaymentsModule />;
        default:
          return <div>{t('pageNotFound') || 'Page Not Found'}</div>;
      }
    }

    // Employee-specific rendering
    switch (activeTab) {
      case 'dashboard':
        return <EmployeeDashboard onTabChange={handleTabChange} onOpenSettings={handleOpenSettings} />;
      case 'resources':
        return <InfrastructureModule />;
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
        return <AdminModule onOpenSettings={handleOpenSettings} />;
      case 'news':
        return <NewsModule />;
      case 'payments':
        return <PaymentsModule />;
      default:
        return <div>{t('pageNotFound') || 'Page Not Found'}</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100">
        {userType === 'employee' ? (
          <AppSidebar userType={userType} activeTab={activeTab} onTabChange={handleTabChange} />
        ) : (
          <ResidentSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        <SidebarInset>
          <Header 
            userType={userType} 
            userName={user?.email || 'User'}
            notifications={notifications}
            setNotifications={setNotifications}
            onOpenSettings={handleOpenSettings}
          />
          <main className="p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainApp;
