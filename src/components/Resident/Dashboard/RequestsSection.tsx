
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Appeal {
  id: string;
  title: string;
  status: string;
  created_at: string;
  category: string;
}

const RequestsSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppeals();
  }, [user]);

  const fetchAppeals = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appeals')
        .select('id, title, status, created_at, category')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching appeals:', error);
        setAppeals([]);
      } else {
        setAppeals(data || []);
      }
    } catch (error) {
      console.error('Error fetching appeals:', error);
      setAppeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : appeals.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev < appeals.length - 1 ? prev + 1 : 0);
  };

  const getStatusColor = (status: string) => {
    const englishStatus = status === 'Завершено' ? 'Completed' : 
                         status === 'В процесі' ? 'In Progress' : 
                         status === 'На розгляді' ? 'Under Review' : status;
    
    switch (englishStatus) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'uk') {
      switch (status) {
        case 'Under Review': return 'На розгляді';
        case 'In Progress': return 'В процесі';
        case 'Completed': return 'Завершено';
        default: return status;
      }
    }
    return status;
  };

  const handleViewAllRequests = () => {
    navigate('/resident-appeals');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{language === 'en' ? 'Loading...' : 'Завантаження...'}</p>
        </CardContent>
      </Card>
    );
  }

  if (appeals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{language === 'en' ? 'No requests found' : 'Запитів не знайдено'}</p>
          <Button variant="outline" className="w-full mt-4" onClick={handleViewAllRequests}>
            {language === 'en' ? 'View All Requests' : 'Переглянути всі запити'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {language === 'en' ? 'My Recent Requests' : 'Мої останні запити'}
          </div>
          {appeals.length > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {appeals.length}
              </span>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{appeals[currentIndex].title}</p>
              <p className="text-sm text-gray-600">
                #{appeals[currentIndex].id.slice(0, 8)} • {new Date(appeals[currentIndex].created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appeals[currentIndex].status)}`}>
              {getStatusText(appeals[currentIndex].status)}
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={handleViewAllRequests}>
          {language === 'en' ? 'View All Requests' : 'Переглянути всі запити'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequestsSection;
