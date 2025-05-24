
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="appeal">Appeal</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="report">Report</SelectItem>
          <SelectItem value="event">Event</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPriority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onClearFilters} className="text-sm">
        Clear Filters
      </Button>
    </div>
  );
};

export default ActivityFilter;
