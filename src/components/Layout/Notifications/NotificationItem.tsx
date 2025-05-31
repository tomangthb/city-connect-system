
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Clock, Circle } from 'lucide-react';

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ 
  id, 
  title, 
  message, 
  isRead, 
  timestamp, 
  onMarkAsRead 
}: NotificationItemProps) => {
  const { t } = useLanguage();
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'щойно';
    if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} год тому`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн тому`;
    
    return date.toLocaleDateString('uk-UA', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div 
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
        isRead 
          ? 'bg-white dark:bg-gray-900' 
          : 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-500'
      }`}
      onClick={() => onMarkAsRead(id)}
    >
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {!isRead && (
            <Circle className="h-2 w-2 text-blue-500 mt-2 flex-shrink-0 fill-current" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={`text-sm font-medium truncate ${
                isRead 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-2 flex-shrink-0">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimestamp(timestamp)}
              </span>
            </div>
            <p className={`text-xs line-clamp-2 ${
              isRead 
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
