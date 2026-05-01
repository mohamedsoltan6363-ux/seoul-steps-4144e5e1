import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { supabase } from '@/integrations/supabase/client';
import AvatarUpload from '@/components/AvatarUpload';
import RewardsDisplay from '@/components/RewardsDisplay';
import StreakDisplay from '@/components/StreakDisplay';
import ProfileStats from '@/components/ProfileStats';
import AchievementsList from '@/components/AchievementsList';
import IdVerification from '@/components/IdVerification';
import CertificatePreview from '@/components/CertificatePreview';
import ReferralSystem from '@/components/ReferralSystem';
import {
  ArrowLeft, Settings, Mail, Edit2, BarChart3, Trophy, Users2,
  Flame, Gift, Award, Shield, Sparkles, Star, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'stats' | 'achievements' | 'referral' | 'streak' | 'rewards' | 'certificate' | 'verification';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, getLevelProgress, progressByLevel } = useProgress();
  const { streakDays, todayCompleted } = useStreak();
  const { getDueCount, totalReviews, masteredCount } = useSpacedRepetition();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabId>('stats');
  const [quizzesPassed, setQuizzesPassed] = useState(0);

  const isRTL = language === 'ar';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar_url, display_name')
        .eq('user_id', user.id)
        .single();
      if (profileData) {
        setAvatarUrl(profileData.avatar_url);
        setDisplayName(profileData.display_name || '');
      }
      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('passed')
        .eq('user_id', user.id)
        .eq('passed', true);
      setQuizzesPassed(quizData?.length || 0);
    };
    fetchProfile();
  }, [user]);

  const level1Memorized = progressByLevel[1]?.memorizedCount || 0;
  const level2Memorized = progressByLevel[2]?.memorizedCount || 0;
  const level3Memorized = progressByLevel[3]?.memorizedCount || 0;

  const achievements = [
    { id: 'first_letter', unlocked: level1Memorized > 0 },
    { id: 'consonant_master', unlocked: level1Memorized >= 19, progress: level1Memorized, maxProgress: 19 },
    { id: 'vowel_master', unlocked: level1Memorized >= 40, progress: Math.max(0, level1Memorized - 19), maxProgress: 21 },
    { id: 'level1_complete', unlocked: getLevelProgress(1) >= 100 },
    { id: 'vocabulary_25', unlocked: level2Memorized >= 25, progress: level2Memorized, maxProgress: 25 },
    { id: 'vocabulary_50', unlocked: level2Memorized >= 50, progress: level2Memorized, maxProgress: 50 },
    { id: 'vocabulary_100', unlocked: level2Memorized >= 100, progress: level2Memorized, maxProgress: 100 },
    { id: 'sentence_beginner', unlocked: level3Memorized >= 10, progress: level3Memorized, maxProgress: 10 },
    { id: 'streak_3', unlocked: streakDays >= 3, progress: streakDays, maxProgress: 3 },
    { id: 'streak_7', unlocked: streakDays >= 7, progress: streakDays, maxProgress: 7 },
    { id: 'streak_14', unlocked: streakDays >= 14, progress: streakDays, maxProgress: 14 },
    { id: 'streak_30', unlocked: streakDays >= 30, progress: streakDays, maxProgress: 30 },
    { id: 'dedicated_learner', unlocked: totalPoints >= 500, progress: totalPoints, maxProgress: 500 },
    { id: 'expert_learner', unlocked: totalPoints >= 1000, progress: totalPoints, maxProgress: 1000 },
    { id: 'master_learner', unlocked: getLevelProgress(1) >= 100 && getLevelProgress(2) >= 100 && getLevelProgress(3) >= 100 && getLevelProgress(4) >= 100 },
  ];

  const totalMemorized = level1Memorized + level2Memorized + level3Memorized;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const tabs: { id: TabId; label: string; icon: any; gradient: string }[] = [
    { id: 'stats', label: isRTL ? 'الإحصائيات' : '통계', icon: BarChart3, gradient: 'from-blue-400 to-cyan-400' },
    { id: 'achievements', label: isRTL ? 'الإنجازات' : '업적', icon: Trophy, gradient: 'from-amber-400 to-orange-400' },
    { id: 'streak', label: isRTL ? 'السلسلة' : '연속', icon: Flame, gradient: 'from-rose-400 to-pink-400' },
    { id: 'rewards', label: isRTL ? 'المكافآت' : '보상', icon: Gift, gradient: 'from-purple-400 to-violet-400' },
    { id: 'referral', label: isRTL ? 'الإحالات' : '추천', icon: Users2, gradient: 'from-emerald-400 to-teal-400' },
    { id: 'certificate', label: isRTL ? 'الشهادة' : '인증서', icon: Award, gradient: 'from-yellow-400 to-amber-400' },
    { id: 'verification', label: isRTL ? 'التوثيق' : '인증', icon: Shield, gradient: 'from-indigo-400 to-blue-400' },
  ];

  const overallProgress = Math.round(
    (getLevelProgress(1) + getLevelProgress(2) + getLevelProgress(3) +
     getLevelProgress(4) + getLevelProgress(5) + getLevelProgress(6)) / 6
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: 'linear-gradient(135deg, #fef3f9 0%, #f0e7ff 35%, #e0f2fe 70%, #fce7f3 100%)',
      }}
    >
      {/* Animated background blobs - Korean K-pop pastel aesthetic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 22, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)' }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity }}
        />
        {/* Tiny floating sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
            style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/40 border-b border-white/30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur hover:bg-white/80 transition text-slate-700"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">{t('dashboard')}</span>
          </button>
          <h1 className="font-bold text-base text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-500" />
            {t('profile')}
          </h1>
          <button className="p-2 rounded-full bg-white/60 backdrop-blur hover:bg-white/80 transition text-slate-700">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 pb-32 md:pb-8 max-w-3xl relative z-10">
        {/* Hero Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-5"
        >
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(244,114,182,0.15)] p-5 sm:p-6">
            {/* Decorative gradient orbs inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-rose-300/40 to-pink-300/40 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-300/40 to-blue-300/40 blur-2xl" />

            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Avatar with animated ring */}
              <div className="relative">
                <motion.div
                  className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-violet-400 opacity-70"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative">
                  <AvatarUpload currentAvatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />
                </div>
              </div>

              {/* Name & Email */}
              <div className="flex-1 text-center sm:text-start min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2 truncate">
                  {displayName || user?.email?.split('@')[0]}
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 text-xs mt-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow">
                    {isRTL ? `المستوى ${currentLevel}` : `레벨 ${currentLevel}`}
                  </span>
                  <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/70 text-slate-600 border border-white/80">
                    {isRTL ? '한국어 학습자' : 'متعلم كوري'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: totalPoints, label: isRTL ? 'نقطة' : '점', icon: Star, color: 'from-amber-400 to-orange-400' },
                { value: streakDays, label: isRTL ? 'يوم' : '일', icon: Flame, color: 'from-rose-400 to-pink-400' },
                { value: unlockedAchievements, label: isRTL ? 'إنجاز' : '업적', icon: Trophy, color: 'from-violet-400 to-purple-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="relative rounded-2xl p-3 backdrop-blur bg-white/60 border border-white/70 text-center"
                >
                  <div className={`mx-auto w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-1.5 shadow`}>
                    <stat.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                  <p className="text-[10px] text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="relative mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-rose-500" />
                  {isRTL ? 'التقدم العام' : '전체 진행률'}
                </span>
                <span className="text-xs font-bold text-rose-600">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden backdrop-blur">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Glass Tabs - scrollable */}
        <div className="mb-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1 min-w-max">
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition backdrop-blur border ${
                    active
                      ? 'text-white border-transparent shadow-lg'
                      : 'bg-white/50 text-slate-600 border-white/60 hover:bg-white/70'
                  }`}
                  style={
                    active
                      ? { backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }
                      : undefined
                  }
                >
                  {active && (
                    <motion.div
                      layoutId="activeTabBg"
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${tab.gradient} shadow-lg`}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <tab.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content - Glass Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl backdrop-blur-2xl bg-white/50 border border-white/60 shadow-[0_8px_32px_rgba(168,85,247,0.1)] p-4 sm:p-5"
          >
            {activeTab === 'stats' && (
              <ProfileStats
                totalPoints={totalPoints}
                currentLevel={currentLevel}
                streakDays={streakDays}
                totalMemorized={totalMemorized}
                lettersMemorized={level1Memorized}
                vocabularyMemorized={level2Memorized}
                sentencesMemorized={level3Memorized}
                totalReviews={totalReviews}
                masteredItems={masteredCount}
                quizzesPassed={quizzesPassed}
                dueReviews={getDueCount()}
              />
            )}
            {activeTab === 'achievements' && (
              <AchievementsList achievements={achievements} totalPoints={totalPoints} streakDays={streakDays} />
            )}
            {activeTab === 'streak' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">{isRTL ? 'أيامك المتتالية' : '연속 학습 일수'}</h3>
                <StreakDisplay streakDays={streakDays} todayCompleted={todayCompleted} />
              </div>
            )}
            {activeTab === 'rewards' && (
              <RewardsDisplay
                totalPoints={totalPoints}
                currentLevel={currentLevel}
                streakDays={streakDays}
                achievements={achievements}
              />
            )}
            {activeTab === 'certificate' && <CertificatePreview />}
            {activeTab === 'verification' && <IdVerification />}
            {activeTab === 'referral' && <ReferralSystem />}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Profile;
