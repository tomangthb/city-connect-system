
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Plus, 
  BarChart3,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceCard from './ServiceCard';
import CreateServiceDialog from './CreateServiceDialog';
import MetricsChart from '../Employee/MetricsChart';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
  activeTab?: string;
}

const ServicesModule = ({ userType, activeTab = 'services' }: ServicesModuleProps) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch services
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    if (!services) return [];
    const uniqueCategories = [...new Set(services.map(s => language === 'en' ? s.category : s.category_uk))];
    return [
      { value: 'all', label: language === 'en' ? 'All Categories' : 'Всі категорії' },
      ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
    ];
  }, [services, language]);

  // Filter services
  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    return services.filter(service => {
      const nameMatch = (language === 'en' ? service.name : service.name_uk)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || 
        (language === 'en' ? service.category : service.category_uk) === selectedCategory;
      
      const statusMatch = selectedStatus === 'all' || service.status === selectedStatus;
      
      return nameMatch && categoryMatch && statusMatch;
    });
  }, [services, searchTerm, selectedCategory, selectedStatus, language]);

  // Group services by category for chart
  const servicesByCategory = React.useMemo(() => {
    if (!services) return [];
    
    const categoryGroups: { [key: string]: number } = {};
    
    services.forEach(service => {
      const category = language === 'en' ? service.category : service.category_uk;
      categoryGroups[category] = (categoryGroups[category] || 0) + 1;
    });
    
    return Object.entries(categoryGroups).map(([name, value], index) => ({
      name,
      value,
      percentage: Math.round((value / services.length) * 100)
    }));
  }, [services, language]);

  const handleServiceUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          {language === 'en' ? 'Loading services...' : 'Завантаження послуг...'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'City Services' : 'Міські послуги'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Browse and manage city services' 
              : 'Переглядайте та керуйте міськими послугами'}
          </p>
        </div>
        {userType === 'employee' && (
          <CreateServiceDialog onServiceCreated={handleServiceUpdated}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Service' : 'Додати послугу'}
            </Button>
          </CreateServiceDialog>
        )}
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">
            {language === 'en' ? 'Services' : 'Послуги'}
          </TabsTrigger>
          {userType === 'employee' && (
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Analytics' : 'Аналітика'}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === 'en' ? 'Search services...' : 'Пошук послуг...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">
                      {language === 'en' ? 'All Status' : 'Всі статуси'}
                    </option>
                    <option value="Available">
                      {language === 'en' ? 'Available' : 'Доступні'}
                    </option>
                    <option value="Unavailable">
                      {language === 'en' ? 'Unavailable' : 'Недоступні'}
                    </option>
                    <option value="Maintenance">
                      {language === 'en' ? 'Under Maintenance' : 'На обслуговуванні'}
                    </option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                userType={userType}
                onServiceUpdated={handleServiceUpdated}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {language === 'en' ? 'No services found' : 'Послуги не знайдено'}
              </div>
              <p className="text-gray-400">
                {language === 'en' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Спробуйте змінити параметри пошуку або фільтра'}
              </p>
            </div>
          )}
        </TabsContent>

        {userType === 'employee' && (
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {language === 'en' ? 'Total Services' : 'Всього послуг'}
                      </p>
                      <p className="text-3xl font-bold">{services?.length || 0}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {language === 'en' ? 'Available' : 'Доступні'}
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {services?.filter(s => s.status === 'Available').length || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {language === 'en' ? 'Average Rating' : 'Середня оцінка'}
                      </p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {services?.length ? 
                          (services.reduce((sum, s) => sum + (s.average_rating || 0), 0) / services.length).toFixed(1) : 
                          '0.0'
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {language === 'en' ? 'Total Reviews' : 'Всього відгуків'}
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {services?.reduce((sum, s) => sum + (s.total_reviews || 0), 0) || 0}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsChart 
                title={language === 'en' ? 'Service Distribution by Category' : 'Розподіл послуг за категоріями'}
                data={servicesByCategory}
                type="pie"
                showLegend={true}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Service Status Overview' : 'Огляд статусів послуг'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Available', 'Unavailable', 'Maintenance'].map((status) => {
                      const count = services?.filter(s => s.status === status).length || 0;
                      const percentage = services?.length ? Math.round((count / services.length) * 100) : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'Available' ? 'bg-green-500' :
                              status === 'Unavailable' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <span className="font-medium">
                              {status === 'Available' ? (language === 'en' ? 'Available' : 'Доступні') :
                               status === 'Unavailable' ? (language === 'en' ? 'Unavailable' : 'Недоступні') :
                               (language === 'en' ? 'Under Maintenance' : 'На обслуговуванні')
                              }
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{count}</div>
                            <div className="text-sm text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ServicesModule;
