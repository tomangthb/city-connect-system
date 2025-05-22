
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResourceProps {
  userType: 'employee' | 'resident';
}

const ResourcesModule = ({ userType }: ResourceProps) => {
  const { language, t } = useLanguage();
  
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading resources...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading resources</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {userType === 'employee' ? t('resourceManagement') : t('cityResources')}
      </h2>
      
      {userType === 'employee' && (
        <p className="text-gray-600 mb-6">
          {language === 'en' 
            ? 'Manage and monitor all city resources.' 
            : 'Управління та моніторинг усіх міських ресурсів.'}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? resource.name : resource.name_uk}
              </h3>
              <p className="text-sm text-blue-600 mb-2">
                {language === 'en' ? resource.category : resource.category_uk}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'en' ? resource.description : resource.description_uk}
              </p>
              {resource.location && (
                <p className="text-xs text-gray-500 mt-2">
                  {language === 'en' ? 'Location: ' : 'Розташування: '} 
                  {resource.location}
                </p>
              )}
              <div className="mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  resource.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {resource.status === 'Available' 
                    ? (language === 'en' ? 'Available' : 'Доступно')
                    : (language === 'en' ? 'Unavailable' : 'Недоступно')
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourcesModule;
