
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface KPICardProps {
  title: string;
  value: string | number;
  target?: number;
  change?: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

const KPICard = ({ title, value, target, change, icon: Icon, color, onClick }: KPICardProps) => {
  const { t } = useLanguage();
  const isPositiveChange = change && change > 0;
  const changePercent = target && typeof value === 'number' ? ((value / target) * 100).toFixed(1) : null;

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {target && (
              <p className="text-xs text-gray-500">{t('target')}: {target}</p>
            )}
            {change && (
              <div className="flex items-center mt-1">
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? '+' : ''}{change}
                </span>
              </div>
            )}
            {changePercent && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${parseFloat(changePercent) >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(parseFloat(changePercent), 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
