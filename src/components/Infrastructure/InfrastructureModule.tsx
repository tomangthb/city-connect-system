
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
import { Plus, Search, Edit, Trash2, MapPin, Calendar, Filter, Building, Car, Zap, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Asset {
  id: string;
  name: string;
  name_uk: string;
  category: string;
  category_uk: string;
  type: 'asset' | 'infrastructure';
  description?: string;
  description_uk?: string;
  location?: string;
  status: string;
  value?: number;
  acquisition_date?: string;
  maintenance_schedule?: string;
  created_at: string;
  updated_at: string;
}

const InfrastructureModule = () => {
  const { language, t } = useLanguage();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_uk: '',
    category: '',
    category_uk: '',
    type: 'asset' as 'asset' | 'infrastructure',
    description: '',
    description_uk: '',
    location: '',
    status: 'Active',
    value: '',
    acquisition_date: '',
    maintenance_schedule: ''
  });

  const statusOptions = [
    { value: 'Active', label: language === 'en' ? 'Active' : 'Активний' },
    { value: 'Under Maintenance', label: language === 'en' ? 'Under Maintenance' : 'На обслуговуванні' },
    { value: 'Decommissioned', label: language === 'en' ? 'Decommissioned' : 'Виведений з експлуатації' },
    { value: 'Planned', label: language === 'en' ? 'Planned' : 'Запланований' }
  ];

  const assetCategories = [
    { value: 'Buildings', value_uk: 'Будівлі' },
    { value: 'Vehicles', value_uk: 'Транспортні засоби' },
    { value: 'Equipment', value_uk: 'Обладнання' },
    { value: 'IT Assets', value_uk: 'ІТ активи' }
  ];

  const infrastructureCategories = [
    { value: 'Roads', value_uk: 'Дороги' },
    { value: 'Water Systems', value_uk: 'Водопостачання' },
    { value: 'Energy Grid', value_uk: 'Енергосистема' },
    { value: 'Telecommunications', value_uk: 'Телекомунікації' },
    { value: 'Waste Management', value_uk: 'Управління відходами' }
  ];

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to include type and ensure compatibility with any existing records
      const transformedData = (data || []).map(item => ({
        ...item,
        type: (item as any).type || 'asset' as 'asset' | 'infrastructure',
        value: (item as any).value || undefined,
        acquisition_date: (item as any).acquisition_date || undefined,
        maintenance_schedule: (item as any).maintenance_schedule || undefined
      })) as Asset[];
      
      setAssets(transformedData);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error(language === 'en' ? 'Error loading assets' : 'Помилка завантаження активів');
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
      const assetData = {
        name: formData.name,
        name_uk: formData.name_uk,
        category: formData.category,
        category_uk: formData.category_uk,
        type: formData.type,
        description: formData.description || null,
        description_uk: formData.description_uk || null,
        location: formData.location || null,
        status: formData.status,
        value: formData.value ? parseFloat(formData.value) : null,
        acquisition_date: formData.acquisition_date || null,
        maintenance_schedule: formData.maintenance_schedule || null
      };

      if (editingAsset) {
        const { error } = await supabase
          .from('resources')
          .update({ ...assetData, updated_at: new Date().toISOString() })
          .eq('id', editingAsset.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Asset updated successfully' : 'Актив успішно оновлено');
      } else {
        const { error } = await supabase
          .from('resources')
          .insert(assetData);

        if (error) throw error;
        toast.success(language === 'en' ? 'Asset created successfully' : 'Актив успішно створено');
      }

      resetForm();
      loadAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error(language === 'en' ? 'Error saving asset' : 'Помилка збереження активу');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this asset?' : 'Ви впевнені, що хочете видалити цей актив?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(language === 'en' ? 'Asset deleted successfully' : 'Актив успішно видалено');
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error(language === 'en' ? 'Error deleting asset' : 'Помилка видалення активу');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_uk: '',
      category: '',
      category_uk: '',
      type: 'asset',
      description: '',
      description_uk: '',
      location: '',
      status: 'Active',
      value: '',
      acquisition_date: '',
      maintenance_schedule: ''
    });
    setEditingAsset(null);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = (asset: Asset) => {
    setFormData({
      name: asset.name,
      name_uk: asset.name_uk,
      category: asset.category,
      category_uk: asset.category_uk,
      type: asset.type || 'asset',
      description: asset.description || '',
      description_uk: asset.description_uk || '',
      location: asset.location || '',
      status: asset.status,
      value: asset.value?.toString() || '',
      acquisition_date: asset.acquisition_date || '',
      maintenance_schedule: asset.maintenance_schedule || ''
    });
    setEditingAsset(asset);
    setIsCreateDialogOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Decommissioned': return 'bg-red-100 text-red-800';
      case 'Planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'infrastructure': return <Zap className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const nameMatch = (language === 'en' ? asset.name : asset.name_uk)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || asset.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || asset.category === categoryFilter;
    const typeMatch = typeFilter === 'all' || asset.type === typeFilter;
    
    return nameMatch && statusMatch && categoryMatch && typeMatch;
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
            {language === 'en' ? 'Assets & Infrastructure' : 'Активи та інфраструктура'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage municipal assets and infrastructure systems' 
              : 'Керування муніципальними активами та інфраструктурними системами'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Asset' : 'Додати актив'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAsset 
                  ? (language === 'en' ? 'Edit Asset' : 'Редагувати актив')
                  : (language === 'en' ? 'Add New Asset' : 'Додати новий актив')
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    {language === 'en' ? 'Type' : 'Тип'} *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'asset' | 'infrastructure') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">
                        {language === 'en' ? 'Asset' : 'Актив'}
                      </SelectItem>
                      <SelectItem value="infrastructure">
                        {language === 'en' ? 'Infrastructure' : 'Інфраструктура'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    {language === 'en' ? 'Category' : 'Категорія'} *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      const categories = formData.type === 'asset' ? assetCategories : infrastructureCategories;
                      const category = categories.find(cat => cat.value === value);
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
                      {(formData.type === 'asset' ? assetCategories : infrastructureCategories).map((category) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {language === 'en' ? 'Value (UAH)' : 'Вартість (грн)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="acquisition_date">
                    {language === 'en' ? 'Acquisition Date' : 'Дата придбання'}
                  </Label>
                  <Input
                    id="acquisition_date"
                    type="date"
                    value={formData.acquisition_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, acquisition_date: e.target.value }))}
                  />
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

              <div className="space-y-2">
                <Label htmlFor="maintenance_schedule">
                  {language === 'en' ? 'Maintenance Schedule' : 'Графік обслуговування'}
                </Label>
                <Input
                  id="maintenance_schedule"
                  value={formData.maintenance_schedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, maintenance_schedule: e.target.value }))}
                  placeholder={language === 'en' ? 'e.g., Monthly, Quarterly' : 'наприклад: Щомісяця, Щокварталу'}
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
                  {editingAsset 
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
                  placeholder={language === 'en' ? 'Search assets...' : 'Пошук активів...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'en' ? 'Type' : 'Тип'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Types' : 'Всі типи'}
                </SelectItem>
                <SelectItem value="asset">
                  {language === 'en' ? 'Assets' : 'Активи'}
                </SelectItem>
                <SelectItem value="infrastructure">
                  {language === 'en' ? 'Infrastructure' : 'Інфраструктура'}
                </SelectItem>
              </SelectContent>
            </Select>
            
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
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            {language === 'en' ? 'All' : 'Всі'}
          </TabsTrigger>
          <TabsTrigger value="asset">
            {language === 'en' ? 'Assets' : 'Активи'}
          </TabsTrigger>
          <TabsTrigger value="infrastructure">
            {language === 'en' ? 'Infrastructure' : 'Інфраструктура'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      {getTypeIcon(asset.type)}
                      <span className="ml-2">
                        {language === 'en' ? asset.name : asset.name_uk}
                      </span>
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusBadgeColor(asset.status)}>
                      {statusOptions.find(s => s.value === asset.status)?.label || asset.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {language === 'en' ? asset.category : asset.category_uk}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {(asset.description || asset.description_uk) && (
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? asset.description : asset.description_uk}
                    </p>
                  )}
                  
                  {asset.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {asset.location}
                    </div>
                  )}

                  {asset.value && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">
                        {language === 'en' ? 'Value: ' : 'Вартість: '}
                        {asset.value.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Updated: ' : 'Оновлено: '}
                    {new Date(asset.updated_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="asset">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.filter(asset => asset.type === 'asset').map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      {getTypeIcon(asset.type)}
                      <span className="ml-2">
                        {language === 'en' ? asset.name : asset.name_uk}
                      </span>
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusBadgeColor(asset.status)}>
                      {statusOptions.find(s => s.value === asset.status)?.label || asset.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {language === 'en' ? asset.category : asset.category_uk}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {(asset.description || asset.description_uk) && (
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? asset.description : asset.description_uk}
                    </p>
                  )}
                  
                  {asset.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {asset.location}
                    </div>
                  )}

                  {asset.value && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">
                        {language === 'en' ? 'Value: ' : 'Вартість: '}
                        {asset.value.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Updated: ' : 'Оновлено: '}
                    {new Date(asset.updated_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="infrastructure">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.filter(asset => asset.type === 'infrastructure').map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      {getTypeIcon(asset.type)}
                      <span className="ml-2">
                        {language === 'en' ? asset.name : asset.name_uk}
                      </span>
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(asset)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusBadgeColor(asset.status)}>
                      {statusOptions.find(s => s.value === asset.status)?.label || asset.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {language === 'en' ? asset.category : asset.category_uk}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {(asset.description || asset.description_uk) && (
                    <p className="text-sm text-gray-600">
                      {language === 'en' ? asset.description : asset.description_uk}
                    </p>
                  )}
                  
                  {asset.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {asset.location}
                    </div>
                  )}

                  {asset.value && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">
                        {language === 'en' ? 'Value: ' : 'Вартість: '}
                        {asset.value.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Updated: ' : 'Оновлено: '}
                    {new Date(asset.updated_at).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {language === 'en' ? 'No assets found' : 'Активи не знайдено'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfrastructureModule;
