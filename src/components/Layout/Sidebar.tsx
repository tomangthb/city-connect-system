
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Settings, 
  Map,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface SidebarProps {
  userType: 'employee' | 'resident';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ userType, activeTab, onTabChange }: SidebarProps) => {
  const { t } = useLanguage();

  const employeeMenuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'resources', label: t('resourceManagement'), icon: Map },
    { id: 'services', label: t('cityServices'), icon: FileText },
    { id: 'appeals', label: t('citizensAppeals'), icon: MessageSquare },
    { id: 'documents', label: t('documentManagement'), icon: FileText },
    { id: 'analytics', label: t('analyticsReports'), icon: Calendar },
    { id: 'administration', label: t('administration'), icon: Settings },
  ];

  const residentMenuItems = [
    { id: 'dashboard', label: t('home'), icon: Home },
    { id: 'services', label: t('cityServices'), icon: FileText },
    { id: 'appeals', label: t('submitAppeal'), icon: MessageSquare },
    { id: 'resources', label: t('cityResources'), icon: Map },
    { id: 'news', label: t('newsEvents'), icon: Calendar },
    { id: 'account', label: t('myAccount'), icon: User },
    { id: 'payments', label: t('payments'), icon: CreditCard },
  ];

  const menuItems = userType === 'employee' ? employeeMenuItems : residentMenuItems;

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {userType === 'employee' ? t('employeePortal') : t('residentPortal')}
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
