
import React from 'react';
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
      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isRead ? 'bg-white' : 'bg-blue-50'
      }`}
      onClick={() => onMarkAsRead(id)}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">{title}</h4>
        <span className="text-xs text-gray-500">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-1">{message}</p>
    </div>
  );
};

export default NotificationItem;
