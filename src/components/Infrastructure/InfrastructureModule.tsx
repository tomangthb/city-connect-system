
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AssetCard from './AssetCard';
import MaintenanceRequestDialog from './MaintenanceRequestDialog';
import MaintenanceScheduleDialog from './MaintenanceScheduleDialog';
import AssetDetailsDialog from './AssetDetailsDialog';
import InfrastructureStats from './InfrastructureStats';
import InfrastructureFilters from './InfrastructureFilters';
import AssetFormDialog from './AssetFormDialog';
import { useInfrastructureData } from './hooks/useInfrastructureData';

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
  const { language } = useLanguage();
  const {
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
  } = useInfrastructureData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isMaintenanceRequestOpen, setIsMaintenanceRequestOpen] = useState(false);
  const [isMaintenanceScheduleOpen, setIsMaintenanceScheduleOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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

  const onFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      setIsCreateDialogOpen(false);
    }
  };

  const onEditAsset = (asset: Asset) => {
    handleEdit(asset);
    setIsCreateDialogOpen(true);
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
      {/* Header with Stats */}
      <InfrastructureStats assets={assets} />

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
          
          <AssetFormDialog
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            editingAsset={editingAsset}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onFormSubmit}
          />
        </Dialog>
      </div>

      {/* Filters */}
      <InfrastructureFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} onClick={() => handleViewDetails(asset)} className="cursor-pointer">
            <AssetCard
              asset={asset}
              onEdit={onEditAsset}
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
