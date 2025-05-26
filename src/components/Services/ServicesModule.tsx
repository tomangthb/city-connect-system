
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, BarChart3, Building, Bus, GraduationCap, MapPin, Leaf } from 'lucide-react';
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
  const { language } = useLanguage();
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
    const categoryGroups: Record<string, number> = {};
    services.forEach(service => {
      const category = language === 'en' ? service.category : service.category_uk;
      categoryGroups[category] = (categoryGroups[category] || 0) + 1;
    });
    return Object.entries(categoryGroups).map(([name, value]) => ({
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
            {language === 'en' ? 'Browse and manage city services' : 'Переглядайте та керуйте міськими послугами'}
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
          <TabsTrigger value="housing-utilities">
            <Building className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Housing and Utilities' : 'ЖКГ'}
          </TabsTrigger>
          <TabsTrigger value="permits-registration">
            {language === 'en' ? 'Permits and Registration' : 'Дозволи та реєстрація'}
          </TabsTrigger>
          <TabsTrigger value="social-services">
            {language === 'en' ? 'Social Services' : 'Соціальні послуги'}
          </TabsTrigger>
          <TabsTrigger value="transport-traffic">
            <Bus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Transport and Traffic' : 'Транспорт та трафік'}
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Education' : 'Освіта'}
          </TabsTrigger>
          <TabsTrigger value="land-planning">
            <MapPin className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Land Use and Urban Planning' : 'Землекористування та планування'}
          </TabsTrigger>
          <TabsTrigger value="environmental">
            <Leaf className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Environmental Services' : 'Екологічні послуги'}
          </TabsTrigger>
          {userType === 'employee' && (
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Analytics' : 'Аналітика'}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {/* Search and Filter */}
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
                      {language === 'en' ? 'Available' : 'Доступно'}
                    </option>
                    <option value="Unavailable">
                      {language === 'en' ? 'Unavailable' : 'Недоступно'}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'No services found' : 'Послуги не знайдено'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Спробуйте змінити параметри пошуку або фільтра'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Category-specific tabs */}
        {['housing-utilities', 'permits-registration', 'social-services', 'transport-traffic', 'education', 'land-planning', 'environmental'].map(category => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.filter(service => {
                const serviceCategory = (language === 'en' ? service.category : service.category_uk).toLowerCase();
                return serviceCategory.includes(category.replace('-', ' '));
              }).map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  userType={userType}
                  onServiceUpdated={handleServiceUpdated}
                />
              ))}
            </div>
          </TabsContent>
        ))}

        {userType === 'employee' && (
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Services Distribution' : 'Розподіл послуг'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricsChart data={servicesByCategory} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'en' ? 'Service Statistics' : 'Статистика послуг'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Total Services:' : 'Всього послуг:'}</span>
                    <span className="font-bold">{services?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Available:' : 'Доступно:'}</span>
                    <span className="font-bold text-green-600">
                      {services?.filter(s => s.status === 'Available').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Categories:' : 'Категорій:'}</span>
                    <span className="font-bold">{categories.length - 1}</span>
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
