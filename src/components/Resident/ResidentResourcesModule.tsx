
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Building,
  MapPin,
  Clock,
  Users,
  Phone,
  Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
}

const ResidentResourcesModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      currentOccupancy: 45
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
      currentOccupancy: 120
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
      currentOccupancy: 67
    },
    {
      id: '4',
      name: 'Youth Recreation Center',
      nameUk: 'Молодіжний центр відпочинку',
      category: 'recreation',
      categoryUk: 'Відпочинок',
      description: 'Recreation center focused on youth activities and programs.',
      descriptionUk: 'Центр відпочинку, орієнтований на молодіжні заходи та програми.',
      location: '23 Youth Plaza',
      status: 'Maintenance',
      workingHours: '10:00 - 18:00',
      contact: '+380 44 456-7890',
      capacity: 100,
      currentOccupancy: 0
    },
    {
      id: '5',
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
      currentOccupancy: 85
    },
    {
      id: '6',
      name: 'Senior Citizens Center',
      nameUk: 'Центр для людей похилого віку',
      category: 'social',
      categoryUk: 'Соціальні послуги',
      description: 'Dedicated center providing services and activities for senior citizens.',
      descriptionUk: 'Спеціалізований центр, що надає послуги та заходи для людей похилого віку.',
      location: '56 Elder Avenue',
      status: 'Available',
      workingHours: '8:00 - 17:00',
      contact: '+380 44 678-9012',
      capacity: 80,
      currentOccupancy: 34
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'City Resources' : 'Міські ресурси'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Explore available city facilities and resources for residents.' 
            : 'Досліджуйте доступні міські установи та ресурси для громадян.'}
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
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">
                  {language === 'en' ? resource.name : resource.nameUk}
                </CardTitle>
                <Badge className={getStatusColor(resource.status)}>
                  {getStatusText(resource.status)}
                </Badge>
              </div>
              <p className="text-sm text-blue-600">
                {language === 'en' ? resource.category : resource.categoryUk}
              </p>
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
              
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Get Directions' : 'Як добратись'}
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'More Info' : 'Детальніше'}
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
    </div>
  );
};

export default ResidentResourcesModule;
