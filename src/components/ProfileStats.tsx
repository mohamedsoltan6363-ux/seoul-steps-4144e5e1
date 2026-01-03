import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Trophy, Flame, Star, Target, Clock, BookOpen, 
  MessageSquare, Award, TrendingUp, Calendar, Zap, Medal
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileStatsProps {
  totalPoints: number;
  currentLevel: number;
  streakDays: number;
  totalMemorized: number;
  lettersMemorized: number;
  vocabularyMemorized: number;
  sentencesMemorized: number;
  totalReviews: number;
  masteredItems: number;
  quizzesPassed: number;
  dueReviews: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalPoints,
  currentLevel,
  streakDays,
  totalMemorized,
  lettersMemorized,
  vocabularyMemorized,
  sentencesMemorized,
  totalReviews,
  masteredItems,
  quizzesPassed,
  dueReviews,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const mainStats = [
    {
      icon: Trophy,
      value: totalPoints,
      label: isRTL ? 'النقاط الإجمالية' : '총 점수',
      color: 'text-korean-gold',
      bgColor: 'bg-korean-gold/10',
    },
    {
      icon: Flame,
      value: streakDays,
      label: isRTL ? 'أيام متتالية' : '연속 일수',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      suffix: isRTL ? 'يوم' : '일',
    },
    {
      icon: Star,
      value: currentLevel,
      label: isRTL ? 'المستوى الحالي' : '현재 레벨',
      color: 'text-korean-pink',
      bgColor: 'bg-korean-pink/10',
    },
    {
      icon: Target,
      value: totalMemorized,
      label: isRTL ? 'تم الحفظ' : '암기 완료',
      color: 'text-korean-green',
      bgColor: 'bg-korean-green/10',
    },
  ];

  const detailedStats = [
    {
      icon: BookOpen,
      value: lettersMemorized,
      label: isRTL ? 'الحروف المحفوظة' : '암기한 글자',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: MessageSquare,
      value: vocabularyMemorized,
      label: isRTL ? 'المفردات المحفوظة' : '암기한 어휘',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Zap,
      value: sentencesMemorized,
      label: isRTL ? 'الجمل المحفوظة' : '암기한 문장',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      value: totalReviews,
      label: isRTL ? 'إجمالي المراجعات' : '총 복습 횟수',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Medal,
      value: masteredItems,
      label: isRTL ? 'العناصر المتقنة' : '완벽 숙달',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Award,
      value: quizzesPassed,
      label: isRTL ? 'الاختبارات الناجحة' : '통과한 퀴즈',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {mainStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="pro-card p-4 text-center"
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {stat.value.toLocaleString()}
              {stat.suffix && <span className="text-sm text-muted-foreground mr-1"> {stat.suffix}</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Due Reviews Alert */}
      {dueReviews > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {isRTL ? `${dueReviews} عنصر للمراجعة` : `${dueReviews}개 복습 대기`}
              </p>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'حان وقت المراجعة!' : '복습할 시간입니다!'}
              </p>
            </div>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
        </motion.div>
      )}

      {/* Detailed Stats */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground">
          {isRTL ? 'إحصائيات تفصيلية' : '상세 통계'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {detailedStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="pro-card p-3 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
