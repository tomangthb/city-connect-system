
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppealsModuleProps {
  userType: 'employee' | 'resident';
}

const AppealsModule = ({ userType }: AppealsModuleProps) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  const appeals = [
    {
      id: 'APP-001',
      title: 'Street Light Not Working',
      category: 'Infrastructure',
      status: 'In Progress',
      priority: 'Medium',
      submittedBy: 'John Smith',
      date: '2024-05-20',
      description: 'The street light on Main Street is not working...'
    },
    {
      id: 'APP-002',
      title: 'Noise Complaint',
      category: 'Public Order',
      status: 'Under Review',
      priority: 'High',
      submittedBy: 'Mary Johnson',
      date: '2024-05-19',
      description: 'Loud music from nearby construction site...'
    },
    {
      id: 'APP-003',
      title: 'Pothole on Oak Avenue',
      category: 'Roads',
      status: 'Completed',
      priority: 'Low',
      submittedBy: 'David Brown',
      date: '2024-05-18',
      description: 'Large pothole causing traffic issues...'
    }
  ];

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

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'Completed': return t('completed');
      case 'In Progress': return t('pending');
      case 'Under Review': return t('scheduled');
      default: return status;
    }
  };

  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'Infrastructure': return t('infrastructure');
      case 'Public Order': return t('publicOrder');
      case 'Roads': return t('roads');
      default: return category;
    }
  };

  const getPriorityTranslation = (priority: string) => {
    switch (priority) {
      case 'High': return t('high');
      case 'Medium': return t('medium');
      case 'Low': return t('low');
      default: return priority;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('citizensAppeals')}</h2>
          <p className="text-gray-600">
            {userType === 'employee' 
              ? t('manageRespond')
              : t('submitTrack')}
          </p>
        </div>
        {userType === 'resident' && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('submitAppeal')}
          </Button>
        )}
      </div>

      {/* New Appeal Form for Residents */}
      {userType === 'resident' && showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('submitAppealTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('subject')}
              </label>
              <Input placeholder={t('subject')} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('category')}
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>{t('infrastructure')}</option>
                <option>{t('publicOrder')}</option>
                <option>{t('roads')}</option>
                <option>{t('environment')}</option>
                <option>{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')}
              </label>
              <Textarea 
                placeholder={t('description')}
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <Button>{t('submitAppealButton')}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appeals List */}
      <div className="space-y-4">
        {appeals.map((appeal) => (
          <Card key={appeal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{appeal.title}</h3>
                  <p className="text-sm text-gray-600">ID: {appeal.id}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(appeal.status)}>
                    {getStatusTranslation(appeal.status)}
                  </Badge>
                  <Badge className={getPriorityColor(appeal.priority)}>
                    {getPriorityTranslation(appeal.priority)}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{appeal.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {appeal.submittedBy}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {appeal.date}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {getCategoryTranslation(appeal.category)}
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  {userType === 'employee' ? t('review') : t('viewDetails')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppealsModule;
