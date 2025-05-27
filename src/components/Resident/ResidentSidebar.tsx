
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Building2, 
  MessageSquare, 
  Newspaper, 
  User, 
  CreditCard,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResidentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ResidentSidebar = ({ activeTab, onTabChange }: ResidentSidebarProps) => {
  const { language } = useLanguage();

  const menuItems = [
    {
      title: language === 'en' ? 'Home' : 'Головна',
      url: 'home',
      icon: Home,
    },
    {
      title: language === 'en' ? 'City Services' : 'Міські послуги',
      url: 'services',
      icon: Building2,
    },
    {
      title: language === 'en' ? 'Submit Appeal' : 'Подати звернення',
      url: 'appeals',
      icon: MessageSquare,
    },
    {
      title: language === 'en' ? 'City Resources' : 'Міські ресурси',
      url: 'resources',
      icon: Building2,
    },
    {
      title: language === 'en' ? 'News & Events' : 'Новини та події',
      url: 'news',
      icon: Newspaper,
    },
    {
      title: language === 'en' ? 'My Account' : 'Мій акаунт',
      url: 'account',
      icon: User,
    },
    {
      title: language === 'en' ? 'Payments' : 'Платежі',
      url: 'payments',
      icon: CreditCard,
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? 'City Council Portal' : 'Портал міської ради'}
            </h2>
            <p className="text-sm text-green-600 font-medium">
              {language === 'en' ? 'Resident Portal' : 'Портал громадянина'}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {language === 'en' ? 'Navigation' : 'Навігація'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.url)}
                    isActive={activeTab === item.url}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.url ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className={`${activeTab === item.url ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ResidentSidebar;
