
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AppealStatusBadgesProps {
  status: string;
  priority: string;
}

const AppealStatusBadges = ({ status, priority }: AppealStatusBadgesProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex space-x-2">
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
      <Badge className={getPriorityColor(priority)}>
        {priority}
      </Badge>
    </div>
  );
};

export default AppealStatusBadges;
