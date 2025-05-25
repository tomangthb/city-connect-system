
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { CalendarIcon, Clock } from 'lucide-react';

interface BookAppointmentDialogProps {
  children: React.ReactNode;
  service: any;
}

const BookAppointmentDialog = ({ children, service }: BookAppointmentDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: specialists } = useQuery({
    queryKey: ['specialists', service.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialists')
        .select('*')
        .eq('is_available', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: timeSlots } = useQuery({
    queryKey: ['appointment-slots', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const { data, error } = await supabase
        .from('appointment_slots')
        .select('*, specialists(*)')
        .eq('date', selectedDate.toISOString().split('T')[0])
        .eq('is_available', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedDate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error(language === 'en' ? 'Please select date and time' : 'Будь ласка, оберіть дату та час');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedSlot = timeSlots?.find(slot => 
        `${slot.start_time}-${slot.end_time}` === selectedTime
      );

      if (!selectedSlot) {
        throw new Error('Selected time slot not found');
      }

      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedSlot.start_time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('appointments')
        .insert({
          service_id: service.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          appointment_date: appointmentDateTime.toISOString(),
          specialist_name: selectedSlot.specialists?.name,
          specialist_position: selectedSlot.specialists?.position,
          location: selectedSlot.specialists?.department,
          notes: notes
        });

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `Appointment booked: ${service.name}` : `Записано на прийом: ${service.name_uk || service.name}`,
        description: `Appointment scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
        type: 'appointment',
        priority: 'medium',
        status: 'scheduled'
      });

      toast.success(language === 'en' ? 'Appointment booked successfully' : 'Запис на прийом успішно створено');
      setOpen(false);
      setSelectedDate(undefined);
      setSelectedTime('');
      setNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(language === 'en' ? 'Error booking appointment' : 'Помилка при записі на прийом');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Book Appointment' : 'Записатися на прийом'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Календар */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-4 w-4" />
                {language === 'en' ? 'Select Date' : 'Оберіть дату'}
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </div>

            {/* Час */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === 'en' ? 'Available Times' : 'Доступний час'}
              </Label>
              
              {selectedDate && timeSlots && timeSlots.length > 0 ? (
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select time' : 'Оберіть час'} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={`${slot.start_time}-${slot.end_time}`}>
                        {slot.start_time} - {slot.end_time}
                        {slot.specialists?.name && (
                          <span className="text-gray-500 ml-2">
                            ({slot.specialists.name})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : selectedDate ? (
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'No available times for this date' : 'Немає доступних часів на цю дату'}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Please select a date first' : 'Спочатку оберіть дату'}
                </p>
              )}
            </div>
          </div>

          {/* Примітки */}
          <div>
            <Label htmlFor="notes">
              {language === 'en' ? 'Additional Notes' : 'Додаткові примітки'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'en' ? 'Any additional information...' : 'Додаткова інформація...'}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedDate || !selectedTime}>
              {isSubmitting 
                ? (language === 'en' ? 'Booking...' : 'Записуємо...') 
                : (language === 'en' ? 'Book Appointment' : 'Записатися')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;
