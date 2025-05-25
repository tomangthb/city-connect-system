
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, File, X } from 'lucide-react';

interface DocumentStorageProps {
  children: React.ReactNode;
  onDocumentUploaded: () => void;
}

const DocumentStorage = ({ children, onDocumentUploaded }: DocumentStorageProps) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error(language === 'en' ? 'Please select files to upload' : 'Будь ласка, оберіть файли для завантаження');
      return;
    }

    if (!formData.title || !formData.category) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        // Save document metadata to database
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            name: formData.title || file.name,
            original_name: file.name,
            file_path: filePath,
            file_url: publicUrl,
            file_size: file.size,
            file_type: file.type,
            category: formData.category,
            description: formData.description,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (dbError) throw dbError;

        // Update progress
        const progress = ((index + 1) / selectedFiles.length) * 100;
        setUploadProgress(progress);
      });

      await Promise.all(uploadPromises);

      toast.success(language === 'en' ? 'Documents uploaded successfully' : 'Документи успішно завантажено');
      onDocumentUploaded();
      resetForm();
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error(language === 'en' ? 'Error uploading documents' : 'Помилка завантаження документів');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: ''
    });
    setSelectedFiles([]);
    setOpen(false);
  };

  const categories = [
    { value: 'contracts', label: language === 'en' ? 'Contracts' : 'Договори' },
    { value: 'reports', label: language === 'en' ? 'Reports' : 'Звіти' },
    { value: 'policies', label: language === 'en' ? 'Policies' : 'Політики' },
    { value: 'procedures', label: language === 'en' ? 'Procedures' : 'Процедури' },
    { value: 'forms', label: language === 'en' ? 'Forms' : 'Форми' },
    { value: 'correspondence', label: language === 'en' ? 'Correspondence' : 'Листування' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Інше' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Upload Documents' : 'Завантажити документи'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">
                {language === 'en' ? 'Drop files here...' : 'Перетягніть файли сюди...'}
              </p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  {language === 'en' ? 'Drag & drop files here, or click to select' : 'Перетягніть файли сюди або клацніть для вибору'}
                </p>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Supports: PDF, DOC, DOCX, XLS, XLSX, Images, TXT' : 'Підтримує: PDF, DOC, DOCX, XLS, XLSX, Зображення, TXT'}
                </p>
              </div>
            )}
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {language === 'en' ? 'Selected Files' : 'Обрані файли'}
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {language === 'en' ? 'Document Title' : 'Назва документа'} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={language === 'en' ? 'Enter document title' : 'Введіть назву документа'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                {language === 'en' ? 'Category' : 'Категорія'} *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select category' : 'Оберіть категорію'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {language === 'en' ? 'Description' : 'Опис'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={language === 'en' ? 'Enter document description' : 'Введіть опис документа'}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">
              {language === 'en' ? 'Tags (comma separated)' : 'Теги (через кому)'}
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder={language === 'en' ? 'urgent, public, internal' : 'термінове, публічне, внутрішнє'}
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Upload Progress' : 'Прогрес завантаження'}</Label>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">
                {uploadProgress.toFixed(0)}%
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              {language === 'en' ? 'Cancel' : 'Скасувати'}
            </Button>
            <Button 
              onClick={uploadFiles} 
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading 
                ? (language === 'en' ? 'Uploading...' : 'Завантаження...') 
                : (language === 'en' ? 'Upload Documents' : 'Завантажити документи')
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentStorage;
