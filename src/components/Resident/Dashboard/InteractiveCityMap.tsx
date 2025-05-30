
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const InteractiveCityMap = () => {
  const { language } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast.error(language === 'en' ? 'Please enter a valid Mapbox token' : 'Будь ласка, введіть дійсний токен Mapbox');
      return;
    }
    
    setIsMapLoading(true);
    setIsTokenSet(true);
    
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) {
      setIsMapLoading(false);
      return;
    }

    try {
      mapboxgl.accessToken = mapboxToken;

      if (map.current) {
        map.current.remove();
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [30.5234, 50.4501], // Kyiv coordinates
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoading(false);
        toast.success(language === 'en' ? 'Map loaded successfully' : 'Карта завантажена успішно');
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setIsMapLoading(false);
        toast.error(language === 'en' ? 'Error loading map. Please check your token.' : 'Помилка завантаження карти. Перевірте ваш токен.');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setIsMapLoading(false);
      toast.error(language === 'en' ? 'Error initializing map' : 'Помилка ініціалізації карти');
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (!isTokenSet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Interactive City Map' : 'Інтерактивна карта міста'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Please enter your Mapbox access token to view the interactive map.' 
              : 'Будь ласка, введіть ваш токен доступу Mapbox для перегляду інтерактивної карти.'}
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder={language === 'en' ? 'Enter Mapbox token...' : 'Введіть токен Mapbox...'}
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit} disabled={isMapLoading}>
              {isMapLoading 
                ? (language === 'en' ? 'Loading...' : 'Завантаження...') 
                : (language === 'en' ? 'Set Token' : 'Встановити токен')
              }
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            {language === 'en' 
              ? 'Get your free token at: https://mapbox.com/' 
              : 'Отримайте безкоштовний токен на: https://mapbox.com/'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Interactive City Map' : 'Інтерактивна карта міста'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMapLoading ? (
          <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">
              {language === 'en' ? 'Loading map...' : 'Завантаження карти...'}
            </p>
          </div>
        ) : (
          <div ref={mapContainer} className="w-full h-96 rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveCityMap;
