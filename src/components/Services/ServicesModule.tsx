
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
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AddServiceDialog from './AddServiceDialog';
import { addActivity } from '@/utils/activityUtils';

interface ServicesModuleProps {
  userType: 'employee' | 'resident';
}

const ServicesModule = ({ userType }: ServicesModuleProps) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

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
    const description = language === 'en' ? service.description : (service.description_uk || service.description);
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (description && description.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const handleManageService = async (service: any) => {
    try {
      await addActivity({
        title: language === 'en' ? `Service managed: ${service.name}` : `Послуга керована: ${service.name_uk || service.name}`,
        description: `Opened management for service: ${service.name}`,
        type: 'service',
        priority: 'low',
        status: 'completed'
      });

      toast.info(t('serviceManagement') || 'Service management opened');
    } catch (error) {
      console.error('Error logging activity:', error);
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
            placeholder={t('searchServices') || 'Search services...'} 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {t('filter') || 'Filter'}
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const name = language === 'en' ? service.name : (service.name_uk || service.name);
          const category = language === 'en' ? service.category : (service.category_uk || service.category);
          const description = language === 'en' ? service.description : (service.description_uk || service.description);

          return (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <Badge variant="secondary">{category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{description}</p>
                
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
                </div>

                <div className="flex space-x-2">
                  {userType === 'employee' ? (
                    <>
                      <Button 
                        className="flex-1" 
                        onClick={() => handleManageService(service)}
                      >
                        {t('manage') || 'Manage'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteService(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="flex-1"
                        onClick={() => handleRequestService(service)}
                        disabled={service.status !== 'Available'}
                      >
                        {t('requestServiceButton') || 'Request Service'}
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4" />
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
