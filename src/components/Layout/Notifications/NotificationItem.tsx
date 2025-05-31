
import React from 'react';
import { Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

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
  
  return (
    <div 
      className={`p-4 hover:bg-gray-800 cursor-pointer transition-all duration-200 border-l-4 ${
        isRead 
          ? 'bg-gray-900 border-l-gray-600' 
          : 'bg-gray-800/50 border-l-blue-500 shadow-sm'
      }`}
      onClick={() => !isRead && onMarkAsRead(id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-medium text-sm leading-tight ${
          isRead ? 'text-gray-300' : 'text-white'
        }`}>
          {title}
        </h4>
        <div className="flex items-center gap-2 ml-3">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          {!isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(id);
              }}
              className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
              title={t('markAsRead') || 'Позначити як прочитане'}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <p className={`text-xs leading-relaxed ${
        isRead ? 'text-gray-500' : 'text-gray-300'
      }`}>
        {message}
      </p>
      {!isRead && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
};

export default NotificationItem;
