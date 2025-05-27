
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPaymentMethodDialog = ({ open, onOpenChange }: AddPaymentMethodDialogProps) => {
  const { language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    bankName: '',
    accountNumber: '',
    phoneNumber: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: language === 'en' ? 'Credit/Debit Card' : 'Кредитна/Дебетова картка',
      icon: CreditCard
    },
    {
      id: 'bank',
      name: language === 'en' ? 'Bank Transfer' : 'Банківський переказ',
      icon: Building
    },
    {
      id: 'mobile',
      name: language === 'en' ? 'Mobile Payment' : 'Мобільний платіж',
      icon: Smartphone
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    
    switch (selectedMethod) {
      case 'card':
        isValid = formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardName;
        break;
      case 'bank':
        isValid = formData.bankName && formData.accountNumber;
        break;
      case 'mobile':
        isValid = formData.phoneNumber;
        break;
    }

    if (!isValid) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть усі обов\'язкові поля');
      return;
    }

    toast.success(language === 'en' ? 'Payment method added successfully!' : 'Спосіб оплати успішно додано!');
    onOpenChange(false);
    
    // Reset form
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      bankName: '',
      accountNumber: '',
      phoneNumber: ''
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Add Payment Method' : 'Додати спосіб оплати'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>{language === 'en' ? 'Select Payment Method' : 'Оберіть спосіб оплати'}</Label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Details */}
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">
                  {language === 'en' ? 'Card Number *' : 'Номер картки *'}
                </Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">
                    {language === 'en' ? 'Expiry Date *' : 'Термін дії *'}
                  </Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cvv">
                    {language === 'en' ? 'CVV *' : 'CVV *'}
                  </Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123"
                    maxLength={4}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">
                  {language === 'en' ? 'Cardholder Name *' : 'Ім\'я власника картки *'}
                </Label>
                <Input
                  id="cardName"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  placeholder={language === 'en' ? 'John Doe' : 'Іван Іваненко'}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {selectedMethod === 'bank' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">
                  {language === 'en' ? 'Bank Name *' : 'Назва банку *'}
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder={language === 'en' ? 'Bank Name' : 'Назва банку'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="accountNumber">
                  {language === 'en' ? 'Account Number *' : 'Номер рахунку *'}
                </Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="UA123456789012345678901234567"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Mobile Payment Details */}
          {selectedMethod === 'mobile' && (
            <div>
              <Label htmlFor="phoneNumber">
                {language === 'en' ? 'Phone Number *' : 'Номер телефону *'}
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+380 XX XXX XX XX"
                className="mt-1"
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" className="flex-1">
              {language === 'en' ? 'Add Method' : 'Додати спосіб'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;
