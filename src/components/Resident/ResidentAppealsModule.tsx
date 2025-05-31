
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ResidentAppealsModule = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Submit Appeal' : 'Подати звернення'}
        </h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'New Appeal' : 'Нове звернення'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            {language === 'en' ? 'My Appeals' : 'Мої звернення'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Submit and track your appeals to the city administration.' 
              : 'Подавайте та відстежуйте свої звернення до міської адміністрації.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentAppealsModule;
