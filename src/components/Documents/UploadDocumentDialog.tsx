
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

interface UploadDocumentDialogProps {
  children: React.ReactNode;
}

const UploadDocumentDialog = ({ children }: UploadDocumentDialogProps) => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!documentName.trim()) {
      toast.error(language === 'en' ? 'Document name is required' : 'Назва документа обов\'язкова');
      return;
    }

    if (!file) {
      toast.error(language === 'en' ? 'Please select a file' : 'Будь ласка, оберіть файл');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await addActivity({
        title: language === 'en' ? `Document uploaded: ${documentName}` : `Документ завантажено: ${documentName}`,
        description: `Uploaded document: ${documentName} (${file.name})`,
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      toast.success(t('documentUploaded') || 'Document uploaded successfully');
      setOpen(false);
      setDocumentName('');
      setCategory('');
      setFile(null);
    } catch (error) {
      toast.error(t('errorUploadingDocument') || 'Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Upload Document' : 'Завантажити документ'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentName">{language === 'en' ? 'Document Name' : 'Назва документа'}</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={language === 'en' ? 'Enter document name' : 'Введіть назву документа'}
            />
          </div>

          <div>
            <Label htmlFor="category">{t('category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select category' : 'Оберіть категорію'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">{language === 'en' ? 'Financial' : 'Фінансовий'}</SelectItem>
                <SelectItem value="planning">{language === 'en' ? 'Planning' : 'Планування'}</SelectItem>
                <SelectItem value="services">{language === 'en' ? 'Services' : 'Послуги'}</SelectItem>
                <SelectItem value="environment">{language === 'en' ? 'Environment' : 'Довкілля'}</SelectItem>
                <SelectItem value="legal">{language === 'en' ? 'Legal' : 'Правовий'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">{language === 'en' ? 'File' : 'Файл'}</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (language === 'en' ? 'Uploading...' : 'Завантаження...') : (language === 'en' ? 'Upload' : 'Завантажити')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
