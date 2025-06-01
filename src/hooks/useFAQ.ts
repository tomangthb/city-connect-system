
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  id: string;
  question: string;
  question_uk: string;
  answer: string;
  answer_uk: string;
  category: string;
  category_uk: string;
  display_order: number;
}

export const useFAQ = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetchFAQItems();
  }, []);

  const fetchFAQItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (err) {
      console.error('Error fetching FAQ items:', err);
      setError('Failed to load FAQ items');
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedFAQItems = () => {
    return faqItems.map(item => ({
      ...item,
      question: language === 'uk' ? item.question_uk : item.question,
      answer: language === 'uk' ? item.answer_uk : item.answer,
      category: language === 'uk' ? item.category_uk : item.category,
    }));
  };

  return {
    faqItems: getLocalizedFAQItems(),
    loading,
    error,
    refetch: fetchFAQItems
  };
};
