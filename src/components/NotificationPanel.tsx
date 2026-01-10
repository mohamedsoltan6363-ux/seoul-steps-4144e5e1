import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, Trash2, BookOpen, Flame, Trophy, Zap, Heart } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ar, ko } from 'date-fns/locale';

const NotificationPanel: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'daily':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'welcome':
        return <Heart className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'streak':
        return 'from-orange-500/20 to-amber-500/20 border-orange-500/30';
      case 'achievement':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'daily':
        return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
      case 'welcome':
        return 'from-pink-500/20 to-rose-500/20 border-pink-500/30';
      default:
        return 'from-primary/20 to-primary/10 border-primary/30';
    }
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: isRTL ? ar : ko 
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-xl hover:bg-muted transition-all duration-300">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 sm:w-96 p-0 border-border/50 shadow-2xl" 
        align={isRTL ? 'start' : 'end'}
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-pink-500/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isRTL ? 'الإشعارات' : '알림'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isRTL 
                  ? `${unreadCount} إشعار غير مقروء` 
                  : `${unreadCount}개의 읽지 않은 알림`}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7 px-2 hover:bg-primary/10"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              {isRTL ? 'قراءة الكل' : '모두 읽음'}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                {isRTL ? 'لا توجد إشعارات' : '알림이 없습니다'}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {isRTL ? 'ستظهر هنا عند وصولها' : '새 알림이 여기에 표시됩니다'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-3 rounded-xl border transition-all duration-200 cursor-pointer group
                      ${notification.read 
                        ? 'bg-card/50 border-border/30 opacity-70' 
                        : `bg-gradient-to-r ${getNotificationColor(notification.type)}`
                      }
                      hover:shadow-md hover:scale-[1.01]
                    `}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${notification.read ? 'bg-muted' : 'bg-white/80 dark:bg-black/20 shadow-sm'}
                      `}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold truncate ${notification.read ? 'text-muted-foreground' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-2 ${notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:bg-primary/20 transition-colors"
                          title={isRTL ? 'تحديد كمقروء' : '읽음으로 표시'}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="p-1.5 rounded-full bg-white/80 dark:bg-black/40 hover:bg-destructive/20 transition-colors"
                        title={isRTL ? 'حذف' : '삭제'}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-border/50 bg-muted/30">
          <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-pink-500" />
            {isRTL ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
