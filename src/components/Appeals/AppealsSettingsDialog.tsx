
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface AppealsSettingsDialogProps {
  children: React.ReactNode;
}

const AppealsSettingsDialog = ({ children }: AppealsSettingsDialogProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    autoAssign: true,
    emailNotifications: true,
    responseDeadline: '7',
    categories: 'Технічне\nАдміністративне\nСкарга\nПропозиція\nІнфраструктура\nДовкілля',
    maxFileSize: '10',
    allowedFileTypes: 'pdf,doc,docx,jpg,png'
  });

  const handleSave = async () => {
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(language === 'en' ? 
        'Settings saved successfully' : 
        'Налаштування успішно збережено'
      );
      
      setOpen(false);
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to save settings' : 'Помилка збереження налаштувань');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Appeals Settings' : 'Налаштування звернень'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>{language === 'en' ? 'Auto-assign appeals' : 'Автоматичне призначення звернень'}</Label>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 
                  'Automatically assign new appeals to available staff' : 
                  'Автоматично призначати нові звернення доступним співробітникам'
                }
              </p>
            </div>
            <Switch 
              checked={settings.autoAssign} 
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssign: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{language === 'en' ? 'Email notifications' : 'Email сповіщення'}</Label>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 
                  'Send email notifications for new appeals' : 
                  'Надсилати email сповіщення про нові звернення'
                }
              </p>
            </div>
            <Switch 
              checked={settings.emailNotifications} 
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <div>
            <Label>{language === 'en' ? 'Response deadline (days)' : 'Термін відповіді (дні)'}</Label>
            <Input 
              type="number"
              value={settings.responseDeadline}
              onChange={(e) => setSettings(prev => ({ ...prev, responseDeadline: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>{language === 'en' ? 'Appeal categories (one per line)' : 'Категорії звернень (по одній на рядок)'}</Label>
            <Textarea 
              value={settings.categories}
              onChange={(e) => setSettings(prev => ({ ...prev, categories: e.target.value }))}
              className="mt-1"
              rows={6}
            />
          </div>

          <div>
            <Label>{language === 'en' ? 'Max file size (MB)' : 'Максимальний розмір файлу (МБ)'}</Label>
            <Input 
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>{language === 'en' ? 'Allowed file types' : 'Дозволені типи файлів'}</Label>
            <Input 
              value={settings.allowedFileTypes}
              onChange={(e) => setSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
              className="mt-1"
              placeholder="pdf,doc,docx,jpg,png"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button onClick={handleSave}>
              {language === 'en' ? 'Save Settings' : 'Зберегти налаштування'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppealsSettingsDialog;
