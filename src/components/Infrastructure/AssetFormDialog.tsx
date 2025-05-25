import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

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
  asset_id?: string;
  subcategory?: string;
  subcategory_uk?: string;
  gps_coordinates?: string;
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
  supplier?: string;
}

interface FormData {
  name: string;
  name_uk: string;
  category: string;
  category_uk: string;
  type: 'asset' | 'infrastructure';
  description: string;
  description_uk: string;
  location: string;
  status: string;
  value: string;
  acquisition_date: string;
  maintenance_schedule: string;
  asset_id: string;
  subcategory: string;
  subcategory_uk: string;
  gps_coordinates: string;
  model: string;
  serial_number: string;
  commissioning_date: string;
  service_life_years: string;
  book_value: string;
  residual_value: string;
  responsible_department: string;
  responsible_person: string;
  legal_status: string;
  condition_status: string;
  utilization_rate: string;
  supplier: string;
}

interface AssetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingAsset: Asset | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const AssetFormDialog: React.FC<AssetFormDialogProps> = ({
  isOpen,
  onClose,
  editingAsset,
  formData,
  setFormData,
  onSubmit
}) => {
  const { language } = useLanguage();

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAsset 
              ? (language === 'en' ? 'Edit Asset' : 'Редагувати актив')
              : (language === 'en' ? 'Add New Asset' : 'Додати новий актив')
            }
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6">
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
            <Button type="button" variant="outline" onClick={onClose}>
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
  );
};

export default AssetFormDialog;
