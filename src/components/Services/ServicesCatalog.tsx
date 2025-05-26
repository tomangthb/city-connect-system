import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  Plus,
  Building,
  FileText,
  Users,
  Truck,
  GraduationCap,
  MapPin,
  Leaf
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreateServiceDialog from './CreateServiceDialog';
import ServicesFilterDialog from './ServicesFilterDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServicesCatalogProps {
  userType: 'employee' | 'resident';
  onServiceSelect: (service: any) => void;
}

const ServicesCatalog = ({ userType, onServiceSelect }: ServicesCatalogProps) => {
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
        .order('category', { ascending: true });
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      return data || [];
    }
  });

  const categoryIcons: Record<string, any> = {
    'Housing and Utilities': Building,
    'Житлово-комунальні послуги': Building,
    'Permits and Registration': FileText,
    'Дозвільні та реєстраційні послуги': FileText,
    'Social Services': Users,
    'Соціальні послуги': Users,
    'Transport and Traffic': Truck,
    'Транспорт та дорожній рух': Truck,
    'Education': GraduationCap,
    'Освіта': GraduationCap,
    'Land Use and Urban Planning': MapPin,
    'Землекористування та містобудування': MapPin,
    'Environmental Services': Leaf,
    'Екологічні послуги': Leaf
  };

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
            {t('servicesCatalog') || 'Каталог адміністративних послуг'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'en' ? 
              'Browse all available administrative services organized by categories' :
              'Перегляньте всі доступні адміністративні послуги, організовані за категоріями'
            }
          </p>
        </div>
        {userType === 'employee' && (
          <CreateServiceDialog onServiceCreated={refetch}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addNewService') || 'Додати послугу'}
            </Button>
          </CreateServiceDialog>
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

      {/* Services Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => {
          const IconComponent = categoryIcons[category] || FileText;
          return (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                  <span className="text-lg">{category}</span>
                </CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {categoryServices.length} {language === 'en' ? 'services' : 'послуг'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryServices.slice(0, 3).map((service) => (
                    <div key={service.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">
                        {language === 'en' ? service.name : (service.name_uk || service.name)}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {language === 'en' ? service.description : (service.description_uk || service.description)}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto font-medium text-blue-600"
                        onClick={() => onServiceSelect(service)}
                      >
                        {t('learnMore') || 'Докладніше'}
                      </Button>
                    </div>
                  ))}
                  {categoryServices.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      {language === 'en' ? 
                        `+${categoryServices.length - 3} more services` :
                        `+${categoryServices.length - 3} інших послуг`
                      }
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {Object.keys(servicesByCategory).length === 0 && (
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
  );
};

export default ServicesCatalog;
