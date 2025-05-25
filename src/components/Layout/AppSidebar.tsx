
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
  CreditCard,
  ChevronDown,
  ChevronRight
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AppSidebarProps {
  userType: 'employee' | 'resident';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ userType, activeTab, onTabChange }: AppSidebarProps) => {
  const { t } = useLanguage();
  const [isServicesOpen, setIsServicesOpen] = React.useState(true);

  const employeeMenuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'resources', label: t('resourceManagement'), icon: Map },
    { 
      id: 'services', 
      label: t('cityServices'), 
      icon: FileText,
      hasSubmenu: true,
      submenu: [
        { id: 'appeals', label: t('citizensAppeals'), icon: MessageSquare }
      ]
    },
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

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    
    if (item.hasSubmenu && userType === 'employee') {
      return (
        <SidebarMenuItem key={item.id}>
          <Collapsible open={isServicesOpen} onOpenChange={setIsServicesOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full justify-between',
                  activeTab === item.id 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {isServicesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6 mt-1">
              {item.submenu?.map((subItem: any) => {
                const SubIcon = subItem.icon;
                return (
                  <SidebarMenuButton
                    key={subItem.id}
                    isActive={activeTab === subItem.id}
                    onClick={() => onTabChange(subItem.id)}
                    className={cn(
                      'w-full justify-start',
                      activeTab === subItem.id 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <SubIcon className="h-4 w-4" />
                    <span>{subItem.label}</span>
                  </SidebarMenuButton>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      );
    }

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
  };

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
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
