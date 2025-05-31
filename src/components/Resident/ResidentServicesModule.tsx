
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Calendar,
  FileText,
  CreditCard,
  Users,
  Home,
  Building,
  Wrench,
  Heart,
  Filter,
  Leaf
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Service {
  id: number;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  category: string;
  categoryUk: string;
  rating: number;
  price: string;
  duration: string;
  durationUk: string;
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
  locationUk: string;
  contact: {
    phone: string;
    email: string;
  };
  tags: string[];
  tagsUk: string[];
  icon: React.ComponentType<any>;
}

const ResidentServicesModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services: Service[] = [
    {
      id: 1,
      name: 'Water Bill Payment',
      nameUk: 'Оплата рахунків за воду',
      description: 'Pay your monthly water bills online',
      descriptionUk: 'Оплачуйте щомісячні рахунки за воду онлайн',
      category: 'Housing & Utilities',
      categoryUk: 'Житлово-комунальні',
      rating: 4.8,
      price: 'Free service',
      duration: 'Instant',
      durationUk: 'Миттєво',
      availability: 'available',
      location: 'Online',
      locationUk: 'Онлайн',
      contact: {
        phone: '+380 44 123 4567',
        email: 'water@city.gov.ua'
      },
      tags: ['water', 'bills', 'payment'],
      tagsUk: ['вода', 'рахунки', 'оплата'],
      icon: CreditCard
    },
    {
      id: 2,
      name: 'Building Permit Application',
      nameUk: 'Заявка на дозвіл на будівництво',
      description: 'Apply for construction and renovation permits',
      descriptionUk: 'Подайте заявку на дозволи на будівництво та ремонт',
      category: 'Permits & Registration',
      categoryUk: 'Дозволи та реєстрація',
      rating: 4.2,
      price: '500-2000 UAH',
      duration: '10-15 business days',
      durationUk: '10-15 робочих днів',
      availability: 'available',
      location: 'City Hall',
      locationUk: 'Міська рада',
      contact: {
        phone: '+380 44 123 4568',
        email: 'permits@city.gov.ua'
      },
      tags: ['building', 'permit', 'construction'],
      tagsUk: ['будівництво', 'дозвіл', 'будівництво'],
      icon: Building
    },
    {
      id: 3,
      name: 'Social Support Application',
      nameUk: 'Заявка на соціальну підтримку',
      description: 'Apply for various social assistance programs',
      descriptionUk: 'Подайте заявку на різні програми соціальної допомоги',
      category: 'Social Services',
      categoryUk: 'Соціальні послуги',
      rating: 4.5,
      price: 'Free service',
      duration: '5-7 business days',
      durationUk: '5-7 робочих днів',
      availability: 'available',
      location: 'Social Services Center',
      locationUk: 'Центр соціальних послуг',
      contact: {
        phone: '+380 44 123 4569',
        email: 'social@city.gov.ua'
      },
      tags: ['social', 'support', 'assistance'],
      tagsUk: ['соціальні', 'підтримка', 'допомога'],
      icon: Heart
    },
    {
      id: 4,
      name: 'Parking Permit',
      nameUk: 'Дозвіл на паркування',
      description: 'Get residential parking permits',
      descriptionUk: 'Отримайте дозволи на житлове паркування',
      category: 'Transport & Traffic',
      categoryUk: 'Транспорт та рух',
      rating: 4.0,
      price: '200-500 UAH/month',
      duration: '3-5 business days',
      durationUk: '3-5 робочих днів',
      availability: 'available',
      location: 'Traffic Department',
      locationUk: 'Департамент дорожнього руху',
      contact: {
        phone: '+380 44 123 4570',
        email: 'parking@city.gov.ua'
      },
      tags: ['parking', 'permit', 'transport'],
      tagsUk: ['паркування', 'дозвіл', 'транспорт'],
      icon: MapPin
    },
    {
      id: 5,
      name: 'School Registration',
      nameUk: 'Реєстрація в школі',
      description: 'Register your child for public schools',
      descriptionUk: 'Зареєструйте свою дитину в державних школах',
      category: 'Education',
      categoryUk: 'Освіта',
      rating: 4.7,
      price: 'Free service',
      duration: '1-2 business days',
      durationUk: '1-2 робочих дні',
      availability: 'available',
      location: 'Education Department',
      locationUk: 'Департамент освіти',
      contact: {
        phone: '+380 44 123 4571',
        email: 'education@city.gov.ua'
      },
      tags: ['school', 'registration', 'education'],
      tagsUk: ['школа', 'реєстрація', 'освіта'],
      icon: FileText
    },
    {
      id: 6,
      name: 'Waste Collection Schedule',
      nameUk: 'Розклад збору сміття',
      description: 'View and modify your waste collection schedule',
      descriptionUk: 'Переглядайте та змінюйте свій розклад збору сміття',
      category: 'Environmental',
      categoryUk: 'Екологічні',
      rating: 4.3,
      price: 'Free service',
      duration: 'Instant',
      durationUk: 'Миттєво',
      availability: 'available',
      location: 'Online/Environmental Dept',
      locationUk: 'Онлайн/Екологічний департамент',
      contact: {
        phone: '+380 44 123 4572',
        email: 'waste@city.gov.ua'
      },
      tags: ['waste', 'collection', 'environment'],
      tagsUk: ['сміття', 'збір', 'довкілля'],
      icon: Leaf
    }
  ];

  const categories = [
    { value: 'all', label: language === 'en' ? 'All Services' : 'Всі послуги' },
    { value: 'Housing & Utilities', label: language === 'en' ? 'Housing & Utilities' : 'Житлово-комунальні' },
    { value: 'Permits & Registration', label: language === 'en' ? 'Permits & Registration' : 'Дозволи та реєстрація' },
    { value: 'Social Services', label: language === 'en' ? 'Social Services' : 'Соціальні послуги' },
    { value: 'Transport & Traffic', label: language === 'en' ? 'Transport & Traffic' : 'Транспорт та рух' },
    { value: 'Education', label: language === 'en' ? 'Education' : 'Освіта' },
    { value: 'Environmental', label: language === 'en' ? 'Environmental' : 'Екологічні' }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      (language === 'en' ? service.name : service.nameUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? service.description : service.descriptionUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? service.tags : service.tagsUk).some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || 
      service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return (
          <Badge variant="default" className="shadow-sm bg-green-600 text-white">
            {language === 'en' ? 'Available' : 'Доступно'}
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="secondary" className="shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Busy' : 'Зайнято'}
          </Badge>
        );
      case 'unavailable':
        return (
          <Badge variant="destructive" className="shadow-sm">
            {language === 'en' ? 'Unavailable' : 'Недоступно'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const handleApply = (service: Service) => {
    toast.success(`${language === 'en' ? 'Applied for' : 'Подано заявку на'}: ${language === 'en' ? service.name : service.nameUk}`);
  };

  const handleLearnMore = (service: Service) => {
    toast.info(`${language === 'en' ? 'More information about' : 'Більше інформації про'}: ${language === 'en' ? service.name : service.nameUk}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'City Services' : 'Міські послуги'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'en' 
            ? 'Access all available city services and submit requests online.' 
            : 'Отримайте доступ до всіх доступних міських послуг та подавайте запити онлайн.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === 'en' ? 'Search services...' : 'Пошук послуг...'}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md min-w-[200px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-gray-900 dark:text-white text-lg leading-tight">
                        {language === 'en' ? service.name : service.nameUk}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex space-x-1">
                          {renderStars(service.rating)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {service.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getAvailabilityBadge(service.availability)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === 'en' ? service.description : service.descriptionUk}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {language === 'en' ? 'Cost:' : 'Вартість:'} 
                      <span className="ml-1 text-gray-900 dark:text-white font-medium">{service.price}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {language === 'en' ? 'Processing time:' : 'Час обробки:'} {language === 'en' ? service.duration : service.durationUk}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-500 dark:text-red-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {language === 'en' ? service.location : service.locationUk}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(language === 'en' ? service.tags : service.tagsUk).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-6">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={service.availability === 'unavailable'}
                    onClick={() => handleApply(service)}
                  >
                    {language === 'en' ? 'Apply' : 'Подати заявку'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLearnMore(service)}
                  >
                    {language === 'en' ? 'Learn More' : 'Детальніше'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? 'No services found matching your criteria.' 
              : 'Не знайдено послуг, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResidentServicesModule;
