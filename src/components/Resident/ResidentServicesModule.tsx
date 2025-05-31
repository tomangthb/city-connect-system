
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Building,
  Users,
  Truck,
  GraduationCap,
  MapPin,
  Leaf,
  FileText,
  Clock,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const ResidentServicesModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);

  const categories = [
    { 
      id: 'all', 
      name: language === 'en' ? 'All Services' : 'Всі послуги', 
      icon: FileText 
    },
    { 
      id: 'housing', 
      name: language === 'en' ? 'Housing & Utilities' : 'Житлово-комунальні', 
      icon: Building 
    },
    { 
      id: 'permits', 
      name: language === 'en' ? 'Permits & Registration' : 'Дозволи та реєстрація', 
      icon: FileText 
    },
    { 
      id: 'social', 
      name: language === 'en' ? 'Social Services' : 'Соціальні послуги', 
      icon: Users 
    },
    { 
      id: 'transport', 
      name: language === 'en' ? 'Transport & Traffic' : 'Транспорт та рух', 
      icon: Truck 
    },
    { 
      id: 'education', 
      name: language === 'en' ? 'Education' : 'Освіта', 
      icon: GraduationCap 
    },
    { 
      id: 'planning', 
      name: language === 'en' ? 'Land Use & Planning' : 'Землекористування', 
      icon: MapPin 
    },
    { 
      id: 'environmental', 
      name: language === 'en' ? 'Environmental Services' : 'Екологічні послуги', 
      icon: Leaf 
    },
  ];

  const services = [
    {
      id: '1',
      name: language === 'en' ? 'Water Bill Payment' : 'Оплата рахунків за воду',
      description: language === 'en' ? 'Pay your monthly water bills online' : 'Сплачуйте щомісячні рахунки за воду онлайн',
      category: 'housing',
      processingTime: language === 'en' ? 'Instant' : 'Миттєво',
      cost: language === 'en' ? 'Free service' : 'Безкоштовна послуга',
      rating: 4.8,
      status: 'Available'
    },
    {
      id: '2',
      name: language === 'en' ? 'Building Permit Application' : 'Заявка на будівельний дозвіл',
      description: language === 'en' ? 'Apply for construction and renovation permits' : 'Подача заявки на дозволи на будівництво та ремонт',
      category: 'permits',
      processingTime: language === 'en' ? '10-15 business days' : '10-15 робочих днів',
      cost: language === 'en' ? '500-2000 UAH' : '500-2000 грн',
      rating: 4.2,
      status: 'Available'
    },
    {
      id: '3',
      name: language === 'en' ? 'Social Support Application' : 'Заявка на соціальну підтримку',
      description: language === 'en' ? 'Apply for various social assistance programs' : 'Подача заявки на різні програми соціальної допомоги',
      category: 'social',
      processingTime: language === 'en' ? '5-7 business days' : '5-7 робочих днів',
      cost: language === 'en' ? 'Free service' : 'Безкоштовна послуга',
      rating: 4.5,
      status: 'Available'
    },
    {
      id: '4',
      name: language === 'en' ? 'Parking Permit' : 'Дозвіл на паркування',
      description: language === 'en' ? 'Get residential parking permits' : 'Отримання дозволів на житлове паркування',
      category: 'transport',
      processingTime: language === 'en' ? '3-5 business days' : '3-5 робочих днів',
      cost: language === 'en' ? '200-500 UAH/month' : '200-500 грн/місяць',
      rating: 4.0,
      status: 'Available'
    },
    {
      id: '5',
      name: language === 'en' ? 'School Registration' : 'Реєстрація в школі',
      description: language === 'en' ? 'Register your child for public schools' : 'Зареєструйте свою дитину в державних школах',
      category: 'education',
      processingTime: language === 'en' ? '1-2 business days' : '1-2 робочих дні',
      cost: language === 'en' ? 'Free service' : 'Безкоштовна послуга',
      rating: 4.7,
      status: 'Available'
    },
    {
      id: '6',
      name: language === 'en' ? 'Waste Collection Schedule' : 'Розклад збору сміття',
      description: language === 'en' ? 'View and modify your waste collection schedule' : 'Переглядайте та змінюйте розклад збору сміття',
      category: 'environmental',
      processingTime: language === 'en' ? 'Instant' : 'Миттєво',
      cost: language === 'en' ? 'Free service' : 'Безкоштовна послуга',
      rating: 4.3,
      status: 'Available'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleServiceDetails = (service: any) => {
    setSelectedService(service);
  };

  const handleServiceApplication = (service: any) => {
    setSelectedService(service);
    setApplicationDialogOpen(true);
    toast.success(`${language === 'en' ? 'Starting application for' : 'Починаємо подачу заявки на'}: ${service.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'City Services' : 'Міські послуги'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Access all available city services and submit requests online.' 
            : 'Отримайте доступ до всіх доступних міських послуг та подавайте запити онлайн.'}
        </p>
      </div>

      {/* Search */}
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
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 4).map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge 
                  variant={service.status === 'Available' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {service.status === 'Available' 
                    ? (language === 'en' ? 'Available' : 'Доступно')
                    : (language === 'en' ? 'Unavailable' : 'Недоступно')
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{service.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    {language === 'en' ? 'Processing time:' : 'Час обробки:'} {service.processingTime}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-700">
                    {language === 'en' ? 'Cost:' : 'Вартість:'} {service.cost}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-gray-700">{service.rating} / 5.0</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleServiceApplication(service)}
                >
                  {language === 'en' ? 'Apply' : 'Подати заявку'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleServiceDetails(service)}
                >
                  {language === 'en' ? 'Learn More' : 'Докладніше'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Details Dialog */}
      <Dialog open={!!selectedService && !applicationDialogOpen} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedService?.name}</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedService.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">
                    {language === 'en' ? 'Processing Time' : 'Час обробки'}
                  </label>
                  <p className="text-gray-600">{selectedService.processingTime}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">
                    {language === 'en' ? 'Cost' : 'Вартість'}
                  </label>
                  <p className="text-gray-600">{selectedService.cost}</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">
                    {language === 'en' ? 'Rating' : 'Рейтинг'}
                  </label>
                  <p className="text-gray-600">{selectedService.rating} / 5.0</p>
                </div>
                <div>
                  <label className="font-semibold text-sm">
                    {language === 'en' ? 'Status' : 'Статус'}
                  </label>
                  <Badge variant={selectedService.status === 'Available' ? 'default' : 'secondary'}>
                    {selectedService.status === 'Available' 
                      ? (language === 'en' ? 'Available' : 'Доступно')
                      : (language === 'en' ? 'Unavailable' : 'Недоступно')
                    }
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleServiceApplication(selectedService)}
                  className="flex-1"
                >
                  {language === 'en' ? 'Apply for Service' : 'Подати заявку на послугу'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedService(null)}
                >
                  {language === 'en' ? 'Close' : 'Закрити'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Apply for Service' : 'Подача заявки на послугу'}
            </DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedService.name}</h4>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Full Name' : 'Повне ім\'я'}
                  </label>
                  <Input placeholder={language === 'en' ? 'Enter your full name' : 'Введіть повне ім\'я'} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Contact Information' : 'Контактна інформація'}
                  </label>
                  <Input placeholder={language === 'en' ? 'Phone or email' : 'Телефон або електронна пошта'} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === 'en' ? 'Additional Notes' : 'Додаткові нотатки'}
                  </label>
                  <Input placeholder={language === 'en' ? 'Any additional information' : 'Будь-яка додаткова інформація'} />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    toast.success(language === 'en' ? 'Application submitted successfully!' : 'Заявку подано успішно!');
                    setApplicationDialogOpen(false);
                    setSelectedService(null);
                  }}
                  className="flex-1"
                >
                  {language === 'en' ? 'Submit Application' : 'Подати заявку'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setApplicationDialogOpen(false)}
                >
                  {language === 'en' ? 'Cancel' : 'Скасувати'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
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
