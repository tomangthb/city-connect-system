import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NewsSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const cityNews = [
    {
      id: 1,
      title: language === 'en' ? 'New Park Opening This Weekend' : 'Відкриття нового парку на вихідних',
      date: '2024-05-20',
      summary: language === 'en' 
        ? 'Central Park renovation completed. Grand opening ceremony...' 
        : 'Завершена реконструкція Центрального парку. Урочисте відкриття...',
      comments: 12
    },
    {
      id: 2,
      title: language === 'en' ? 'Road Construction Updates' : 'Оновлення дорожнього будівництва',
      date: '2024-05-18',
      summary: language === 'en' 
        ? 'Main Street construction will continue through next month...' 
        : 'Будівництво на Головній вулиці триватиме наступний місяць...',
      comments: 8
    },
    {
      id: 3,
      title: language === 'en' ? 'Public Meeting Notice' : 'Повідомлення про громадські збори',
      date: '2024-05-15',
      summary: language === 'en' 
        ? 'Community budget discussion scheduled for next Tuesday...' 
        : 'Обговорення громадського бюджету заплановано на наступний вівторок...',
      comments: 5
    },
    {
      id: 4,
      title: language === 'en' ? 'Water System Maintenance' : 'Обслуговування водної системи',
      date: '2024-05-12',
      summary: language === 'en' 
        ? 'Scheduled maintenance will affect water pressure...' 
        : 'Планове обслуговування вплине на тиск води...',
      comments: 15
    },
    {
      id: 5,
      title: language === 'en' ? 'City Festival Announcement' : 'Оголошення про міський фестиваль',
      date: '2024-05-10',
      summary: language === 'en' 
        ? 'Annual city festival to be held next month...' 
        : 'Щорічний міський фестиваль відбудеться наступного місяця...',
      comments: 23
    }
  ];

  const handleComments = (news: any) => {
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

  const handleViewAllNews = () => {
    navigate('/resident-news');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            {language === 'en' ? 'City News & Events' : 'Міські новини та події'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-4 pr-4">
              {cityNews.map((news) => (
                <div key={news.id} className="border-b border-gray-100 pb-3">
                  <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{news.date}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleComments(news)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{news.comments}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button variant="outline" className="w-full mt-4" onClick={handleViewAllNews}>
            {language === 'en' ? 'View All News' : 'Переглянути всі новини'}
          </Button>
        </CardContent>
      </Card>

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
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-sm">{selectedNews.title}</h5>
                <p className="text-xs text-gray-500">{selectedNews.date}</p>
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

            <div className="max-h-64 overflow-y-auto space-y-3">
              {comments.map((comment) => (
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsSection;
