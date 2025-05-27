
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface Resource {
  id: string;
  name: string;
  nameUk: string;
  location: string;
  contact: string;
}

interface ResourceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null;
}

const ResourceBookingDialog = ({ open, onOpenChange, resource }: ResourceBookingDialogProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '',
    participants: '',
    purpose: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.purpose || !formData.contactName) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть усі обов\'язкові поля');
      return;
    }

    // Simulate booking submission
    toast.success(language === 'en' ? 'Booking request submitted successfully!' : 'Запит на бронювання успішно надіслано!');
    onOpenChange(false);
    
    // Reset form
    setFormData({
      date: '',
      time: '',
      duration: '',
      participants: '',
      purpose: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      additionalNotes: ''
    });
  };

  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Book Resource' : 'Забронювати ресурс'}: {language === 'en' ? resource.name : resource.nameUk}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'en' ? 'Resource Information' : 'Інформація про ресурс'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{resource.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{resource.contact}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {language === 'en' ? 'Date *' : 'Дата *'}
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === 'en' ? 'Time *' : 'Час *'}
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="duration">
                {language === 'en' ? 'Duration (hours)' : 'Тривалість (години)'}
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="12"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="mt-1"
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="participants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {language === 'en' ? 'Number of Participants' : 'Кількість учасників'}
              </Label>
              <Input
                id="participants"
                type="number"
                min="1"
                value={formData.participants}
                onChange={(e) => handleInputChange('participants', e.target.value)}
                className="mt-1"
                placeholder="10"
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <Label htmlFor="purpose">
              {language === 'en' ? 'Purpose of Booking *' : 'Мета бронювання *'}
            </Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="mt-1"
              placeholder={language === 'en' ? 'Please describe the purpose of your booking...' : 'Опишіть мету вашого бронювання...'}
              rows={3}
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              {language === 'en' ? 'Contact Information' : 'Контактна інформація'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">
                  {language === 'en' ? 'Full Name *' : 'Повне ім\'я *'}
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">
                  {language === 'en' ? 'Phone Number' : 'Номер телефону'}
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-1"
                  placeholder="+380"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {language === 'en' ? 'Email Address' : 'Електронна пошта'}
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">
              {language === 'en' ? 'Additional Notes' : 'Додаткові примітки'}
            </Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              className="mt-1"
              placeholder={language === 'en' ? 'Any additional requirements or information...' : 'Будь-які додаткові вимоги або інформація...'}
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" className="flex-1">
              {language === 'en' ? 'Submit Booking Request' : 'Надіслати запит на бронювання'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceBookingDialog;
