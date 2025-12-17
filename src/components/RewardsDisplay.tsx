import React from 'react';
import { Trophy, Star, Flame, Target, Crown, Medal, Award, Zap, BookOpen, MessageSquare, Sparkles, Heart, Gift, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Achievement {
  id: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface RewardsDisplayProps {
  totalPoints: number;
  currentLevel: number;
  streakDays: number;
  achievements: Achievement[];
}

const achievementData: Record<string, { 
  titleAr: string; 
  titleKo: string; 
  descriptionAr: string; 
  descriptionKo: string; 
  icon: React.ReactNode; 
  color: string;
  points: number;
}> = {
  first_letter: { 
    titleAr: 'الحرف الأول', 
    titleKo: '첫 글자', 
    descriptionAr: 'حفظ أول حرف كوري', 
    descriptionKo: '첫 번째 한글 암기', 
    icon: <Star className="w-6 h-6" />, 
    color: 'from-yellow-400 to-amber-500',
    points: 10,
  },
  consonant_master: { 
    titleAr: 'أستاذ الحروف الساكنة', 
    titleKo: '자음 마스터', 
    descriptionAr: 'حفظ جميع الحروف الساكنة (19)', 
    descriptionKo: '모든 자음 암기 (19개)', 
    icon: <Medal className="w-6 h-6" />, 
    color: 'from-blue-400 to-blue-600',
    points: 50,
  },
  vowel_master: { 
    titleAr: 'أستاذ الحروف المتحركة', 
    titleKo: '모음 마스터', 
    descriptionAr: 'حفظ جميع الحروف المتحركة (21)', 
    descriptionKo: '모든 모음 암기 (21개)', 
    icon: <Award className="w-6 h-6" />, 
    color: 'from-pink-400 to-rose-500',
    points: 50,
  },
  level1_complete: { 
    titleAr: 'المستوى الأول', 
    titleKo: '레벨 1 완료', 
    descriptionAr: 'إتمام المستوى الأول بالكامل', 
    descriptionKo: '레벨 1 완료', 
    icon: <Trophy className="w-6 h-6" />, 
    color: 'from-green-400 to-emerald-500',
    points: 100,
  },
  vocabulary_25: { 
    titleAr: 'متعلم المفردات', 
    titleKo: '단어 입문자', 
    descriptionAr: 'حفظ 25 كلمة', 
    descriptionKo: '25단어 암기', 
    icon: <BookOpen className="w-6 h-6" />, 
    color: 'from-cyan-400 to-teal-500',
    points: 25,
  },
  vocabulary_50: { 
    titleAr: 'جامع الكلمات', 
    titleKo: '단어 수집가', 
    descriptionAr: 'حفظ 50 كلمة', 
    descriptionKo: '50단어 암기', 
    icon: <Target className="w-6 h-6" />, 
    color: 'from-purple-400 to-violet-500',
    points: 75,
  },
  vocabulary_100: { 
    titleAr: 'خبير المفردات', 
    titleKo: '단어 전문가', 
    descriptionAr: 'حفظ 100 كلمة', 
    descriptionKo: '100단어 암기', 
    icon: <Sparkles className="w-6 h-6" />, 
    color: 'from-indigo-400 to-purple-500',
    points: 150,
  },
  sentence_beginner: { 
    titleAr: 'بداية الجمل', 
    titleKo: '문장 입문', 
    descriptionAr: 'حفظ 10 جمل', 
    descriptionKo: '10문장 암기', 
    icon: <MessageSquare className="w-6 h-6" />, 
    color: 'from-orange-400 to-amber-500',
    points: 30,
  },
  streak_3: { 
    titleAr: '3 أيام متتالية', 
    titleKo: '3일 연속', 
    descriptionAr: 'التعلم لمدة 3 أيام متتالية', 
    descriptionKo: '3일 연속 학습', 
    icon: <Flame className="w-6 h-6" />, 
    color: 'from-orange-400 to-red-500',
    points: 30,
  },
  streak_7: { 
    titleAr: 'أسبوع متواصل', 
    titleKo: '7일 연속', 
    descriptionAr: 'التعلم لمدة 7 أيام متتالية', 
    descriptionKo: '7일 연속 학습', 
    icon: <Flame className="w-6 h-6" />, 
    color: 'from-red-400 to-rose-600',
    points: 70,
  },
  quiz_perfect: { 
    titleAr: 'درجة كاملة', 
    titleKo: '만점', 
    descriptionAr: 'الحصول على درجة كاملة في الاختبار', 
    descriptionKo: '퀴즈 만점', 
    icon: <Crown className="w-6 h-6" />, 
    color: 'from-amber-400 to-yellow-500',
    points: 100,
  },
  speed_learner: { 
    titleAr: 'متعلم سريع', 
    titleKo: '빠른 학습자', 
    descriptionAr: 'حفظ 10 عناصر في جلسة واحدة', 
    descriptionKo: '한 세션에 10개 암기', 
    icon: <Zap className="w-6 h-6" />, 
    color: 'from-cyan-400 to-blue-500',
    points: 40,
  },
  dedicated_learner: { 
    titleAr: 'متعلم مثابر', 
    titleKo: '열정적인 학습자', 
    descriptionAr: 'جمع 500 نقطة', 
    descriptionKo: '500 포인트 달성', 
    icon: <Heart className="w-6 h-6" />, 
    color: 'from-pink-400 to-red-500',
    points: 50,
  },
  expert_learner: { 
    titleAr: 'خبير التعلم', 
    titleKo: '학습 전문가', 
    descriptionAr: 'جمع 1000 نقطة', 
    descriptionKo: '1000 포인트 달성', 
    icon: <Gift className="w-6 h-6" />, 
    color: 'from-violet-400 to-purple-600',
    points: 100,
  },
  master_learner: { 
    titleAr: 'أستاذ التعلم', 
    titleKo: '학습 마스터', 
    descriptionAr: 'إتمام جميع المستويات', 
    descriptionKo: '모든 레벨 완료', 
    icon: <Rocket className="w-6 h-6" />, 
    color: 'from-amber-400 via-orange-500 to-red-500',
    points: 500,
  },
};

const RewardsDisplay: React.FC<RewardsDisplayProps> = ({ totalPoints, streakDays, achievements }) => {
  const { language } = useLanguage();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = Object.keys(achievementData).length;

  // Calculate level based on points
  const getLevel = (points: number) => {
    if (points >= 2000) return { level: 10, title: { ar: 'أستاذ', ko: '마스터' }, color: 'from-amber-400 to-red-500' };
    if (points >= 1500) return { level: 9, title: { ar: 'خبير', ko: '전문가' }, color: 'from-purple-400 to-pink-500' };
    if (points >= 1000) return { level: 8, title: { ar: 'متقدم', ko: '고급' }, color: 'from-indigo-400 to-purple-500' };
    if (points >= 700) return { level: 7, title: { ar: 'ماهر', ko: '숙련자' }, color: 'from-blue-400 to-indigo-500' };
    if (points >= 500) return { level: 6, title: { ar: 'متوسط+', ko: '중급+' }, color: 'from-cyan-400 to-blue-500' };
    if (points >= 300) return { level: 5, title: { ar: 'متوسط', ko: '중급' }, color: 'from-teal-400 to-cyan-500' };
    if (points >= 200) return { level: 4, title: { ar: 'مبتدئ+', ko: '초급+' }, color: 'from-green-400 to-teal-500' };
    if (points >= 100) return { level: 3, title: { ar: 'مبتدئ', ko: '초급' }, color: 'from-lime-400 to-green-500' };
    if (points >= 50) return { level: 2, title: { ar: 'جديد', ko: '새내기' }, color: 'from-yellow-400 to-lime-500' };
    return { level: 1, title: { ar: 'مستجد', ko: '입문자' }, color: 'from-gray-400 to-gray-500' };
  };

  const userLevel = getLevel(totalPoints);
  const nextLevelPoints = [50, 100, 200, 300, 500, 700, 1000, 1500, 2000, 3000][userLevel.level] || 3000;
  const prevLevelPoints = [0, 50, 100, 200, 300, 500, 700, 1000, 1500, 2000][userLevel.level - 1] || 0;
  const progressToNextLevel = Math.min(100, ((totalPoints - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100);

  return (
    <div className="space-y-6">
      {/* User Level Card */}
      <div className={`relative p-5 rounded-3xl overflow-hidden bg-gradient-to-br ${userLevel.color}`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{userLevel.level}</span>
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm">{language === 'ar' ? 'المستوى الحالي' : '현재 레벨'}</p>
            <p className="text-xl font-bold text-white">{language === 'ar' ? userLevel.title.ar : userLevel.title.ko}</p>
            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-1">
              {totalPoints} / {nextLevelPoints} {language === 'ar' ? 'نقطة' : '포인트'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-korean-gold to-amber-500 flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gradient">{totalPoints}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'النقاط' : '포인트'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{streakDays}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'أيام متتالية' : '연속 일수'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{unlockedCount}/{totalAchievements}</p>
          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الإنجازات' : '업적'}</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{language === 'ar' ? 'الإنجازات' : '업적'}</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{totalAchievements} {language === 'ar' ? 'مكتمل' : '완료'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(achievementData).map(([id, data]) => {
            const achievement = achievements.find(a => a.id === id);
            const isUnlocked = achievement?.unlocked || false;
            const progress = achievement?.progress;
            const maxProgress = achievement?.maxProgress;
            
            return (
              <div key={id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${isUnlocked ? data.color : 'from-gray-300 to-gray-400'} flex items-center justify-center mb-2 mx-auto shadow-lg`}>
                  <div className={isUnlocked ? 'text-white' : 'text-gray-500'}>{data.icon}</div>
                </div>
                <h4 className={`font-semibold text-xs text-center mb-0.5 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {language === 'ar' ? data.titleAr : data.titleKo}
                </h4>
                <p className="text-[10px] text-muted-foreground text-center mb-1">
                  {language === 'ar' ? data.descriptionAr : data.descriptionKo}
                </p>
                {isUnlocked && (
                  <p className="text-xs text-center font-semibold text-korean-gold">+{data.points}</p>
                )}
                {progress !== undefined && maxProgress && !isUnlocked && (
                  <div className="mt-1">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${data.color}`}
                        style={{ width: `${(progress / maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-0.5">
                      {progress}/{maxProgress}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsDisplay;
