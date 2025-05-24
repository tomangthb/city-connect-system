
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';

interface ActivityFilterProps {
  selectedType: string;
  selectedPriority: string;
  selectedStatus: string;
  onTypeChange: (type: string) => void;
  onPriorityChange: (priority: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

const ActivityFilter = ({
  selectedType,
  selectedPriority,
  selectedStatus,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  onClearFilters
}: ActivityFilterProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('type')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allTypes')}</SelectItem>
          <SelectItem value="appeal">{t('appeal')}</SelectItem>
          <SelectItem value="service">{t('service')}</SelectItem>
          <SelectItem value="report">{t('report')}</SelectItem>
          <SelectItem value="event">{t('event')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('priority')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allPriorities')}</SelectItem>
          <SelectItem value="high">{t('high')}</SelectItem>
          <SelectItem value="medium">{t('medium')}</SelectItem>
          <SelectItem value="low">{t('low')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder={t('status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('allStatus')}</SelectItem>
          <SelectItem value="pending">{t('pending')}</SelectItem>
          <SelectItem value="completed">{t('completed')}</SelectItem>
          <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onClearFilters} className="text-sm">
        {t('clearFilters')}
      </Button>
    </div>
  );
};

export default ActivityFilter;
