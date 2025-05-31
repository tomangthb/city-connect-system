
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ResidentSidebar from '@/components/Resident/ResidentSidebar';
import ResidentHeader from '@/components/Resident/ResidentHeader';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import ResidentServicesModule from '@/components/Resident/ResidentServicesModule';
import ResidentAppealsModule from '@/components/Resident/ResidentAppealsModule';
import ResidentNewsModule from '@/components/Resident/ResidentNewsModule';
import ResidentAccountModule from '@/components/Resident/ResidentAccountModule';
import ResidentPaymentsModule from '@/components/Resident/ResidentPaymentsModule';
import ResidentResourcesModule from '@/components/Resident/ResidentResourcesModule';
import { useResidentNotifications } from '@/hooks/useResidentNotifications';

const ResidentPortal = () => {
  const { t } = useLanguage();
  const { user, loading, userType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, setNotifications } = useResidentNotifications();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const path = location.pathname;
    
    // Set activeTab based on current path
    if (path === '/resident-portal') {
      setActiveTab('home');
    } else if (path.startsWith('/resident-')) {
      const tab = path.replace('/resident-', '');
      setActiveTab(tab);
    } else {
      setActiveTab('home');
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center theme-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/resident-auth" replace />;
  }

  if (userType === 'employee') {
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const routePath = tab === 'home' ? '/resident-portal' : `/resident-${tab}`;
    navigate(routePath);
  };

  const handleLogout = async () => {
    const { signOut } = useAuth();
    await signOut();
    navigate('/resident-auth');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <ResidentDashboard />;
      case 'services':
        return <ResidentServicesModule />;
      case 'appeals':
        return <ResidentAppealsModule />;
      case 'resources':
        return <ResidentResourcesModule />;
      case 'news':
        return <ResidentNewsModule />;
      case 'account':
        return <ResidentAccountModule />;
      case 'payments':
        return <ResidentPaymentsModule />;
      default:
        return <ResidentDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background theme-transition">
        <ResidentSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <SidebarInset className="flex-1">
          <ResidentHeader 
            userName={user?.email || 'User'}
            notifications={notifications}
            setNotifications={setNotifications}
            onLogout={handleLogout}
          />
          <main className="p-6 bg-background theme-transition">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ResidentPortal;
