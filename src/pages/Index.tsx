
import React, { useState } from 'react';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import EmployeeDashboard from '@/components/Employee/EmployeeDashboard';
import ResidentDashboard from '@/components/Resident/ResidentDashboard';
import ServicesModule from '@/components/Services/ServicesModule';
import AppealsModule from '@/components/Appeals/AppealsModule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [userType, setUserType] = useState<'employee' | 'resident' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login selection screen
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">City Council Information System</h1>
            <p className="text-xl text-gray-600">Select your user type to access the portal</p>
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
                <CardTitle className="text-2xl text-blue-900">Employee Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">Access administrative tools, manage city resources, and handle citizen requests efficiently.</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Dashboard with KPIs and analytics</li>
                  <li>• Resource and service management</li>
                  <li>• Citizens appeals processing</li>
                  <li>• Document management system</li>
                  <li>• Reporting and administration tools</li>
                </ul>
                <Button className="w-full mt-6">Access Employee Portal</Button>
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
                <CardTitle className="text-2xl text-green-900">Resident Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">Access city services, submit requests, and stay informed about community news and events.</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Personal dashboard and account</li>
                  <li>• Access to city services</li>
                  <li>• Submit appeals and requests</li>
                  <li>• City news and events</li>
                  <li>• Interactive city map and resources</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Access Resident Portal</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Need help? Contact support at support@citycouncil.gov or call (555) 123-4567
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
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {userType === 'employee' ? 'Resource Management' : 'City Resources'}
            </h2>
            <p className="text-gray-600">Resource management module will be implemented here.</p>
          </div>
        );
      case 'documents':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Management</h2>
            <p className="text-gray-600">Document management system will be implemented here.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">Analytics and reporting module will be implemented here.</p>
          </div>
        );
      case 'administration':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Administration</h2>
            <p className="text-gray-600">Administration and settings module will be implemented here.</p>
          </div>
        );
      case 'news':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">News & Events</h2>
            <p className="text-gray-600">News and events module will be implemented here.</p>
          </div>
        );
      case 'account':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Account</h2>
            <p className="text-gray-600">Personal account management will be implemented here.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payments</h2>
            <p className="text-gray-600">Payment system will be implemented here.</p>
          </div>
        );
      default:
        return userType === 'employee' ? <EmployeeDashboard /> : <ResidentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userType={userType} userName={userType === 'employee' ? 'Admin User' : 'John Doe'} />
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
