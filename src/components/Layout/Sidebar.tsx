
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

interface SidebarProps {
  userType: 'employee' | 'resident';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const employeeMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'resources', label: 'Resource Management', icon: Map },
  { id: 'services', label: 'City Services', icon: FileText },
  { id: 'appeals', label: 'Citizens Appeals', icon: MessageSquare },
  { id: 'documents', label: 'Document Management', icon: FileText },
  { id: 'analytics', label: 'Analytics & Reports', icon: Calendar },
  { id: 'administration', label: 'Administration', icon: Settings },
];

const residentMenuItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'services', label: 'City Services', icon: FileText },
  { id: 'appeals', label: 'Submit Appeal', icon: MessageSquare },
  { id: 'resources', label: 'City Resources', icon: Map },
  { id: 'news', label: 'News & Events', icon: Calendar },
  { id: 'account', label: 'My Account', icon: User },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const Sidebar = ({ userType, activeTab, onTabChange }: SidebarProps) => {
  const menuItems = userType === 'employee' ? employeeMenuItems : residentMenuItems;

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
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
  );
};

export default Sidebar;
