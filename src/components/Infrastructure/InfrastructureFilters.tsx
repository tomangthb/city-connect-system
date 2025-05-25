
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InfrastructureFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

const InfrastructureFilters: React.FC<InfrastructureFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter
}) => {
  const { language } = useLanguage();

  const statusOptions = [
    { value: 'Active', label: language === 'en' ? 'Active' : 'Активний' },
    { value: 'Under Maintenance', label: language === 'en' ? 'Under Maintenance' : 'На обслуговуванні' },
    { value: 'Decommissioned', label: language === 'en' ? 'Decommissioned' : 'Виведений з експлуатації' },
    { value: 'Planned', label: language === 'en' ? 'Planned' : 'Запланований' }
  ];

  return (
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
  );
};

export default InfrastructureFilters;
