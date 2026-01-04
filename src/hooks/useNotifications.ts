import { useEffect, useCallback } from 'react';
import { useSpacedRepetition } from './useSpacedRepetition';
import { useToast } from './use-toast';

export const useNotifications = () => {
  const { getDueCount, getNextReviewDate } = useSpacedRepetition();
  const { toast } = useToast();

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'korean-learning',
      });
    }
  }, []);

  const checkDueReviews = useCallback(() => {
    const dueCount = getDueCount();
    if (dueCount > 0) {
      return {
        hasDue: true,
        count: dueCount,
        message: `لديك ${dueCount} عناصر للمراجعة`,
      };
    }
    return { hasDue: false, count: 0, message: '' };
  }, [getDueCount]);

  const scheduleReminder = useCallback((minutes: number) => {
    setTimeout(() => {
      const { hasDue, count } = checkDueReviews();
      if (hasDue) {
        showNotification(
          'وقت المراجعة! 📚',
          `لديك ${count} عناصر جاهزة للمراجعة`
        );
        toast({
          title: 'وقت المراجعة! 📚',
          description: `لديك ${count} عناصر جاهزة للمراجعة`,
        });
      }
    }, minutes * 60 * 1000);
  }, [checkDueReviews, showNotification, toast]);

  // Check on mount
  useEffect(() => {
    requestPermission();
    
    // Check every hour
    const intervalId = setInterval(() => {
      const { hasDue, count } = checkDueReviews();
      if (hasDue && count >= 5) {
        toast({
          title: 'تذكير المراجعة 📚',
          description: `لديك ${count} عناصر للمراجعة`,
        });
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [requestPermission, checkDueReviews, toast]);

  return {
    requestPermission,
    showNotification,
    checkDueReviews,
    scheduleReminder,
    getNextReviewDate,
  };
};
