
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ServiceCategorySection from './ServiceCategorySection';
import AddServiceDialog from './AddServiceDialog';
import EditServiceDialog from './EditServiceDialog';
import ServicesFilterDialog from './ServicesFilterDialog';
import { addActivity } from '@/utils/activityUtils';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
}

const ServicesModule = ({ userType }: ServicesModuleProps) => {
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
            {language === 'en' ? 'City Services Catalog' : 'Каталог міських послуг'}
          </h1>
          <p className="text-gray-600 mt-2">
            {userType === 'employee' 
              ? (language === 'en' ? 'Comprehensive service management and administration' : 'Комплексне управління та адміністрування послуг')
              : (language === 'en' ? 'Complete catalog of city services with detailed information and online booking' : 'Повний каталог міських послуг з детальною інформацією та онлайн записом')}
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
          {language === 'en' ? 'Search & Filter Services' : 'Пошук та фільтрація послуг'}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={language === 'en' ? 
                'Search by service name, category, life situation...' : 
                'Пошук за назвою послуги, категорією, життєвою ситуацією...'
              }
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
              {language === 'en' ? 'Filters applied' : 'Застосовано фільтри'}
            </span>
          )}
        </div>
      </div>

      {/* Services Catalog by Categories */}
      <div className="space-y-8">
        {Object.keys(servicesByCategory).length > 0 ? (
          Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <ServiceCategorySection
              key={category}
              category={category}
              services={categoryServices}
              userType={userType}
              onRequestService={handleRequestService}
              onEdit={setEditingService}
              onDelete={handleDeleteService}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 text-lg">
              {language === 'en' ? 'No services found matching your criteria' : 'Не знайдено послуг за вашими критеріями'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {language === 'en' ? 'Try adjusting your search terms or filters' : 'Спробуйте змінити умови пошуку або фільтри'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Service Dialog */}
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
