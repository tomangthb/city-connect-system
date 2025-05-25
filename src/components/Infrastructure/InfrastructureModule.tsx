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
import { Plus, Search, Filter, Building, Zap, BarChart3, Calendar, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AssetCard from './AssetCard';
import MaintenanceRequestDialog from './MaintenanceRequestDialog';
import MaintenanceScheduleDialog from './MaintenanceScheduleDialog';
import AssetDetailsDialog from './AssetDetailsDialog';

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
  asset_id?: string;
  subcategory?: string;
  subcategory_uk?: string;
  gps_coordinates?: string;
  technical_specs?: any;
  model?: string;
  serial_number?: string;
  commissioning_date?: string;
  service_life_years?: number;
  book_value?: number;
  residual_value?: number;
  responsible_department?: string;
  responsible_person?: string;
  legal_status?: string;
  condition_status?: string;
  utilization_rate?: number;
  last_inspection_date?: string;
  next_maintenance_date?: string;
  warranty_expiry_date?: string;
  supplier?: string;
  images?: string[];
  documents?: string[];
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
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isMaintenanceRequestOpen, setIsMaintenanceRequestOpen] = useState(false);
  const [isMaintenanceScheduleOpen, setIsMaintenanceScheduleOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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
    maintenance_schedule: '',
    asset_id: '',
    subcategory: '',
    subcategory_uk: '',
    gps_coordinates: '',
    model: '',
    serial_number: '',
    commissioning_date: '',
    service_life_years: '',
    book_value: '',
    residual_value: '',
    responsible_department: '',
    responsible_person: '',
    legal_status: 'owned',
    condition_status: 'good',
    utilization_rate: '',
    supplier: ''
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
    { value: 'IT Assets', value_uk: 'ІТ активи' },
    { value: 'Landscaping', value_uk: 'Благоустрій' }
  ];

  const infrastructureCategories = [
    { value: 'Roads', value_uk: 'Дороги' },
    { value: 'Water Systems', value_uk: 'Водопостачання' },
    { value: 'Energy Grid', value_uk: 'Енергосистема' },
    { value: 'Telecommunications', value_uk: 'Телекомунікації' },
    { value: 'Waste Management', value_uk: 'Управління відходами' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: language === 'en' ? 'Excellent' : 'Відмінний' },
    { value: 'good', label: language === 'en' ? 'Good' : 'Добрий' },
    { value: 'fair', label: language === 'en' ? 'Fair' : 'Задовільний' },
    { value: 'poor', label: language === 'en' ? 'Poor' : 'Поганий' }
  ];

  const legalStatusOptions = [
    { value: 'owned', label: language === 'en' ? 'Owned' : 'Власність' },
    { value: 'leased', label: language === 'en' ? 'Leased' : 'Оренда' },
    { value: 'rented', label: language === 'en' ? 'Rented' : 'Найм' }
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
        name_uk: formData.name_uk || formData.name,
        category: formData.category,
        category_uk: formData.category_uk,
        type: formData.type,
        description: formData.description || null,
        description_uk: formData.description_uk || null,
        location: formData.location || null,
        status: formData.status,
        value: formData.value ? parseFloat(formData.value) : null,
        acquisition_date: formData.acquisition_date || null,
        maintenance_schedule: formData.maintenance_schedule || null,
        asset_id: formData.asset_id || null,
        subcategory: formData.subcategory || null,
        subcategory_uk: formData.subcategory_uk || null,
        gps_coordinates: formData.gps_coordinates || null,
        model: formData.model || null,
        serial_number: formData.serial_number || null,
        commissioning_date: formData.commissioning_date || null,
        service_life_years: formData.service_life_years ? parseInt(formData.service_life_years) : null,
        book_value: formData.book_value ? parseFloat(formData.book_value) : null,
        residual_value: formData.residual_value ? parseFloat(formData.residual_value) : null,
        responsible_department: formData.responsible_department || null,
        responsible_person: formData.responsible_person || null,
        legal_status: formData.legal_status,
        condition_status: formData.condition_status,
        utilization_rate: formData.utilization_rate ? parseFloat(formData.utilization_rate) : null,
        supplier: formData.supplier || null
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
      maintenance_schedule: '',
      asset_id: '',
      subcategory: '',
      subcategory_uk: '',
      gps_coordinates: '',
      model: '',
      serial_number: '',
      commissioning_date: '',
      service_life_years: '',
      book_value: '',
      residual_value: '',
      responsible_department: '',
      responsible_person: '',
      legal_status: 'owned',
      condition_status: 'good',
      utilization_rate: '',
      supplier: ''
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
      maintenance_schedule: asset.maintenance_schedule || '',
      asset_id: asset.asset_id || '',
      subcategory: asset.subcategory || '',
      subcategory_uk: asset.subcategory_uk || '',
      gps_coordinates: asset.gps_coordinates || '',
      model: asset.model || '',
      serial_number: asset.serial_number || '',
      commissioning_date: asset.commissioning_date || '',
      service_life_years: asset.service_life_years?.toString() || '',
      book_value: asset.book_value?.toString() || '',
      residual_value: asset.residual_value?.toString() || '',
      responsible_department: asset.responsible_department || '',
      responsible_person: asset.responsible_person || '',
      legal_status: asset.legal_status || 'owned',
      condition_status: asset.condition_status || 'good',
      utilization_rate: asset.utilization_rate?.toString() || '',
      supplier: asset.supplier || ''
    });
    setEditingAsset(asset);
    setIsCreateDialogOpen(true);
  };

  const handleScheduleMaintenance = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceScheduleOpen(true);
  };

  const handleCreateRequest = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceRequestOpen(true);
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailsDialogOpen(true);
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

  const getStats = () => {
    const total = assets.length;
    const active = assets.filter(a => a.status === 'Active').length;
    const maintenance = assets.filter(a => a.status === 'Under Maintenance').length;
    const totalValue = assets.reduce((sum, a) => sum + (a.value || 0), 0);
    
    return { total, active, maintenance, totalValue };
  };

  const stats = getStats();

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
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Assets' : 'Всього активів'}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Active' : 'Активні'}
                </p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Maintenance' : 'На ТО'}
                </p>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Value' : 'Загальна вартість'}
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalValue.toLocaleString()} {language === 'en' ? 'UAH' : 'грн'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Assets & Infrastructure Management' : 'Управління активами та інфраструктурою'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Comprehensive asset management, maintenance scheduling, and infrastructure monitoring' 
              : 'Комплексне управління активами, планування обслуговування та моніторинг інфраструктури'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Add Asset' : 'Додати актив'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAsset 
                  ? (language === 'en' ? 'Edit Asset' : 'Редагувати актив')
                  : (language === 'en' ? 'Add New Asset' : 'Додати новий актив')
                }
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">{language === 'en' ? 'Basic' : 'Основне'}</TabsTrigger>
                  <TabsTrigger value="financial">{language === 'en' ? 'Financial' : 'Фінанси'}</TabsTrigger>
                  <TabsTrigger value="technical">{language === 'en' ? 'Technical' : 'Технічне'}</TabsTrigger>
                  <TabsTrigger value="maintenance">{language === 'en' ? 'Maintenance' : 'Обслуговування'}</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
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
                        {language === 'en' ? 'Name (Ukrainian)' : 'Назва (українською)'}
                      </Label>
                      <Input
                        id="name_uk"
                        value={formData.name_uk}
                        onChange={(e) => setFormData(prev => ({ ...prev, name_uk: e.target.value }))}
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
                      <Label htmlFor="gps_coordinates">
                        {language === 'en' ? 'GPS Coordinates' : 'GPS координати'}
                      </Label>
                      <Input
                        id="gps_coordinates"
                        value={formData.gps_coordinates}
                        onChange={(e) => setFormData(prev => ({ ...prev, gps_coordinates: e.target.value }))}
                        placeholder="50.4501, 30.5234"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value">
                        {language === 'en' ? 'Current Value (UAH)' : 'Поточна вартість (грн)'}
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
                      <Label htmlFor="book_value">
                        {language === 'en' ? 'Book Value (UAH)' : 'Балансова вартість (грн)'}
                      </Label>
                      <Input
                        id="book_value"
                        type="number"
                        value={formData.book_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, book_value: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="residual_value">
                        {language === 'en' ? 'Residual Value (UAH)' : 'Залишкова вартість (грн)'}
                      </Label>
                      <Input
                        id="residual_value"
                        type="number"
                        value={formData.residual_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, residual_value: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="supplier">
                        {language === 'en' ? 'Supplier' : 'Постачальник'}
                      </Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                        placeholder={language === 'en' ? 'Enter supplier name' : 'Введіть назву постачальника'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legal_status">
                      {language === 'en' ? 'Legal Status' : 'Правовий статус'}
                    </Label>
                    <Select
                      value={formData.legal_status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, legal_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {legalStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset_id">
                        {language === 'en' ? 'Asset ID' : 'ID активу'}
                      </Label>
                      <Input
                        id="asset_id"
                        value={formData.asset_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, asset_id: e.target.value }))}
                        placeholder="A-001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">
                        {language === 'en' ? 'Model' : 'Модель'}
                      </Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        placeholder={language === 'en' ? 'Enter model' : 'Введіть модель'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serial_number">
                        {language === 'en' ? 'Serial Number' : 'Серійний номер'}
                      </Label>
                      <Input
                        id="serial_number"
                        value={formData.serial_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                        placeholder="SN123456"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service_life_years">
                        {language === 'en' ? 'Service Life (years)' : 'Термін служби (років)'}
                      </Label>
                      <Input
                        id="service_life_years"
                        type="number"
                        value={formData.service_life_years}
                        onChange={(e) => setFormData(prev => ({ ...prev, service_life_years: e.target.value }))}
                        placeholder="10"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commissioning_date">
                        {language === 'en' ? 'Commissioning Date' : 'Дата введення в експлуатацію'}
                      </Label>
                      <Input
                        id="commissioning_date"
                        type="date"
                        value={formData.commissioning_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, commissioning_date: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="condition_status">
                        {language === 'en' ? 'Condition' : 'Стан'}
                      </Label>
                      <Select
                        value={formData.condition_status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, condition_status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOptions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsible_department">
                        {language === 'en' ? 'Responsible Department' : 'Відповідальний відділ'}
                      </Label>
                      <Input
                        id="responsible_department"
                        value={formData.responsible_department}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsible_department: e.target.value }))}
                        placeholder={language === 'en' ? 'Enter department' : 'Введіть відділ'}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responsible_person">
                        {language === 'en' ? 'Responsible Person' : 'Відповідальна особа'}
                      </Label>
                      <Input
                        id="responsible_person"
                        value={formData.responsible_person}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsible_person: e.target.value }))}
                        placeholder={language === 'en' ? 'Enter name' : 'Введіть ім\'я'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="utilization_rate">
                        {language === 'en' ? 'Utilization Rate (%)' : 'Коефіцієнт завантаженості (%)'}
                      </Label>
                      <Input
                        id="utilization_rate"
                        type="number"
                        value={formData.utilization_rate}
                        onChange={(e) => setFormData(prev => ({ ...prev, utilization_rate: e.target.value }))}
                        placeholder="85"
                        min="0"
                        max="100"
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
                </TabsContent>
              </Tabs>

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} onClick={() => handleViewDetails(asset)} className="cursor-pointer">
            <AssetCard
              asset={asset}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onScheduleMaintenance={handleScheduleMaintenance}
              onCreateRequest={handleCreateRequest}
            />
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {language === 'en' ? 'No assets found' : 'Активи не знайдено'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <MaintenanceRequestDialog
        isOpen={isMaintenanceRequestOpen}
        onClose={() => setIsMaintenanceRequestOpen(false)}
        asset={selectedAsset}
        onSuccess={() => {
          loadAssets();
          setIsMaintenanceRequestOpen(false);
        }}
      />

      <MaintenanceScheduleDialog
        isOpen={isMaintenanceScheduleOpen}
        onClose={() => setIsMaintenanceScheduleOpen(false)}
        asset={selectedAsset}
        onSuccess={() => {
          loadAssets();
          setIsMaintenanceScheduleOpen(false);
        }}
      />

      <AssetDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
};

export default InfrastructureModule;
