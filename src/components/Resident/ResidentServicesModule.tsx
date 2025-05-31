
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
  Heart
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
      name: 'Document Processing',
      nameUk: 'Обробка документів',
      description: 'Fast processing of official documents, certificates, and permits',
      descriptionUk: 'Швидка обробка офіційних документів, довідок та дозволів',
      category: 'Administrative',
      categoryUk: 'Адміністративні',
      rating: 4.8,
      price: '₴150-500',
      duration: '2-5 business days',
      durationUk: '2-5 робочих днів',
      availability: 'available',
      location: 'City Hall, Room 201',
      locationUk: 'Міська рада, кімната 201',
      contact: {
        phone: '+380 44 123 4567',
        email: 'documents@city.gov.ua'
      },
      tags: ['documents', 'certificates', 'permits'],
      tagsUk: ['документи', 'довідки', 'дозволи'],
      icon: FileText
    },
    {
      id: 2,
      name: 'Utility Bill Payment',
      nameUk: 'Оплата комунальних послуг',
      description: 'Pay water, gas, electricity, and heating bills online or in person',
      descriptionUk: 'Оплачуйте рахунки за воду, газ, електроенергію та опалення онлайн або особисто',
      category: 'Financial',
      categoryUk: 'Фінансові',
      rating: 4.6,
      price: 'No fee',
      duration: 'Instant',
      durationUk: 'Миттєво',
      availability: 'available',
      location: 'Online Portal / City Hall',
      locationUk: 'Онлайн портал / Міська рада',
      contact: {
        phone: '+380 44 123 4568',
        email: 'payments@city.gov.ua'
      },
      tags: ['utilities', 'payments', 'bills'],
      tagsUk: ['комунальні', 'платежі', 'рахунки'],
      icon: CreditCard
    },
    {
      id: 3,
      name: 'Healthcare Registration',
      nameUk: 'Реєстрація у системі охорони здоров\'я',
      description: 'Register for municipal healthcare services and family doctor assignment',
      descriptionUk: 'Реєстрація на муніципальні медичні послуги та призначення сімейного лікаря',
      category: 'Healthcare',
      categoryUk: 'Охорона здоров\'я',
      rating: 4.5,
      price: 'Free',
      duration: '1-3 business days',
      durationUk: '1-3 робочих дні',
      availability: 'busy',
      location: 'Healthcare Center',
      locationUk: 'Центр охорони здоров\'я',
      contact: {
        phone: '+380 44 123 4569',
        email: 'healthcare@city.gov.ua'
      },
      tags: ['healthcare', 'registration', 'doctor'],
      tagsUk: ['здоров\'я', 'реєстрація', 'лікар'],
      icon: Heart
    }
  ];

  const categories = [
    { value: 'all', label: language === 'en' ? 'All Services' : 'Всі послуги' },
    { value: 'administrative', label: language === 'en' ? 'Administrative' : 'Адміністративні' },
    { value: 'financial', label: language === 'en' ? 'Financial' : 'Фінансові' },
    { value: 'healthcare', label: language === 'en' ? 'Healthcare' : 'Охорона здоров\'я' }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      (language === 'en' ? service.name : service.nameUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? service.description : service.descriptionUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? service.tags : service.tagsUk).some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || 
      service.category.toLowerCase() === selectedCategory;
    
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
            : 'text-gray-600 dark:text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-enhanced mb-2">
          {language === 'en' ? 'City Services' : 'Міські послуги'}
        </h2>
        <p className="text-secondary-enhanced">
          {language === 'en' 
            ? 'Access all available city services, book appointments, and manage requests.' 
            : 'Отримайте доступ до всіх доступних міських послуг, записуйтесь на прийом та керуйте запитами.'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 icon-enhanced" />
          <Input
            placeholder={language === 'en' ? 'Search services...' : 'Пошук послуг...'}
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

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="enhanced-card-block">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-green-400 icon-enhanced" />
                    </div>
                    <div>
                      <CardTitle className="text-primary-enhanced">
                        {language === 'en' ? service.name : service.nameUk}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex space-x-1">
                          {renderStars(service.rating)}
                        </div>
                        <span className="text-sm text-muted-enhanced">
                          {service.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getAvailabilityBadge(service.availability)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-secondary-enhanced">
                  {language === 'en' ? service.description : service.descriptionUk}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-green-400 icon-enhanced" />
                    <span className="text-muted-enhanced">
                      {language === 'en' ? 'Price:' : 'Ціна:'} 
                      <span className="price-display ml-1">{service.price}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-400 icon-enhanced" />
                    <span className="text-muted-enhanced">
                      {language === 'en' ? service.duration : service.durationUk}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-red-400 icon-enhanced" />
                    <span className="text-muted-enhanced">
                      {language === 'en' ? service.location : service.locationUk}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-400 icon-enhanced" />
                    <span className="text-muted-enhanced">{service.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-400 icon-enhanced" />
                    <span className="text-muted-enhanced">{service.contact.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(language === 'en' ? service.tags : service.tagsUk).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="success" 
                    className="flex-1"
                    disabled={service.availability === 'unavailable'}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Details' : 'Деталі'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-muted-enhanced">
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
