
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, MapPin, Calendar, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Resource {
  id: string;
  name: string;
  name_uk: string;
  category: string;
  category_uk: string;
  description?: string;
  description_uk?: string;
  location?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ResourcesManagement = () => {
  const { language, t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_uk: '',
    category: '',
    category_uk: '',
    description: '',
    description_uk: '',
    location: '',
    status: 'Available'
  });

  const statusOptions = [
    { value: 'Available', label: language === 'en' ? 'Available' : 'Доступний' },
    { value: 'In Use', label: language === 'en' ? 'In Use' : 'Використовується' },
    { value: 'Maintenance', label: language === 'en' ? 'Maintenance' : 'Обслуговування' },
    { value: 'Unavailable', label: language === 'en' ? 'Unavailable' : 'Недоступний' }
  ];

  const categoryOptions = [
    { value: 'Infrastructure', value_uk: 'Інфраструктура' },
    { value: 'Transportation', value_uk: 'Транспорт' },
    { value: 'Equipment', value_uk: 'Обладнання' },
    { value: 'Facilities', value_uk: 'Споруди' },
    { value: 'Technology', value_uk: 'Технології' },
    { value: 'Utilities', value_uk: 'Комунальні послуги' }
  ];

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error(language === 'en' ? 'Error loading resources' : 'Помилка завантаження ресурсів');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      if (editingResource) {
        const { error } = await supabase
          .from('resources')
          .update({
            name: formData.name,
            name_uk: formData.name_uk,
            category: formData.category,
            category_uk: formData.category_uk,
            description: formData.description || null,
            description_uk: formData.description_uk || null,
            location: formData.location || null,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingResource.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Resource updated successfully' : 'Ресурс успішно оновлено');
      } else {
        const { error } = await supabase
          .from('resources')
          .insert({
            name: formData.name,
            name_uk: formData.name_uk,
            category: formData.category,
            category_uk: formData.category_uk,
            description: formData.description || null,
            description_uk: formData.description_uk || null,
            location: formData.location || null,
            status: formData.status
          });

        if (error) throw error;
        toast.success(language === 'en' ? 'Resource created successfully' : 'Ресурс успішно створено');
      }

      resetForm();
      loadResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error(language === 'en' ? 'Error saving resource' : 'Помилка збереження ресурсу');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this resource?' : 'Ви впевнені, що хочете видалити цей ресурс?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(language === 'en' ? 'Resource deleted successfully' : 'Ресурс успішно видалено');
      loadResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error(language === 'en' ? 'Error deleting resource' : 'Помилка видалення ресурсу');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_uk: '',
      category: '',
      category_uk: '',
      description: '',
      description_uk: '',
      location: '',
      status: 'Available'
    });
    setEditingResource(null);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (resource: Resource) => {
    setFormData({
      name: resource.name,
      name_uk: resource.name_uk,
      category: resource.category,
      category_uk: resource.category_uk,
      description: resource.description || '',
      description_uk: resource.description_uk || '',
      location: resource.location || '',
      status: resource.status
    });
    setEditingResource(resource);
    setIsCreateDialogOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const nameMatch = (language === 'en' ? resource.name : resource.name_uk)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || resource.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || resource.category === categoryFilter;
    
    return nameMatch && statusMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          {language === 'en' ? 'Loading...' : 'Завантаження...'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Resource Management' : 'Управління ресурсами'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage city resources, equipment, and facilities' 
              : 'Керування міськими ресурсами, обладнанням та об\'єктами'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Resource' : 'Додати ресурс'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingResource 
                  ? (language === 'en' ? 'Edit Resource' : 'Редагувати ресурс')
                  : (language === 'en' ? 'Add New Resource' : 'Додати новий ресурс')
                }
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {language === 'en' ? 'Name (English)' : 'Назва (англійською)'} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name_uk">
                    {language === 'en' ? 'Name (Ukrainian)' : 'Назва (українською)'} *
                  </Label>
                  <Input
                    id="name_uk"
                    value={formData.name_uk}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_uk: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    {language === 'en' ? 'Category' : 'Категорія'} *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      const category = categoryOptions.find(cat => cat.value === value);
                      setFormData(prev => ({ 
                        ...prev, 
                        category: value,
                        category_uk: category?.value_uk || value
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? 'Select category' : 'Оберіть категорію'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {language === 'en' ? category.value : category.value_uk}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    {language === 'en' ? 'Status' : 'Статус'}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  {language === 'en' ? 'Location' : 'Розташування'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter location' : 'Введіть розташування'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {language === 'en' ? 'Description (English)' : 'Опис (англійською)'}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description_uk">
                    {language === 'en' ? 'Description (Ukrainian)' : 'Опис (українською)'}
                  </Label>
                  <Textarea
                    id="description_uk"
                    value={formData.description_uk}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_uk: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {language === 'en' ? 'Cancel' : 'Скасувати'}
                </Button>
                <Button type="submit">
                  {editingResource 
                    ? (language === 'en' ? 'Update' : 'Оновити')
                    : (language === 'en' ? 'Create' : 'Створити')
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === 'en' ? 'Search resources...' : 'Пошук ресурсів...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={language === 'en' ? 'Status' : 'Статус'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Statuses' : 'Всі статуси'}
                </SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'en' ? 'Category' : 'Категорія'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Categories' : 'Всі категорії'}
                </SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {language === 'en' ? category.value : category.value_uk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {language === 'en' ? resource.name : resource.name_uk}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(resource)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={getStatusBadgeColor(resource.status)}>
                  {statusOptions.find(s => s.value === resource.status)?.label || resource.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {language === 'en' ? resource.category : resource.category_uk}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {(resource.description || resource.description_uk) && (
                <p className="text-sm text-gray-600">
                  {language === 'en' ? resource.description : resource.description_uk}
                </p>
              )}
              
              {resource.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {resource.location}
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {language === 'en' ? 'Updated: ' : 'Оновлено: '}
                {new Date(resource.updated_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {language === 'en' ? 'No resources found' : 'Ресурси не знайдено'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourcesManagement;
