
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DocumentsModule = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = [
    { value: 'all', label: language === 'en' ? 'All Documents' : 'Всі документи' },
    { value: 'certificates', label: language === 'en' ? 'Certificates' : 'Довідки' },
    { value: 'applications', label: language === 'en' ? 'Applications' : 'Заяви' },
    { value: 'identity', label: language === 'en' ? 'Identity Documents' : 'Документи особи' }
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
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('documents')}</h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Manage and view your documents' 
            : 'Керуйте та переглядайте свої документи'}
        </p>
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
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Filter' : 'Фільтр'}
              </Button>
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
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'View' : 'Переглянути'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
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
