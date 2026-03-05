import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart3, MessageCircle, Shield, ArrowLeft, Trash2, 
  Search, Eye, TrendingUp, Award, BookOpen, RefreshCw, 
  Calendar, Clock, Download, Filter, ChevronDown, ChevronUp,
  Activity, Globe, Smartphone, UserCheck, UserX, Send,
  AlertTriangle, CheckCircle, XCircle, PieChart, Layers,
  Star, Zap, Target, Hash, Mail, Phone, MapPin, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  full_name_arabic: string | null;
  full_name_english: string | null;
  avatar_url: string | null;
  current_level: number | null;
  total_points: number | null;
  streak_days: number | null;
  user_type: string | null;
  phone: string | null;
  national_id: string | null;
  created_at: string | null;
  last_activity_at: string | null;
  age: number | null;
  location_address: string | null;
  college_name: string | null;
  job_title: string | null;
  birth_date: string | null;
  preferred_language: string | null;
}

interface ForumPostAdmin {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
  reactions_count: number;
  comments_count: number;
}

interface QuizResult {
  id: string;
  user_id: string;
  level: number;
  score: number;
  total_questions: number;
  passed: boolean | null;
  completed_at: string | null;
  user_name?: string;
}

interface LevelStat {
  level: number;
  title: string;
  studentsCount: number;
  avgProgress: number;
  memorizedItems: number;
  totalReviews: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPostAdmin[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [levelStats, setLevelStats] = useState<LevelStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUserProgress, setSelectedUserProgress] = useState<any[]>([]);
  const [selectedUserQuizzes, setSelectedUserQuizzes] = useState<QuizResult[]>([]);
  const [selectedUserPosts, setSelectedUserPosts] = useState<ForumPostAdmin[]>([]);
  const [adminPostContent, setAdminPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userSort, setUserSort] = useState<'newest' | 'points' | 'level'>('newest');
  const [totalStats, setTotalStats] = useState({
    users: 0, posts: 0, avgLevel: 0, totalPoints: 0,
    activeToday: 0, totalQuizzes: 0, passRate: 0,
    totalMemorized: 0, avgStreak: 0, certificates: 0,
    totalComments: 0, totalReactions: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    const [
      { data: profilesData },
      { data: postsData },
      { data: reactionsData },
      { data: commentsData },
      { data: progressData },
      { data: quizData },
      { data: certsData },
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('forum_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('forum_reactions').select('*'),
      supabase.from('forum_comments').select('*'),
      supabase.from('lesson_progress').select('*'),
      supabase.from('quiz_results').select('*').order('completed_at', { ascending: false }),
      supabase.from('certificates').select('*'),
    ]);

    const allUsers = (profilesData || []) as UserProfile[];
    setUsers(allUsers);

    const profileMap = new Map(allUsers.map(u => [u.user_id, u]));

    // Forum posts with counts
    const postsWithMeta: ForumPostAdmin[] = (postsData || []).map(p => {
      const u = profileMap.get(p.user_id);
      return {
        ...p,
        user_name: u?.full_name_arabic || u?.display_name || 'Unknown',
        reactions_count: (reactionsData || []).filter(r => r.post_id === p.id).length,
        comments_count: (commentsData || []).filter(c => c.post_id === p.id).length,
      };
    });
    setForumPosts(postsWithMeta);

    // Quiz results
    const quizzesWithNames: QuizResult[] = (quizData || []).map(q => ({
      ...q,
      user_name: profileMap.get(q.user_id)?.full_name_arabic || profileMap.get(q.user_id)?.display_name || 'Unknown',
    }));
    setQuizResults(quizzesWithNames);

    // Level stats
    const levelTitles = [
      { level: 1, title: isRTL ? 'الحروف الكورية' : '한글', total: 40 },
      { level: 2, title: isRTL ? 'المفردات الأساسية' : '기본 어휘', total: 130 },
      { level: 3, title: isRTL ? 'المفردات المتقدمة' : '고급 어휘', total: 200 },
      { level: 4, title: isRTL ? 'الجمل الأساسية' : '기본 문장', total: 40 },
      { level: 5, title: isRTL ? 'الجمل المتقدمة' : '고급 문장', total: 50 },
      { level: 6, title: isRTL ? 'الحياة اليومية' : '일상 생활', total: 100 },
    ];

    const stats: LevelStat[] = levelTitles.map(lt => {
      const levelProgress = (progressData || []).filter(p => p.level === lt.level);
      const uniqueUsers = new Set(levelProgress.map(p => p.user_id));
      const memorized = levelProgress.filter(p => p.is_memorized);
      const totalReviews = levelProgress.reduce((s, p) => s + (p.times_reviewed || 0), 0);
      const avgProg = uniqueUsers.size > 0 ? Math.round((memorized.length / (uniqueUsers.size * lt.total)) * 100) : 0;
      return { level: lt.level, title: lt.title, studentsCount: uniqueUsers.size, avgProgress: Math.min(avgProg, 100), memorizedItems: memorized.length, totalReviews };
    });
    setLevelStats(stats);

    // Total stats
    const today = new Date().toISOString().split('T')[0];
    const activeToday = allUsers.filter(u => u.last_activity_at?.startsWith(today)).length;
    const avgLevel = allUsers.length > 0
      ? Math.round(allUsers.reduce((sum, u) => sum + (u.current_level || 1), 0) / allUsers.length * 10) / 10
      : 0;
    const passedQuizzes = (quizData || []).filter(q => q.passed);
    const passRate = (quizData || []).length > 0 ? Math.round((passedQuizzes.length / (quizData || []).length) * 100) : 0;
    const totalMem = (progressData || []).filter(p => p.is_memorized).length;
    const avgStreak = allUsers.length > 0
      ? Math.round(allUsers.reduce((s, u) => s + (u.streak_days || 0), 0) / allUsers.length)
      : 0;

    setTotalStats({
      users: allUsers.length,
      posts: (postsData || []).length,
      avgLevel,
      totalPoints: allUsers.reduce((sum, u) => sum + (u.total_points || 0), 0),
      activeToday,
      totalQuizzes: (quizData || []).length,
      passRate,
      totalMemorized: totalMem,
      avgStreak,
      certificates: (certsData || []).length,
      totalComments: (commentsData || []).length,
      totalReactions: (reactionsData || []).length,
    });

    setLoading(false);
  }, [isRTL]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const viewUserDetails = async (profile: UserProfile) => {
    setSelectedUser(profile);
    const [{ data: progress }, { data: quizzes }, { data: posts }] = await Promise.all([
      supabase.from('lesson_progress').select('*').eq('user_id', profile.user_id),
      supabase.from('quiz_results').select('*').eq('user_id', profile.user_id).order('completed_at', { ascending: false }),
      supabase.from('forum_posts').select('*').eq('user_id', profile.user_id).order('created_at', { ascending: false }),
    ]);
    setSelectedUserProgress(progress || []);
    setSelectedUserQuizzes((quizzes || []) as QuizResult[]);
    setSelectedUserPosts((posts || []).map(p => ({ ...p, user_name: profile.full_name_arabic || profile.display_name || '', reactions_count: 0, comments_count: 0 })));
  };

  const deleteForumPost = async (postId: string) => {
    const { error } = await supabase.from('forum_posts').delete().eq('id', postId);
    if (error) {
      toast({ title: isRTL ? 'خطأ' : '오류', description: error.message, variant: 'destructive' });
    } else {
      setForumPosts(prev => prev.filter(p => p.id !== postId));
      toast({ title: isRTL ? 'تم الحذف' : '삭제됨' });
    }
  };

  const createAdminPost = async () => {
    if (!adminPostContent.trim() || !user) return;
    const { error } = await supabase.from('forum_posts').insert({
      user_id: user.id,
      content: `📢 ${adminPostContent.trim()}`,
    });
    if (!error) {
      setAdminPostContent('');
      toast({ title: isRTL ? 'تم نشر الإعلان!' : '공지가 게시되었습니다!' });
      fetchData();
    }
  };

  const getFilteredUsers = () => {
    let filtered = users.filter(u => {
      const q = searchQuery.toLowerCase();
      return (u.full_name_arabic || '').toLowerCase().includes(q) ||
        (u.display_name || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q) ||
        (u.national_id || '').includes(q) ||
        (u.full_name_english || '').toLowerCase().includes(q);
    });

    const today = new Date().toISOString().split('T')[0];
    if (userFilter === 'active') filtered = filtered.filter(u => u.last_activity_at?.startsWith(today));
    if (userFilter === 'inactive') filtered = filtered.filter(u => !u.last_activity_at?.startsWith(today));

    if (userSort === 'newest') filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    if (userSort === 'points') filtered.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
    if (userSort === 'level') filtered.sort((a, b) => (b.current_level || 1) - (a.current_level || 1));

    return filtered;
  };

  const exportUsersCSV = () => {
    const headers = ['Name Arabic', 'Name English', 'Phone', 'Level', 'Points', 'Streak', 'Type', 'Registered'];
    const rows = users.map(u => [
      u.full_name_arabic || '', u.full_name_english || '', u.phone || '',
      u.current_level || 1, u.total_points || 0, u.streak_days || 0,
      u.user_type || '', u.created_at || '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'seoul-steps-users.csv'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: isRTL ? 'تم التصدير!' : '내보내기 완료!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">{isRTL ? 'جاري تحميل البيانات...' : '데이터 로딩 중...'}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: isRTL ? 'إجمالي المستخدمين' : '전체 사용자', value: totalStats.users, icon: Users, color: 'from-blue-500 to-cyan-500', sub: `${totalStats.activeToday} ${isRTL ? 'نشط اليوم' : '오늘 활동'}` },
    { label: isRTL ? 'المنشورات' : '게시물', value: totalStats.posts, icon: MessageCircle, color: 'from-purple-500 to-pink-500', sub: `${totalStats.totalComments} ${isRTL ? 'تعليق' : '댓글'} · ${totalStats.totalReactions} ${isRTL ? 'تفاعل' : '반응'}` },
    { label: isRTL ? 'الاختبارات' : '퀴즈', value: totalStats.totalQuizzes, icon: FileText, color: 'from-emerald-500 to-teal-500', sub: `${totalStats.passRate}% ${isRTL ? 'نسبة النجاح' : '합격률'}` },
    { label: isRTL ? 'العناصر المحفوظة' : '암기 항목', value: totalStats.totalMemorized, icon: Target, color: 'from-amber-500 to-orange-500', sub: `${isRTL ? 'متوسط السلسلة' : '평균 연속'}: ${totalStats.avgStreak} ${isRTL ? 'يوم' : '일'}` },
    { label: isRTL ? 'متوسط المستوى' : '평균 레벨', value: totalStats.avgLevel, icon: TrendingUp, color: 'from-rose-500 to-red-500', sub: `${totalStats.totalPoints.toLocaleString()} ${isRTL ? 'نقطة إجمالية' : '총 점수'}` },
    { label: isRTL ? 'الشهادات' : '인증서', value: totalStats.certificates, icon: Award, color: 'from-indigo-500 to-violet-500', sub: isRTL ? 'شهادة صادرة' : '발급된 인증서' },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{isRTL ? 'لوحة تحكم المدير' : '관리자 대시보드'}</h1>
              <p className="text-xs text-white/60">{isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman Mohamed Sultan'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportUsersCSV} className="text-white hover:bg-white/10 gap-1.5">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{isRTL ? 'تصدير' : '내보내기'}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-white hover:bg-white/10">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-4 text-white group hover:shadow-xl transition-shadow`}
            >
              <stat.icon className="absolute top-3 right-3 w-8 h-8 opacity-20 group-hover:opacity-30 transition-opacity" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/80 mt-0.5 font-medium">{stat.label}</p>
              <p className="text-[10px] text-white/60 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5 mb-6 h-auto">
            {[
              { value: 'overview', icon: BarChart3, label: isRTL ? 'نظرة عامة' : '개요' },
              { value: 'users', icon: Users, label: isRTL ? 'المستخدمين' : '사용자' },
              { value: 'levels', icon: BookOpen, label: isRTL ? 'المستويات' : '레벨' },
              { value: 'quizzes', icon: FileText, label: isRTL ? 'الاختبارات' : '퀴즈' },
              { value: 'forum', icon: MessageCircle, label: isRTL ? 'المنتدى' : '포럼' },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1 py-2.5 text-xs sm:text-sm">
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ===== OVERVIEW TAB ===== */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Registrations */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  {isRTL ? 'أحدث التسجيلات' : '최근 가입'}
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => viewUserDetails(u)}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-sm font-bold overflow-hidden">
                        {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : (u.full_name_arabic || 'U').charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.full_name_arabic || u.display_name || '-'}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {u.created_at ? formatDistanceToNow(new Date(u.created_at), { addSuffix: true, locale: isRTL ? ar : undefined }) : '-'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary">{isRTL ? 'مستوى' : 'Lv.'} {u.current_level || 1}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Level Distribution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  {isRTL ? 'توزيع المستويات' : '레벨 분포'}
                </h3>
                <div className="space-y-3">
                  {levelStats.map(stat => {
                    const percent = totalStats.users > 0 ? Math.round((stat.studentsCount / totalStats.users) * 100) : 0;
                    return (
                      <div key={stat.level} className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{stat.level}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{stat.title}</span>
                            <span className="text-muted-foreground">{stat.studentsCount} ({percent}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} className="h-full bg-primary rounded-full" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Quiz Results */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {isRTL ? 'أحدث نتائج الاختبارات' : '최근 퀴즈 결과'}
                </h3>
                <div className="space-y-2">
                  {quizResults.slice(0, 6).map(q => (
                    <div key={q.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {q.passed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        <div>
                          <p className="text-xs font-medium">{q.user_name}</p>
                          <p className="text-[10px] text-muted-foreground">{isRTL ? 'مستوى' : '레벨'} {q.level}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${q.passed ? 'text-emerald-500' : 'text-destructive'}`}>
                        {q.score}/{q.total_questions}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Forum Activity */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  {isRTL ? 'أحدث نشاط المنتدى' : '최근 포럼 활동'}
                </h3>
                <div className="space-y-2">
                  {forumPosts.slice(0, 6).map(p => (
                    <div key={p.id} className="p-2 rounded-xl hover:bg-muted/50">
                      <p className="text-xs font-medium text-primary">{p.user_name}</p>
                      <p className="text-xs text-foreground/80 line-clamp-1 mt-0.5">{p.content}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span>❤️ {p.reactions_count}</span>
                        <span>💬 {p.comments_count}</span>
                        <span>{p.created_at ? formatDistanceToNow(new Date(p.created_at), { addSuffix: true, locale: isRTL ? ar : undefined }) : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* ===== USERS TAB ===== */}
          <TabsContent value="users">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'بحث بالاسم، الهاتف، الرقم القومي...' : '이름, 전화번호, 주민번호로 검색...'}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30`}
                />
              </div>
              <div className="flex gap-2">
                <select value={userFilter} onChange={e => setUserFilter(e.target.value as any)} className="bg-card border border-border rounded-xl px-3 py-2 text-xs outline-none">
                  <option value="all">{isRTL ? 'الكل' : '전체'}</option>
                  <option value="active">{isRTL ? 'نشط اليوم' : '오늘 활동'}</option>
                  <option value="inactive">{isRTL ? 'غير نشط' : '비활성'}</option>
                </select>
                <select value={userSort} onChange={e => setUserSort(e.target.value as any)} className="bg-card border border-border rounded-xl px-3 py-2 text-xs outline-none">
                  <option value="newest">{isRTL ? 'الأحدث' : '최신순'}</option>
                  <option value="points">{isRTL ? 'النقاط' : '점수순'}</option>
                  <option value="level">{isRTL ? 'المستوى' : '레벨순'}</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              {isRTL ? `عرض ${getFilteredUsers().length} من ${users.length} مستخدم` : `${users.length}명 중 ${getFilteredUsers().length}명 표시`}
            </p>

            {/* Selected User Detail */}
            <AnimatePresence>
              {selectedUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="bg-card border-2 border-primary/20 rounded-2xl p-6 mb-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      {isRTL ? 'تفاصيل المستخدم' : '사용자 상세'}
                    </h3>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedUser(null)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar & Name */}
                    <div className="flex flex-col items-center sm:items-start gap-3">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-3xl font-bold overflow-hidden shadow-lg">
                        {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" /> : (selectedUser.full_name_arabic || 'U').charAt(0)}
                      </div>
                      <div className="text-center sm:text-start">
                        <p className="font-bold text-lg">{selectedUser.full_name_arabic || selectedUser.display_name}</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.full_name_english || '-'}</p>
                        <p className="text-xs text-primary font-medium mt-1">{selectedUser.user_type || '-'}</p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { icon: Layers, label: isRTL ? 'المستوى' : '레벨', value: selectedUser.current_level || 1 },
                        { icon: Star, label: isRTL ? 'النقاط' : '점수', value: selectedUser.total_points || 0 },
                        { icon: Zap, label: isRTL ? 'السلسلة' : '연속', value: `${selectedUser.streak_days || 0} ${isRTL ? 'يوم' : '일'}` },
                        { icon: Phone, label: isRTL ? 'الهاتف' : '전화', value: selectedUser.phone || '-' },
                        { icon: Hash, label: isRTL ? 'الرقم القومي' : '주민번호', value: selectedUser.national_id || '-' },
                        { icon: Calendar, label: isRTL ? 'تاريخ الميلاد' : '생년월일', value: selectedUser.birth_date || '-' },
                        { icon: MapPin, label: isRTL ? 'الموقع' : '위치', value: selectedUser.location_address || '-' },
                        { icon: BookOpen, label: isRTL ? 'الكلية' : '대학', value: selectedUser.college_name || '-' },
                        { icon: Target, label: isRTL ? 'محفوظات' : '암기', value: selectedUserProgress.filter(p => p.is_memorized).length },
                      ].map((item, i) => (
                        <div key={i} className="bg-muted/50 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <item.icon className="w-3 h-3 text-muted-foreground" />
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          </div>
                          <p className="text-sm font-semibold truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User's Quizzes */}
                  {selectedUserQuizzes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{isRTL ? 'نتائج الاختبارات' : '퀴즈 결과'}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedUserQuizzes.map(q => (
                          <span key={q.id} className={`text-xs px-3 py-1.5 rounded-full font-medium ${q.passed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                            {isRTL ? 'مستوى' : 'Lv.'}{q.level}: {q.score}/{q.total_questions} {q.passed ? '✓' : '✗'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration info */}
                  <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {isRTL ? 'تسجيل' : '가입'}: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('ar-EG') : '-'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {isRTL ? 'آخر نشاط' : '최근 활동'}: {selectedUser.last_activity_at ? formatDistanceToNow(new Date(selectedUser.last_activity_at), { addSuffix: true, locale: isRTL ? ar : undefined }) : '-'}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {selectedUser.preferred_language === 'ar' ? 'العربية' : '한국어'}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{isRTL ? 'المستخدم' : '사용자'}</TableHead>
                    <TableHead>{isRTL ? 'المستوى' : '레벨'}</TableHead>
                    <TableHead>{isRTL ? 'النقاط' : '점수'}</TableHead>
                    <TableHead className="hidden sm:table-cell">{isRTL ? 'السلسلة' : '연속'}</TableHead>
                    <TableHead className="hidden md:table-cell">{isRTL ? 'النوع' : '유형'}</TableHead>
                    <TableHead className="hidden md:table-cell">{isRTL ? 'التسجيل' : '가입일'}</TableHead>
                    <TableHead>{isRTL ? 'إجراءات' : '작업'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredUsers().map((u, idx) => (
                    <TableRow key={u.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => viewUserDetails(u)}>
                      <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                            {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : (u.full_name_arabic || 'U').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{u.full_name_arabic || u.display_name || '-'}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.phone || u.full_name_english || ''}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-sm font-bold text-primary">{u.current_level || 1}</span></TableCell>
                      <TableCell><span className="text-sm font-medium">{(u.total_points || 0).toLocaleString()}</span></TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm">{u.streak_days || 0} 🔥</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{u.user_type || '-'}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{u.created_at ? new Date(u.created_at).toLocaleDateString('ar-EG') : '-'}</span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); viewUserDetails(u); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {getFilteredUsers().length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {isRTL ? 'لا توجد نتائج' : '결과 없음'}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ===== LEVELS TAB ===== */}
          <TabsContent value="levels">
            <div className="space-y-4">
              {levelStats.map((stat, i) => (
                <motion.div
                  key={stat.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">{stat.level}</span>
                      <div>
                        <h3 className="font-bold">{stat.title}</h3>
                        <p className="text-xs text-muted-foreground">{stat.studentsCount} {isRTL ? 'طالب مسجل' : '등록된 학생'}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary">{stat.avgProgress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.avgProgress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary">{stat.memorizedItems}</p>
                      <p className="text-[10px] text-muted-foreground">{isRTL ? 'عنصر محفوظ' : '암기 항목'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary">{stat.totalReviews}</p>
                      <p className="text-[10px] text-muted-foreground">{isRTL ? 'مراجعة' : '복습 횟수'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ===== QUIZZES TAB ===== */}
          <TabsContent value="quizzes">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {isRTL ? 'جميع نتائج الاختبارات' : '모든 퀴즈 결과'}
                </h3>
                <span className="text-xs text-muted-foreground">{quizResults.length} {isRTL ? 'نتيجة' : '결과'}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? 'الطالب' : '학생'}</TableHead>
                    <TableHead>{isRTL ? 'المستوى' : '레벨'}</TableHead>
                    <TableHead>{isRTL ? 'الدرجة' : '점수'}</TableHead>
                    <TableHead>{isRTL ? 'النتيجة' : '결과'}</TableHead>
                    <TableHead className="hidden sm:table-cell">{isRTL ? 'التاريخ' : '날짜'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizResults.map(q => (
                    <TableRow key={q.id}>
                      <TableCell className="text-sm font-medium">{q.user_name}</TableCell>
                      <TableCell><span className="font-bold text-primary">{q.level}</span></TableCell>
                      <TableCell><span className="font-medium">{q.score}/{q.total_questions}</span></TableCell>
                      <TableCell>
                        {q.passed ? (
                          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full font-medium">✓ {isRTL ? 'ناجح' : '합격'}</span>
                        ) : (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-medium">✗ {isRTL ? 'راسب' : '불합격'}</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                        {q.completed_at ? new Date(q.completed_at).toLocaleDateString('ar-EG') : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {quizResults.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">{isRTL ? 'لا توجد اختبارات بعد' : '아직 퀴즈가 없습니다'}</div>
              )}
            </div>
          </TabsContent>

          {/* ===== FORUM TAB ===== */}
          <TabsContent value="forum">
            {/* Admin Post Creator */}
            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold">{isRTL ? 'نشر إعلان رسمي' : '공식 공지 게시'}</p>
                  <p className="text-[10px] text-muted-foreground">{isRTL ? 'سيظهر باسم النظام في المنتدى' : '시스템 이름으로 포럼에 표시됩니다'}</p>
                </div>
              </div>
              <textarea
                value={adminPostContent}
                onChange={e => setAdminPostContent(e.target.value)}
                placeholder={isRTL ? 'اكتب إعلاناً رسمياً...' : '공식 공지를 작성하세요...'}
                className="w-full min-h-[80px] bg-background rounded-xl p-3 text-sm outline-none resize-none border border-border focus:ring-2 focus:ring-primary/30 mb-3"
              />
              <Button onClick={createAdminPost} disabled={!adminPostContent.trim()} className="gap-1.5">
                <Send className="w-4 h-4" />
                {isRTL ? 'نشر الإعلان' : '공지 게시'}
              </Button>
            </div>

            {/* Posts Management */}
            <div className="space-y-3">
              {forumPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary">{post.user_name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: isRTL ? ar : undefined }) : ''}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>❤️ {post.reactions_count}</span>
                        <span>💬 {post.comments_count}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => deleteForumPost(post.id)} className="text-destructive shrink-0 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {forumPosts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">{isRTL ? 'لا توجد منشورات' : '게시물이 없습니다'}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <div className="h-20" />
    </div>
  );
};

export default AdminDashboard;
