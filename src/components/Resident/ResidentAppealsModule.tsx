
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Plus,
  Clock,
  User,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Appeal {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'Under Review' | 'In Progress' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
}

const ResidentAppealsModule = () => {
  const { language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newAppeal, setNewAppeal] = useState({
    title: '',
    category: '',
    content: ''
  });

  // Mock appeals data
  const [appeals, setAppeals] = useState<Appeal[]>([
    {
      id: '001',
      title: language === 'en' ? 'Street Light Repair Request' : 'Запит на ремонт вуличного освітлення',
      category: language === 'en' ? 'Infrastructure' : 'Інфраструктура',
      content: language === 'en' 
        ? 'The street light on Main Street has been broken for two weeks...' 
        : 'Вуличне освітлення на Головній вулиці не працює вже два тижні...',
      status: 'In Progress',
      priority: 'Medium',
      created_at: '2024-05-10',
      updated_at: '2024-05-12'
    },
    {
      id: '002',
      title: language === 'en' ? 'Noise Complaint' : 'Скарга на шум',
      category: language === 'en' ? 'Public Order' : 'Громадський порядок',
      content: language === 'en' 
        ? 'Construction work starts too early in the morning...' 
        : 'Будівельні роботи починаються занадто рано вранці...',
      status: 'Under Review',
      priority: 'Low',
      created_at: '2024-05-08',
      updated_at: '2024-05-08'
    },
    {
      id: '003',
      title: language === 'en' ? 'Pothole Repair' : 'Ремонт ями на дорозі',
      category: language === 'en' ? 'Roads' : 'Дороги',
      content: language === 'en' 
        ? 'Large pothole causing damage to vehicles...' 
        : 'Велика яма на дорозі завдає шкоди транспортним засобам...',
      status: 'Completed',
      priority: 'High',
      created_at: '2024-05-05',
      updated_at: '2024-05-15'
    }
  ]);

  const categories = [
    { value: 'infrastructure', label: language === 'en' ? 'Infrastructure' : 'Інфраструктура' },
    { value: 'roads', label: language === 'en' ? 'Roads' : 'Дороги' },
    { value: 'public_order', label: language === 'en' ? 'Public Order' : 'Громадський порядок' },
    { value: 'environment', label: language === 'en' ? 'Environment' : 'Навколишнє середовище' },
    { value: 'utilities', label: language === 'en' ? 'Utilities' : 'Комунальні послуги' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Інше' }
  ];

  const statuses = [
    { value: 'all', label: language === 'en' ? 'All Statuses' : 'Всі статуси' },
    { value: 'Under Review', label: language === 'en' ? 'Under Review' : 'На розгляді' },
    { value: 'In Progress', label: language === 'en' ? 'In Progress' : 'В процесі' },
    { value: 'Completed', label: language === 'en' ? 'Completed' : 'Завершено' },
    { value: 'Rejected', label: language === 'en' ? 'Rejected' : 'Відхилено' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitAppeal = () => {
    if (!newAppeal.title.trim() || !newAppeal.category || !newAppeal.content.trim()) {
      toast.error(language === 'en' ? 'Please fill all fields' : 'Будь ласка, заповніть всі поля');
      return;
    }

    const appeal: Appeal = {
      id: `00${appeals.length + 1}`,
      title: newAppeal.title,
      category: categories.find(c => c.value === newAppeal.category)?.label || newAppeal.category,
      content: newAppeal.content,
      status: 'Under Review',
      priority: 'Medium',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    setAppeals([appeal, ...appeals]);
    toast.success(language === 'en' ? 'Appeal submitted successfully!' : 'Звернення подано успішно!');
    setShowForm(false);
    setNewAppeal({ title: '', category: '', content: '' });
  };

  const filteredAppeals = appeals.filter(appeal => {
    const matchesSearch = appeal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appeal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'My Appeals' : 'Мої звернення'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Submit and track your appeals to the city administration.' 
              : 'Подавайте та відстежуйте свої звернення до міської адміністрації.'}
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'New Appeal' : 'Нове звернення'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Submit New Appeal' : 'Подати нове звернення'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Subject' : 'Тема'}
                </label>
                <Input 
                  placeholder={language === 'en' ? 'Brief description of your issue' : 'Короткий опис вашої проблеми'}
                  value={newAppeal.title}
                  onChange={(e) => setNewAppeal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Category' : 'Категорія'}
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newAppeal.category}
                  onChange={(e) => setNewAppeal(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">{language === 'en' ? 'Select category' : 'Виберіть категорію'}</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Description' : 'Опис'}
                </label>
                <Textarea 
                  placeholder={language === 'en' 
                    ? 'Provide detailed information about your issue...' 
                    : 'Надайте детальну інформацію про вашу проблему...'}
                  rows={4}
                  value={newAppeal.content}
                  onChange={(e) => setNewAppeal(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleSubmitAppeal} className="flex-1">
                  {language === 'en' ? 'Submit Appeal' : 'Подати звернення'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  {language === 'en' ? 'Cancel' : 'Скасувати'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Appeals List */}
      <div className="space-y-4">
        {filteredAppeals.length > 0 ? (
          filteredAppeals.map((appeal) => (
            <Card key={appeal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{appeal.title}</h3>
                    <p className="text-sm text-gray-600">ID: {appeal.id} • {appeal.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(appeal.status)}>
                      {appeal.status}
                    </Badge>
                    <Badge className={getPriorityColor(appeal.priority)}>
                      {appeal.priority}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{appeal.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Created:' : 'Створено:'} {appeal.created_at}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Updated:' : 'Оновлено:'} {appeal.updated_at}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAppeal(appeal)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'View Details' : 'Деталі'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {language === 'en' ? 'No appeals found' : 'Звернень не знайдено'}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Submit Your First Appeal' : 'Подати перше звернення'}
            </Button>
          </div>
        )}
      </div>

      {/* Appeal Details Dialog */}
      <Dialog open={!!selectedAppeal} onOpenChange={() => setSelectedAppeal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAppeal?.title}</DialogTitle>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(selectedAppeal.status)}>
                  {selectedAppeal.status}
                </Badge>
                <Badge className={getPriorityColor(selectedAppeal.priority)}>
                  {selectedAppeal.priority}
                </Badge>
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Category:' : 'Категорія:'} {selectedAppeal.category}
                </span>
              </div>
              
              <div>
                <label className="font-semibold text-sm block mb-2">
                  {language === 'en' ? 'Description' : 'Опис'}
                </label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedAppeal.content}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-semibold block">
                    {language === 'en' ? 'Created' : 'Створено'}
                  </label>
                  <p className="text-gray-600">{selectedAppeal.created_at}</p>
                </div>
                <div>
                  <label className="font-semibold block">
                    {language === 'en' ? 'Last Updated' : 'Останнє оновлення'}
                  </label>
                  <p className="text-gray-600">{selectedAppeal.updated_at}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedAppeal(null)}
                className="w-full"
              >
                {language === 'en' ? 'Close' : 'Закрити'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentAppealsModule;
