
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppeals } from '@/hooks/useAppeals';
import { Download, Settings } from 'lucide-react';
import AppealFilters from './AppealFilters';
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

      {/* Filters */}
      <AppealFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onDateChange={setDateFilter}
        onClearFilters={handleClearFilters}
      />

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
