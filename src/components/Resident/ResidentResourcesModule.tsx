import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Building,
  MapPin,
  Clock,
  Users,
  Phone,
  Calendar,
  Star,
  Eye,
  Share2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ResourceBookingDialog from './ResourceBookingDialog';

interface Resource {
  id: string;
  name: string;
  nameUk: string;
  category: string;
  categoryUk: string;
  description: string;
  descriptionUk: string;
  location: string;
  status: 'Available' | 'Unavailable' | 'Maintenance';
  workingHours: string;
  contact: string;
  capacity?: number;
  currentOccupancy?: number;
  rating?: number;
  features: string[];
  featuresUk: string[];
}

const ResidentResourcesModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const categories = [
    { id: 'all', name: language === 'en' ? 'All Resources' : 'Всі ресурси' },
    { id: 'recreation', name: language === 'en' ? 'Recreation' : 'Відпочинок' },
    { id: 'healthcare', name: language === 'en' ? 'Healthcare' : 'Охорона здоров\'я' },
    { id: 'education', name: language === 'en' ? 'Education' : 'Освіта' },
    { id: 'social', name: language === 'en' ? 'Social Services' : 'Соціальні послуги' },
    { id: 'culture', name: language === 'en' ? 'Culture' : 'Культура' },
    { id: 'sports', name: language === 'en' ? 'Sports' : 'Спорт' }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      name: 'Central Community Center',
      nameUk: 'Центральний громадський центр',
      category: 'social',
      categoryUk: 'Соціальні послуги',
      description: 'Multi-purpose community center with meeting rooms, event spaces, and social services.',
      descriptionUk: 'Багатофункціональний громадський центр з конференц-залами, залами для заходів та соціальними послугами.',
      location: '15 Community Street',
      status: 'Available',
      workingHours: '8:00 - 20:00',
      contact: '+380 44 123-4567',
      capacity: 200,
      currentOccupancy: 45,
      rating: 4.5,
      features: ['Meeting Rooms', 'Event Spaces', 'Free WiFi', 'Parking', 'Accessibility'],
      featuresUk: ['Конференц-зали', 'Зали для заходів', 'Безкоштовний WiFi', 'Парковка', 'Доступність']
    },
    {
      id: '2',
      name: 'City Sports Complex',
      nameUk: 'Міський спортивний комплекс',
      category: 'sports',
      categoryUk: 'Спорт',
      description: 'Modern sports facility with gym, swimming pool, and various sports courts.',
      descriptionUk: 'Сучасний спортивний заклад з тренажерним залом, басейном та різними спортивними майданчиками.',
      location: '88 Athletic Avenue',
      status: 'Available',
      workingHours: '6:00 - 22:00',
      contact: '+380 44 234-5678',
      capacity: 500,
      currentOccupancy: 120,
      rating: 4.8,
      features: ['Gym', 'Swimming Pool', 'Basketball Court', 'Tennis Court', 'Locker Rooms'],
      featuresUk: ['Тренажерний зал', 'Басейн', 'Баскетбольний майданчик', 'Тенісний корт', 'Роздягальні']
    },
    {
      id: '3',
      name: 'Public Library Main Branch',
      nameUk: 'Головна філія публічної бібліотеки',
      category: 'education',
      categoryUk: 'Освіта',
      description: 'Comprehensive library with books, digital resources, and study areas.',
      descriptionUk: 'Комплексна бібліотека з книгами, цифровими ресурсами та навчальними зонами.',
      location: '42 Knowledge Street',
      status: 'Available',
      workingHours: '9:00 - 19:00',
      contact: '+380 44 345-6789',
      capacity: 150,
      currentOccupancy: 67,
      rating: 4.3,
      features: ['Books', 'Digital Resources', 'Study Areas', 'Computer Access', 'Reading Rooms'],
      featuresUk: ['Книги', 'Цифрові ресурси', 'Навчальні зони', 'Доступ до комп\'ютерів', 'Читальні зали']
    },
    {
      id: '4',
      name: 'Cultural Arts Center',
      nameUk: 'Центр культури та мистецтв',
      category: 'culture',
      categoryUk: 'Культура',
      description: 'Center for arts, theater performances, and cultural events.',
      descriptionUk: 'Центр мистецтв, театральних вистав та культурних заходів.',
      location: '7 Arts Square',
      status: 'Available',
      workingHours: '10:00 - 20:00',
      contact: '+380 44 567-8901',
      capacity: 300,
      currentOccupancy: 85,
      rating: 4.6,
      features: ['Theater Hall', 'Art Gallery', 'Workshop Rooms', 'Gift Shop', 'Café'],
      featuresUk: ['Театральна зала', 'Художня галерея', 'Майстерні', 'Сувенірна крамниця', 'Кафе']
    }
  ];

  const filteredResources = resources.filter(resource => {
    const name = language === 'en' ? resource.name : resource.nameUk;
    const description = language === 'en' ? resource.description : resource.descriptionUk;
    
    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Available': return language === 'en' ? 'Available' : 'Доступно';
      case 'Unavailable': return language === 'en' ? 'Unavailable' : 'Недоступно';
      case 'Maintenance': return language === 'en' ? 'Maintenance' : 'Обслуговування';
      default: return status;
    }
  };

  const getOccupancyPercentage = (resource: Resource) => {
    if (!resource.capacity || !resource.currentOccupancy) return 0;
    return Math.round((resource.currentOccupancy / resource.capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleBookResource = (resource: Resource) => {
    setSelectedResource(resource);
    setBookingDialogOpen(true);
  };

  const handleGetDirections = (resource: Resource) => {
    toast.success(`${language === 'en' ? 'Opening directions to' : 'Відкриваємо маршрут до'}: ${language === 'en' ? resource.name : resource.nameUk}`);
  };

  const handleViewDetails = (resource: Resource) => {
    toast.success(`${language === 'en' ? 'Viewing details for' : 'Перегляд деталей'}: ${language === 'en' ? resource.name : resource.nameUk}`);
  };

  const handleShareResource = (resource: Resource) => {
    if (navigator.share) {
      navigator.share({
        title: language === 'en' ? resource.name : resource.nameUk,
        text: language === 'en' ? resource.description : resource.descriptionUk,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'en' ? 'Link copied to clipboard' : 'Посилання скопійовано в буфер обміну');
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
            ? 'Explore and book available city facilities and resources for residents.' 
            : 'Досліджуйте та бронюйте доступні міські установи та ресурси для громадян.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search resources...' : 'Пошук ресурсів...'}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border border-gray-300 rounded-md min-w-[200px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 4).map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  {language === 'en' ? resource.name : resource.nameUk}
                </CardTitle>
                <Badge className={getStatusColor(resource.status)}>
                  {getStatusText(resource.status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-600">
                  {language === 'en' ? resource.category : resource.categoryUk}
                </p>
                {resource.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{resource.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                {language === 'en' ? resource.description : resource.descriptionUk}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{resource.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{resource.workingHours}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{resource.contact}</span>
                </div>
                
                {resource.capacity && resource.currentOccupancy !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className={`${getOccupancyColor(getOccupancyPercentage(resource))} font-medium`}>
                      {resource.currentOccupancy}/{resource.capacity} ({getOccupancyPercentage(resource)}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {language === 'en' ? 'Features:' : 'Особливості:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(language === 'en' ? resource.features : resource.featuresUk).slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {resource.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.features.length - 3} {language === 'en' ? 'more' : 'ще'}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleBookResource(resource)}
                  disabled={resource.status !== 'Available'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Book Now' : 'Забронювати'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGetDirections(resource)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetails(resource)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShareResource(resource)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'en' 
              ? 'No resources found matching your criteria.' 
              : 'Не знайдено ресурсів, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}

      <ResourceBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        resource={selectedResource}
      />
    </div>
  );
};

export default ResidentResourcesModule;
