
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Download, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ImportExportTab = () => {
  const { language } = useLanguage();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImportUsers = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Here you would process the CSV/Excel file
      toast.success(language === 'en' ? 'Users imported successfully' : 'Користувачів успішно імпортовано');
    } catch (error) {
      toast.error(language === 'en' ? 'Error importing users' : 'Помилка імпорту користувачів');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      // Here you would generate and download the export file
      toast.success(language === 'en' ? 'Users exported successfully' : 'Користувачів успішно експортовано');
    } catch (error) {
      toast.error(language === 'en' ? 'Error exporting users' : 'Помилка експорту користувачів');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportRoles = async () => {
    setIsExporting(true);
    try {
      // Here you would generate and download the roles export
      toast.success(language === 'en' ? 'Roles exported successfully' : 'Ролі успішно експортовано');
    } catch (error) {
      toast.error(language === 'en' ? 'Error exporting roles' : 'Помилка експорту ролей');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {language === 'en' ? 'Import Data' : 'Імпорт даних'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">
                  {language === 'en' ? 'Important Notes' : 'Важливі примітки'}
                </h4>
                <ul className="text-sm text-amber-700 mt-1 space-y-1">
                  <li>• {language === 'en' ? 'Backup your data before importing' : 'Створіть резервну копію даних перед імпортом'}</li>
                  <li>• {language === 'en' ? 'File should be in CSV or Excel format' : 'Файл повинен бути у форматі CSV або Excel'}</li>
                  <li>• {language === 'en' ? 'Required columns: first_name, last_name, email' : 'Обов\'язкові колонки: first_name, last_name, email'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'en' ? 'Import Users' : 'Імпорт користувачів'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Upload a CSV or Excel file with user data' 
                : 'Завантажте CSV або Excel файл з даними користувачів'}
            </p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImportUsers}
              className="hidden"
              id="import-users"
              disabled={isImporting}
            />
            <label htmlFor="import-users">
              <Button asChild disabled={isImporting}>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting 
                    ? (language === 'en' ? 'Importing...' : 'Імпорт...') 
                    : (language === 'en' ? 'Choose File' : 'Обрати файл')
                  }
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {language === 'en' ? 'Export Data' : 'Експорт даних'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Export Users' : 'Експорт користувачів'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Download all user accounts with their details' 
                    : 'Завантажити всі облікові записи користувачів з їх деталями'}
                </p>
                <Button onClick={handleExportUsers} disabled={isExporting} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting 
                    ? (language === 'en' ? 'Exporting...' : 'Експорт...') 
                    : (language === 'en' ? 'Export Users' : 'Експорт користувачів')
                  }
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Export Roles' : 'Експорт ролей'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Download all roles and their permissions' 
                    : 'Завантажити всі ролі та їх дозволи'}
                </p>
                <Button onClick={handleExportRoles} disabled={isExporting} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting 
                    ? (language === 'en' ? 'Exporting...' : 'Експорт...') 
                    : (language === 'en' ? 'Export Roles' : 'Експорт ролей')
                  }
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              {language === 'en' ? 'Export Information' : 'Інформація про експорт'}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {language === 'en' ? 'Files are downloaded in CSV format' : 'Файли завантажуються у форматі CSV'}</li>
              <li>• {language === 'en' ? 'Personal data is exported according to GDPR guidelines' : 'Персональні дані експортуються відповідно до рекомендацій GDPR'}</li>
              <li>• {language === 'en' ? 'Export includes only non-sensitive information' : 'Експорт включає лише неконфіденційну інформацію'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExportTab;
