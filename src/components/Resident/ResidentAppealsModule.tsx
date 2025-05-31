
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus,
  Clock,
  User,
  Eye,
  Search,
  Filter,
  FileText,
  CalendarDays,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addActivity } from '@/utils/activityUtils';
import { useAuth } from '@/contexts/AuthContext';

const ResidentAppealsModule = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newAppeal, setNewAppeal] = useState({
    title: '',
    category: '',
    content: ''
  });

  const { data: appeals, isLoading, refetch } = useQuery({
    queryKey: ['appeals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('appeals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching appeals:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user
  });

  const handleSubmitAppeal = async () => {
    if (!newAppeal.title.trim() || !newAppeal.category || !newAppeal.content.trim()) {
      toast.error(language === 'en' ? 'Please fill all fields' : 'Заповніть всі поля');
      return;
    }

    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('appeals')
        .insert([{
          ...newAppeal,
          user_id: user.id,
          submitted_by: user.email || 'Unknown User',
          status: 'Under Review',
          priority: 'Medium'
        }]);

      if (error) throw error;

      await addActivity({
        title: `New appeal submitted: ${newAppeal.title}`,
        description: `Appeal "${newAppeal.title}" has been submitted for review`,
        type: 'appeal',
        priority: 'medium',
        status: 'pending'
      });

      toast.success(language === 'en' ? 'Appeal submitted successfully' : 'Звернення успішно подано');
      setShowForm(false);
      setNewAppeal({ title: '', category: '', content: '' });
      refetch();
    } catch (error) {
      console.error('Error submitting appeal:', error);
      toast.error(language === 'en' ? 'Error submitting appeal' : 'Помилка при поданні звернення');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppeals = appeals?.filter(appeal => {
    const matchesSearch = appeal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appeal.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || appeal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
          {language === 'en' ? 'My Appeals' : 'Мої звернення'}
        </h2>
        <p className="text-gray-200 dark:text-gray-200">
          {language === 'en' 
            ? 'Submit and track your appeals to the city administration.' 
            : 'Подавайте та відстежуйте ваші звернення до міської адміністрації.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={language === 'en' ? 'Search appeals...' : 'Пошук звернень...'}
            className="pl-10 search-input-enhanced"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="p-2 border border-white bg-gray-800 text-white rounded-md min-w-[200px] focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all" className="bg-gray-800 text-white">
            {language === 'en' ? 'All Categories' : 'Всі категорії'}
          </option>
          <option value="Infrastructure" className="bg-gray-800 text-white">
            {language === 'en' ? 'Infrastructure' : 'Інфраструктура'}
          </option>
          <option value="Public Order" className="bg-gray-800 text-white">
            {language === 'en' ? 'Public Order' : 'Громадський порядок'}
          </option>
          <option value="Roads" className="bg-gray-800 text-white">
            {language === 'en' ? 'Roads' : 'Дороги'}
          </option>
          <option value="Environment" className="bg-gray-800 text-white">
            {language === 'en' ? 'Environment' : 'Довкілля'}
          </option>
          <option value="Other" className="bg-gray-800 text-white">
            {language === 'en' ? 'Other' : 'Інше'}
          </option>
        </select>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'New Appeal' : 'Нове звернення'}
        </Button>
      </div>

      {/* New Appeal Form */}
      {showForm && (
        <Card className="enhanced-card-block">
          <CardHeader>
            <CardTitle className="text-white dark:text-white">
              {language === 'en' ? 'Submit New Appeal' : 'Подати нове звернення'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {language === 'en' ? 'Subject' : 'Тема'}
              </label>
              <Input 
                placeholder={language === 'en' ? 'Appeal subject' : 'Тема звернення'}
                value={newAppeal.title}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, title: e.target.value }))}
                className="enhanced-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {language === 'en' ? 'Category' : 'Категорія'}
              </label>
              <select 
                className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                value={newAppeal.category}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">{language === 'en' ? 'Select category' : 'Оберіть категорію'}</option>
                <option value="Infrastructure">{language === 'en' ? 'Infrastructure' : 'Інфраструктура'}</option>
                <option value="Public Order">{language === 'en' ? 'Public Order' : 'Громадський порядок'}</option>
                <option value="Roads">{language === 'en' ? 'Roads' : 'Дороги'}</option>
                <option value="Environment">{language === 'en' ? 'Environment' : 'Довкілля'}</option>
                <option value="Other">{language === 'en' ? 'Other' : 'Інше'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {language === 'en' ? 'Description' : 'Опис'}
              </label>
              <Textarea 
                placeholder={language === 'en' ? 'Detailed description of your appeal' : 'Детальний опис вашого звернення'}
                rows={4}
                value={newAppeal.content}
                onChange={(e) => setNewAppeal(prev => ({ ...prev, content: e.target.value }))}
                className="enhanced-input"
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSubmitAppeal} className="bg-green-600 hover:bg-green-700">
                {language === 'en' ? 'Submit Appeal' : 'Подати звернення'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {language === 'en' ? 'Cancel' : 'Скасувати'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appeals List */}
      <div className="space-y-4">
        {filteredAppeals.length > 0 ? (
          filteredAppeals.map((appeal) => (
            <Card key={appeal.id} className="enhanced-card-block hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{appeal.title}</h3>
                    <p className="text-sm text-gray-300">ID: #{appeal.id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(appeal.status)}>
                      {appeal.status}
                    </Badge>
                    <Badge className={getPriorityColor(appeal.priority)}>
                      {appeal.priority}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-200 mb-4 leading-relaxed">{appeal.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {appeal.submitted_by}
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {new Date(appeal.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {appeal.category}
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'View Details' : 'Деталі'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {language === 'en' 
                ? 'No appeals found matching your criteria.' 
                : 'Не знайдено звернень за вашими критеріями.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentAppealsModule;
