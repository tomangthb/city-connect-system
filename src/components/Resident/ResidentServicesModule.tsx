
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceDetailDialog from '@/components/Services/ServiceDetailDialog';
import ServicesHeader from './Services/ServicesHeader';
import ServicesSearch from './Services/ServicesSearch';
import PopularServicesSection from './Services/PopularServicesSection';
import AllServicesSection from './Services/AllServicesSection';

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
      <ServicesHeader />
      
      <ServicesSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <PopularServicesSection
        services={popularServices}
        onServiceSelect={setSelectedService}
      />

      <AllServicesSection
        services={filteredServices}
        onServiceSelect={setSelectedService}
      />

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
