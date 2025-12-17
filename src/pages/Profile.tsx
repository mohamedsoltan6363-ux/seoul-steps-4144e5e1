import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import AvatarUpload from '@/components/AvatarUpload';
import RewardsDisplay from '@/components/RewardsDisplay';
import { 
  ArrowLeft, Trophy, Flame, Star, Settings, ChevronRight, 
  BookOpen, MessageSquare, GraduationCap, Mail
} from 'lucide-react';

const Profile: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, getLevelProgress, progressByLevel } = useProgress();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'progress' | 'rewards'>('progress');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, display_name')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setAvatarUrl(data.avatar_url);
        setDisplayName(data.display_name || '');
      }
    };
    fetchProfile();
  }, [user]);

  const levelIcons = [
    <span key={1} className="text-xl font-korean">ㄱ</span>,
    <BookOpen key={2} className="w-5 h-5" />,
    <MessageSquare key={3} className="w-5 h-5" />,
    <GraduationCap key={4} className="w-5 h-5" />,
  ];

  const levelColors = [
    'from-blue-500 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-violet-600',
  ];

  const streakDays = 0;
  const unlockedAchievements = [
    (progressByLevel[1]?.memorizedCount || 0) > 0 ? 'first_letter' : null,
    (progressByLevel[1]?.memorizedCount || 0) >= 19 ? 'consonant_master' : null,
    (progressByLevel[1]?.memorizedCount || 0) >= 40 ? 'vowel_master' : null,
    getLevelProgress(1) >= 100 ? 'level1_complete' : null,
    (progressByLevel[2]?.memorizedCount || 0) >= 50 ? 'vocabulary_50' : null,
    streakDays >= 7 ? 'streak_7' : null,
  ].filter(Boolean) as string[];

  const achievements = unlockedAchievements.map(id => ({ id, unlocked: true }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
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
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute inset-0 opacity-30" />
          </div>
          
          <div className="relative p-6 pt-8 flex flex-col items-center">
            <AvatarUpload 
              currentAvatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
            
            <h2 className="text-xl font-bold text-white mt-4">
              {displayName || user?.email?.split('@')[0]}
            </h2>
            <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <p className="text-white/60 text-sm mt-2">
              {language === 'ar' ? 'متعلم اللغة الكورية' : '한국어 학습자'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="pro-card p-4 text-center">
            <Trophy className="w-7 h-7 mx-auto mb-2 text-korean-gold" />
            <p className="text-2xl font-bold text-gradient">{totalPoints}</p>
            <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
          </div>
          <div className="pro-card p-4 text-center">
            <Flame className="w-7 h-7 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{currentLevel}</p>
            <p className="text-xs text-muted-foreground">{t('currentLevel')}</p>
          </div>
          <div className="pro-card p-4 text-center">
            <Star className="w-7 h-7 mx-auto mb-2 text-korean-pink" />
            <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
            <p className="text-xs text-muted-foreground">{t('achievements')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'progress' 
                ? 'bg-card shadow-sm text-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            {language === 'ar' ? 'التقدم' : '진행 상황'}
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'rewards' 
                ? 'bg-card shadow-sm text-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            {language === 'ar' ? 'المكافآت' : '보상'}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'progress' ? (
          <div className="space-y-3">
            <h3 className="font-bold mb-4">{t('progress')}</h3>
            {[1, 2, 3, 4].map((level) => {
              const progress = getLevelProgress(level);
              const memorized = progressByLevel[level]?.memorizedCount || 0;
              const total = progressByLevel[level]?.totalItems || 0;
              
              return (
                <div 
                  key={level} 
                  className="pro-card p-4 cursor-pointer"
                  onClick={() => navigate(`/learn/${level}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${levelColors[level - 1]} flex items-center justify-center text-white`}>
                      {levelIcons[level - 1]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{t(`level${level}` as any)}</span>
                        <span className="text-sm font-bold text-primary">{progress}%</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {memorized} / {total} {language === 'ar' ? 'تم الحفظ' : '암기 완료'}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <RewardsDisplay
            totalPoints={totalPoints}
            currentLevel={currentLevel}
            streakDays={streakDays}
            achievements={achievements}
          />
        )}
      </main>
    </div>
  );
};

export default Profile;
