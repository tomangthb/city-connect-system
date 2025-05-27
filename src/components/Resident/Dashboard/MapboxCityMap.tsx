
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const MapboxCityMap = () => {
  const { language } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // City locations for demonstration
  const cityLocations = [
    {
      name: language === 'en' ? 'City Hall' : 'Міська рада',
      coordinates: [30.5234, 50.4501] as [number, number],
      type: 'government'
    },
    {
      name: language === 'en' ? 'Central Hospital' : 'Центральна лікарня',
      coordinates: [30.5200, 50.4475] as [number, number],
      type: 'healthcare'
    },
    {
      name: language === 'en' ? 'Public Library' : 'Публічна бібліотека',
      coordinates: [30.5180, 50.4520] as [number, number],
      type: 'education'
    },
    {
      name: language === 'en' ? 'Central Park' : 'Центральний парк',
      coordinates: [30.5250, 50.4490] as [number, number],
      type: 'recreation'
    }
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    } else {
      toast.error(language === 'en' ? 'Please enter a valid Mapbox token' : 'Будь ласка, введіть дійсний токен Mapbox');
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [30.5234, 50.4501], // Kyiv coordinates
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for city locations
    cityLocations.forEach((location) => {
      const marker = new mapboxgl.Marker({
        color: getMarkerColor(location.type)
      })
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3 style="margin: 0; font-weight: bold;">${location.name}</h3>`)
        )
        .addTo(map.current!);
    });

    map.current.on('load', () => {
      toast.success(language === 'en' ? 'Map loaded successfully' : 'Карта завантажена успішно');
    });
  };

  const getMarkerColor = (type: string) => {
    const colors = {
      government: '#DC2626',
      healthcare: '#059669',
      education: '#2563EB',
      recreation: '#7C3AED'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error(language === 'en' ? 'Please enter a search query' : 'Будь ласка, введіть запит для пошуку');
      return;
    }

    const foundLocation = cityLocations.find(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundLocation && map.current) {
      map.current.flyTo({
        center: foundLocation.coordinates,
        zoom: 15
      });
      toast.success(`${language === 'en' ? 'Found' : 'Знайдено'}: ${foundLocation.name}`);
    } else {
      toast.error(language === 'en' ? 'Location not found' : 'Локацію не знайдено');
    }
  };

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
            />
            <Button onClick={handleTokenSubmit}>
              {language === 'en' ? 'Set Token' : 'Встановити токен'}
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
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === 'en' ? 'Search locations...' : 'Пошук локацій...'}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Navigation className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Search' : 'Пошук'}
          </Button>
        </div>
        
        <div ref={mapContainer} className="w-full h-96 rounded-lg" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>{language === 'en' ? 'Government' : 'Урядові'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>{language === 'en' ? 'Healthcare' : 'Медицина'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>{language === 'en' ? 'Education' : 'Освіта'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span>{language === 'en' ? 'Recreation' : 'Відпочинок'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxCityMap;
