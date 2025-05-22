
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload, Trash } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DocumentsModule = () => {
  const { language, t } = useLanguage();
  
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('documentManagement')}</h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage all city council documents in one place' 
              : 'Керуйте всіма документами міської ради в одному місці'}
          </p>
        </div>
        <Button className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Upload Document' : 'Завантажити документ'}
        </Button>
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
                {documents.map((doc) => (
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
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsModule;
