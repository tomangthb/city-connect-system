
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreateServiceDialog from './CreateServiceDialog';
import EditServiceDialog from './EditServiceDialog';
import ServicesFilterDialog from './ServicesFilterDialog';
import BookAppointmentDialog from './BookAppointmentDialog';
import { addActivity } from '@/utils/activityUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServiceCategoryPageProps {
  userType: 'employee' | 'resident';
  category: string;
  categoryTitle: string;
  onServiceSelect: (service: any) => void;
}

const ServiceCategoryPage = ({ userType, category, categoryTitle, onServiceSelect }: ServiceCategoryPageProps) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    processingTime: 'all',
    lifeSituation: 'all'
  });

  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .or(`category.eq.${category},category_uk.eq.${category}`)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      return data || [];
    }
  });

  const filteredServices = services?.filter(service => {
    const name = language === 'en' ? service.name : (service.name_uk || service.name);
    const subcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
    const description = language === 'en' ? service.description : (service.description_uk || service.description);
    const lifeSituations = language === 'en' ? service.life_situations : (service.life_situations_uk || service.life_situations);
    
    // Search filter
    const matchesSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (subcategory && subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (description && description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (lifeSituations && Array.isArray(lifeSituations) && lifeSituations.some((situation: string) => 
             situation.toLowerCase().includes(searchTerm.toLowerCase())
           ));
    
    if (!matchesSearch) return false;

    // Apply additional filters
    if (filters.status !== 'all' && service.status !== filters.status) return false;
    if (filters.processingTime !== 'all') {
      const processingTime = service.processing_time || '';
      if (filters.processingTime === 'fast' && !processingTime.includes('1-3')) return false;
      if (filters.processingTime === 'medium' && !processingTime.includes('week')) return false;
      if (filters.processingTime === 'slow' && !processingTime.includes('2+')) return false;
    }
    if (filters.lifeSituation !== 'all') {
      if (!lifeSituations || !Array.isArray(lifeSituations) || !lifeSituations.includes(filters.lifeSituation)) return false;
    }

    return true;
  }) || [];

  const handleRequestService = async (service: any) => {
    try {
      const serviceName = language === 'en' ? service.name : (service.name_uk || service.name);
      
      await addActivity({
        title: language === 'en' ? `Service requested: ${serviceName}` : `Послуга запитана: ${serviceName}`,
        description: `Requested service: ${serviceName}`,
        type: 'service',
        priority: 'medium',
        status: 'pending'
      });

      await supabase
        .from('services')
        .update({ requests: (service.requests || 0) + 1 })
        .eq('id', service.id);

      toast.success(t('serviceRequested') || (language === 'en' ? 'Service requested successfully' : 'Послуга запитана успішно'));
      refetch();
    } catch (error) {
      console.error('Error requesting service:', error);
      toast.error(t('errorRequestingService') || (language === 'en' ? 'Error requesting service' : 'Помилка при запиті послуги'));
    }
  };

  const handleDeleteService = async (service: any) => {
    const serviceName = language === 'en' ? service.name : (service.name_uk || service.name);
    const confirmMessage = language === 'en' ? 
      `Are you sure you want to delete "${serviceName}"?` : 
      `Ви впевнені, що хочете видалити "${serviceName}"?`;
      
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `Service deleted: ${serviceName}` : `Послуга видалена: ${serviceName}`,
        description: `Deleted service: ${serviceName}`,
        type: 'service',
        priority: 'high',
        status: 'completed'
      });

      toast.success(t('serviceDeleted') || (language === 'en' ? 'Service deleted successfully' : 'Послуга видалена успішно'));
      refetch();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(t('errorDeletingService') || (language === 'en' ? 'Error deleting service' : 'Помилка видалення послуги'));
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
  };

  const handleServiceUpdated = () => {
    refetch();
    setEditingService(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Unavailable': return 'bg-red-100 text-red-800 border-red-200';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Available': return language === 'en' ? 'Available' : 'Доступно';
      case 'Unavailable': return language === 'en' ? 'Unavailable' : 'Недоступно';
      case 'Maintenance': return language === 'en' ? 'Under Maintenance' : 'На обслуговуванні';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-gray-500">
          {t('loading') || (language === 'en' ? 'Loading...' : 'Завантаження...')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {categoryTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {language === 'en' ? 
              `Administrative services in the ${categoryTitle} category` :
              `Адміністративні послуги в категорії "${categoryTitle}"`
            }
          </p>
        </div>
        {userType === 'employee' && (
          <CreateServiceDialog onServiceCreated={refetch}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addNewService') || (language === 'en' ? 'Add New Service' : 'Додати нову послугу')}
            </Button>
          </CreateServiceDialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={t('searchServices') || (language === 'en' ? 'Search services...' : 'Пошук послуг...')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ServicesFilterDialog onFiltersApplied={setFilters}>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('filter') || (language === 'en' ? 'Filter' : 'Фільтр')}
            </Button>
          </ServicesFilterDialog>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'en' ? 
            `Found ${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} in this category` :
            `Знайдено ${filteredServices.length} послуг у цій категорії`
          }
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const serviceName = language === 'en' ? service.name : (service.name_uk || service.name);
          const serviceDescription = language === 'en' ? service.description : (service.description_uk || service.description);
          const serviceSubcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
          
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {serviceName}
                </CardTitle>
                <div className="flex gap-2 flex-wrap">
                  {serviceSubcategory && (
                    <Badge variant="outline" className="text-xs">
                      {serviceSubcategory}
                    </Badge>
                  )}
                  <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {serviceDescription}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {service.processing_time || (language === 'en' ? 'Processing time not specified' : 'Час обробки не вказано')}
                  </span>
                  {service.average_rating && service.average_rating > 0 && (
                    <span className="text-yellow-600">
                      ⭐ {service.average_rating.toFixed(1)} ({service.total_reviews || 0})
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onServiceSelect(service)}
                  >
                    {t('learnMore') || (language === 'en' ? 'Learn More' : 'Докладніше')}
                  </Button>
                  
                  {userType === 'resident' && service.status === 'Available' ? (
                    <BookAppointmentDialog service={service}>
                      <Button size="sm" className="flex-1">
                        {t('bookAppointment') || (language === 'en' ? 'Book Appointment' : 'Записатися')}
                      </Button>
                    </BookAppointmentDialog>
                  ) : userType === 'employee' ? (
                    <div className="flex gap-1 flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Edit' : 'Редагувати'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteService(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
          <p className="text-gray-500 text-lg">
            {t('noServicesFound') || (language === 'en' ? 'No services found in this category' : 'Не знайдено послуг у цій категорії')}
          </p>
        </div>
      )}

      {/* Edit Service Dialog */}
      {editingService && (
        <EditServiceDialog 
          service={editingService} 
          onServiceUpdated={handleServiceUpdated}
        >
          <div />
        </EditServiceDialog>
      )}
    </div>
  );
};

export default ServiceCategoryPage;
