import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Flame, BookOpen, MessageSquare, 
  GraduationCap, Award, Crown, Zap, Target, 
  Medal, Heart, Sparkles, Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsListProps {
  achievements: Achievement[];
  totalPoints: number;
  streakDays: number;
}

const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  totalPoints,
  streakDays,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const achievementDetails: Record<string, {
    icon: React.ElementType;
    title: string;
    titleKo: string;
    description: string;
    descriptionKo: string;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }> = {
    first_letter: {
      icon: BookOpen,
      title: 'الحرف الأول',
      titleKo: '첫 글자',
      description: 'احفظ حرفك الكوري الأول',
      descriptionKo: '첫 번째 한글을 암기하세요',
      color: 'from-green-400 to-emerald-500',
      rarity: 'common',
    },
    consonant_master: {
      icon: Star,
      title: 'سيد الحروف الساكنة',
      titleKo: '자음 마스터',
      description: 'احفظ جميع الحروف الساكنة (19)',
      descriptionKo: '모든 자음(19개)을 암기하세요',
      color: 'from-blue-400 to-indigo-500',
      rarity: 'rare',
    },
    vowel_master: {
      icon: Star,
      title: 'سيد الحروف المتحركة',
      titleKo: '모음 마스터',
      description: 'احفظ جميع الحروف المتحركة (21)',
      descriptionKo: '모든 모음(21개)을 암기하세요',
      color: 'from-pink-400 to-rose-500',
      rarity: 'rare',
    },
    level1_complete: {
      icon: Trophy,
      title: 'إتقان الهانغول',
      titleKo: '한글 정복',
      description: 'أكمل المستوى الأول بالكامل',
      descriptionKo: '레벨 1을 완전히 완료하세요',
      color: 'from-amber-400 to-orange-500',
      rarity: 'epic',
    },
    vocabulary_25: {
      icon: MessageSquare,
      title: '25 كلمة',
      titleKo: '25단어',
      description: 'احفظ 25 كلمة',
      descriptionKo: '25개 단어를 암기하세요',
      color: 'from-cyan-400 to-blue-500',
      rarity: 'common',
    },
    vocabulary_50: {
      icon: MessageSquare,
      title: '50 كلمة',
      titleKo: '50단어',
      description: 'احفظ 50 كلمة',
      descriptionKo: '50개 단어를 암기하세요',
      color: 'from-teal-400 to-cyan-500',
      rarity: 'rare',
    },
    vocabulary_100: {
      icon: Award,
      title: '100 كلمة',
      titleKo: '100단어',
      description: 'احفظ 100 كلمة',
      descriptionKo: '100개 단어를 암기하세요',
      color: 'from-purple-400 to-violet-500',
      rarity: 'epic',
    },
    sentence_beginner: {
      icon: Zap,
      title: 'بداية الجمل',
      titleKo: '문장 입문',
      description: 'احفظ 10 جمل',
      descriptionKo: '10개 문장을 암기하세요',
      color: 'from-emerald-400 to-green-500',
      rarity: 'rare',
    },
    streak_3: {
      icon: Flame,
      title: '3 أيام متتالية',
      titleKo: '3일 연속',
      description: 'حافظ على سلسلة 3 أيام',
      descriptionKo: '3일 연속 학습하세요',
      color: 'from-orange-400 to-red-500',
      rarity: 'common',
    },
    streak_7: {
      icon: Flame,
      title: 'أسبوع كامل',
      titleKo: '일주일 연속',
      description: 'حافظ على سلسلة 7 أيام',
      descriptionKo: '7일 연속 학습하세요',
      color: 'from-red-400 to-pink-500',
      rarity: 'rare',
    },
    streak_14: {
      icon: Flame,
      title: 'أسبوعان',
      titleKo: '2주 연속',
      description: 'حافظ على سلسلة 14 يوماً',
      descriptionKo: '14일 연속 학습하세요',
      color: 'from-rose-400 to-red-600',
      rarity: 'epic',
    },
    streak_30: {
      icon: Crown,
      title: 'شهر كامل',
      titleKo: '한 달 연속',
      description: 'حافظ على سلسلة 30 يوماً',
      descriptionKo: '30일 연속 학습하세요',
      color: 'from-yellow-400 to-amber-600',
      rarity: 'legendary',
    },
    dedicated_learner: {
      icon: Target,
      title: 'متعلم مجتهد',
      titleKo: '성실한 학습자',
      description: 'اجمع 500 نقطة',
      descriptionKo: '500점을 획득하세요',
      color: 'from-indigo-400 to-purple-500',
      rarity: 'rare',
    },
    expert_learner: {
      icon: Medal,
      title: 'متعلم خبير',
      titleKo: '전문 학습자',
      description: 'اجمع 1000 نقطة',
      descriptionKo: '1000점을 획득하세요',
      color: 'from-violet-400 to-purple-600',
      rarity: 'epic',
    },
    master_learner: {
      icon: Sparkles,
      title: 'سيد اللغة الكورية',
      titleKo: '한국어 달인',
      description: 'أكمل جميع المستويات',
      descriptionKo: '모든 레벨을 완료하세요',
      color: 'from-gradient-start to-gradient-end',
      rarity: 'legendary',
    },
  };

  const rarityColors = {
    common: 'border-gray-400/30 bg-gray-500/5',
    rare: 'border-blue-400/30 bg-blue-500/5',
    epic: 'border-purple-400/30 bg-purple-500/5',
    legendary: 'border-amber-400/30 bg-amber-500/5',
  };

  const rarityLabels = {
    common: { ar: 'عادي', ko: '일반' },
    rare: { ar: 'نادر', ko: '희귀' },
    epic: { ar: 'ملحمي', ko: '에픽' },
    legendary: { ar: 'أسطوري', ko: '전설' },
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-korean-gold/20 to-amber-500/20 border border-korean-gold/30">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-korean-gold" />
          <div>
            <p className="font-bold text-foreground text-lg">
              {unlockedCount} / {achievements.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'الإنجازات المفتوحة' : '달성한 업적'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-korean-gold">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-3">
        {achievements.map((achievement, index) => {
          const details = achievementDetails[achievement.id];
          if (!details) return null;

          const Icon = details.icon;
          const progress = achievement.progress ?? 0;
          const maxProgress = achievement.maxProgress ?? 0;
          const progressPercent = maxProgress > 0 ? Math.min((progress / maxProgress) * 100, 100) : 0;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                achievement.unlocked 
                  ? `${rarityColors[details.rarity]} shadow-lg` 
                  : 'border-border/50 bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${details.color}` 
                    : 'bg-muted'
                }`}>
                  {achievement.unlocked ? (
                    <Icon className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-korean-green flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground truncate">
                      {isRTL ? details.title : details.titleKo}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      details.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-500' :
                      details.rarity === 'epic' ? 'bg-purple-500/20 text-purple-500' :
                      details.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {isRTL ? rarityLabels[details.rarity].ar : rarityLabels[details.rarity].ko}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {isRTL ? details.description : details.descriptionKo}
                  </p>
                  
                  {/* Progress Bar */}
                  {maxProgress > 0 && !achievement.unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{progress} / {maxProgress}</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${details.color}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsList;
