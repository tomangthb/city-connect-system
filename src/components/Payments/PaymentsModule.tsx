
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentsModule = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('payments') || 'Payments'}
        </h1>
        <p className="mt-2 text-gray-600">
          {t('paymentsDescription') || 'Manage your payments and billing information'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('utilityBills') || 'Utility Bills'}</CardTitle>
            <CardDescription>
              {t('utilityBillsDesc') || 'View and pay your utility bills'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {t('comingSoon') || 'Coming Soon'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('taxes') || 'Taxes'}</CardTitle>
            <CardDescription>
              {t('taxesDesc') || 'View and pay your property taxes'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {t('comingSoon') || 'Coming Soon'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('fines') || 'Fines'}</CardTitle>
            <CardDescription>
              {t('finesDesc') || 'View and pay outstanding fines'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {t('comingSoon') || 'Coming Soon'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsModule;
