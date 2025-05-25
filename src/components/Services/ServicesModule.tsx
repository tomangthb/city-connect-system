
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  FileText,
  Clock,
  User,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AddServiceDialog from './AddServiceDialog';
import EditServiceDialog from './EditServiceDialog';
import ManageServiceDialog from './ManageServiceDialog';
import ServicesFilterDialog from './ServicesFilterDialog';
import ServiceDetailDialog from './ServiceDetailDialog';
import { addActivity } from '@/utils/activityUtils';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
}

const ServicesModule = ({ userType }: ServicesModuleProps) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
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
        .order('created_at', { ascending: false });
      
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

    // Category filter
    if (filters.category !== 'all' && service.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && service.status !== filters.status) {
      return false;
    }

    // Processing time filter
    if (filters.processingTime !== 'all') {
      const processingTime = service.processing_time || '';
      if (filters.processingTime === 'fast' && !processingTime.includes('1-3')) {
        return false;
      }
      if (filters.processingTime === 'medium' && !processingTime.includes('week')) {
        return false;
      }
      if (filters.processingTime === 'slow' && !processingTime.includes('2+')) {
        return false;
      }
    }

    // Life situation filter
    if (filters.lifeSituation !== 'all') {
      if (!lifeSituations || !lifeSituations.includes(filters.lifeSituation)) {
        return false;
      }
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

      // Update request count
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('cityServices') || 'City Services'}</h2>
          <p className="text-gray-600">
            {userType === 'employee' 
              ? (t('manageProvide') || 'Manage and provide city services')
              : (t('accessRequest') || 'Access and request city services')}
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

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={t('searchServices') || 'Search services, categories, life situations...'} 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ServicesFilterDialog onFiltersApplied={setFilters}>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {t('filter') || 'Filter'}
          </Button>
        </ServicesFilterDialog>
      </div>

      {/* Results info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {language === 'en' ? 
            `Showing ${filteredServices.length} of ${services?.length || 0} services` :
            `Показано ${filteredServices.length} з ${services?.length || 0} послуг`
          }
        </p>
        {(filters.category !== 'all' || filters.status !== 'all' || filters.processingTime !== 'all' || filters.lifeSituation !== 'all') && (
          <p className="text-sm text-blue-600">
            {language === 'en' ? 'Filters applied' : 'Застосовано фільтри'}
          </p>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const name = language === 'en' ? service.name : (service.name_uk || service.name);
          const category = language === 'en' ? service.category : (service.category_uk || service.category);
          const subcategory = language === 'en' ? service.subcategory : (service.subcategory_uk || service.subcategory);
          const description = language === 'en' ? service.description : (service.description_uk || service.description);

          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{name}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary">{category}</Badge>
                      {subcategory && <Badge variant="outline" className="text-xs">{subcategory}</Badge>}
                    </div>
                  </div>
                  {service.average_rating > 0 && (
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
                
                <div className="space-y-2 mb-4">
                  {service.processing_time && (
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{t('processing') || 'Processing'}: {service.processing_time}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>{t('status')}: {service.status}</span>
                  </div>
                  {userType === 'employee' && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{t('activeRequests') || 'Active requests'}: {service.requests || 0}</span>
                    </div>
                  )}
                  {service.total_reviews > 0 && (
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{service.total_reviews} {language === 'en' ? 'reviews' : 'відгуків'}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {userType === 'employee' ? (
                    <>
                      <ManageServiceDialog service={service} onServiceUpdated={refetch}>
                        <Button className="flex-1" size="sm">
                          {t('manage') || 'Manage'}
                        </Button>
                      </ManageServiceDialog>
                      <EditServiceDialog service={service} onServiceUpdated={refetch}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </EditServiceDialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteService(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <ServiceDetailDialog service={service} userType={userType}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === 'en' ? 'Details' : 'Деталі'}
                        </Button>
                      </ServiceDetailDialog>
                      <Button 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleRequestService(service)}
                        disabled={service.status !== 'Available'}
                      >
                        {t('requestServiceButton') || 'Request Service'}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noServicesFound') || 'No services found'}</p>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;
