import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Search,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  Filter,
  Send
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
  imageUrl?: string;
  author: string;
  views: number;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  newsId: string;
}

const ResidentNewsModule = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);
  const [selectedNewsForComments, setSelectedNewsForComments] = useState<NewsItem | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: language === 'en' ? 'John Doe' : 'Іван Іваненко',
      text: language === 'en' ? 'Great news! Looking forward to it.' : 'Чудові новини! З нетерпінням чекаю.',
      date: '2024-05-21',
      newsId: '1'
    },
    {
      id: 2,
      author: language === 'en' ? 'Jane Smith' : 'Марія Петренко',
      text: language === 'en' ? 'Finally! This was long overdue.' : 'Нарешті! Це давно треба було зробити.',
      date: '2024-05-20',
      newsId: '1'
    },
    {
      id: 3,
      author: language === 'en' ? 'Mike Johnson' : 'Михайло Петренко',
      text: language === 'en' ? 'This will cause more traffic issues.' : 'Це спричинить більше проблем з трафіком.',
      date: '2024-05-19',
      newsId: '2'
    }
  ]);

  const categories = [
    { id: 'all', name: language === 'en' ? 'All News' : 'Всі новини' },
    { id: 'announcements', name: language === 'en' ? 'Announcements' : 'Оголошення' },
    { id: 'events', name: language === 'en' ? 'Events' : 'Події' },
    { id: 'infrastructure', name: language === 'en' ? 'Infrastructure' : 'Інфраструктура' },
    { id: 'community', name: language === 'en' ? 'Community' : 'Громада' },
    { id: 'emergency', name: language === 'en' ? 'Emergency' : 'Надзвичайні ситуації' }
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'New Community Park Opening This Weekend',
      titleUk: 'Відкриття нового громадського парку на вихідних',
      summary: 'Central Park renovation completed. Grand opening ceremony this Saturday.',
      summaryUk: 'Завершена реконструкція Центрального парку. Урочисте відкриття цієї суботи.',
      content: 'After months of renovation, our beautiful Central Park is ready to welcome visitors again. The grand opening ceremony will feature live music, food vendors, and activities for children.',
      contentUk: 'Після місяців реконструкції наш прекрасний Центральний парк готовий знову приймати відвідувачів. На урочистому відкритті будуть жива музика, продавці їжі та заходи для дітей.',
      category: 'events',
      categoryUk: 'Події',
      date: '2024-05-20',
      author: 'City News Team',
      views: 1250,
      likes: 89,
      comments: 24,
      isPinned: true,
      imageUrl: '/lovable-uploads/a450267e-efde-401a-9890-e34db63d8654.png'
    },
    {
      id: '2',
      title: 'Road Construction Updates - Main Street',
      titleUk: 'Оновлення дорожнього будівництва - Головна вулиця',
      summary: 'Main Street construction will continue through next month with traffic diversions.',
      summaryUk: 'Будівництво на Головній вулиці триватиме наступний місяць з об\'їздами руху.',
      content: 'The reconstruction of Main Street is progressing well. We expect completion by the end of next month. Alternative routes are available via Oak Street and Pine Avenue.',
      contentUk: 'Реконструкція Головної вулиці просувається добре. Очікуємо завершення до кінця наступного місяця. Альтернативні маршрути доступні через вулицю Дубову та проспект Сосновий.',
      category: 'infrastructure',
      categoryUk: 'Інфраструктура',
      date: '2024-05-18',
      author: 'Infrastructure Department',
      views: 890,
      likes: 34,
      comments: 12
    },
    {
      id: '3',
      title: 'Public Budget Meeting - Join the Discussion',
      titleUk: 'Збори з громадського бюджету - Приєднуйтесь до обговорення',
      summary: 'Community budget discussion scheduled for next Tuesday at City Hall.',
      summaryUk: 'Обговорення громадського бюджету заплановано на наступний вівторок у міській раді.',
      content: 'Your voice matters! Join us for an important discussion about how our city budget should be allocated. Every resident is welcome to participate and share their priorities.',
      contentUk: 'Ваша думка важлива! Приєднуйтесь до важливого обговорення про те, як має розподілятися наш міський бюджет. Кожен житель може взяти участь та поділитися своїми пріоритетами.',
      category: 'announcements',
      categoryUk: 'Оголошення',
      date: '2024-05-15',
      author: 'Mayor Office',
      views: 670,
      likes: 56,
      comments: 18,
      isPinned: true
    },
    {
      id: '4',
      title: 'Summer Festival 2024 - Save the Date',
      titleUk: 'Літній фестиваль 2024 - Збережіть дату',
      summary: 'Annual summer festival returns with music, food, and family activities.',
      summaryUk: 'Щорічний літній фестиваль повертається з музикою, їжею та сімейними заходами.',
      content: 'Mark your calendars! Our annual summer festival will take place on July 15-17. This year features local bands, international food court, and a special children\'s area.',
      contentUk: 'Позначте у своїх календарях! Наш щорічний літній фестиваль відбудеться 15-17 липня. Цього року будуть місцеві гурти, міжнародний фуд-корт та спеціальна дитяча зона.',
      category: 'events',
      categoryUk: 'Події',
      date: '2024-05-12',
      author: 'Events Committee',
      views: 1150,
      likes: 143,
      comments: 35
    },
    {
      id: '5',
      title: 'Emergency Alert System Test',
      titleUk: 'Тестування системи екстрених сповіщень',
      summary: 'Monthly test of emergency alert system scheduled for tomorrow.',
      summaryUk: 'Щомісячне тестування системи екстрених сповіщень заплановано на завтра.',
      content: 'Tomorrow at 2 PM, we will conduct our monthly test of the emergency alert system. You may hear sirens and receive test messages. This is just a test.',
      contentUk: 'Завтра о 14:00 ми проведемо наше щомісячне тестування системи екстрених сповіщень. Ви можете почути сирени та отримати тестові повідомлення. Це лише тест.',
      category: 'emergency',
      categoryUk: 'Надзвичайні ситуації',
      date: '2024-05-10',
      author: 'Emergency Services',
      views: 445,
      likes: 12,
      comments: 6
    }
  ];

  const handleComments = (news: NewsItem) => {
    setSelectedNewsForComments(news);
    setShowComments(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error(language === 'en' ? 'Please enter a comment' : 'Будь ласка, введіть коментар');
      return;
    }

    if (!selectedNewsForComments) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: language === 'en' ? 'Current User' : 'Поточний користувач',
      text: newComment,
      date: new Date().toISOString().split('T')[0],
      newsId: selectedNewsForComments.id
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success(language === 'en' ? 'Comment added successfully' : 'Коментар успішно додано');
  };

  const getNewsComments = (newsId: string) => {
    return comments.filter(comment => comment.newsId === newsId);
  };

  const filteredNews = newsItems.filter(item => {
    const title = language === 'en' ? item.title : item.titleUk;
    const summary = language === 'en' ? item.summary : item.summaryUk;
    const category = language === 'en' ? item.category : item.categoryUk;
    
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort by pinned first, then by date
  const sortedNews = filteredNews.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleLike = (newsId: string) => {
    const newLikedNews = new Set(likedNews);
    if (likedNews.has(newsId)) {
      newLikedNews.delete(newsId);
      toast.success(language === 'en' ? 'Like removed' : 'Лайк видалено');
    } else {
      newLikedNews.add(newsId);
      toast.success(language === 'en' ? 'Liked!' : 'Лайк!');
    }
    setLikedNews(newLikedNews);
  };

  const handleShare = (news: NewsItem) => {
    const title = language === 'en' ? news.title : news.titleUk;
    navigator.clipboard.writeText(`${title} - City News`);
    toast.success(language === 'en' ? 'Link copied to clipboard' : 'Посилання скопійовано');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'infrastructure': return 'bg-blue-100 text-blue-800';
      case 'announcements': return 'bg-green-100 text-green-800';
      case 'community': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Stay informed about city news, events, and important announcements.' 
            : 'Будьте в курсі міських новин, подій та важливих оголошень.'}
        </p>
      </div>

      {/* Search and Filter */}
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
        <select 
          className="p-2 border border-gray-300 rounded-md min-w-[200px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 4).map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <div className="space-y-6">
        {sortedNews.map((news) => (
          <Card key={news.id} className={`hover:shadow-md transition-shadow ${news.isPinned ? 'ring-2 ring-blue-200' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* News Image */}
                {news.imageUrl && (
                  <div className="md:w-1/3">
                    <img 
                      src={news.imageUrl} 
                      alt={language === 'en' ? news.title : news.titleUk}
                      className="w-full h-48 md:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* News Content */}
                <div className={`${news.imageUrl ? 'md:w-2/3' : 'w-full'} space-y-3`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {news.isPinned && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {language === 'en' ? 'Pinned' : 'Закріплено'}
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(news.category)}>
                          {language === 'en' ? news.category : news.categoryUk}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'en' ? news.title : news.titleUk}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {language === 'en' ? news.summary : news.summaryUk}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(news.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {news.views}
                        </div>
                        <span>{news.author}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(news.id)}
                        className={`flex items-center gap-1 ${likedNews.has(news.id) ? 'text-red-600' : 'text-gray-600'}`}
                      >
                        <Heart className={`h-4 w-4 ${likedNews.has(news.id) ? 'fill-current' : ''}`} />
                        {news.likes + (likedNews.has(news.id) ? 1 : 0)}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleComments(news)}
                        className="flex items-center gap-1 text-gray-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {getNewsComments(news.id).length}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleShare(news)}
                        className="flex items-center gap-1 text-gray-600"
                      >
                        <Share2 className="h-4 w-4" />
                        {language === 'en' ? 'Share' : 'Поділитись'}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedNews(news)}
                    >
                      {language === 'en' ? 'Read More' : 'Читати далі'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={() => setShowComments(false)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? 'Comments' : 'Коментарі'}
            </DialogTitle>
          </DialogHeader>
          {selectedNewsForComments && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-sm">
                  {language === 'en' ? selectedNewsForComments.title : selectedNewsForComments.titleUk}
                </h5>
                <p className="text-xs text-gray-500">{selectedNewsForComments.date}</p>
              </div>
              
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

              <div className="max-h-64 overflow-y-auto space-y-3">
                {getNewsComments(selectedNewsForComments.id).map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedNews && (language === 'en' ? selectedNews.title : selectedNews.titleUk)}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              {selectedNews.imageUrl && (
                <img 
                  src={selectedNews.imageUrl} 
                  alt={language === 'en' ? selectedNews.title : selectedNews.titleUk}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(selectedNews.category)}>
                  {language === 'en' ? selectedNews.category : selectedNews.categoryUk}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedNews.date)} • {selectedNews.author}
                </span>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {language === 'en' ? selectedNews.content : selectedNews.contentUk}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(selectedNews.id)}
                    className={`flex items-center gap-2 ${likedNews.has(selectedNews.id) ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`h-4 w-4 ${likedNews.has(selectedNews.id) ? 'fill-current' : ''}`} />
                    {language === 'en' ? 'Like' : 'Лайк'} ({selectedNews.likes + (likedNews.has(selectedNews.id) ? 1 : 0)})
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShare(selectedNews)}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Share2 className="h-4 w-4" />
                    {language === 'en' ? 'Share' : 'Поділитись'}
                  </Button>
                </div>
                
                <Button onClick={() => setSelectedNews(null)}>
                  {language === 'en' ? 'Close' : 'Закрити'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {sortedNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === 'en' 
              ? 'No news found matching your criteria.' 
              : 'Не знайдено новин, що відповідають вашим критеріям.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResidentNewsModule;
