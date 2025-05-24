
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Clock,
  User,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Appeal {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  category: string;
  submitted_by: string;
  created_at: string;
}

interface AppealCardProps {
  appeal: Appeal;
  userType: 'employee' | 'resident';
  onReview: (appeal: Appeal) => void;
}

const AppealCard = ({ appeal, userType, onReview }: AppealCardProps) => {
  const { t } = useLanguage();

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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{appeal.title}</h3>
            <p className="text-sm text-gray-600">ID: {appeal.id}</p>
          </div>
          <div className="flex space-x-2">
            <Badge className={getStatusColor(appeal.status)}>
              {appeal.status}
            </Badge>
            <Badge className={getPriorityColor(appeal.priority)}>
              {appeal.priority}
            </Badge>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{appeal.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {appeal.submitted_by}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(appeal.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {appeal.category}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onReview(appeal)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {userType === 'employee' ? (t('review') || 'Review') : (t('viewDetails') || 'View Details')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppealCard;
