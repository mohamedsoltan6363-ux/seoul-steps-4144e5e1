import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewItem {
  item_id: string;
  level: number;
  lesson_type: string;
  korean: string;
  romanized: string;
  arabic: string;
  times_reviewed: number;
  last_reviewed_at: string | null;
  next_review_at: string;
  ease_factor: number;
  interval_days: number;
}

interface SpacedRepetitionData {
  dueItems: ReviewItem[];
  upcomingItems: ReviewItem[];
  totalReviews: number;
  masteredCount: number;
}

// SM-2 Algorithm Implementation
const calculateNextReview = (
  quality: number, // 0-5 rating (0-2 fail, 3-5 pass)
  easeFactor: number,
  intervalDays: number,
  repetitions: number
): { nextInterval: number; newEaseFactor: number } => {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure ease factor doesn't go below 1.3
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;
  
  let nextInterval: number;
  
  if (quality < 3) {
    // Failed - reset to beginning
    nextInterval = 1;
  } else {
    if (repetitions === 0) {
      nextInterval = 1;
    } else if (repetitions === 1) {
      nextInterval = 3;
    } else {
      nextInterval = Math.round(intervalDays * newEaseFactor);
    }
  }
  
  return { nextInterval, newEaseFactor };
};

export const useSpacedRepetition = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SpacedRepetitionData>({
    dueItems: [],
    upcomingItems: [],
    totalReviews: 0,
    masteredCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchReviewItems = useCallback(async () => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      
      const { data: progressData, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_memorized', true);

      if (error) throw error;

      const items: ReviewItem[] = (progressData || []).map(item => {
        const lastReviewed = item.last_reviewed_at ? new Date(item.last_reviewed_at) : new Date();
        const intervalDays = Math.max(1, item.times_reviewed || 1);
        const nextReview = new Date(lastReviewed);
        nextReview.setDate(nextReview.getDate() + intervalDays);
        
        return {
          item_id: item.item_id,
          level: item.level,
          lesson_type: item.lesson_type,
          korean: item.item_id,
          romanized: '',
          arabic: '',
          times_reviewed: item.times_reviewed || 0,
          last_reviewed_at: item.last_reviewed_at,
          next_review_at: nextReview.toISOString(),
          ease_factor: 2.5,
          interval_days: intervalDays,
        };
      });

      const dueItems = items.filter(item => new Date(item.next_review_at) <= new Date(now));
      const upcomingItems = items
        .filter(item => new Date(item.next_review_at) > new Date(now))
        .sort((a, b) => new Date(a.next_review_at).getTime() - new Date(b.next_review_at).getTime())
        .slice(0, 10);

      const masteredCount = items.filter(item => item.times_reviewed >= 5).length;

      setData({
        dueItems,
        upcomingItems,
        totalReviews: items.reduce((sum, item) => sum + item.times_reviewed, 0),
        masteredCount,
      });
    } catch (error) {
      console.error('Error fetching review items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReviewItems();
  }, [fetchReviewItems]);

  const recordReview = async (
    level: number,
    lessonType: string,
    itemId: string,
    quality: number // 0-5
  ) => {
    if (!user) return;

    try {
      // Get current item data
      const { data: currentItem } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('level', level)
        .eq('lesson_type', lessonType)
        .eq('item_id', itemId)
        .single();

      const currentEaseFactor = 2.5;
      const currentInterval = currentItem?.times_reviewed || 1;
      const repetitions = currentItem?.times_reviewed || 0;

      const { nextInterval, newEaseFactor } = calculateNextReview(
        quality,
        currentEaseFactor,
        currentInterval,
        repetitions
      );

      await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          level,
          lesson_type: lessonType,
          item_id: itemId,
          is_memorized: quality >= 3,
          times_reviewed: repetitions + 1,
          last_reviewed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,level,lesson_type,item_id'
        });

      await fetchReviewItems();
    } catch (error) {
      console.error('Error recording review:', error);
    }
  };

  const getDueCount = () => data.dueItems.length;
  
  const getNextReviewDate = () => {
    if (data.upcomingItems.length === 0) return null;
    return new Date(data.upcomingItems[0].next_review_at);
  };

  return {
    ...data,
    loading,
    recordReview,
    getDueCount,
    getNextReviewDate,
    refreshReviews: fetchReviewItems,
  };
};
