
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  userType: 'employee' | 'resident';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ userType, activeTab, onTabChange }: AppSidebarProps) => {
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          {userType === 'employee' ? t('employeePortal') : t('residentPortal')}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        'w-full justify-start',
                        activeTab === item.id 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
