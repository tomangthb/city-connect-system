
import React, { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResourcesModule from '@/components/Resources/ResourcesModule';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import DocumentsModule from '@/components/Documents/DocumentsModule';
import AnalyticsModule from '@/components/Analytics/AnalyticsModule';
import AdminModule from '@/components/Admin/AdminModule';
import NewsModule from '@/components/News/NewsModule';
import UserAccountModule from '@/components/User/UserAccountModule';
import PaymentsModule from '@/components/Payments/PaymentsModule';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Index() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Wait for auth to load
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // User info
  const userType = profile?.user_type || 'resident';
  const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'User';

  // Determine which component to render based on activeTab and userType
  const renderContent = () => {
    if (userType === 'employee') {
      switch (activeTab) {
        case 'dashboard':
          return <EmployeeDashboard />;
        case 'resources':
          return <ResourcesModule />;
        case 'services':
          return <ServicesModule />;
        case 'appeals':
          return <AppealsModule />;
        case 'documents':
          return <DocumentsModule />;
        case 'analytics':
          return <AnalyticsModule />;
        case 'administration':
          return <AdminModule />;
        default:
          return <EmployeeDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ResidentDashboard />;
        case 'services':
          return <ServicesModule />;
        case 'appeals':
          return <AppealsModule />;
        case 'resources':
          return <ResourcesModule />;
        case 'news':
          return <NewsModule />;
        case 'account':
          return <UserAccountModule />;
        case 'payments':
          return <PaymentsModule />;
        default:
          return <ResidentDashboard />;
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        userType={userType as 'employee' | 'resident'} 
        userName={userName} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          userType={userType as 'employee' | 'resident'} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
