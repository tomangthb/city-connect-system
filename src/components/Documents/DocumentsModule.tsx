
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload, Trash, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { supabase } from '@/integrations/supabase/client';
import CreateFolderDialog from './CreateFolderDialog';
import UploadDocumentDialog from './UploadDocumentDialog';

interface Document {
  id: string;
  name: string;
  category: string;
  date: string;
  size: string;
  url?: string;
  type?: string;
}

const DocumentsModule = () => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sample document data as fallback
  const sampleDocuments = [
    { 
      id: '1', 
      name: language === 'en' ? 'Budget Report 2024' : 'Звіт про бюджет 2024', 
      category: language === 'en' ? 'Financial' : 'Фінансовий', 
      date: '2024-05-15', 
      size: '3.5 MB' 
    },
    { 
      id: '2', 
      name: language === 'en' ? 'City Development Plan' : 'План розвитку міста', 
      category: language === 'en' ? 'Planning' : 'Планування', 
      date: '2024-04-22', 
      size: '8.2 MB' 
    },
    { 
      id: '3', 
      name: language === 'en' ? 'Public Services Report' : 'Звіт про публічні послуги', 
      category: language === 'en' ? 'Services' : 'Послуги', 
      date: '2024-05-10', 
      size: '2.1 MB' 
    },
    { 
      id: '4', 
      name: language === 'en' ? 'Environmental Assessment' : 'Екологічна оцінка', 
      category: language === 'en' ? 'Environment' : 'Довкілля', 
      date: '2024-04-05', 
      size: '5.7 MB' 
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Try to load from storage or database
      // For now, we'll use sample data but structure it properly
      setDocuments(sampleDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments(sampleDocuments);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadDocument = async (doc: Document) => {
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

      toast.success(language === 'en' ? 'Document downloaded successfully' : 'Документ успішно завантажено');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(language === 'en' ? 'Error downloading document' : 'Помилка завантаження документа');
    }
  };

  const handleDeleteDocument = async (doc: Document) => {
    if (!confirm(language === 'en' ? 
      `Are you sure you want to delete "${doc.name}"?` : 
      `Ви впевнені, що хочете видалити "${doc.name}"?`)) {
      return;
    }

    try {
      // Remove from state
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      
      await addActivity({
        title: language === 'en' ? `Document deleted: ${doc.name}` : `Документ видалено: ${doc.name}`,
        description: `Deleted document: ${doc.name}`,
        type: 'event',
        priority: 'medium',
        status: 'completed'
      });

      toast.success(language === 'en' ? 'Document deleted successfully' : 'Документ успішно видалено');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(language === 'en' ? 'Error deleting document' : 'Помилка видалення документа');
    }
  };

  const handleDocumentUploaded = (newDocument: Omit<Document, 'id'>) => {
    const documentWithId: Document = {
      ...newDocument,
      id: Date.now().toString()
    };
    setDocuments(prev => [...prev, documentWithId]);
    toast.success(language === 'en' ? 'Document uploaded successfully' : 'Документ успішно завантажено');
  };

  const handleFolderCreated = (folderName: string) => {
    const newFolder: Document = {
      id: Date.now().toString(),
      name: folderName,
      category: language === 'en' ? 'Folder' : 'Папка',
      date: new Date().toISOString().split('T')[0],
      size: '-',
      type: 'folder'
    };
    setDocuments(prev => [...prev, newFolder]);
    toast.success(language === 'en' ? 'Folder created successfully' : 'Папку успішно створено');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-gray-500">
            {language === 'en' ? 'Loading documents...' : 'Завантаження документів...'}
          </p>
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
              ? 'Manage all city council documents in one place' 
              : 'Керуйте всіма документами міської ради в одному місці'}
          </p>
        </div>
        <div className="flex space-x-2">
          <CreateFolderDialog onFolderCreated={handleFolderCreated}>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'New Folder' : 'Нова папка'}
            </Button>
          </CreateFolderDialog>
          <UploadDocumentDialog onDocumentUploaded={handleDocumentUploaded}>
            <Button className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Upload Document' : 'Завантажити документ'}
            </Button>
          </UploadDocumentDialog>
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
                        {doc.type !== 'folder' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            title={language === 'en' ? 'Download' : 'Завантажити'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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
