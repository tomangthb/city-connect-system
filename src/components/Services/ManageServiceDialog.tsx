
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { addActivity } from '@/utils/activityUtils';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface ManageServiceDialogProps {
  children: React.ReactNode;
  service: any;
  onServiceUpdated: () => void;
}

const ManageServiceDialog = ({ children, service, onServiceUpdated }: ManageServiceDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', service.id);

      if (error) throw error;

      await addActivity({
        title: language === 'en' ? `Service status changed: ${service.name}` : `Статус послуги змінено: ${service.name_uk || service.name}`,
        description: `Changed status to: ${newStatus}`,
        type: 'service',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'Service status updated' : 'Статус послуги оновлено');
      onServiceUpdated();
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error(language === 'en' ? 'Error updating status' : 'Помилка оновлення статусу');
    } finally {
      setIsUpdating(false);
    }
  };

  const name = language === 'en' ? service?.name : (service?.name_uk || service?.name);
  const category = language === 'en' ? service?.category : (service?.category_uk || service?.category);
  const description = language === 'en' ? service?.description : (service?.description_uk || service?.description);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Manage Service' : 'Керування послугою'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{name}</CardTitle>
                <Badge variant="secondary">{category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  <span>{t('status')}: {service?.status}</span>
                </div>
                {service?.processing_time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{service.processing_time}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Total Requests' : 'Загальні запити'}
                    </p>
                    <p className="text-2xl font-bold">{service?.requests || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'This Month' : 'Цього місяця'}
                    </p>
                    <p className="text-2xl font-bold">{Math.floor((service?.requests || 0) * 0.3)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'en' ? 'Avg. Time' : 'Сер. час'}
                    </p>
                    <p className="text-2xl font-bold">2.5d</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? 'Status Management' : 'Керування статусом'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button 
                  variant={service?.status === 'Available' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('Available')}
                  disabled={isUpdating}
                >
                  {t('available')}
                </Button>
                <Button 
                  variant={service?.status === 'Unavailable' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('Unavailable')}
                  disabled={isUpdating}
                >
                  {t('unavailable')}
                </Button>
                <Button 
                  variant={service?.status === 'Maintenance' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('Maintenance')}
                  disabled={isUpdating}
                >
                  {t('maintenance')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Close' : 'Закрити'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageServiceDialog;
