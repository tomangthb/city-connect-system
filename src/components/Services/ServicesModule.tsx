import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AddServiceDialog from './AddServiceDialog';
import EditServiceDialog from './EditServiceDialog';
import ServicesFilterDialog from './ServicesFilterDialog';
import ServiceDetailDialog from './ServiceDetailDialog';
import BookAppointmentDialog from './BookAppointmentDialog';
import { addActivity } from '@/utils/activityUtils';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
  activeTab?: string;
}

const ServicesModule = ({ userType, activeTab }: ServicesModuleProps) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [appointmentService, setAppointmentService] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    processingTime: 'all',
    lifeSituation: 'all'
  });

  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      return data || [];
    }
  });

  const filteredServices = services?.filter(service => {
    const name = language === 'en' ? service.name : (service.name_uk || service.name);
    const category = language === 'en' ? service.category : (service.category_uk || service.category);
    const subcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
    const description = language === 'en' ? service.description : (service.description_uk || service.description);
    const lifeSituations = language === 'en' ? service.life_situations : (service.life_situations_uk || service.life_situations);
    
    // Search filter
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (subcategory && subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (description && description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (lifeSituations && lifeSituations.some((situation: string) => 
             situation.toLowerCase().includes(searchTerm.toLowerCase())
           ));
    
    if (!matchesSearch) return false;

    // Apply filters
    if (filters.category !== 'all' && service.category !== filters.category) return false;
    if (filters.status !== 'all' && service.status !== filters.status) return false;
    if (filters.processingTime !== 'all') {
      const processingTime = service.processing_time || '';
      if (filters.processingTime === 'fast' && !processingTime.includes('1-3')) return false;
      if (filters.processingTime === 'medium' && !processingTime.includes('week')) return false;
      if (filters.processingTime === 'slow' && !processingTime.includes('2+')) return false;
    }
    if (filters.lifeSituation !== 'all') {
      if (!lifeSituations || !lifeSituations.includes(filters.lifeSituation)) return false;
    }

    return true;
  }) || [];

  // Group services by category
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    const category = language === 'en' ? service.category : (service.category_uk || service.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, any[]>);

  const handleRequestService = async (service: any) => {
    try {
      await addActivity({
        title: language === 'en' ? `Service requested: ${service.name}` : `Послуга запитана: ${service.name_uk || service.name}`,
        description: `Requested service: ${service.name}`,
        type: 'service',
        priority: 'medium',
        status: 'pending'
      });

      await supabase
        .from('services')
        .update({ requests: (service.requests || 0) + 1 })
        .eq('id', service.id);

      toast.success(t('serviceRequested') || 'Service requested successfully');
      refetch();
    } catch (error) {
      console.error('Error requesting service:', error);
      toast.error(t('errorRequestingService') || 'Error requesting service');
    }
  };

  const handleDeleteService = async (service: any) => {
    if (!confirm(t('confirmDeleteService') || 'Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `Service deleted: ${service.name}` : `Послуга видалена: ${service.name_uk || service.name}`,
        description: `Deleted service: ${service.name}`,
        type: 'service',
        priority: 'high',
        status: 'completed'
      });

      toast.success(t('serviceDeleted') || 'Service deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(t('errorDeletingService') || 'Error deleting service');
    }
  };

  const scrollContainer = (containerId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div>{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('administrativeServices') || 'Адміністративні послуги'}
          </h1>
          <p className="text-gray-600 mt-2">
            {userType === 'employee' 
              ? (t('employeeServicesDescription') || 'Комплексне управління та адміністрування послуг')
              : (t('servicesDescription') || 'Повний каталог адміністративних послуг з детальною інформацією та онлайн записом')}
          </p>
        </div>
        {userType === 'employee' && (
          <AddServiceDialog onServiceAdded={refetch}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addNewService') || 'Add New Service'}
            </Button>
          </AddServiceDialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold text-lg">
          {t('searchAndFilter') || 'Пошук та фільтрація послуг'}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={t('searchServices') || 'Пошук за назвою послуги, категорією, життєвою ситуацією...'}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ServicesFilterDialog onFiltersApplied={setFilters}>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('filter') || 'Фільтр'}
            </Button>
          </ServicesFilterDialog>
        </div>

        {/* Results info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {language === 'en' ? 
              `Showing ${filteredServices.length} of ${services?.length || 0} services` :
              `Показано ${filteredServices.length} з ${services?.length || 0} послуг`
            }
          </span>
          {(filters.category !== 'all' || filters.status !== 'all' || filters.processingTime !== 'all' || filters.lifeSituation !== 'all') && (
            <span className="text-blue-600 font-medium">
              {t('filtersApplied') || 'Застосовано фільтри'}
            </span>
          )}
        </div>
      </div>

      {/* Services Catalog by Categories */}
      <div className="space-y-8">
        {Object.keys(servicesByCategory).length > 0 ? (
          Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollContainer(`category-${category}`, 'left')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollContainer(`category-${category}`, 'right')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div
                id={`category-${category}`}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categoryServices.map((service) => (
                  <div key={service.id} className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 border">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {language === 'en' ? service.name : (service.name_uk || service.name)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory)}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {language === 'en' ? service.description : (service.description_uk || service.description)}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {service.processing_time}
                        </span>
                        {service.average_rating && (
                          <span className="text-yellow-600">
                            ⭐ {service.average_rating.toFixed(1)} ({service.total_reviews})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedService(service)}
                        >
                          {t('learnMore') || 'Докладніше'}
                        </Button>
                        
                        {userType === 'resident' ? (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => setAppointmentService(service)}
                          >
                            {t('bookAppointment') || 'Записатися'}
                          </Button>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteService(service)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 text-lg">
              {t('noServicesFound') || 'Не знайдено послуг за вашими критеріями'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {t('adjustSearchCriteria') || 'Спробуйте змінити умови пошуку або фільтри'}
            </p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedService && (
        <ServiceDetailDialog
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookAppointment={() => {
            setAppointmentService(selectedService);
            setSelectedService(null);
          }}
          userType={userType}
        />
      )}

      {appointmentService && (
        <BookAppointmentDialog service={appointmentService}>
          <div />
        </BookAppointmentDialog>
      )}

      {editingService && (
        <EditServiceDialog 
          service={editingService} 
          onServiceUpdated={() => {
            refetch();
            setEditingService(null);
          }}
        >
          <div />
        </EditServiceDialog>
      )}
    </div>
  );
};

export default ServicesModule;
