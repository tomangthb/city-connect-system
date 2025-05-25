
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

export const useInfrastructureData = () => {
  const { language } = useLanguage();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const initialFormData: FormData = {
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
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

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
      return true;
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error(language === 'en' ? 'Error saving asset' : 'Помилка збереження активу');
      return false;
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
    setFormData(initialFormData);
    setEditingAsset(null);
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
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return {
    assets,
    loading,
    editingAsset,
    formData,
    setFormData,
    handleSubmit,
    handleDelete,
    resetForm,
    handleEdit,
    loadAssets
  };
};
