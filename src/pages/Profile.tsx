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
import { ArrowLeft, Settings, Mail, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, getLevelProgress, progressByLevel } = useProgress();
  const { streakDays, todayCompleted } = useStreak();
  const { getDueCount, totalReviews, masteredCount } = useSpacedRepetition();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'streak' | 'rewards' | 'verification'>('stats');
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

      // Fetch quiz results
      const { data: quizData } = await supabase
        .from('quiz_results')
        .select('passed')
        .eq('user_id', user.id)
        .eq('passed', true);

      setQuizzesPassed(quizData?.length || 0);
    };
    fetchProfile();
  }, [user]);
  
  // Calculate all achievements
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

  const tabs = [
    { id: 'stats', label: isRTL ? 'الإحصائيات' : '통계' },
    { id: 'achievements', label: isRTL ? 'الإنجازات' : '업적' },
    { id: 'streak', label: isRTL ? 'السلسلة' : '연속' },
    { id: 'rewards', label: isRTL ? 'المكافآت' : '보상' },
    { id: 'verification', label: isRTL ? 'التوثيق' : '인증' },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-medium">{t('dashboard')}</span>
          </button>
          <h1 className="font-bold text-lg">{t('profile')}</h1>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute inset-0 opacity-30" />
          </div>
          
          <div className="relative p-6 pt-8 flex flex-col items-center">
            <AvatarUpload 
              currentAvatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
            
            <h2 className="text-xl font-bold text-white mt-4 flex items-center gap-2">
              {displayName || user?.email?.split('@')[0]}
              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Edit2 className="w-4 h-4 text-white/70" />
              </button>
            </h2>
            <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <p className="text-white/60 text-sm mt-2">
              {isRTL ? 'متعلم اللغة الكورية' : '한국어 학습자'}
            </p>

            {/* Quick Stats in Header */}
            <div className="flex items-center gap-6 mt-4 text-white/80">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-white/60">{isRTL ? 'نقطة' : '점'}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold">{streakDays}</p>
                <p className="text-xs text-white/60">{isRTL ? 'يوم' : '일'}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
                <p className="text-xs text-white/60">{isRTL ? 'إنجاز' : '업적'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-muted rounded-2xl overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-card shadow-sm text-foreground' 
                  : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
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
            <AchievementsList
              achievements={achievements}
              totalPoints={totalPoints}
              streakDays={streakDays}
            />
          )}
          
          {activeTab === 'streak' && (
            <div className="space-y-4">
              <h3 className="font-bold">{isRTL ? 'أيامك المتتالية' : '연속 학습 일수'}</h3>
              <StreakDisplay 
                streakDays={streakDays} 
                todayCompleted={todayCompleted} 
              />
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
          
          {activeTab === 'verification' && (
            <IdVerification />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
