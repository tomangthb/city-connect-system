
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFAQ } from '@/hooks/useFAQ';

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const { language } = useLanguage();
  const { faqItems, loading } = useFAQ();

  const getGreeting = () => {
    return language === 'uk' 
      ? 'Привіт! Як я можу вам допомогти? Виберіть одне з питань нижче:'
      : 'Hello! How can I help you? Select one of the questions below:';
  };

  const getBackText = () => {
    return language === 'uk' ? 'Назад до списку' : 'Back to list';
  };

  const getLoadingText = () => {
    return language === 'uk' ? 'Завантаження...' : 'Loading...';
  };

  const handleQuestionClick = (question: any) => {
    setSelectedQuestion(question);
  };

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  const groupedFAQs = faqItems.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      {/* Floating FAQ Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* FAQ Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="bg-black/20 fixed inset-0" onClick={() => setIsOpen(false)} />
          <Card className="w-96 h-[500px] shadow-2xl relative z-10 enhanced-card">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <CardTitle className="text-lg">
                    {language === 'uk' ? 'Часті запитання' : 'FAQ'}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-700 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 h-full">
              <ScrollArea className="h-[420px] p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500">{getLoadingText()}</p>
                  </div>
                ) : selectedQuestion ? (
                  // Show selected question answer
                  <div className="space-y-4">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="flex items-center space-x-2 p-0 h-auto text-green-600 hover:text-green-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>{getBackText()}</span>
                    </Button>
                    
                    <div className="space-y-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {selectedQuestion.question}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {selectedQuestion.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show FAQ list
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {getGreeting()}
                      </p>
                    </div>

                    {Object.entries(groupedFAQs).map(([category, questions]) => (
                      <div key={category} className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                        
                        <div className="space-y-2">
                          {questions.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleQuestionClick(item)}
                              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.question}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FAQChatbot;
