
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, DollarSign, Calendar, Clock, Wallet } from 'lucide-react';

const PaymentsModule = () => {
  const { language, t } = useLanguage();
  
  // Sample payment history
  const paymentHistory = [
    { 
      id: '1', 
      description: language === 'en' ? 'Water Utility Bill' : 'Рахунок за воду', 
      amount: '127.50', 
      date: '2024-05-15', 
      status: 'completed' 
    },
    { 
      id: '2', 
      description: language === 'en' ? 'Property Tax' : 'Податок на нерухомість', 
      amount: '450.00', 
      date: '2024-04-02', 
      status: 'completed' 
    },
    { 
      id: '3', 
      description: language === 'en' ? 'Building Permit Fee' : 'Плата за дозвіл на будівництво', 
      amount: '215.75', 
      date: '2024-03-18', 
      status: 'completed' 
    },
  ];

  // Sample upcoming payments
  const upcomingPayments = [
    { 
      id: '4', 
      description: language === 'en' ? 'Electricity Bill' : 'Рахунок за електроенергію', 
      amount: '95.20', 
      dueDate: '2024-06-05' 
    },
    { 
      id: '5', 
      description: language === 'en' ? 'Waste Management Fee' : 'Плата за управління відходами', 
      amount: '45.00', 
      dueDate: '2024-06-15' 
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('payments')}</h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage your payments and billing information' 
            : 'Керуйте своїми платежами та платіжною інформацією'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Make a Payment */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Make a Payment' : 'Здійснити платіж'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Payment Type' : 'Тип платежу'}
                </label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>{language === 'en' ? 'Select payment type' : 'Виберіть тип платежу'}</option>
                  <option>{language === 'en' ? 'Utility Bill' : 'Комунальні послуги'}</option>
                  <option>{language === 'en' ? 'Property Tax' : 'Податок на нерухомість'}</option>
                  <option>{language === 'en' ? 'License Fee' : 'Ліцензійний збір'}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Amount' : 'Сума'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input className="pl-8" placeholder="0.00" />
                </div>
              </div>
              <Button className="w-full">
                {language === 'en' ? 'Pay Now' : 'Сплатити зараз'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Upcoming Payments' : 'Майбутні платежі'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Due: ' : 'До сплати: '}
                      {new Date(payment.dueDate).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'uk-UA'
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${payment.amount}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    {language === 'en' ? 'Pay' : 'Сплатити'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Payment History' : 'Історія платежів'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Description' : 'Опис'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Date' : 'Дата'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Amount' : 'Сума'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Status' : 'Статус'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{payment.description}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(payment.date).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'uk-UA'
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">${payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                        {language === 'en' ? 'Completed' : 'Завершено'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsModule;
