
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  MessageCircle, 
  Send,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  title: string;
  titleUk: string;
  summary: string;
  summaryUk: string;
  content: string;
  contentUk: string;
  category: string;
  categoryUk: string;
  date: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  isPinned: boolean;
  imageUrl?: string;
}

const ResidentNewsModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'New Park Opening This Weekend',
      titleUk: 'Відкриття нового парку на вихідних',
      summary: 'Central Park renovation completed. Grand opening ceremony scheduled for Saturday.',
      summaryUk: 'Завершена реконструкція Центрального парку. Урочисте відкриття заплановано на суботу.',
      content: 'After months of renovation work, Central Park is ready to welcome visitors again...',
      contentUk: 'Після місяців ремонтних робіт Центральний парк готовий знову приймати відвідувачів...',
      category: 'Events',
      categoryUk: 'Події',
      date: '2024-05-20',
      author: 'City News Team',
      views: 1250,
      likes: 89,
      comments: 12,
      isPinned: true
    },
    {
      id: '2',
      title: 'Road Construction Updates',
      titleUk: 'Оновлення дорожнього будівництва',
      summary: 'Main Street construction will continue through next month with traffic diversions.',
      summaryUk: 'Будівництво на Головній вулиці триватиме наступний місяць з об\'їздами руху.',
      content: 'Construction work on Main Street is progressing as planned...',
      contentUk: 'Будівельні роботи на Головній вулиці просуваються згідно з планом...',
      category: 'Infrastructure',
      categoryUk: 'Інфраструктура',
      date: '2024-05-18',
      author: 'Transport Department',
      views: 890,
      likes: 23,
      comments: 8,
      isPinned: false
    },
    {
      id: '3',
      title: 'Public Meeting Notice',
      titleUk: 'Повідомлення про громадські збори',
      summary: 'Community budget discussion scheduled for next Tuesday at 7 PM.',
      summaryUk: 'Обговорення громадського бюджету заплановано на наступний вівторок о 19:00.',
      content: 'All residents are invited to participate in the community budget discussion...',
      contentUk: 'Всі мешканці запрошуються до участі в обговоренні громадського бюджету...',
      category: 'Announcements',
      categoryUk: 'Оголошення',
      date: '2024-05-15',
      author: 'City Administration',
      views: 567,
      likes: 45,
      comments: 5,
      isPinned: false
    }
  ];

  const categories = [
    { value: 'all', label: language === 'en' ? 'All Categories' : 'Всі категорії' },
    { value: 'events', label: language === 'en' ? 'Events' : 'Події' },
    { value: 'infrastructure', label: language === 'en' ? 'Infrastructure' : 'Інфраструктура' },
    { value: 'announcements', label: language === 'en' ? 'Announcements' : 'Оголошення' },
    { value: 'safety', label: language === 'en' ? 'Safety' : 'Безпека' }
  ];

  const filteredNews = newsItems.filter(item => {
    const title = language === 'en' ? item.title : item.titleUk;
    const summary = language === 'en' ? item.summary : item.summaryUk;
    const category = language === 'en' ? item.category : item.categoryUk;
    
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (news: NewsItem) => {
    setSelectedNews(news);
    setShowDetailsDialog(true);
  };

  const handleComments = (news: NewsItem) => {
    setSelectedNews(news);
    setShowComments(true);
    // Mock comments
    setComments([
      {
        id: 1,
        author: language === 'en' ? 'John Doe' : 'Іван Іванenko',
        text: language === 'en' ? 'Great news! Looking forward to it.' : 'Чудові новини! З нетерпінням чекаю.',
        date: '2024-05-21'
      },
      {
        id: 2,
        author: language === 'en' ? 'Jane Smith' : 'Марія Петренко',
        text: language === 'en' ? 'Finally! This was long overdue.' : 'Нарешті! Це давно треба було зробити.',
        date: '2024-05-20'
      }
    ]);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error(language === 'en' ? 'Please enter a comment' : 'Будь ласка, введіть коментар');
      return;
    }

    const comment = {
      id: comments.length + 1,
      author: language === 'en' ? 'Current User' : 'Поточний користувач',
      text: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success(language === 'en' ? 'Comment added successfully' : 'Коментар успішно додано');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'en' 
            ? 'Stay informed about city news, events, and important announcements.' 
            : 'Будьте в курсі міських новин, подій та важливих оголошень.'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={language === 'en' ? 'Search news...' : 'Пошук новин...'}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* News Grid */}
      <div className="grid gap-6">
        {filteredNews.map((news) => (
          <Card key={news.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {news.isPinned && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {language === 'en' ? 'Pinned' : 'Закріплено'}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {language === 'en' ? news.category : news.categoryUk}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {language === 'en' ? news.title : news.titleUk}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {language === 'en' ? news.summary : news.summaryUk}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{news.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{news.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{news.likes}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleComments(news)}
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{news.comments}</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(news)}>
                    {language === 'en' ? 'Read More' : 'Читати далі'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {language === 'en' 
              ? 'No news found matching your criteria.' 
              : 'Не знайдено новин, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}

      {/* News Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNews && (language === 'en' ? selectedNews.title : selectedNews.titleUk)}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{selectedNews.date}</span>
                <span>•</span>
                <span>{selectedNews.author}</span>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline">
                  {language === 'en' ? selectedNews.category : selectedNews.categoryUk}
                </Badge>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'en' ? selectedNews.content : selectedNews.contentUk}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedNews.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{selectedNews.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{selectedNews.comments}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Like' : 'Подобається'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Share' : 'Поділитися'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Comments' : 'Коментарі'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedNews && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h5 className="font-medium text-sm">
                  {language === 'en' ? selectedNews.title : selectedNews.titleUk}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedNews.date}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Textarea
                placeholder={language === 'en' ? 'Write a comment...' : 'Написати коментар...'}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button onClick={handleAddComment} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentNewsModule;
