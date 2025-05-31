
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar,
  Building,
  TreePine,
  Dumbbell,
  GraduationCap,
  Heart,
  Car,
  Filter,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ResourceBookingDialog from './ResourceBookingDialog';

interface Resource {
  id: number;
  name: string;
  nameUk: string;
  category: string;
  categoryUk: string;
  description: string;
  descriptionUk: string;
  location: string;
  locationUk: string;
  availability: 'available' | 'busy' | 'maintenance';
  workingHours: string;
  workingHoursUk: string;
  contact: string;
  amenities: string[];
  amenitiesUk: string[];
  icon: React.ComponentType<any>;
  image?: string;
}

const ResidentResourcesModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const resources: Resource[] = [
    {
      id: 1,
      name: 'Central Library',
      nameUk: 'Центральна бібліотека',
      category: 'Education',
      categoryUk: 'Освіта',
      description: 'Modern library with digital resources and study spaces',
      descriptionUk: 'Сучасна бібліотека з цифровими ресурсами та навчальними зонами',
      location: 'Downtown, 15 Main Street',
      locationUk: 'Центр міста, вул. Головна 15',
      availability: 'available',
      workingHours: 'Mon-Fri: 9:00-20:00, Sat-Sun: 10:00-18:00',
      workingHoursUk: 'Пн-Пт: 9:00-20:00, Сб-Нд: 10:00-18:00',
      contact: '+380 44 123 4567',
      amenities: ['Wi-Fi', 'Study rooms', 'Computer access', 'Printing'],
      amenitiesUk: ['Wi-Fi', 'Навчальні кімнати', 'Доступ до комп\'ютерів', 'Друк'],
      icon: BookOpen
    },
    {
      id: 2,
      name: 'Sports Complex',
      nameUk: 'Спортивний комплекс',
      category: 'Sports & Recreation',
      categoryUk: 'Спорт та відпочинок',
      description: 'Multi-purpose sports facility with gym and swimming pool',
      descriptionUk: 'Багатофункціональний спортивний заклад з залом та басейном',
      location: 'Sports District, 42 Athletic Avenue',
      locationUk: 'Спортивний район, просп. Спортивний 42',
      availability: 'available',
      workingHours: 'Daily: 6:00-22:00',
      workingHoursUk: 'Щодня: 6:00-22:00',
      contact: '+380 44 123 4568',
      amenities: ['Swimming pool', 'Gym', 'Basketball court', 'Locker rooms'],
      amenitiesUk: ['Басейн', 'Тренажерний зал', 'Баскетбольний майданчик', 'Роздягальні'],
      icon: Dumbbell
    },
    {
      id: 3,
      name: 'City Park',
      nameUk: 'Міський парк',
      category: 'Parks & Nature',
      categoryUk: 'Парки та природа',
      description: 'Beautiful city park with walking trails and picnic areas',
      descriptionUk: 'Красивий міський парк з пішохідними стежками та зонами для пікніка',
      location: 'Central Park Area, Green Street',
      locationUk: 'Район центрального парку, вул. Зелена',
      availability: 'available',
      workingHours: '24/7 access',
      workingHoursUk: 'Доступ 24/7',
      contact: '+380 44 123 4569',
      amenities: ['Walking trails', 'Picnic areas', 'Playground', 'Restrooms'],
      amenitiesUk: ['Пішохідні стежки', 'Зони для пікніка', 'Дитячий майданчик', 'Туалети'],
      icon: TreePine
    },
    {
      id: 4,
      name: 'Community Center',
      nameUk: 'Громадський центр',
      category: 'Community Services',
      categoryUk: 'Громадські послуги',
      description: 'Venue for community events and meetings',
      descriptionUk: 'Місце для громадських заходів та зустрічей',
      location: 'City Center, 8 Community Square',
      locationUk: 'Центр міста, пл. Громадська 8',
      availability: 'busy',
      workingHours: 'Mon-Fri: 8:00-18:00',
      workingHoursUk: 'Пн-Пт: 8:00-18:00',
      contact: '+380 44 123 4570',
      amenities: ['Meeting rooms', 'Event hall', 'Kitchen', 'Parking'],
      amenitiesUk: ['Кімнати для зустрічей', 'Зал для заходів', 'Кухня', 'Паркування'],
      icon: Building
    },
    {
      id: 5,
      name: 'Medical Center',
      nameUk: 'Медичний центр',
      category: 'Healthcare',
      categoryUk: 'Охорона здоров\'я',
      description: 'Primary healthcare facility with various medical services',
      descriptionUk: 'Первинний медичний заклад з різними медичними послугами',
      location: 'Medical District, 23 Health Street',
      locationUk: 'Медичний район, вул. Здоров\'я 23',
      availability: 'available',
      workingHours: 'Mon-Fri: 7:00-19:00, Sat: 9:00-15:00',
      workingHoursUk: 'Пн-Пт: 7:00-19:00, Сб: 9:00-15:00',
      contact: '+380 44 123 4571',
      amenities: ['General practice', 'Laboratory', 'Pharmacy', 'Emergency care'],
      amenitiesUk: ['Загальна практика', 'Лабораторія', 'Аптека', 'Екстрена допомога'],
      icon: Heart
    },
    {
      id: 6,
      name: 'Public Parking',
      nameUk: 'Громадське паркування',
      category: 'Transportation',
      categoryUk: 'Транспорт',
      description: 'Secure public parking facility in city center',
      descriptionUk: 'Безпечне громадське паркування в центрі міста',
      location: 'Downtown, 5 Parking Plaza',
      locationUk: 'Центр міста, пл. Паркувальна 5',
      availability: 'available',
      workingHours: '24/7 access',
      workingHoursUk: 'Доступ 24/7',
      contact: '+380 44 123 4572',
      amenities: ['Security cameras', '200 spaces', 'Card payment', 'Disabled access'],
      amenitiesUk: ['Камери безпеки', '200 місць', 'Оплата карткою', 'Доступ для інвалідів'],
      icon: Car
    }
  ];

  const categories = [
    { value: 'all', label: language === 'en' ? 'All Resources' : 'Всі ресурси' },
    { value: 'Education', label: language === 'en' ? 'Education' : 'Освіта' },
    { value: 'Sports & Recreation', label: language === 'en' ? 'Sports & Recreation' : 'Спорт та відпочинок' },
    { value: 'Parks & Nature', label: language === 'en' ? 'Parks & Nature' : 'Парки та природа' },
    { value: 'Community Services', label: language === 'en' ? 'Community Services' : 'Громадські послуги' },
    { value: 'Healthcare', label: language === 'en' ? 'Healthcare' : 'Охорона здоров\'я' },
    { value: 'Transportation', label: language === 'en' ? 'Transportation' : 'Транспорт' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      (language === 'en' ? resource.name : resource.nameUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? resource.description : resource.descriptionUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? resource.location : resource.locationUk).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return (
          <Badge variant="success" className="shadow-sm">
            {language === 'en' ? 'Available' : 'Доступно'}
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="warning" className="shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Busy' : 'Зайнято'}
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="destructive" className="shadow-sm">
            {language === 'en' ? 'Maintenance' : 'Обслуговування'}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
          {language === 'en' ? 'City Resources' : 'Міські ресурси'}
        </h2>
        <p className="text-gray-200 dark:text-gray-200">
          {language === 'en' 
            ? 'Discover and book city facilities and resources available to residents.' 
            : 'Відкрийте та забронюйте міські об\'єкти та ресурси, доступні для жителів.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === 'en' ? 'Search resources...' : 'Пошук ресурсів...'}
            className="pl-10 search-input-enhanced"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border border-white bg-gray-800 text-white rounded-md min-w-[200px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value} className="bg-gray-800 text-white">
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.id} className="enhanced-card-block hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white dark:text-white text-lg leading-tight">
                        {language === 'en' ? resource.name : resource.nameUk}
                      </CardTitle>
                      <p className="text-sm text-blue-400 mt-1">
                        {language === 'en' ? resource.category : resource.categoryUk}
                      </p>
                    </div>
                  </div>
                  {getAvailabilityBadge(resource.availability)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-200 dark:text-gray-200 leading-relaxed">
                  {language === 'en' ? resource.description : resource.descriptionUk}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-400" />
                    <span className="text-gray-300">
                      {language === 'en' ? resource.location : resource.locationUk}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">
                      {language === 'en' ? resource.workingHours : resource.workingHoursUk}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(language === 'en' ? resource.amenities : resource.amenitiesUk).slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {resource.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{resource.amenities.length - 3} {language === 'en' ? 'more' : 'ще'}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    variant="success" 
                    className="flex-1"
                    disabled={resource.availability !== 'available'}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Book' : 'Забронювати'}
                  </Button>
                  <Button variant="outline" size="sm">
                    {language === 'en' ? 'Info' : 'Інфо'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {language === 'en' 
              ? 'No resources found matching your criteria.' 
              : 'Не знайдено ресурсів, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}

      {selectedResource && (
        <ResourceBookingDialog
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default ResidentResourcesModule;
