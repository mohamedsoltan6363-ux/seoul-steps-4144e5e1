import React, { useState } from 'react';
import { 
  Trophy, Star, Flame, Target, Crown, Medal, Award, Zap, 
  BookOpen, MessageSquare, Sparkles, Heart, Gift, Rocket,
  Calendar, CheckCircle2, Clock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface DailyReward {
  day: number;
  points: number;
  claimed: boolean;
  icon: React.ReactNode;
  special?: boolean;
}

interface WeeklyChallenge {
  id: string;
  titleAr: string;
  titleKo: string;
  descriptionAr: string;
  descriptionKo: string;
  target: number;
  current: number;
  rewardPoints: number;
  icon: React.ReactNode;
  deadline: Date;
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
  const isRTL = language === 'ar';
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = Object.keys(achievementData).length;

  // Daily rewards state
  const [currentStreak] = useState(streakDays);
  const [todayRewardClaimed, setTodayRewardClaimed] = useState(false);

  const dailyRewards: DailyReward[] = [
    { day: 1, points: 10, claimed: streakDays >= 1, icon: <Gift className="w-4 h-4" /> },
    { day: 2, points: 15, claimed: streakDays >= 2, icon: <Star className="w-4 h-4" /> },
    { day: 3, points: 20, claimed: streakDays >= 3, icon: <Zap className="w-4 h-4" /> },
    { day: 4, points: 25, claimed: streakDays >= 4, icon: <Medal className="w-4 h-4" /> },
    { day: 5, points: 30, claimed: streakDays >= 5, icon: <Trophy className="w-4 h-4" /> },
    { day: 6, points: 40, claimed: streakDays >= 6, icon: <Award className="w-4 h-4" /> },
    { day: 7, points: 100, claimed: streakDays >= 7, icon: <Crown className="w-4 h-4" />, special: true },
  ];

  const weeklyChallenges: WeeklyChallenge[] = [
    {
      id: 'vocab_master',
      titleAr: 'سيد المفردات',
      titleKo: '어휘 마스터',
      descriptionAr: 'تعلم 50 كلمة جديدة',
      descriptionKo: '50개 새 단어 배우기',
      target: 50,
      current: Math.min(32, totalPoints / 10),
      rewardPoints: 200,
      icon: <Target className="w-5 h-5" />,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'streak_keeper',
      titleAr: 'حارس السلسلة',
      titleKo: '연속 학습 챔피언',
      descriptionAr: 'حافظ على سلسلة 7 أيام',
      descriptionKo: '7일 연속 학습',
      target: 7,
      current: streakDays,
      rewardPoints: 150,
      icon: <Flame className="w-5 h-5" />,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'quiz_champion',
      titleAr: 'بطل الاختبارات',
      titleKo: '퀴즈 챔피언',
      descriptionAr: 'اجتز 5 اختبارات بنسبة 90%',
      descriptionKo: '90%로 5개 퀴즈 통과',
      target: 5,
      current: 2,
      rewardPoints: 250,
      icon: <Trophy className="w-5 h-5" />,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
  ];

  const handleClaimReward = (day: number, points: number) => {
    if (day === currentStreak + 1 && !todayRewardClaimed) {
      setTodayRewardClaimed(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const getDaysRemaining = (deadline: Date) => {
    const diff = deadline.getTime() - Date.now();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

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
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* User Level Card */}
      <div className={`relative p-5 rounded-3xl overflow-hidden bg-gradient-to-br ${userLevel.color}`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{userLevel.level}</span>
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm">{isRTL ? 'المستوى الحالي' : '현재 레벨'}</p>
            <p className="text-xl font-bold text-white">{isRTL ? userLevel.title.ar : userLevel.title.ko}</p>
            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-1">
              {totalPoints} / {nextLevelPoints} {isRTL ? 'نقطة' : '포인트'}
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
          <p className="text-xs text-muted-foreground">{isRTL ? 'النقاط' : '포인트'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{streakDays}</p>
          <p className="text-xs text-muted-foreground">{isRTL ? 'أيام متتالية' : '연속 일수'}</p>
        </div>
        <div className="reward-stat-card">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold">{unlockedCount}/{totalAchievements}</p>
          <p className="text-xs text-muted-foreground">{isRTL ? 'الإنجازات' : '업적'}</p>
        </div>
      </div>

      {/* Daily Rewards */}
      <motion.div 
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'المكافآت اليومية' : '일일 보상'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'سجل دخولك يومياً!' : '매일 로그인하세요!'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {dailyRewards.map((reward, index) => (
            <motion.button
              key={reward.day}
              className={`relative flex flex-col items-center p-2 rounded-xl transition-all ${
                reward.claimed 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400'
                  : reward.day === currentStreak + 1 && !todayRewardClaimed
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-400 animate-pulse cursor-pointer'
                    : 'bg-muted/50 border border-border opacity-60'
              } ${reward.special ? 'ring-1 ring-purple-400' : ''}`}
              onClick={() => handleClaimReward(reward.day, reward.points)}
              disabled={reward.claimed || reward.day !== currentStreak + 1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {reward.claimed && (
                <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500" />
              )}
              <div className={`${reward.claimed ? 'text-emerald-500' : reward.special ? 'text-purple-500' : 'text-amber-500'}`}>
                {reward.icon}
              </div>
              <span className="text-[10px] font-medium mt-1">{reward.day}</span>
              <span className={`text-[10px] font-bold ${reward.special ? 'text-purple-600' : 'text-amber-600'}`}>
                +{reward.points}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Weekly Challenges */}
      <motion.div 
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">{isRTL ? 'التحديات الأسبوعية' : '주간 챌린지'}</h3>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'أكمل التحديات لجوائز خاصة!' : '챌린지 완료하고 보상 받기!'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {weeklyChallenges.map((challenge, index) => {
            const progress = (challenge.current / challenge.target) * 100;
            const daysRemaining = getDaysRemaining(challenge.deadline);
            
            return (
              <motion.div
                key={challenge.id}
                className="p-3 rounded-xl bg-muted/30 border border-border"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    progress >= 100 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {challenge.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {isRTL ? challenge.titleAr : challenge.titleKo}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{daysRemaining}d</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${
                            progress >= 100 
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                              : 'bg-gradient-to-r from-primary to-primary/80'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-medium">{challenge.current}/{challenge.target}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Gift className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-medium text-amber-600">+{challenge.rewardPoints}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Grand Prize */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-600 via-pink-500 to-amber-500"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 left-2 w-12 h-12 border border-white/50 rounded-full" />
          <div className="absolute bottom-2 right-2 w-16 h-16 border border-white/30 rounded-full" />
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white">
              {isRTL ? 'جائزة الأسبوع الكبرى' : '이번 주 대상'}
            </h3>
            <p className="text-white/80 text-xs mb-1">
              {isRTL ? 'أكمل جميع التحديات لتفوز!' : '모든 챌린지 완료하고 우승!'}
            </p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="font-bold text-white">+1000 {isRTL ? 'نقطة' : '포인트'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{isRTL ? 'الإنجازات' : '업적'}</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedCount}/{totalAchievements} {isRTL ? 'مكتمل' : '완료'}
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
                  {isRTL ? data.titleAr : data.titleKo}
                </h4>
                <p className="text-[10px] text-muted-foreground text-center mb-1">
                  {isRTL ? data.descriptionAr : data.descriptionKo}
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
