
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
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
  const [selectedService, setSelectedService] = useState<any>(null);
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
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (subcategory && subcategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (description && description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (lifeSituations && lifeSituations.some((situation: string) => 
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
      if (!lifeSituations || !lifeSituations.includes(filters.lifeSituation)) return false;
    }

    return true;
  }) || [];

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
            {categoryTitle}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'en' ? 
              `Administrative services in the ${categoryTitle} category` :
              `Адміністративні послуги в категорії "${categoryTitle}"`
            }
          </p>
        </div>
        {userType === 'employee' && (
          <AddServiceDialog onServiceAdded={refetch}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addNewService') || 'Додати послугу'}
            </Button>
          </AddServiceDialog>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={t('searchServices') || 'Пошук послуг...'}
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

        <div className="text-sm text-gray-600">
          {language === 'en' ? 
            `Found ${filteredServices.length} services in this category` :
            `Знайдено ${filteredServices.length} послуг у цій категорії`
          }
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'en' ? service.name : (service.name_uk || service.name)}
              </CardTitle>
              <div className="flex gap-2">
                {service.subcategory && (
                  <Badge variant="outline" className="text-xs">
                    {language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory)}
                  </Badge>
                )}
                <Badge 
                  variant={service.status === 'Available' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {service.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {language === 'en' ? service.description : (service.description_uk || service.description)}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {service.processing_time}
                </span>
                {service.average_rating && service.average_rating > 0 && (
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
                  onClick={() => onServiceSelect(service)}
                >
                  {t('learnMore') || 'Докладніше'}
                </Button>
                
                {userType === 'resident' ? (
                  <BookAppointmentDialog service={service}>
                    <Button size="sm" className="flex-1">
                      {t('bookAppointment') || 'Записатися'}
                    </Button>
                  </BookAppointmentDialog>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">
            {t('noServicesFound') || 'Не знайдено послуг у цій категорії'}
          </p>
        </div>
      )}

      {/* Dialogs */}
      {selectedService && (
        <ServiceDetailDialog
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookAppointment={() => setSelectedService(null)}
          userType={userType}
        />
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

export default ServiceCategoryPage;
