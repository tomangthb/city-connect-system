
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Filter,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Appeal {
  id: string;
  subject: string;
  subjectUk: string;
  description: string;
  descriptionUk: string;
  category: string;
  categoryUk: string;
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dateSubmitted: string;
  dateUpdated: string;
  responseTime: string;
  assignedTo?: string;
}

const ResidentAppealsModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const appeals: Appeal[] = [
    {
      id: '9f531ca3',
      subject: 'Pothole on Main Street',
      subjectUk: 'Погане освітлення',
      description: 'на вул. Лукаша не працюють деякі ліхтарі',
      descriptionUk: 'на вул. Лукаша не працюють деякі ліхтарі',
      category: 'Infrastructure',
      categoryUk: 'Інфраструктура',
      status: 'resolved',
      priority: 'medium',
      dateSubmitted: '30.05.2025',
      dateUpdated: '30.05.2025',
      responseTime: '2-3 business days',
      assignedTo: 'John Smith'
    },
    {
      id: '2',
      subject: 'Broken streetlight',
      subjectUk: 'Зламаний ліхтар',
      description: 'Streetlight on Park Avenue has been out for a week',
      descriptionUk: 'Ліхтар на Парковій алеї не працює вже тиждень',
      category: 'Public Safety',
      categoryUk: 'Громадська безпека',
      status: 'pending',
      priority: 'medium',
      dateSubmitted: '2024-05-12',
      dateUpdated: '2024-05-12',
      responseTime: '5-7 business days'
    },
    {
      id: '3',
      subject: 'Noise complaint',
      subjectUk: 'Скарга на шум',
      description: 'Construction work starting too early in residential area',
      descriptionUk: 'Будівельні роботи починаються занадто рано в житловому районі',
      category: 'Environmental',
      categoryUk: 'Екологічні',
      status: 'in-review',
      priority: 'low',
      dateSubmitted: '2024-05-10',
      dateUpdated: '2024-05-15',
      responseTime: '3-5 business days',
      assignedTo: 'Maria Garcia'
    }
  ];

  const categories = [
    { value: 'infrastructure', label: language === 'en' ? 'Infrastructure' : 'Інфраструктура' },
    { value: 'public-safety', label: language === 'en' ? 'Public Safety' : 'Громадська безпека' },
    { value: 'environmental', label: language === 'en' ? 'Environmental' : 'Екологічні' },
    { value: 'housing', label: language === 'en' ? 'Housing' : 'Житло' },
    { value: 'transportation', label: language === 'en' ? 'Transportation' : 'Транспорт' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Інше' }
  ];

  const statuses = [
    { value: 'all', label: language === 'en' ? 'All Statuses' : 'Всі статуси' },
    { value: 'pending', label: language === 'en' ? 'Pending' : 'Очікує' },
    { value: 'in-review', label: language === 'en' ? 'In Review' : 'На розгляді' },
    { value: 'resolved', label: language === 'en' ? 'Resolved' : 'Вирішено' },
    { value: 'rejected', label: language === 'en' ? 'Rejected' : 'Відхилено' }
  ];

  const filteredAppeals = appeals.filter(appeal => {
    const subject = language === 'en' ? appeal.subject : appeal.subjectUk;
    const description = language === 'en' ? appeal.description : appeal.descriptionUk;
    
    const matchesSearch = 
      subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || appeal.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Pending' : 'Очікує'}
          </Badge>
        );
      case 'in-review':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'In Review' : 'На розгляді'}
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Completed' : 'Completed'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Rejected' : 'Відхилено'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">{language === 'en' ? 'High' : 'Високий'}</Badge>;
      case 'medium':
        return <Badge variant="secondary">{language === 'en' ? 'Medium' : 'Medium'}</Badge>;
      case 'low':
        return <Badge variant="outline">{language === 'en' ? 'Low' : 'Низький'}</Badge>;
      default:
        return null;
    }
  };

  const handleCreateAppeal = () => {
    if (!newAppeal.subject || !newAppeal.description || !newAppeal.category) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    // Here you would typically send the data to your backend
    toast.success(language === 'en' ? 'Appeal submitted successfully' : 'Звернення успішно подано');
    setShowCreateDialog(false);
    setNewAppeal({
      subject: '',
      description: '',
      category: '',
      priority: 'medium' as 'low' | 'medium' | 'high'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'My Appeals' : 'Мої звернення'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'en' 
            ? 'Submit and track your appeals to the city administration.' 
            : 'Подавайте та відстежуйте свої звернення до міської адміністрації.'}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder={language === 'en' ? 'Search appeals...' : 'Пошук звернень...'}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'New Appeal' : 'Нове звернення'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Submit New Appeal' : 'Подати нове звернення'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Subject' : 'Тема'}
                </label>
                <Input 
                  value={newAppeal.subject}
                  onChange={(e) => setNewAppeal({...newAppeal, subject: e.target.value})}
                  placeholder={language === 'en' ? 'Brief description of the issue' : 'Короткий опис проблеми'}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Category' : 'Категорія'}
                </label>
                <Select value={newAppeal.category} onValueChange={(value) => setNewAppeal({...newAppeal, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select category' : 'Оберіть категорію'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Priority' : 'Пріоритет'}
                </label>
                <Select value={newAppeal.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewAppeal({...newAppeal, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{language === 'en' ? 'Low' : 'Низький'}</SelectItem>
                    <SelectItem value="medium">{language === 'en' ? 'Medium' : 'Середній'}</SelectItem>
                    <SelectItem value="high">{language === 'en' ? 'High' : 'Високий'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Description' : 'Опис'}
                </label>
                <Textarea 
                  value={newAppeal.description}
                  onChange={(e) => setNewAppeal({...newAppeal, description: e.target.value})}
                  placeholder={language === 'en' ? 'Provide detailed information about the issue' : 'Надайте детальну інформацію про проблему'}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateAppeal} className="flex-1">
                  {language === 'en' ? 'Submit Appeal' : 'Подати звернення'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  {language === 'en' ? 'Cancel' : 'Скасувати'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Appeals List */}
      <div className="grid gap-4">
        {filteredAppeals.map((appeal) => (
          <Card key={appeal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {language === 'en' ? appeal.subject : appeal.subjectUk}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    ID: {appeal.id} • {language === 'en' ? appeal.category : appeal.categoryUk}
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(appeal.status)}
                    {getPriorityBadge(appeal.priority)}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {language === 'en' ? appeal.description : appeal.descriptionUk}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {language === 'en' ? 'Created:' : 'Створено:'} {appeal.dateSubmitted}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {language === 'en' ? 'Updated:' : 'Оновлено:'} {appeal.dateUpdated}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'View Details' : 'Переглянути деталі'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppeals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? 'No appeals found matching your criteria.' 
              : 'Не знайдено звернень, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResidentAppealsModule;
