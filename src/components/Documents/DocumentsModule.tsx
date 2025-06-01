
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File,
  Upload,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import UploadDocumentDialog from './UploadDocumentDialog';
import DocumentFiltersDialog from './DocumentFiltersDialog';

interface Document {
  id: string;
  name: string;
  category: string;
  file_path?: string;
  file_size: string;
  file_type: string;
  created_at: string;
  uploaded_by?: string;
}

const DocumentsModule = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const queryClient = useQueryClient();

  // Fetch documents from database
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success(language === 'en' ? 'Document deleted successfully' : 'Документ успішно видалено');
    },
    onError: () => {
      toast.error(language === 'en' ? 'Error deleting document' : 'Помилка видалення документа');
    }
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'application/pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'image/jpeg':
      case 'image/png':
      case 'image/jpg':
        return <Image className="h-8 w-8 text-blue-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getCategoryName = (category: string) => {
    const categories = {
      financial: language === 'en' ? 'Financial' : 'Фінансовий',
      planning: language === 'en' ? 'Planning' : 'Планування',
      services: language === 'en' ? 'Services' : 'Послуги',
      environment: language === 'en' ? 'Environment' : 'Довкілля',
      legal: language === 'en' ? 'Legal' : 'Правовий',
      contracts: language === 'en' ? 'Contracts' : 'Договори',
      reports: language === 'en' ? 'Reports' : 'Звіти',
      policies: language === 'en' ? 'Policies' : 'Політики',
      procedures: language === 'en' ? 'Procedures' : 'Процедури',
      forms: language === 'en' ? 'Forms' : 'Форми',
      correspondence: language === 'en' ? 'Correspondence' : 'Листування',
      other: language === 'en' ? 'Other' : 'Інше'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || doc.category === filters.category;
    const matchesType = filters.type === 'all' || doc.file_type.includes(filters.type);
    
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const docDate = new Date(doc.created_at);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = docDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = docDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          matchesDate = docDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          matchesDate = docDate >= yearAgo;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const handleViewDocument = async (doc: Document) => {
    if (doc.file_path) {
      const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_path);
      window.open(data.publicUrl, '_blank');
    } else {
      toast.error(language === 'en' ? 'File not found' : 'Файл не знайдено');
    }
  };

  const handleDownloadDocument = async (doc: Document) => {
    if (doc.file_path) {
      const { data } = supabase.storage.from('documents').getPublicUrl(doc.file_path);
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = doc.name;
      link.click();
      toast.success(language === 'en' ? 'Downloading document...' : 'Завантажуємо документ...');
    } else {
      toast.error(language === 'en' ? 'File not found' : 'Файл не знайдено');
    }
  };

  const handleDeleteDocument = (doc: Document) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this document?' : 'Ви впевнені, що хочете видалити цей документ?')) {
      deleteDocumentMutation.mutate(doc.id);
    }
  };

  const handleDocumentUploaded = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>{language === 'en' ? 'Loading documents...' : 'Завантаження документів...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Document Management' : 'Управління документами'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage and view your documents' 
              : 'Керуйте та переглядайте свої документи'}
          </p>
        </div>
        <UploadDocumentDialog onDocumentUploaded={handleDocumentUploaded}>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Upload Document' : 'Завантажити документ'}
          </Button>
        </UploadDocumentDialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === 'en' ? 'Search documents...' : 'Пошук документів...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <DocumentFiltersDialog
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(doc.file_type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.file_type.split('/').pop()?.toUpperCase()} • {doc.file_size}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {getCategoryName(doc.category)}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  {language === 'en' ? 'Uploaded:' : 'Завантажено:'} {' '}
                  {new Date(doc.created_at).toLocaleDateString(
                    language === 'en' ? 'en-US' : 'uk-UA'
                  )}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDocument(doc)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'View' : 'Переглянути'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadDocument(doc)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteDocument(doc)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'en' ? 'No documents found' : 'Документи не знайдено'}
          </h3>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Спробуйте змінити параметри пошуку або фільтра'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsModule;
