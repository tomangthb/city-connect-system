
import React, { useState, useEffect } from 'react';
import { Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu/UserMenu';
import LanguageToggle from './LanguageToggle/LanguageToggle';
import NotificationsPopover from './Notifications/NotificationsPopover';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  userType: 'employee' | 'resident';
  userName: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

const Header = ({ userType, userName }: HeaderProps) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Supabase
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Convert Supabase notifications to component format
  useEffect(() => {
    if (notificationsData) {
      const formattedNotifications: Notification[] = notificationsData.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.content,
        isRead: notif.is_read || false,
        timestamp: new Date(notif.created_at || Date.now())
      }));
      setNotifications(formattedNotifications);
    }
  }, [notificationsData]);

  // Create sample notifications if none exist (for demo purposes)
  useEffect(() => {
    if (notifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: language === 'en' ? 'New Appeal Submitted' : 'Подано нове звернення',
          message: language === 'en' ? 'A citizen has submitted a new appeal regarding street lighting.' : 'Громадянин подав нове звернення щодо вуличного освітлення.',
          isRead: false,
          timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
        },
        {
          id: '2',
          title: language === 'en' ? 'System Update' : 'Оновлення системи',
          message: language === 'en' ? 'The system will undergo maintenance tonight from 2-4 AM.' : 'Система буде на технічному обслуговуванні сьогодні вночі з 2 до 4 ранку.',
          isRead: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: '3',
          title: language === 'en' ? 'Monthly Report Ready' : 'Щомісячний звіт готовий',
          message: language === 'en' ? 'Your monthly performance report is now available for download.' : 'Ваш щомісячний звіт про продуктивність тепер доступний для завантаження.',
          isRead: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        }
      ];
      setNotifications(sampleNotifications);
    }
  }, [language, notifications.length]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {userType === 'employee' ? t('employeePortal') : t('residentPortal')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          
          {/* Functional Notifications Bell */}
          <NotificationsPopover 
            notifications={notifications}
            setNotifications={setNotifications}
          />
          
          <UserMenu userName={userName} />
        </div>
      </div>
    </header>
  );
};

export default Header;
