import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Plus,
  Receipt,
  History
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentDetailsDialog from './Payments/PaymentDetailsDialog';
import AddPaymentMethodDialog from './Payments/AddPaymentMethodDialog';

interface Bill {
  id: string;
  type: string;
  typeUk: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'completed' | 'failed' | 'refunded';
  description: string;
  descriptionUk: string;
}

interface PaymentHistory {
  id: string;
  type: string;
  typeUk: string;
  amount: number;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  transactionId: string;
}

const ResidentPaymentsModule = () => {
  const { language } = useLanguage();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  const currentBills: Bill[] = [
    {
      id: '1',
      type: 'Utilities',
      typeUk: 'Комунальні послуги',
      amount: 1250.50,
      dueDate: '2024-05-25',
      status: 'pending',
      description: 'Electricity, Water, Gas - May 2024',
      descriptionUk: 'Електроенергія, Вода, Газ - Травень 2024'
    },
    {
      id: '2',
      type: 'Property Tax',
      typeUk: 'Податок на нерухомість',
      amount: 3500.00,
      dueDate: '2024-06-15',
      status: 'pending',
      description: 'Annual property tax payment',
      descriptionUk: 'Річний платіж податку на нерухомість'
    },
    {
      id: '3',
      type: 'Waste Management',
      typeUk: 'Вивіз сміття',
      amount: 320.00,
      dueDate: '2024-05-20',
      status: 'overdue',
      description: 'Monthly waste collection fee',
      descriptionUk: 'Щомісячна плата за вивіз сміття'
    }
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      type: 'Utilities',
      typeUk: 'Комунальні послуги',
      amount: 1180.75,
      date: '2024-04-25',
      status: 'completed',
      transactionId: 'TXN-2024-001'
    },
    {
      id: '2',
      type: 'Parking Fine',
      typeUk: 'Штраф за паркування',
      amount: 150.00,
      date: '2024-04-20',
      status: 'completed',
      transactionId: 'TXN-2024-002'
    },
    {
      id: '3',
      type: 'Business License',
      typeUk: 'Ліцензія на бізнес',
      amount: 500.00,
      date: '2024-04-15',
      status: 'processing',
      transactionId: 'TXN-2024-003'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Pending' : 'Очікує'}
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Paid' : 'Сплачено'}
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Overdue' : 'Прострочено'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Completed' : 'Завершено'}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Processing' : 'Обробляється'}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Failed' : 'Невдалий'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTotalPending = () => {
    return currentBills
      .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getTotalPaidThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return paymentHistory
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               payment.status === 'completed';
      })
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getNextDueDate = () => {
    const upcomingBills = currentBills
      .filter(bill => bill.status === 'pending')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    return upcomingBills.length > 0 ? upcomingBills[0].dueDate : null;
  };

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill);
    setShowPaymentDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'Payments & Billing' : 'Платежі та рахунки'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'en' 
            ? 'Manage your payments, view bills, and track payment history.' 
            : 'Керуйте своїми платежами, переглядайте рахунки та відстежуйте історію платежів.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Total Pending' : 'Всього до сплати'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₴{getTotalPending().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Paid This Month' : 'Сплачено цього місяця'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₴{getTotalPaidThisMonth().toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Next Due Date' : 'Наступна дата сплати'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {getNextDueDate() || (language === 'en' ? 'No pending' : 'Немає заборгованості')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="current" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="current" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Receipt className="h-4 w-4" />
              {language === 'en' ? 'Current Bills' : 'Поточні рахунки'}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <History className="h-4 w-4" />
              {language === 'en' ? 'Payment History' : 'Історія платежів'}
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => setShowAddPaymentMethod(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Add Payment Method' : 'Додати спосіб оплати'}
          </Button>
        </div>

        <TabsContent value="current" className="space-y-4">
          {currentBills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {language === 'en' ? bill.type : bill.typeUk}
                      </h3>
                      {getStatusBadge(bill.status)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {language === 'en' ? bill.description : bill.descriptionUk}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>₴{bill.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{language === 'en' ? 'Due:' : 'До:'} {bill.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {bill.status !== 'paid' && (
                      <Button 
                        onClick={() => handlePayBill(bill)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {language === 'en' ? 'Pay Now' : 'Сплатити зараз'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      {language === 'en' ? 'View Details' : 'Деталі'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {paymentHistory.map((payment) => (
            <Card key={payment.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {language === 'en' ? payment.type : payment.typeUk}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>₴{payment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{payment.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{payment.transactionId}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'en' ? 'View Receipt' : 'Переглянути квитанцію'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      {selectedBill && (
        <PaymentDetailsDialog
          payment={selectedBill}
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
        />
      )}

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        open={showAddPaymentMethod}
        onOpenChange={setShowAddPaymentMethod}
      />
    </div>
  );
};

export default ResidentPaymentsModule;
