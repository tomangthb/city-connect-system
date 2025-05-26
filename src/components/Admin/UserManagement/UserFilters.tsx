
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface Filters {
  role: string;
  status: string;
  department: string;
}

interface UserFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const UserFilters = ({ filters, onFiltersChange }: UserFiltersProps) => {
  const { language } = useLanguage();

  const roles = [
    { value: 'all', label: language === 'en' ? 'All Roles' : 'Всі ролі' },
    { value: 'admin', label: language === 'en' ? 'Administrator' : 'Адміністратор' },
    { value: 'employee', label: language === 'en' ? 'Employee' : 'Працівник' },
    { value: 'resident', label: language === 'en' ? 'Resident' : 'Мешканець' },
    { value: 'moderator', label: language === 'en' ? 'Moderator' : 'Модератор' }
  ];

  const statuses = [
    { value: 'all', label: language === 'en' ? 'All Statuses' : 'Всі статуси' },
    { value: 'active', label: language === 'en' ? 'Active' : 'Активний' },
    { value: 'inactive', label: language === 'en' ? 'Inactive' : 'Неактивний' },
    { value: 'blocked', label: language === 'en' ? 'Blocked' : 'Заблокований' }
  ];

  const departments = [
    { value: 'all', label: language === 'en' ? 'All Departments' : 'Всі відділи' },
    { value: 'housing', label: language === 'en' ? 'Housing and Utilities' : 'ЖКГ' },
    { value: 'transport', label: language === 'en' ? 'Transport' : 'Транспорт' },
    { value: 'social', label: language === 'en' ? 'Social Services' : 'Соціальні послуги' },
    { value: 'admin', label: language === 'en' ? 'Administration' : 'Адміністрація' }
  ];

  return (
    <div className="flex gap-2">
      <Select value={filters.role} onValueChange={(value) => onFiltersChange({ ...filters, role: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.department} onValueChange={(value) => onFiltersChange({ ...filters, department: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilters;
