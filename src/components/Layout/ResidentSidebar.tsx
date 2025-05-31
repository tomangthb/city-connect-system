
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
  Building,
  Users,
  Truck,
  GraduationCap,
  MapPin,
  Leaf,
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

interface ResidentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ResidentSidebar = ({ activeTab, onTabChange }: ResidentSidebarProps) => {
  const { t } = useLanguage();
  const [isServicesOpen, setIsServicesOpen] = React.useState(true);

  const residentMenuItems = [
    { id: 'dashboard', label: t('home') || 'Home', icon: Home },
    { 
      id: 'services', 
      label: t('cityServices') || 'City Services', 
      icon: FileText,
      hasSubmenu: true,
      submenu: [
        { id: 'services-catalog', label: t('servicesCatalog') || 'Services Catalog', icon: FileText },
        { id: 'housing-utilities', label: t('housingUtilities') || 'Housing & Utilities', icon: Building },
        { id: 'permits-registration', label: t('permitsRegistration') || 'Permits & Registration', icon: FileText },
        { id: 'social-services', label: t('socialServices') || 'Social Services', icon: Users },
        { id: 'transport-traffic', label: t('transportTraffic') || 'Transport & Traffic', icon: Truck },
        { id: 'education', label: t('education') || 'Education', icon: GraduationCap },
        { id: 'land-planning', label: t('landUsePlanning') || 'Land Use & Planning', icon: MapPin },
        { id: 'environmental', label: t('environmentalServices') || 'Environmental Services', icon: Leaf }
      ]
    },
    { id: 'appeals', label: t('submitAppeal') || 'Submit Appeal', icon: MessageSquare },
    { id: 'resources', label: t('cityResources') || 'City Resources', icon: Map },
    { id: 'news', label: t('newsEvents') || 'News & Events', icon: Calendar },
    { id: 'payments', label: t('payments') || 'Payments', icon: CreditCard },
    { id: 'account', label: t('myAccount') || 'My Account', icon: User },
  ];

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    
    if (item.hasSubmenu) {
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
          {t('residentPortal') || 'Resident Portal'}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {residentMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ResidentSidebar;
