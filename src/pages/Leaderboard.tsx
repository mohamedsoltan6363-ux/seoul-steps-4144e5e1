import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, Crown, Medal, Trophy, Users, 
  Star, Flame, Target, Award, ChevronRight,
  Share2, UserPlus, Globe
} from 'lucide-react';

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_points: number;
  streak_days: number;
  current_level: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'friends'>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, total_points, streak_days, current_level')
        .order('total_points', { ascending: false })
        .limit(50);

      if (error) throw error;

      const rankedData: LeaderboardUser[] = (data || []).map((u, idx) => ({
        ...u,
        rank: idx + 1
      }));

      setLeaderboard(rankedData);

      // Find current user's rank
      if (user) {
        const userRank = rankedData.find(u => u.user_id === user.id);
        setMyRank(userRank?.rank || null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Use mock data if error
      setLeaderboard([
        { user_id: '1', display_name: 'أحمد المتعلم', avatar_url: null, total_points: 5200, streak_days: 45, current_level: 4, rank: 1 },
        { user_id: '2', display_name: 'سارة النجمة', avatar_url: null, total_points: 4800, streak_days: 32, current_level: 4, rank: 2 },
        { user_id: '3', display_name: 'محمد البطل', avatar_url: null, total_points: 4200, streak_days: 28, current_level: 3, rank: 3 },
        { user_id: '4', display_name: 'فاطمة الذكية', avatar_url: null, total_points: 3800, streak_days: 21, current_level: 3, rank: 4 },
        { user_id: '5', display_name: 'علي المثابر', avatar_url: null, total_points: 3400, streak_days: 18, current_level: 3, rank: 5 },
        { user_id: '6', display_name: 'نورة المجتهدة', avatar_url: null, total_points: 3000, streak_days: 15, current_level: 2, rank: 6 },
        { user_id: '7', display_name: 'خالد الشجاع', avatar_url: null, total_points: 2600, streak_days: 12, current_level: 2, rank: 7 },
        { user_id: '8', display_name: 'هدى اللامعة', avatar_url: null, total_points: 2200, streak_days: 10, current_level: 2, rank: 8 },
        { user_id: '9', display_name: 'يوسف النشيط', avatar_url: null, total_points: 1800, streak_days: 8, current_level: 2, rank: 9 },
        { user_id: '10', display_name: 'مريم الرائعة', avatar_url: null, total_points: 1400, streak_days: 5, current_level: 1, rank: 10 },
      ]);
    }
    
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-korean-gold" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-700" />;
      default: return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-korean-gold/20 to-amber-500/20 border-korean-gold/30';
      case 2: return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/30';
      case 3: return 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-700/30';
      default: return 'bg-card border-border';
    }
  };

  const tabs = [
    { id: 'global', label: language === 'ar' ? 'العالمي' : '전체', icon: <Globe className="w-4 h-4" /> },
    { id: 'weekly', label: language === 'ar' ? 'الأسبوعي' : '주간', icon: <Target className="w-4 h-4" /> },
    { id: 'friends', label: language === 'ar' ? 'الأصدقاء' : '친구', icon: <Users className="w-4 h-4" /> },
  ];

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
              <Trophy className="w-5 h-5 text-korean-gold" />
              {language === 'ar' ? 'لوحة المتصدرين' : '리더보드'}
            </h1>
          </div>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* My Rank Card */}
        {myRank && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  #{myRank}
                </div>
                <div>
                  <p className="font-bold">{language === 'ar' ? 'ترتيبك' : '내 순위'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'استمر في التعلم للصعود!' : '계속 배우며 순위를 올리세요!'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-2 mb-8 h-48">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xl mb-2 border-4 border-gray-400/50">
                {leaderboard[1]?.display_name?.[0] || '?'}
              </div>
              <p className="text-sm font-medium text-center truncate max-w-20">{leaderboard[1]?.display_name}</p>
              <p className="text-xs text-muted-foreground">{leaderboard[1]?.total_points} pts</p>
              <div className="w-20 h-24 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-korean-gold mb-1" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-korean-gold to-amber-500 flex items-center justify-center text-white font-bold text-2xl mb-2 border-4 border-korean-gold/50 shadow-lg">
                {leaderboard[0]?.display_name?.[0] || '?'}
              </div>
              <p className="text-sm font-bold text-center truncate max-w-24">{leaderboard[0]?.display_name}</p>
              <p className="text-xs text-muted-foreground">{leaderboard[0]?.total_points} pts</p>
              <div className="w-24 h-32 bg-gradient-to-t from-korean-gold to-amber-400 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-bold text-xl mb-2 border-4 border-amber-700/50">
                {leaderboard[2]?.display_name?.[0] || '?'}
              </div>
              <p className="text-sm font-medium text-center truncate max-w-20">{leaderboard[2]?.display_name}</p>
              <p className="text-xs text-muted-foreground">{leaderboard[2]?.total_points} pts</p>
              <div className="w-20 h-20 bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg mt-2 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            leaderboard.slice(3).map((entry) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-md ${getRankBg(entry.rank)}`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  entry.rank <= 10 ? 'bg-primary/10 text-primary' : 'bg-muted'
                }`}>
                  {entry.rank}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-lg">
                  {entry.avatar_url ? (
                    <img src={entry.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    entry.display_name?.[0] || '?'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.display_name || 'مستخدم'}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      {entry.streak_days}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      Lv.{entry.current_level}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-bold text-korean-gold">{entry.total_points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'نقطة' : '점'}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invite Friends */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold">{language === 'ar' ? 'ادعُ أصدقاءك' : '친구 초대하기'}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'تنافسوا معاً واكسبوا نقاط إضافية' : '함께 경쟁하고 보너스 포인트를 받으세요'}
              </p>
            </div>
            <button className="p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
