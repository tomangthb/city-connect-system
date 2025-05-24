
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppeals } from '@/hooks/useAppeals';
import AppealSubmissionForm from './AppealSubmissionForm';
import AppealCard from './AppealCard';
import AppealReviewDialog from './AppealReviewDialog';

interface AppealsModuleProps {
  userType: 'employee' | 'resident';
}

const AppealsModule = ({ userType }: AppealsModuleProps) => {
  const { t } = useLanguage();
  const { data: appeals, isLoading, refetch } = useAppeals();
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const handleReviewAppeal = (appeal: any) => {
    setSelectedAppeal(appeal);
    setReviewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div>{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('citizensAppeals') || 'Citizens Appeals'}</h2>
          <p className="text-gray-600">
            {userType === 'employee' 
              ? (t('manageRespond') || 'Manage and respond to citizen appeals')
              : (t('submitTrack') || 'Submit and track your appeals')}
          </p>
        </div>
        {userType === 'resident' && (
          <AppealSubmissionForm onAppealSubmitted={refetch} />
        )}
      </div>

      {/* Appeals List */}
      <div className="space-y-4">
        {appeals && appeals.length > 0 ? (
          appeals.map((appeal) => (
            <AppealCard
              key={appeal.id}
              appeal={appeal}
              userType={userType}
              onReview={handleReviewAppeal}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{t('noAppealsFound') || 'No appeals found'}</p>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <AppealReviewDialog
        appeal={selectedAppeal}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onAppealUpdated={refetch}
      />
    </div>
  );
};

export default AppealsModule;
