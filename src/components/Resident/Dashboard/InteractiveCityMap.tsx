
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  Building, 
  Hospital, 
  GraduationCap, 
  Car, 
  TreePine,
  Zap,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface MapLocation {
  id: string;
  name: string;
  nameUk: string;
  type: string;
  coordinates: { lat: number; lng: number };
  address: string;
  addressUk: string;
  status: 'open' | 'closed' | 'maintenance';
}

const InteractiveCityMap = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const locationTypes = [
    { id: 'all', name: language === 'en' ? 'All' : 'Всі', icon: MapPin },
    { id: 'government', name: language === 'en' ? 'Government' : 'Урядові', icon: Building },
    { id: 'healthcare', name: language === 'en' ? 'Healthcare' : 'Медицина', icon: Hospital },
    { id: 'education', name: language === 'en' ? 'Education' : 'Освіта', icon: GraduationCap },
    { id: 'transport', name: language === 'en' ? 'Transport' : 'Транспорт', icon: Car },
    { id: 'utilities', name: language === 'en' ? 'Utilities' : 'Комунальні', icon: Zap },
    { id: 'parks', name: language === 'en' ? 'Parks' : 'Парки', icon: TreePine },
    { id: 'social', name: language === 'en' ? 'Social' : 'Соціальні', icon: Users },
  ];

  const locations: MapLocation[] = [
    {
      id: '1',
      name: 'City Hall',
      nameUk: 'Міська рада',
      type: 'government',
      coordinates: { lat: 50.4501, lng: 30.5234 },
      address: '1 Independence Square',
      addressUk: 'Майдан Незалежності, 1',
      status: 'open'
    },
    {
      id: '2',
      name: 'Central Hospital',
      nameUk: 'Центральна лікарня',
      type: 'healthcare',
      coordinates: { lat: 50.4475, lng: 30.5200 },
      address: '25 Health Street',
      addressUk: 'вул. Здоров\'я, 25',
      status: 'open'
    },
    {
      id: '3',
      name: 'Public Library',
      nameUk: 'Публічна бібліотека',
      type: 'education',
      coordinates: { lat: 50.4520, lng: 30.5180 },
      address: '10 Knowledge Avenue',
      addressUk: 'просп. Знань, 10',
      status: 'open'
    },
    {
      id: '4',
      name: 'Central Park',
      nameUk: 'Центральний парк',
      type: 'parks',
      coordinates: { lat: 50.4490, lng: 30.5250 },
      address: 'Park District',
      addressUk: 'Парковий район',
      status: 'open'
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesType = selectedType === 'all' || location.type === selectedType;
    const matchesSearch = 
      (language === 'en' ? location.name : location.nameUk)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    toast.success(`${language === 'en' ? 'Selected' : 'Вибрано'}: ${language === 'en' ? location.name : location.nameUk}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return language === 'en' ? 'Open' : 'Відкрито';
      case 'closed': return language === 'en' ? 'Closed' : 'Закрито';
      case 'maintenance': return language === 'en' ? 'Maintenance' : 'Обслуговування';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Interactive City Map' : 'Інтерактивна карта міста'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Controls */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === 'en' ? 'Search locations...' : 'Пошук локацій...'}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {locationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {type.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Map Area - Placeholder */}
        <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Simulate map pins */}
            {filteredLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${25 + (index * 15) % 50}%`,
                  top: `${30 + (index * 10) % 40}%`
                }}
                onClick={() => handleLocationClick(location)}
              >
                <div className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center z-10 bg-white bg-opacity-90 p-4 rounded-lg">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">
              {language === 'en' 
                ? 'Interactive City Map' 
                : 'Інтерактивна карта міста'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'en' 
                ? 'Click on pins to explore locations' 
                : 'Натисніть на мітки для огляду локацій'}
            </p>
          </div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'en' ? selectedLocation.name : selectedLocation.nameUk}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? selectedLocation.address : selectedLocation.addressUk}
                </p>
              </div>
              <Badge className={getStatusColor(selectedLocation.status)}>
                {getStatusText(selectedLocation.status)}
              </Badge>
            </div>
          </div>
        )}

        {/* Locations List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            {language === 'en' ? 'Nearby Locations' : 'Найближчі локації'}
          </h4>
          {filteredLocations.slice(0, 5).map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    {language === 'en' ? location.name : location.nameUk}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? location.address : location.addressUk}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(location.status)}>
                {getStatusText(location.status)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveCityMap;
