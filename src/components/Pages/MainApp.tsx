
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import AppSidebar from '@/components/Layout/AppSidebar';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import ResourcesModule from '@/components/Resources/ResourcesModule';
import ResourcesManagement from '@/components/Resources/ResourcesManagement';
import NewsModule from '@/components/News/NewsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Analytics/AnalyticsModule';
import AdminModule from '@/components/Admin/AdminModule';
import UserAccountModule from '@/components/User/UserAccountModule';
import PaymentsModule from '@/components/Payments/PaymentsModule';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface MainAppProps {
  userType: 'employee' | 'resident';
}

const MainApp = ({ userType }: MainAppProps) => {
  const { user } = useAuth();
  const { notifications, setNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const renderContent = () => {
    if (showProfileSettings) {
      return <ProfileSettings />;
    }

    switch (activeTab) {
      case 'dashboard':
        return userType === 'employee' ? (
          <EmployeeDashboard onTabChange={setActiveTab} onOpenSettings={handleOpenSettings} />
        ) : (
          <ResidentDashboard />
        );
      case 'services':
        return <ServicesModule userType={userType} />;
      case 'appeals':
        return <AppealsModule userType={userType} />;
      case 'resources':
        return userType === 'employee' ? <ResourcesManagement /> : <ResourcesModule userType={userType} />;
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
        return userType === 'employee' ? (
          <EmployeeDashboard onTabChange={setActiveTab} onOpenSettings={handleOpenSettings} />
        ) : (
          <ResidentDashboard />
        );
    }
  };

  const handleOpenSettings = () => {
    setShowProfileSettings(true);
    setActiveTab('');
  };

  const handleTabChange = (tab: string) => {
    setShowProfileSettings(false);
    setActiveTab(tab);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar 
          userType={userType} 
          activeTab={showProfileSettings ? 'settings' : activeTab} 
          onTabChange={handleTabChange} 
        />
        <SidebarInset className="flex flex-col">
          <Header 
            userType={userType} 
            userName={user ? `${user.email}` : (userType === 'employee' ? 'Admin User' : 'John Doe')}
            notifications={notifications}
            setNotifications={setNotifications}
            onOpenSettings={handleOpenSettings}
          />
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainApp;
