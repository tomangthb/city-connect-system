
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';

interface UploadDocumentDialogProps {
  children: React.ReactNode;
  onDocumentUploaded?: () => void;
}

const UploadDocumentDialog = ({ children, onDocumentUploaded }: UploadDocumentDialogProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !documentName.trim() || !category || !user) {
        throw new Error('Missing required fields');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .insert({
          name: documentName,
          category: category,
          file_path: uploadData.path,
          file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          file_type: file.type,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return dbData;
    },
    onSuccess: () => {
      toast.success(language === 'en' ? 'Document uploaded successfully' : 'Документ успішно завантажено');
      setOpen(false);
      setDocumentName('');
      setCategory('');
      setFile(null);
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error(language === 'en' ? 'Error uploading document' : 'Помилка завантаження документа');
    }
  });

  const handleUpload = async () => {
    if (!documentName.trim()) {
      toast.error(language === 'en' ? 'Document name is required' : 'Назва документа обов\'язкова');
      return;
    }

    if (!file) {
      toast.error(language === 'en' ? 'Please select a file' : 'Будь ласка, оберіть файл');
      return;
    }

    if (!category) {
      toast.error(language === 'en' ? 'Please select a category' : 'Будь ласка, оберіть категорію');
      return;
    }

    uploadMutation.mutate();
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
            <Label htmlFor="category">{language === 'en' ? 'Category' : 'Категорія'}</Label>
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
                <SelectItem value="contracts">{language === 'en' ? 'Contracts' : 'Договори'}</SelectItem>
                <SelectItem value="reports">{language === 'en' ? 'Reports' : 'Звіти'}</SelectItem>
                <SelectItem value="policies">{language === 'en' ? 'Policies' : 'Політики'}</SelectItem>
                <SelectItem value="procedures">{language === 'en' ? 'Procedures' : 'Процедури'}</SelectItem>
                <SelectItem value="forms">{language === 'en' ? 'Forms' : 'Форми'}</SelectItem>
                <SelectItem value="correspondence">{language === 'en' ? 'Correspondence' : 'Листування'}</SelectItem>
                <SelectItem value="other">{language === 'en' ? 'Other' : 'Інше'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file">{language === 'en' ? 'File' : 'Файл'}</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xls,.xlsx"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
              {uploadMutation.isPending 
                ? (language === 'en' ? 'Uploading...' : 'Завантаження...') 
                : (language === 'en' ? 'Upload' : 'Завантажити')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
