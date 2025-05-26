
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
  Upload
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import UploadDocumentDialog from './UploadDocumentDialog';
import DocumentFiltersDialog from './DocumentFiltersDialog';

const DocumentsModule = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });

  // Sample documents data
  const documents = [
    {
      id: '1',
      name: 'Довідка про прописку',
      nameEn: 'Residence Certificate',
      type: 'pdf',
      size: '2.4 MB',
      category: 'certificates',
      uploadDate: '2024-01-15',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Заява на субсидію',
      nameEn: 'Subsidy Application',
      type: 'docx',
      size: '1.2 MB',
      category: 'applications',
      uploadDate: '2024-01-10',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Паспорт (копія)',
      nameEn: 'Passport Copy',
      type: 'jpg',
      size: '3.1 MB',
      category: 'identity',
      uploadDate: '2024-01-08',
      status: 'approved'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="h-8 w-8 text-blue-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            {language === 'en' ? 'Approved' : 'Схвалено'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            {language === 'en' ? 'Pending' : 'На розгляді'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            {language === 'en' ? 'Rejected' : 'Відхилено'}
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (language === 'en' ? doc.nameEn : doc.name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || doc.category === filters.category;
    const matchesType = filters.type === 'all' || doc.type === filters.type;
    const matchesStatus = filters.status === 'all' || doc.status === filters.status;
    
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const docDate = new Date(doc.uploadDate);
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
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesDate;
  });

  const handleViewDocument = (doc: any) => {
    toast.success(language === 'en' ? 'Opening document...' : 'Відкриваємо документ...');
  };

  const handleDownloadDocument = (doc: any) => {
    toast.success(language === 'en' ? 'Downloading document...' : 'Завантажуємо документ...');
  };

  const handleDocumentUploaded = () => {
    // Refresh documents list
    toast.success(language === 'en' ? 'Document uploaded successfully' : 'Документ успішно завантажено');
  };

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
                  {getFileIcon(doc.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {language === 'en' ? doc.nameEn : doc.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {doc.type.toUpperCase()} • {doc.size}
                    </p>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  {language === 'en' ? 'Uploaded:' : 'Завантажено:'} {' '}
                  {new Date(doc.uploadDate).toLocaleDateString(
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
                  className="flex-1"
                  onClick={() => handleDownloadDocument(doc)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Download' : 'Завантажити'}
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
