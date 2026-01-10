import { useEffect, useCallback, useState } from 'react';
import { useSpacedRepetition } from './useSpacedRepetition';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'review' | 'streak' | 'achievement' | 'daily' | 'welcome';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const useNotifications = () => {
  const { getDueCount, getNextReviewDate } = useSpacedRepetition();
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // طلب إذن الإشعارات
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
        return true;
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setPermissionGranted(permission === 'granted');
        return permission === 'granted';
      }
    }
    return false;
  }, []);

  // عرض إشعار نظام التشغيل
  const showBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'korean-learning',
        badge: '/favicon.ico',
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }, []);

  // إضافة إشعار جديد
  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);

    // عرض toast
    toast({
      title,
      description: message,
    });

    // عرض إشعار المتصفح
    showBrowserNotification(title, message);

    // تشغيل صوت الإشعار
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAzrN/IhkcAE4zA5KZUAABn1+mYQAAAOd7nljYAABfd56UtAAAL3+ejLgAABN/npy0AAAPf56ktAAQD3+epLQAEA9/nqS0ABAPQ56ktAAQD3+epLQAEA9/nqS0ABAPQ56ktAAQD0OepLQAEA9DnqS0ABAPQ56ktAAQD0OepLQA=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}

    return newNotification;
  }, [toast, showBrowserNotification]);

  // تحديد الإشعار كمقروء
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // حذف إشعار
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // التحقق من المراجعات المستحقة
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

  // جدولة تذكير
  const scheduleReminder = useCallback((minutes: number) => {
    setTimeout(() => {
      const { hasDue, count } = checkDueReviews();
      if (hasDue) {
        addNotification(
          'review',
          'وقت المراجعة! 📚',
          `لديك ${count} عناصر جاهزة للمراجعة`
        );
      }
    }, minutes * 60 * 1000);
  }, [checkDueReviews, addNotification]);

  // إرسال إشعار الترحيب
  const sendWelcomeNotification = useCallback(() => {
    addNotification(
      'welcome',
      'مرحباً بك! 🎉',
      'محمد أيمن يرحب بك في رحلة تعلم اللغة الكورية'
    );
  }, [addNotification]);

  // إرسال إشعار السلسلة
  const sendStreakNotification = useCallback((days: number) => {
    addNotification(
      'streak',
      `سلسلة ${days} أيام! 🔥`,
      'أحسنت! استمر في التعلم للحفاظ على سلسلتك'
    );
  }, [addNotification]);

  // إرسال إشعار الإنجاز
  const sendAchievementNotification = useCallback((achievementName: string) => {
    addNotification(
      'achievement',
      'إنجاز جديد! 🏆',
      `لقد حصلت على: ${achievementName}`
    );
  }, [addNotification]);

  // إرسال إشعار التحدي اليومي
  const sendDailyChallengeNotification = useCallback(() => {
    addNotification(
      'daily',
      'التحدي اليومي جاهز! ⚡',
      'أكمل تحدي اليوم للحصول على نقاط إضافية'
    );
  }, [addNotification]);

  // التحقق الدوري
  useEffect(() => {
    if (!user) return;

    // طلب إذن الإشعارات
    requestPermission();

    // تحميل الإشعارات المحفوظة
    const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })));
        setUnreadCount(parsed.filter((n: any) => !n.read).length);
      } catch (e) {}
    }

    // التحقق من المراجعات كل 30 دقيقة
    const reviewInterval = setInterval(() => {
      const { hasDue, count } = checkDueReviews();
      if (hasDue && count >= 3) {
        addNotification(
          'review',
          'تذكير المراجعة 📚',
          `لديك ${count} عناصر جاهزة للمراجعة`
        );
      }
    }, 30 * 60 * 1000);

    // إشعار التحدي اليومي كل يوم في الساعة 9 صباحاً
    const now = new Date();
    const tomorrow9am = new Date(now);
    tomorrow9am.setDate(tomorrow9am.getDate() + 1);
    tomorrow9am.setHours(9, 0, 0, 0);
    const timeUntil9am = tomorrow9am.getTime() - now.getTime();

    const dailyTimeout = setTimeout(() => {
      sendDailyChallengeNotification();
    }, timeUntil9am);

    return () => {
      clearInterval(reviewInterval);
      clearTimeout(dailyTimeout);
    };
  }, [user, requestPermission, checkDueReviews, addNotification, sendDailyChallengeNotification]);

  // حفظ الإشعارات في localStorage
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  return {
    notifications,
    unreadCount,
    permissionGranted,
    requestPermission,
    showBrowserNotification,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    checkDueReviews,
    scheduleReminder,
    sendWelcomeNotification,
    sendStreakNotification,
    sendAchievementNotification,
    sendDailyChallengeNotification,
    getNextReviewDate,
  };
};
