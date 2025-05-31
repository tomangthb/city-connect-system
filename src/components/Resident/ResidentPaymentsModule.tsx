
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, History, Receipt } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentPaymentsModule = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {language === 'en' ? 'Payments' : 'Платежі'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Pay Utilities' : 'Сплатити комунальні'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Pay your utility bills online quickly and securely.' 
                : 'Сплачуйте комунальні послуги онлайн швидко та безпечно.'}
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              {language === 'en' ? 'Pay Now' : 'Сплатити зараз'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Payment History' : 'Історія платежів'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'View your previous payments and transactions.' 
                : 'Переглядайте свої попередні платежі та транзакції.'}
            </p>
            <Button variant="outline" className="w-full">
              {language === 'en' ? 'View History' : 'Переглянути історію'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Receipts' : 'Квитанції'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Download and manage your payment receipts.' 
                : 'Завантажуйте та керуйте квитанціями про оплату.'}
            </p>
            <Button variant="outline" className="w-full">
              {language === 'en' ? 'Download Receipts' : 'Завантажити квитанції'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentPaymentsModule;
