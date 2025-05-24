
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload, Trash, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';

const DocumentsModule = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample document data
  const documents = [
    { 
      id: 1, 
      name: language === 'en' ? 'Budget Report 2024' : 'Звіт про бюджет 2024', 
      category: language === 'en' ? 'Financial' : 'Фінансовий', 
      date: '2024-05-15', 
      size: '3.5 MB' 
    },
    { 
      id: 2, 
      name: language === 'en' ? 'City Development Plan' : 'План розвитку міста', 
      category: language === 'en' ? 'Planning' : 'Планування', 
      date: '2024-04-22', 
      size: '8.2 MB' 
    },
    { 
      id: 3, 
      name: language === 'en' ? 'Public Services Report' : 'Звіт про публічні послуги', 
      category: language === 'en' ? 'Services' : 'Послуги', 
      date: '2024-05-10', 
      size: '2.1 MB' 
    },
    { 
      id: 4, 
      name: language === 'en' ? 'Environmental Assessment' : 'Екологічна оцінка', 
      category: language === 'en' ? 'Environment' : 'Довкілля', 
      date: '2024-04-05', 
      size: '5.7 MB' 
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadDocument = async () => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await addActivity({
        title: language === 'en' ? 'Document uploaded' : 'Документ завантажено',
        description: 'New document has been uploaded to the system',
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      toast.success(t('documentUploaded') || 'Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(t('errorUploadingDocument') || 'Error uploading document');
    }
  };

  const handleDownloadDocument = async (doc: any) => {
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await addActivity({
        title: language === 'en' ? `Document downloaded: ${doc.name}` : `Документ завантажено: ${doc.name}`,
        description: `Downloaded document: ${doc.name}`,
        type: 'event',
        priority: 'low',
        status: 'completed'
      });

      toast.success(t('documentDownloaded') || 'Document downloaded');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(t('errorDownloadingDocument') || 'Error downloading document');
    }
  };

  const handleDeleteDocument = async (doc: any) => {
    if (!confirm(t('confirmDeleteDocument') || 'Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await addActivity({
        title: language === 'en' ? `Document deleted: ${doc.name}` : `Документ видалено: ${doc.name}`,
        description: `Deleted document: ${doc.name}`,
        type: 'event',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(t('documentDeleted') || 'Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(t('errorDeletingDocument') || 'Error deleting document');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('documentManagement') || 'Document Management'}</h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage all city council documents in one place' 
              : 'Керуйте всіма документами міської ради в одному місці'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'New Folder' : 'Нова папка'}
          </Button>
          <Button className="flex items-center" onClick={handleUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Upload Document' : 'Завантажити документ'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search documents...' : 'Пошук документів...'} 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Document Library' : 'Бібліотека документів'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Name' : 'Назва'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Category' : 'Категорія'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Date' : 'Дата'}
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Size' : 'Розмір'}
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
                    {language === 'en' ? 'Actions' : 'Дії'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{doc.category}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(doc.date).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'uk-UA'
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{doc.size}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                          title={language === 'en' ? 'Download' : 'Завантажити'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteDocument(doc)}
                          title={language === 'en' ? 'Delete' : 'Видалити'}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'en' ? 'No documents found' : 'Документи не знайдено'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsModule;
