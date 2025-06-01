
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Star, Clock, Users, ArrowRight, Calendar } from 'lucide-react';
import ServiceDetailDialog from '@/components/Services/ServiceDetailDialog';
import BookAppointmentDialog from '@/components/Services/BookAppointmentDialog';

const ResidentServicesModule = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const categories = React.useMemo(() => {
    if (!services) return [];
    const uniqueCategories = [...new Set(services.map(service => service.category))];
    return uniqueCategories;
  }, [services]);

  const filteredServices = React.useMemo(() => {
    if (!services) return [];
    
    return services.filter(service => {
      const nameMatch = language === 'en' 
        ? service.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : service.name_uk?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
      
      return nameMatch && categoryMatch;
    });
  }, [services, searchTerm, selectedCategory, language]);

  const popularServices = React.useMemo(() => {
    if (!services) return [];
    return services
      .filter(service => service.requests > 0)
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 6);
  }, [services]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>{language === 'en' ? 'Loading services...' : 'Завантаження послуг...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'en' ? 'City Services' : 'Міські послуги'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Access all municipal services and administrative procedures online. Fast, convenient, and available 24/7.'
            : 'Отримайте доступ до всіх муніципальних послуг та адміністративних процедур онлайн. Швидко, зручно та доступно цілодобово.'}
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === 'en' ? 'Search services...' : 'Пошук послуг...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                {language === 'en' ? 'All' : 'Всі'}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {language === 'en' ? category : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Services Section */}
      {popularServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {language === 'en' ? 'Popular Services' : 'Популярні послуги'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {language === 'en' ? service.name : service.name_uk}
                    </h3>
                    <Badge variant="secondary" className="ml-2">
                      <Users className="h-3 w-3 mr-1" />
                      {service.requests}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {language === 'en' ? service.description : service.description_uk}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {service.average_rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {service.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedService(service)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <BookAppointmentDialog service={service}>
                      <Button className="flex-1" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
                      </Button>
                    </BookAppointmentDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Services Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'All Services' : 'Всі послуги'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {language === 'en' ? service.name : service.name_uk}
                    </CardTitle>
                    <p className="text-sm text-blue-600 mt-1">
                      {language === 'en' ? service.category : service.category_uk}
                    </p>
                  </div>
                  <Badge 
                    variant={service.status === 'Available' ? 'success' : 'destructive'}
                    className="ml-2"
                  >
                    {service.status === 'Available' 
                      ? (language === 'en' ? 'Available' : 'Доступно')
                      : (language === 'en' ? 'Unavailable' : 'Недоступно')
                    }
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {language === 'en' ? service.description : service.description_uk}
                </p>
                
                <div className="space-y-2 mb-4">
                  {service.processing_time && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {language === 'en' ? 'Processing time: ' : 'Час обробки: '}
                        {service.processing_time}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {service.average_rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {service.average_rating.toFixed(1)} ({service.total_reviews})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {service.requests > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {service.requests} {language === 'en' ? 'requests' : 'запитів'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedService(service)}
                  >
                    {language === 'en' ? 'View Details' : 'Переглянути деталі'}
                  </Button>
                  <BookAppointmentDialog service={service}>
                    <Button className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
                    </Button>
                  </BookAppointmentDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {language === 'en' ? 'No services found' : 'Послуги не знайдено'}
          </p>
        </div>
      )}

      {/* Service Detail Dialog */}
      {selectedService && (
        <ServiceDetailDialog
          service={selectedService}
          userType="resident"
          onClose={() => setSelectedService(null)}
          onBookAppointment={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default ResidentServicesModule;
