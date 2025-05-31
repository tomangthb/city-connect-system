
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Receipt, Calendar, CreditCard, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Payment {
  id: string;
  type: string;
  typeUk: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'completed' | 'failed' | 'refunded';
  dueDate?: string;
  paidDate?: string;
  date?: string;
  method?: string;
  methodUk?: string;
  description?: string;
  descriptionUk?: string;
}

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const PaymentDetailsDialog = ({ open, onOpenChange, payment }: PaymentDetailsDialogProps) => {
  const { language } = useLanguage();

  if (!payment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleDownloadReceipt = () => {
    toast.success(language === 'en' ? 'Receipt downloaded successfully' : 'Квитанція успішно завантажена');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {language === 'en' ? 'Payment Details' : 'Деталі платежу'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Header */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? payment.type : payment.typeUk}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Transaction ID:' : 'ID транзакції:'} #{payment.id.slice(0, 8)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₴{payment.amount.toFixed(2)}</p>
              <Badge className={getStatusColor(payment.status)}>
                {getStatusText(payment.status)}
              </Badge>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                {language === 'en' ? 'Payment Information' : 'Інформація про платіж'}
              </h4>
              
              <div className="space-y-3">
                {payment.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {language === 'en' ? 'Due Date:' : 'Термін сплати:'}
                      </span>{' '}
                      {formatDate(payment.dueDate)}
                    </span>
                  </div>
                )}

                {payment.paidDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {language === 'en' ? 'Paid Date:' : 'Дата сплати:'}
                      </span>{' '}
                      {formatDate(payment.paidDate)}
                    </span>
                  </div>
                )}

                {payment.date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {language === 'en' ? 'Transaction Date:' : 'Дата транзакції:'}
                      </span>{' '}
                      {formatDate(payment.date)}
                    </span>
                  </div>
                )}

                {payment.method && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <span className="font-medium">
                        {language === 'en' ? 'Payment Method:' : 'Спосіб оплати:'}
                      </span>{' '}
                      {language === 'en' ? payment.method : payment.methodUk}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                {language === 'en' ? 'Service Details' : 'Деталі послуги'}
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {language === 'en' ? 'Description:' : 'Опис:'}
                    </p>
                    <p className="text-gray-600">
                      {payment.description && payment.descriptionUk 
                        ? (language === 'en' ? payment.description : payment.descriptionUk)
                        : (language === 'en' ? 'No description available' : 'Опис недоступний')
                      }
                    </p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-1">
                    {language === 'en' ? 'Amount Breakdown:' : 'Розбивка суми:'}
                  </p>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Base Amount:' : 'Базова сума:'}</span>
                      <span>₴{(payment.amount * 0.95).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Service Fee:' : 'Комісія:'}</span>
                      <span>₴{(payment.amount * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-medium text-gray-900">
                      <span>{language === 'en' ? 'Total:' : 'Всього:'}</span>
                      <span>₴{payment.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
            {(payment.status === 'paid' || payment.status === 'completed') && (
              <Button onClick={handleDownloadReceipt} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Download Receipt' : 'Завантажити квитанцію'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsDialog;
