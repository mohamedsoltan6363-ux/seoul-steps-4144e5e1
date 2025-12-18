import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from '@/hooks/useAchievements';
import { vocabulary, consonants, vowels } from '@/data/koreanData';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, Trophy, Clock, Target, Zap, Star, 
  CheckCircle2, XCircle, Flame, Gift, Crown, Medal
} from 'lucide-react';

interface Challenge {
  id: string;
  type: 'memorize' | 'quiz' | 'listen' | 'match';
  title: { ar: string; ko: string };
  description: { ar: string; ko: string };
  target: number;
  reward: number;
  icon: React.ReactNode;
  color: string;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  points: number;
  rank: number;
}

const DailyChallenge: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAchievement } = useAchievements();
  
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [challengeItems, setChallengeItems] = useState<any[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Daily challenges pool
  const challenges: Challenge[] = [
    {
      id: 'memorize5',
      type: 'memorize',
      title: { ar: 'احفظ 5 كلمات', ko: '단어 5개 암기' },
      description: { ar: 'احفظ 5 كلمات جديدة في دقيقتين', ko: '2분 안에 새 단어 5개 암기' },
      target: 5,
      reward: 50,
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'quiz10',
      type: 'quiz',
      title: { ar: 'أجب على 10 أسئلة', ko: '퀴즈 10문제' },
      description: { ar: 'أجب بشكل صحيح على 10 أسئلة', ko: '10문제 맞추기' },
      target: 10,
      reward: 100,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'listen8',
      type: 'listen',
      title: { ar: 'استمع وأجب', ko: '듣고 답하기' },
      description: { ar: 'استمع إلى 8 كلمات واختر المعنى', ko: '8개 단어 듣고 뜻 맞추기' },
      target: 8,
      reward: 80,
      icon: <Star className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'match12',
      type: 'match',
      title: { ar: 'وفّق 12 زوج', ko: '12쌍 매칭' },
      description: { ar: 'وفّق الكلمات الكورية بالعربية', ko: '한국어-아랍어 매칭' },
      target: 12,
      reward: 120,
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600'
    }
  ];

  // Get today's challenge based on date
  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDate() % challenges.length;
    setCurrentChallenge(challenges[dayIndex]);
    
    // Check if already completed today
    const lastCompleted = localStorage.getItem('lastChallengeDate');
    if (lastCompleted === today.toDateString()) {
      setCompleted(true);
    }
    
    // Load streak
    const streak = parseInt(localStorage.getItem('challengeStreak') || '0');
    setDailyStreak(streak);
    
    // Load mock leaderboard
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      { user_id: '1', display_name: 'أحمد', avatar_url: null, points: 2500, rank: 1 },
      { user_id: '2', display_name: 'سارة', avatar_url: null, points: 2200, rank: 2 },
      { user_id: '3', display_name: 'محمد', avatar_url: null, points: 1800, rank: 3 },
      { user_id: '4', display_name: 'فاطمة', avatar_url: null, points: 1500, rank: 4 },
      { user_id: '5', display_name: 'علي', avatar_url: null, points: 1200, rank: 5 },
    ];
    setLeaderboard(mockLeaderboard);
  };

  // Start challenge
  const startChallenge = () => {
    if (!currentChallenge) return;
    
    // Prepare items based on challenge type
    const allItems = [...vocabulary.slice(0, 50)];
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    setChallengeItems(shuffled.slice(0, currentChallenge.target));
    
    setIsActive(true);
    setProgress(0);
    setScore(0);
    setCurrentItemIndex(0);
    setTimeLeft(120); // 2 minutes
  };

  // Timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive]);

  // Handle answer
  const handleAnswer = (correct: boolean) => {
    if (!currentChallenge) return;
    
    if (correct) {
      setScore(prev => prev + 1);
      setProgress(prev => Math.min(prev + (100 / currentChallenge.target), 100));
    }
    
    if (currentItemIndex + 1 >= challengeItems.length) {
      // Challenge completed
      completeChallenge();
    } else {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const completeChallenge = () => {
    setIsActive(false);
    setCompleted(true);
    setShowReward(true);
    
    // Save completion
    localStorage.setItem('lastChallengeDate', new Date().toDateString());
    
    // Update streak
    const newStreak = dailyStreak + 1;
    setDailyStreak(newStreak);
    localStorage.setItem('challengeStreak', newStreak.toString());
    
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentItem = () => challengeItems[currentItemIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {language === 'ar' ? 'التحدي اليومي' : '오늘의 도전'}
            </h1>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="font-bold">{dailyStreak}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Challenge Card */}
        {currentChallenge && !isActive && !completed && (
          <div className="mb-6">
            <div className={`p-6 rounded-3xl bg-gradient-to-br ${currentChallenge.color} text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    {currentChallenge.icon}
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{language === 'ar' ? 'تحدي اليوم' : '오늘의 도전'}</p>
                    <h2 className="text-xl font-bold">
                      {currentChallenge.title[language === 'ar' ? 'ar' : 'ko']}
                    </h2>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4">
                  {currentChallenge.description[language === 'ar' ? 'ar' : 'ko']}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>2:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      <span>{currentChallenge.reward} {language === 'ar' ? 'نقطة' : '점'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={startChallenge}
                    className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-white/90 transition-colors"
                  >
                    {language === 'ar' ? 'ابدأ التحدي' : '시작하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Challenge */}
        {isActive && currentChallenge && (
          <div className="mb-6">
            {/* Timer and Progress */}
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft <= 10 ? 'bg-red-500/10 text-red-500' : 'bg-muted'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{currentItemIndex + 1}/{challengeItems.length}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${currentChallenge.color} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            {getCurrentItem() && (
              <div className="bg-card rounded-3xl border border-border p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'ar' ? 'ما معنى هذه الكلمة؟' : '이 단어의 뜻은?'}
                </p>
                <h2 className="font-korean text-4xl font-bold mb-6">{getCurrentItem().korean}</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {[...vocabulary]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .concat([getCurrentItem()])
                    .sort(() => Math.random() - 0.5)
                    .map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(item.id === getCurrentItem().id)}
                        className="p-4 rounded-2xl bg-muted hover:bg-primary/10 hover:border-primary border border-transparent transition-all text-center"
                      >
                        <span className="font-medium">{item.arabic}</span>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed State */}
        {completed && (
          <div className="mb-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-korean-green to-emerald-600 text-white text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {language === 'ar' ? 'أحسنت! أكملت التحدي' : '축하합니다! 도전 완료'}
              </h2>
              <p className="text-white/80 mb-4">
                {language === 'ar' ? 'عد غداً لتحدٍ جديد' : '내일 새로운 도전이 기다립니다'}
              </p>
              <div className="flex items-center justify-center gap-2 text-xl font-bold">
                <Trophy className="w-6 h-6" />
                <span>+{currentChallenge?.reward || 0} {language === 'ar' ? 'نقطة' : '점'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Crown className="w-5 h-5 text-korean-gold" />
              {language === 'ar' ? 'لوحة المتصدرين' : '리더보드'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {language === 'ar' ? 'اليوم' : '오늘'}
            </span>
          </div>
          
          <div className="divide-y divide-border">
            {leaderboard.map((entry, idx) => (
              <div key={entry.user_id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  idx === 0 ? 'bg-korean-gold text-white' :
                  idx === 1 ? 'bg-gray-400 text-white' :
                  idx === 2 ? 'bg-amber-700 text-white' :
                  'bg-muted'
                }`}>
                  {idx + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                  {entry.display_name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.display_name}</p>
                </div>
                <div className="flex items-center gap-1 text-korean-gold font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {entry.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Badges */}
        <div className="mt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            {language === 'ar' ? 'شارات التحدي' : '도전 배지'}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { days: 3, icon: '🔥', unlocked: dailyStreak >= 3 },
              { days: 7, icon: '⭐', unlocked: dailyStreak >= 7 },
              { days: 14, icon: '🏆', unlocked: dailyStreak >= 14 },
              { days: 30, icon: '👑', unlocked: dailyStreak >= 30 },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-center transition-all ${
                  badge.unlocked 
                    ? 'bg-gradient-to-br from-korean-gold/20 to-amber-500/20 border border-korean-gold/30' 
                    : 'bg-muted/50 opacity-50'
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <p className="text-xs mt-1 font-medium">
                  {badge.days} {language === 'ar' ? 'يوم' : '일'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;
