
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const NewsModule = () => {
  const { language, t } = useLanguage();
  
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="p-6">Loading news...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading news</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('newsEvents')}</h2>
      <p className="text-gray-600 mb-6">
        {language === 'en' 
          ? 'Stay updated with the latest news and events in your city.' 
          : 'Будьте в курсі останніх новин та подій у вашому місті.'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            {item.image_url && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={item.image_url} 
                  alt={language === 'en' ? item.title : item.title_uk} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{language === 'en' ? item.title : item.title_uk}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString(
                  language === 'en' ? 'en-US' : 'uk-UA', 
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {language === 'en' ? item.summary : item.summary_uk}
              </p>
              <button className="text-blue-600 mt-4 text-sm font-medium">
                {language === 'en' ? 'Read more' : 'Читати далі'} →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsModule;
