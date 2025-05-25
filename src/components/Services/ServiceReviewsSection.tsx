
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Star, User } from 'lucide-react';

interface ServiceReviewsSectionProps {
  serviceId: string;
}

const ServiceReviewsSection = ({ serviceId }: ServiceReviewsSectionProps) => {
  const { language } = useLanguage();
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reviews, refetch } = useQuery({
    queryKey: ['service-reviews', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: userAppointments } = useQuery({
    queryKey: ['user-completed-appointments', serviceId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('service_id', serviceId)
        .eq('user_id', user.user.id)
        .eq('status', 'completed');
      
      if (error) throw error;
      return data || [];
    }
  });

  const canLeaveReview = userAppointments && userAppointments.length > 0 && 
    !reviews?.some(review => review.user_id === userAppointments[0]?.user_id);

  const handleSubmitReview = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      toast.error(language === 'en' ? 'Please select a rating' : 'Будь ласка, оберіть оцінку');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const completedAppointment = userAppointments?.[0];
      if (!completedAppointment) throw new Error('No completed appointment found');

      const { error } = await supabase
        .from('service_reviews')
        .insert({
          service_id: serviceId,
          user_id: user.user.id,
          appointment_id: completedAppointment.id,
          rating: newRating,
          review_text: newReview.trim() || null
        });

      if (error) throw error;

      toast.success(language === 'en' ? 'Review submitted successfully' : 'Відгук успішно надіслано');
      setNewReview('');
      setNewRating(0);
      refetch();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(language === 'en' ? 'Error submitting review' : 'Помилка при надсиланні відгуку');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Reviews and Ratings' : 'Відгуки та оцінки'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Форма для нового відгуку */}
        {canLeaveReview && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-3">
              {language === 'en' ? 'Leave a Review' : 'Залишити відгук'}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Rating' : 'Оцінка'}
                </label>
                {renderStars(newRating, true, setNewRating)}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Review (optional)' : 'Відгук (необов\'язково)'}
                </label>
                <Textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder={language === 'en' ? 'Share your experience...' : 'Поділіться своїм досвідом...'}
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmitReview} disabled={isSubmitting || !newRating}>
                {isSubmitting 
                  ? (language === 'en' ? 'Submitting...' : 'Надсилаємо...') 
                  : (language === 'en' ? 'Submit Review' : 'Надіслати відгук')
                }
              </Button>
            </div>
          </div>
        )}

        {/* Список відгуків */}
        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">
                      {review.is_anonymous 
                        ? (language === 'en' ? 'Anonymous' : 'Анонімно')
                        : (language === 'en' ? 'User' : 'Користувач')
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-gray-700">{review.review_text}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {language === 'en' ? 'No reviews yet' : 'Поки що відгуків немає'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceReviewsSection;
