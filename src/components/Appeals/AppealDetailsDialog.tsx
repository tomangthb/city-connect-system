
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, FileText, Clock } from 'lucide-react';
import AppealStatusBadges from './AppealStatusBadges';

interface AppealDetailsDialogProps {
  appeal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppealDetailsDialog = ({ appeal, open, onOpenChange }: AppealDetailsDialogProps) => {
  if (!appeal) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'technical': 'Технічне',
      'administrative': 'Адміністративне',
      'complaint': 'Скарга',
      'suggestion': 'Пропозиція',
      'other': 'Інше'
    };
    return labels[category] || category;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Деталі звернення #{appeal.id.slice(-8)}</span>
            <AppealStatusBadges status={appeal.status} priority={appeal.priority} />
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Основна інформація */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">Дата подання</Label>
                    <p className="text-sm text-gray-700">{formatDate(appeal.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">Заявник</Label>
                    <p className="text-sm text-gray-700">{appeal.submitted_by}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">Категорія</Label>
                    <p className="text-sm text-gray-700">{getCategoryLabel(appeal.category)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium">Останнє оновлення</Label>
                    <p className="text-sm text-gray-700">{formatDate(appeal.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Тема звернення */}
            <div>
              <Label className="text-base font-semibold">Тема звернення</Label>
              <p className="mt-2 text-gray-800 font-medium">{appeal.title}</p>
            </div>

            {/* Повний текст звернення */}
            <div>
              <Label className="text-base font-semibold">Повний текст звернення</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {appeal.content || appeal.description}
                </p>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-blue-800">ID звернення</Label>
                <p className="text-sm text-blue-700 font-mono">{appeal.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-800">Пріоритет</Label>
                <p className="text-sm text-blue-700">{appeal.priority}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-blue-800">Поточний статус</Label>
                <p className="text-sm text-blue-700">{appeal.status}</p>
              </div>
            </div>

            {/* Історія змін (placeholder) */}
            <div>
              <Label className="text-base font-semibold">Історія змін</Label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{formatDate(appeal.created_at)}</span>
                    <span className="text-gray-800">Звернення створено</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{formatDate(appeal.updated_at)}</span>
                    <span className="text-gray-800">Статус: {appeal.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AppealDetailsDialog;
