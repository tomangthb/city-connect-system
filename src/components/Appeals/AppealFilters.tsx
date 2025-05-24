
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface AppealFiltersProps {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClearFilters: () => void;
}

const AppealFilters = ({
  searchTerm,
  statusFilter,
  categoryFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onDateChange,
  onClearFilters
}: AppealFiltersProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Фільтри та пошук</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="ml-auto flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Очистити
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Пошук за темою, ім'ям, ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі статуси</SelectItem>
            <SelectItem value="new">Нове</SelectItem>
            <SelectItem value="Under Review">В обробці</SelectItem>
            <SelectItem value="In Progress">Виконується</SelectItem>
            <SelectItem value="Completed">Вирішено</SelectItem>
            <SelectItem value="rejected">Відхилено</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Категорія" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі категорії</SelectItem>
            <SelectItem value="technical">Технічне</SelectItem>
            <SelectItem value="administrative">Адміністративне</SelectItem>
            <SelectItem value="complaint">Скарга</SelectItem>
            <SelectItem value="suggestion">Пропозиція</SelectItem>
            <SelectItem value="other">Інше</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={onDateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Період" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Весь час</SelectItem>
            <SelectItem value="today">Сьогодні</SelectItem>
            <SelectItem value="week">Цей тиждень</SelectItem>
            <SelectItem value="month">Цей місяць</SelectItem>
            <SelectItem value="quarter">Цей квартал</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppealFilters;
