import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StreakDisplayProps {
  streakDays: number;
  todayCompleted: boolean;
  isCompact?: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  streakDays, 
  todayCompleted, 
  isCompact = false 
}) => {
  const { language } = useLanguage();

  // Generate last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'ko-KR', { weekday: 'short' }),
      date: date.getDate(),
      isCompleted: i <= 6 - (7 - Math.min(streakDays, 7)) && 
                   (i < 6 || todayCompleted) &&
                   streakDays > 0,
      isToday: i === 6,
    };
  });

  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={streakDays > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            streakDays > 0 
              ? 'bg-gradient-to-br from-orange-400 to-red-500' 
              : 'bg-muted'
          }`}
        >
          <Flame className={`w-5 h-5 ${streakDays > 0 ? 'text-white' : 'text-muted-foreground'}`} />
        </motion.div>
        <div>
          <p className="text-lg font-bold">{streakDays}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'أيام متتالية' : '연속 일수'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${
        streakDays >= 7 
          ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600' 
          : streakDays >= 3 
            ? 'bg-gradient-to-br from-orange-400 to-red-500'
            : 'bg-gradient-to-br from-slate-700 to-slate-800'
      }`} />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-white/5" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={streakDays > 0 ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <p className="text-white/70 text-sm">
                {language === 'ar' ? 'أيامك المتتالية' : '연속 학습 일수'}
              </p>
              <p className="text-3xl font-bold text-white">{streakDays}</p>
            </div>
          </div>
          
          {streakDays >= 7 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ type: 'spring', duration: 1 }}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-yellow-300" />
            </motion.div>
          )}
        </div>

        {/* Week calendar */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <p className="text-white/50 text-xs mb-1">{day.day}</p>
              <div className={`
                relative w-full aspect-square rounded-xl flex items-center justify-center
                ${day.isCompleted 
                  ? 'bg-white text-orange-500' 
                  : day.isToday 
                    ? 'bg-white/30 text-white border-2 border-dashed border-white/50' 
                    : 'bg-white/10 text-white/30'
                }
              `}>
                {day.isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: index * 0.1 }}
                  >
                    <Flame className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span className="text-xs font-medium">{day.date}</span>
                )}
                
                {day.isToday && !day.isCompleted && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivation message */}
        <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <p className="text-white/80 text-sm text-center">
            {todayCompleted 
              ? (language === 'ar' 
                  ? '🎉 أحسنت! لقد أكملت تعلم اليوم' 
                  : '🎉 잘했어요! 오늘 학습을 완료했습니다')
              : (language === 'ar' 
                  ? '💪 ابدأ التعلم اليوم للحفاظ على سلسلتك!' 
                  : '💪 오늘 학습을 시작해서 연속 기록을 유지하세요!')}
          </p>
        </div>

        {/* Milestone badges */}
        {streakDays > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {[3, 7, 14, 30].map((milestone) => (
              <div
                key={milestone}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  streakDays >= milestone 
                    ? 'bg-white text-orange-500' 
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {milestone} {language === 'ar' ? 'يوم' : '일'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
