import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  History, 
  Receipt, 
  DollarSign, 
  Calendar,
  Download,
  Eye,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import AddPaymentMethodDialog from './Payments/AddPaymentMethodDialog';
import PaymentDetailsDialog from './Payments/PaymentDetailsDialog';

interface Payment {
  id: string;
  type: string;
  typeUk: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  description: string;
  descriptionUk: string;
}

interface PaymentHistory {
  id: string;
  type: string;
  typeUk: string;
  amount: number;
  date: string;
  method: string;
  methodUk: string;
  status: 'completed' | 'failed' | 'refunded';
}

const ResidentPaymentsModule = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('bills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [addPaymentMethodOpen, setAddPaymentMethodOpen] = useState(false);
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | PaymentHistory | null>(null);

  const upcomingBills: Payment[] = [
    {
      id: '1',
      type: 'Utilities',
      typeUk: 'Комунальні послуги',
      amount: 1250.50,
      status: 'pending',
      dueDate: '2024-05-25',
      description: 'Electricity, Water, Gas - May 2024',
      descriptionUk: 'Електроенергія, Вода, Газ - Травень 2024'
    },
    {
      id: '2',
      type: 'Property Tax',
      typeUk: 'Податок на нерухомість',
      amount: 2800.00,
      status: 'overdue',
      dueDate: '2024-05-15',
      description: 'Annual property tax payment',
      descriptionUk: 'Річний податок на нерухомість'
    },
    {
      id: '3',
      type: 'Parking Permit',
      typeUk: 'Дозвіл на паркування',
      amount: 300.00,
      status: 'pending',
      dueDate: '2024-06-01',
      description: 'Monthly parking permit',
      descriptionUk: 'Щомісячний дозвіл на паркування'
    },
    {
      id: '4',
      type: 'Waste Management',
      typeUk: 'Управління відходами',
      amount: 180.75,
      status: 'paid',
      dueDate: '2024-05-10',
      paidDate: '2024-05-08',
      description: 'Monthly waste collection service',
      descriptionUk: 'Щомісячна послуга збору відходів'
    }
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      type: 'Utilities',
      typeUk: 'Комунальні послуги',
      amount: 1180.25,
      date: '2024-04-20',
      method: 'Credit Card',
      methodUk: 'Кредитна картка',
      status: 'completed'
    },
    {
      id: '2',
      type: 'Property Tax',
      typeUk: 'Податок на нерухомість',
      amount: 2800.00,
      date: '2024-04-15',
      method: 'Bank Transfer',
      methodUk: 'Банківський переказ',
      status: 'completed'
    },
    {
      id: '3',
      type: 'Traffic Fine',
      typeUk: 'Штраф за порушення ПДР',
      amount: 510.00,
      date: '2024-04-10',
      method: 'Online Payment',
      methodUk: 'Онлайн платіж',
      status: 'completed'
    },
    {
      id: '4',
      type: 'Parking Permit',
      typeUk: 'Дозвіл на паркування',
      amount: 300.00,
      date: '2024-04-05',
      method: 'Credit Card',
      methodUk: 'Кредитна картка',
      status: 'failed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'overdue': return 'overdue';
      case 'failed': return 'overdue';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { en: string; uk: string }> = {
      paid: { en: 'Paid', uk: 'Сплачено' },
      pending: { en: 'Pending', uk: 'Очікує' },
      overdue: { en: 'Overdue', uk: 'Прострочено' },
      completed: { en: 'Completed', uk: 'Завершено' },
      failed: { en: 'Failed', uk: 'Невдало' },
      refunded: { en: 'Refunded', uk: 'Повернено' }
    };
    return statusMap[status]?.[language] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'overdue':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'paid':
      case 'completed':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const handlePayBill = (bill: Payment) => {
    toast.success(`${language === 'en' ? 'Processing payment for' : 'Обробка платежу для'}: ${language === 'en' ? bill.type : bill.typeUk}`);
  };

  const handleDownloadReceipt = (item: Payment | PaymentHistory) => {
    toast.success(`${language === 'en' ? 'Downloading receipt for' : 'Завантаження квитанції для'}: ${language === 'en' ? item.type : item.typeUk}`);
  };

  const handleViewDetails = (item: Payment | PaymentHistory) => {
    setSelectedPayment(item);
    setPaymentDetailsOpen(true);
  };

  const filteredHistory = paymentHistory.filter(item => {
    const matchesSearch = 
      (language === 'en' ? item.type : item.typeUk).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? item.method : item.methodUk).toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPeriod = true;
    if (selectedPeriod !== 'all') {
      const itemDate = new Date(item.date);
      const now = new Date();
      const monthsAgo = parseInt(selectedPeriod);
      const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsAgo));
      matchesPeriod = itemDate >= cutoffDate;
    }
    
    return matchesSearch && matchesPeriod;
  });

  const totalPending = upcomingBills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-enhanced mb-2">
          {language === 'en' ? 'Payments & Billing' : 'Платежі та рахунки'}
        </h2>
        <p className="text-secondary-enhanced">
          {language === 'en' 
            ? 'Manage your payments, view bills, and track payment history.' 
            : 'Керуйте своїми платежами, переглядайте рахунки та відстежуйте історію платежів.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="enhanced-card-block">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-enhanced">
                  {language === 'en' ? 'Total Pending' : 'Всього до сплати'}
                </p>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <p className="price-display text-red-400">
                    ₴{totalPending.toFixed(2)}
                  </p>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-red-400 icon-enhanced" />
            </div>
          </CardContent>
        </Card>

        <Card className="enhanced-card-block">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-enhanced">
                  {language === 'en' ? 'Paid This Month' : 'Сплачено цього місяця'}
                </p>
                <p className="price-display text-green-400">
                  ₴{paymentHistory.filter(p => p.status === 'completed' && new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-400 icon-enhanced" />
            </div>
          </CardContent>
        </Card>

        <Card className="enhanced-card-block">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-enhanced">
                  {language === 'en' ? 'Next Due Date' : 'Наступна дата платежу'}
                </p>
                <p className="price-display text-blue-400">
                  {upcomingBills.filter(b => b.status !== 'paid').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate.split('-').reverse().join('.') || 'N/A'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400 icon-enhanced" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <Button
          variant={activeTab === 'bills' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('bills')}
          className="flex-1"
        >
          <Receipt className="h-4 w-4 mr-2 icon-enhanced" />
          {language === 'en' ? 'Current Bills' : 'Поточні рахунки'}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('history')}
          className="flex-1"
        >
          <History className="h-4 w-4 mr-2 icon-enhanced" />
          {language === 'en' ? 'Payment History' : 'Історія платежів'}
        </Button>
      </div>

      {/* Current Bills Tab */}
      {activeTab === 'bills' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-enhanced">
              {language === 'en' ? 'Upcoming Bills' : 'Майбутні рахунки'}
            </h3>
            <Button onClick={() => setAddPaymentMethodOpen(true)}>
              <Plus className="h-4 w-4 mr-2 icon-enhanced" />
              {language === 'en' ? 'Add Payment Method' : 'Додати спосіб оплати'}
            </Button>
          </div>

          <div className="grid gap-4">
            {upcomingBills.map((bill) => (
              <Card key={bill.id} className="enhanced-card-block">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-primary-enhanced">
                          {language === 'en' ? bill.type : bill.typeUk}
                        </h4>
                        <Badge variant={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)}
                          {getStatusText(bill.status)}
                        </Badge>
                      </div>
                      <p className="text-secondary-enhanced mb-2">
                        {language === 'en' ? bill.description : bill.descriptionUk}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-enhanced">
                        <span>
                          {language === 'en' ? 'Due:' : 'Термін:'} {bill.dueDate.split('-').reverse().join('.')}
                        </span>
                        {bill.paidDate && (
                          <span>
                            {language === 'en' ? 'Paid:' : 'Сплачено:'} {bill.paidDate.split('-').reverse().join('.')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="price-display">
                        ₴{bill.amount.toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {bill.status !== 'paid' && (
                          <Button size="sm" onClick={() => handlePayBill(bill)}>
                            {language === 'en' ? 'Pay Now' : 'Сплатити'}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(bill)}
                        >
                          <Eye className="h-4 w-4 icon-enhanced" />
                        </Button>
                        {bill.status === 'paid' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReceipt(bill)}
                          >
                            <Download className="h-4 w-4 icon-enhanced" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 icon-enhanced" />
              <Input
                placeholder={language === 'en' ? 'Search payments...' : 'Пошук платежів...'}
                className="pl-10 search-input-enhanced"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="p-2 border border-white bg-gray-800 text-white rounded-md min-w-[200px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all">{language === 'en' ? 'All Time' : 'За весь час'}</option>
              <option value="1">{language === 'en' ? 'Last Month' : 'Останній місяць'}</option>
              <option value="3">{language === 'en' ? 'Last 3 Months' : 'Останні 3 місяці'}</option>
              <option value="6">{language === 'en' ? 'Last 6 Months' : 'Останні 6 місяців'}</option>
              <option value="12">{language === 'en' ? 'Last Year' : 'Останній рік'}</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredHistory.map((payment) => (
              <Card key={payment.id} className="enhanced-card-block">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-primary-enhanced">
                          {language === 'en' ? payment.type : payment.typeUk}
                        </h4>
                        <Badge variant={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          {getStatusText(payment.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-enhanced">
                        <span>
                          {language === 'en' ? 'Date:' : 'Дата:'} {payment.date.split('-').reverse().join('.')}
                        </span>
                        <span>
                          {language === 'en' ? 'Method:' : 'Спосіб:'} {language === 'en' ? payment.method : payment.methodUk}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="price-display">
                        ₴{payment.amount.toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <Eye className="h-4 w-4 icon-enhanced" />
                        </Button>
                        {payment.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment)}
                          >
                            <Download className="h-4 w-4 icon-enhanced" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-muted-enhanced">
                {language === 'en' 
                  ? 'No payment history found matching your criteria.' 
                  : 'Не знайдено історії платежів, що відповідає вашим критеріям.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddPaymentMethodDialog
        open={addPaymentMethodOpen}
        onOpenChange={setAddPaymentMethodOpen}
      />

      <PaymentDetailsDialog
        open={paymentDetailsOpen}
        onOpenChange={setPaymentDetailsOpen}
        payment={selectedPayment}
      />
    </div>
  );
};

export default ResidentPaymentsModule;
