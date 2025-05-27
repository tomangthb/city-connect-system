
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CityMapSection = () => {
  const { language } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Interactive City Map' : 'Інтерактивна карта міста'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Interactive map with city services and locations' 
                : 'Інтерактивна карта з міськими послугами та локаціями'}
            </p>
            <Button className="mt-3">
              {language === 'en' ? 'Explore Map' : 'Дослідити карту'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityMapSection;
