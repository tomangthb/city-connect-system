
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Search,
  FileText,
  Clock,
  User,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Appeal {
  id: string;
  title: string;
  titleUk: string;
  description: string;
  descriptionUk: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  category: string;
  categoryUk: string;
  createdDate: string;
  updatedDate: string;
  response?: string;
  responseUk?: string;
}

const ResidentAppealsModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [newAppeal, setNewAppeal] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const categories = [
    { id: 'infrastructure', name: language === 'en' ? 'Infrastructure' : 'Інфраструктура' },
    { id: 'utilities', name: language === 'en' ? 'Utilities' : 'Комунальні послуги' },
    { id: 'transport', name: language === 'en' ? 'Transport' : 'Транспорт' },
    { id: 'environment', name: language === 'en' ? 'Environment' : 'Навколишнє середовище' },
    { id: 'safety', name: language === 'en' ? 'Safety' : 'Безпека' },
    { id: 'other', name: language === 'en' ? 'Other' : 'Інше' }
  ];

  const statusOptions = [
    { id: 'all', name: language === 'en' ? 'All Statuses' : 'Всі статуси' },
    { id: 'pending', name: language === 'en' ? 'Pending' : 'Очікує' },
    { id: 'in-progress', name: language === 'en' ? 'In Progress' : 'В процесі' },
    { id: 'completed', name: language === 'en' ? 'Completed' : 'Завершено' },
    { id: 'rejected', name: language === 'en' ? 'Rejected' : 'Відхилено' }
  ];

  const appeals: Appeal[] = [
    {
      id: '9f531ca3',
      title: 'Street Light Repair',
      titleUk: 'на вул. Лукаша не працюють деякі ліхтарі',
      description: 'Several street lights on Maple Street are not working, creating safety concerns.',
      descriptionUk: 'Кілька вуличних ліхтарів на вулиці Кленовій не працюють, що створює проблеми з безпекою.',
      status: 'completed',
      priority: 'medium',
      category: 'infrastructure',
      categoryUk: 'Інфраструктура',
      createdDate: '2025-05-30',
      updatedDate: '2025-05-30',
      response: 'Street lights have been repaired and are now fully operational.',
      responseUk: 'Вуличні ліхтарі відремонтовано та вони повністю працюють.'
    },
    {
      id: 'ab123cd4',
      title: 'Pothole on Main Street',
      titleUk: 'Яма на Головній вулиці',
      description: 'Large pothole causing damage to vehicles near the intersection.',
      descriptionUk: 'Велика яма, що спричиняє пошкодження транспортних засобів біля перехрестя.',
      status: 'in-progress',
      priority: 'high',
      category: 'infrastructure',
      categoryUk: 'Інфраструктура',
      createdDate: '2025-05-28',
      updatedDate: '2025-05-29'
    },
    {
      id: 'ef567gh8',
      title: 'Garbage Collection Issue',
      titleUk: 'Проблема з вивозом сміття',
      description: 'Garbage has not been collected for over a week in our neighborhood.',
      descriptionUk: 'Сміття не вивозили понад тиждень у нашому районі.',
      status: 'pending',
      priority: 'medium',
      category: 'utilities',
      categoryUk: 'Комунальні послуги',
      createdDate: '2025-05-25',
      updatedDate: '2025-05-25'
    }
  ];

  const filteredAppeals = appeals.filter(appeal => {
    const title = language === 'en' ? appeal.title : appeal.titleUk;
    const description = language === 'en' ? appeal.description : appeal.descriptionUk;
    
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || appeal.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: language === 'en' ? 'Pending' : 'Очікує',
      'in-progress': language === 'en' ? 'In Progress' : 'В процесі',
      completed: language === 'en' ? 'Completed' : 'Завершено',
      rejected: language === 'en' ? 'Rejected' : 'Відхилено'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };

    const labels = {
      low: language === 'en' ? 'Low' : 'Низький',
      medium: language === 'en' ? 'Medium' : 'Середній',
      high: language === 'en' ? 'High' : 'Високий'
    };

    return (
      <Badge className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    );
  };

  const handleCreateAppeal = () => {
    if (!newAppeal.title.trim() || !newAppeal.description.trim()) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    // Here you would typically send the appeal to your backend
    toast.success(language === 'en' ? 'Appeal submitted successfully' : 'Звернення подано успішно');
    setShowCreateDialog(false);
    setNewAppeal({
      title: '',
      description: '',
      category: 'infrastructure',
      priority: 'medium'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
          {language === 'en' ? 'My Appeals' : 'Мої звернення'}
        </h2>
        <p className="text-gray-200 dark:text-gray-200">
          {language === 'en' 
            ? 'Submit and track your appeals to city services.' 
            : 'Подавайте та відстежуйте свої звернення до міських служб.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search appeals...' : 'Пошук звернень...'}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border border-gray-300 rounded-md min-w-[200px]"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map(status => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'New Appeal' : 'Нове звернення'}
        </Button>
      </div>

      {/* Appeals List */}
      <div className="space-y-4">
        {filteredAppeals.map((appeal) => (
          <Card key={appeal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">ID: {appeal.id}</span>
                    <Badge variant="outline">
                      {language === 'en' ? appeal.category : appeal.categoryUk}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white dark:text-white mb-2">
                    {language === 'en' ? appeal.title : appeal.titleUk}
                  </h3>
                  <p className="text-gray-200 dark:text-gray-200 mb-3">
                    {language === 'en' ? appeal.description : appeal.descriptionUk}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(appeal.status)}
                  {getPriorityBadge(appeal.priority)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-300 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {language === 'en' ? 'Created' : 'Створено'}: {formatDate(appeal.createdDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {language === 'en' ? 'Updated' : 'Оновлено'}: {formatDate(appeal.updatedDate)}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedAppeal(appeal)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Details' : 'Деталі'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppeals.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'en' 
              ? 'No appeals found matching your criteria.' 
              : 'Не знайдено звернень, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}

      {/* Create Appeal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Submit New Appeal' : 'Подати нове звернення'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Title' : 'Заголовок'} *
              </label>
              <Input
                placeholder={language === 'en' ? 'Enter appeal title...' : 'Введіть заголовок звернення...'}
                value={newAppeal.title}
                onChange={(e) => setNewAppeal({ ...newAppeal, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Category' : 'Категорія'}
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAppeal.category}
                onChange={(e) => setNewAppeal({ ...newAppeal, category: e.target.value })}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Priority' : 'Пріоритет'}
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newAppeal.priority}
                onChange={(e) => setNewAppeal({ ...newAppeal, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <option value="low">{language === 'en' ? 'Low' : 'Низький'}</option>
                <option value="medium">{language === 'en' ? 'Medium' : 'Середній'}</option>
                <option value="high">{language === 'en' ? 'High' : 'Високий'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'en' ? 'Description' : 'Опис'} *
              </label>
              <Textarea
                placeholder={language === 'en' ? 'Describe your appeal in detail...' : 'Детально опишіть своє звернення...'}
                value={newAppeal.description}
                onChange={(e) => setNewAppeal({ ...newAppeal, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {language === 'en' ? 'Cancel' : 'Скасувати'}
              </Button>
              <Button onClick={handleCreateAppeal}>
                {language === 'en' ? 'Submit Appeal' : 'Подати звернення'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appeal Details Dialog */}
      <Dialog open={!!selectedAppeal} onOpenChange={() => setSelectedAppeal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Appeal Details' : 'Деталі звернення'}
            </DialogTitle>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">ID:</span>
                <span>{selectedAppeal.id}</span>
                {getStatusBadge(selectedAppeal.status)}
                {getPriorityBadge(selectedAppeal.priority)}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === 'en' ? selectedAppeal.title : selectedAppeal.titleUk}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? selectedAppeal.description : selectedAppeal.descriptionUk}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{language === 'en' ? 'Category:' : 'Категорія:'}</span>
                  <p>{language === 'en' ? selectedAppeal.category : selectedAppeal.categoryUk}</p>
                </div>
                <div>
                  <span className="font-medium">{language === 'en' ? 'Created:' : 'Створено:'}</span>
                  <p>{formatDate(selectedAppeal.createdDate)}</p>
                </div>
                <div>
                  <span className="font-medium">{language === 'en' ? 'Last Updated:' : 'Останнє оновлення:'}</span>
                  <p>{formatDate(selectedAppeal.updatedDate)}</p>
                </div>
              </div>

              {selectedAppeal.response && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{language === 'en' ? 'Official Response:' : 'Офіційна відповідь:'}</h4>
                  <p className="text-gray-700">
                    {language === 'en' ? selectedAppeal.response : selectedAppeal.responseUk}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setSelectedAppeal(null)}>
                  {language === 'en' ? 'Close' : 'Закрити'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentAppealsModule;
