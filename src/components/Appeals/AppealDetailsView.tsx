
import React from 'react';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import AppealStatusBadges from './AppealStatusBadges';

interface AppealDetailsViewProps {
  appeal: any;
}

const AppealDetailsView = ({ appeal }: AppealDetailsViewProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{appeal.title}</h3>
        <p className="text-sm text-gray-600">ID: {appeal.id}</p>
      </div>
      
      <AppealStatusBadges status={appeal.status} priority={appeal.priority} />

      <div>
        <Label>{t('description')}</Label>
        <div className="mt-1 p-3 bg-gray-50 rounded-md">
          <p className="text-gray-700">{appeal.content || appeal.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label>{t('submittedBy') || 'Submitted by'}</Label>
          <p className="text-gray-700">{appeal.submitted_by}</p>
        </div>
        <div>
          <Label>{t('category')}</Label>
          <p className="text-gray-700">{appeal.category}</p>
        </div>
        <div>
          <Label>{t('submittedDate') || 'Submitted'}</Label>
          <p className="text-gray-700">
            {new Date(appeal.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <Label>{t('lastUpdated') || 'Last updated'}</Label>
          <p className="text-gray-700">
            {new Date(appeal.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppealDetailsView;
