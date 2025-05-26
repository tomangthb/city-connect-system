
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppeals } from '@/hooks/useAppeals';
import { Download, Settings, Search, X } from 'lucide-react';
import AppealsTable from './AppealsTable';
import AppealDetailsDialog from './AppealDetailsDialog';
import AppealReviewDialog from './AppealReviewDialog';
import CreateAppealDialog from './CreateAppealDialog';
import AppealsExportDialog from './AppealsExportDialog';
import AppealsSettingsDialog from './AppealsSettingsDialog';

const ComprehensiveAppealsModule = () => {
  const { data: appeals, isLoading, refetch } = useAppeals();
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Filter appeals based on current filters
  const filteredAppeals = useMemo(() => {
    if (!appeals) return [];

    return appeals.filter(appeal => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          appeal.title?.toLowerCase().includes(searchLower) ||
          appeal.content?.toLowerCase().includes(searchLower) ||
          appeal.submitted_by?.toLowerCase().includes(searchLower) ||
          appeal.id?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && appeal.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && appeal.category !== categoryFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'all') {
        const appealDate = new Date(appeal.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            if (appealDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (appealDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            if (appealDate < monthAgo) return false;
            break;
          case 'quarter':
            const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            if (appealDate < quarterAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [appeals, searchTerm, statusFilter, categoryFilter, dateFilter]);

  const handleViewAppeal = (appeal: any) => {
    setSelectedAppeal(appeal);
    setDetailsDialogOpen(true);
  };

  const handleResponseAppeal = (appeal: any) => {
    setSelectedAppeal(appeal);
    setReviewDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
  };

  const getStatsData = () => {
    if (!appeals) return { total: 0, new: 0, inProgress: 0, completed: 0 };
    
    return {
      total: appeals.length,
      new: appeals.filter(a => a.status === 'Under Review').length,
      inProgress: appeals.filter(a => a.status === 'In Progress').length,
      completed: appeals.filter(a => a.status === 'Completed').length
    };
  };

  const stats = getStatsData();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div>Завантаження звернень...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Звернення громадян</h2>
          <p className="text-gray-600 mt-1">
            Управління зверненнями від громадян та надання відповідей
          </p>
        </div>
        <div className="flex gap-2">
          <AppealsExportDialog>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Експорт
            </Button>
          </AppealsExportDialog>
          <AppealsSettingsDialog>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Налаштування
            </Button>
          </AppealsSettingsDialog>
          <CreateAppealDialog onAppealCreated={refetch} />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Всього звернень</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Нові</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">В обробці</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Вирішено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Фільтри та пошук</span>
            {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Очистити
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Пошук за темою, ім'ям, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Статус</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="Under Review">На розгляді</SelectItem>
                  <SelectItem value="In Progress">В обробці</SelectItem>
                  <SelectItem value="Completed">Вирішено</SelectItem>
                  <SelectItem value="Rejected">Відхилено</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Категорія</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі категорії</SelectItem>
                  <SelectItem value="Housing">ЖКГ</SelectItem>
                  <SelectItem value="Transport">Транспорт</SelectItem>
                  <SelectItem value="Social">Соціальні питання</SelectItem>
                  <SelectItem value="Environment">Довкілля</SelectItem>
                  <SelectItem value="Other">Інше</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Період</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
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
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Показано {filteredAppeals.length} з {appeals?.length || 0} звернень
        </p>
        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
          <p className="text-sm text-blue-600">Застосовано фільтри</p>
        )}
      </div>

      {/* Appeals Table */}
      <AppealsTable
        appeals={filteredAppeals}
        onViewAppeal={handleViewAppeal}
        onResponseAppeal={handleResponseAppeal}
      />

      {/* Dialogs */}
      <AppealDetailsDialog
        appeal={selectedAppeal}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <AppealReviewDialog
        appeal={selectedAppeal}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onAppealUpdated={refetch}
      />
    </div>
  );
};

export default ComprehensiveAppealsModule;
