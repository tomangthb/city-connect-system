
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Zap, BarChart3, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Asset {
  id: string;
  status: string;
  value?: number;
}

interface InfrastructureStatsProps {
  assets: Asset[];
}

const InfrastructureStats: React.FC<InfrastructureStatsProps> = ({ assets }) => {
  const { language } = useLanguage();

  const getStats = () => {
    const total = assets.length;
    const active = assets.filter(a => a.status === 'Active').length;
    const maintenance = assets.filter(a => a.status === 'Under Maintenance').length;
    const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
    
    return { total, active, maintenance, totalValue };
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Total Assets' : 'Всього активів'}
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Active' : 'Активні'}
              </p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Maintenance' : 'На ТО'}
              </p>
              <p className="text-2xl font-bold">{stats.maintenance}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Total Value' : 'Загальна вартість'}
              </p>
              <p className="text-2xl font-bold">
                {stats.totalValue.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureStats;
