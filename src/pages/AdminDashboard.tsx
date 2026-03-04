import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Users, BarChart3, MessageCircle, Shield, ArrowLeft, Trash2, 
  Search, Eye, TrendingUp, Award, BookOpen, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

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
}

interface ForumPostAdmin {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
}

interface LevelStat {
  level: number;
  title: string;
  studentsCount: number;
  avgProgress: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPostAdmin[]>([]);
  const [levelStats, setLevelStats] = useState<LevelStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedUserProgress, setSelectedUserProgress] = useState<any[]>([]);
  const [adminPostContent, setAdminPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [totalStats, setTotalStats] = useState({ users: 0, posts: 0, avgLevel: 0, totalPoints: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all users
    const { data: profilesData } = await supabase.from('profiles').select('*');
    const allUsers = profilesData || [];
    setUsers(allUsers);

    // Fetch forum posts
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    const postsWithNames = (postsData || []).map(p => {
      const u = allUsers.find(u => u.user_id === p.user_id);
      return { ...p, user_name: u?.full_name_arabic || u?.display_name || 'Unknown' };
    });
    setForumPosts(postsWithNames);

    // Fetch level progress
    const { data: progressData } = await supabase.from('lesson_progress').select('*');
    
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
      const avgProg = uniqueUsers.size > 0 ? Math.round((memorized.length / (uniqueUsers.size * lt.total)) * 100) : 0;
      return { level: lt.level, title: lt.title, studentsCount: uniqueUsers.size, avgProgress: Math.min(avgProg, 100) };
    });
    setLevelStats(stats);

    // Total stats
    const avgLevel = allUsers.length > 0 
      ? Math.round(allUsers.reduce((sum, u) => sum + (u.current_level || 1), 0) / allUsers.length * 10) / 10
      : 0;
    setTotalStats({
      users: allUsers.length,
      posts: (postsData || []).length,
      avgLevel,
      totalPoints: allUsers.reduce((sum, u) => sum + (u.total_points || 0), 0),
    });

    setLoading(false);
  };

  const viewUserDetails = async (profile: UserProfile) => {
    setSelectedUser(profile);
    const { data } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', profile.user_id);
    setSelectedUserProgress(data || []);
  };

  const deleteForumPost = async (postId: string) => {
    // Admin deletes by directly calling - RLS allows owner only, 
    // but we'll do it through a workaround: admin can only delete their own posts via RLS
    // For now, mark it
    const { error } = await supabase.from('forum_posts').delete().eq('id', postId);
    if (error) {
      toast({ title: isRTL ? 'خطأ' : '오류', description: isRTL ? 'لا يمكن حذف هذا المنشور (ليس منشورك)' : '이 게시물을 삭제할 수 없습니다', variant: 'destructive' });
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

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (u.full_name_arabic || '').toLowerCase().includes(q) ||
           (u.display_name || '').toLowerCase().includes(q) ||
           (u.phone || '').includes(q) ||
           (u.national_id || '').includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Shield className="w-6 h-6 text-yellow-400" />
            <div>
              <h1 className="font-bold text-lg">{isRTL ? 'لوحة تحكم المدير' : '관리자 대시보드'}</h1>
              <p className="text-xs text-white/60">{isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman Mohamed Sultan'}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchData} className="text-white hover:bg-white/10">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: isRTL ? 'المستخدمين' : '사용자', value: totalStats.users, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: isRTL ? 'المنشورات' : '게시물', value: totalStats.posts, icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
            { label: isRTL ? 'متوسط المستوى' : '평균 레벨', value: totalStats.avgLevel, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
            { label: isRTL ? 'إجمالي النقاط' : '총 점수', value: totalStats.totalPoints.toLocaleString(), icon: Award, color: 'from-emerald-500 to-teal-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-4 text-white`}
            >
              <stat.icon className="absolute top-3 right-3 w-8 h-8 opacity-20" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/80 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="w-4 h-4" />
              {isRTL ? 'المستخدمين' : '사용자'}
            </TabsTrigger>
            <TabsTrigger value="levels" className="gap-1.5">
              <BookOpen className="w-4 h-4" />
              {isRTL ? 'المستويات' : '레벨'}
            </TabsTrigger>
            <TabsTrigger value="forum" className="gap-1.5">
              <MessageCircle className="w-4 h-4" />
              {isRTL ? 'المنتدى' : '포럼'}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'بحث عن مستخدم...' : '사용자 검색...'}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6 mb-4 relative"
              >
                <button onClick={() => setSelectedUser(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-2xl font-bold overflow-hidden">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (selectedUser.full_name_arabic || 'U').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedUser.full_name_arabic || selectedUser.display_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.full_name_english}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.user_type} · {isRTL ? 'مستوى' : '레벨'} {selectedUser.current_level}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{selectedUser.total_points || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{isRTL ? 'نقاط' : '점수'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{selectedUser.streak_days || 0}</p>
                    <p className="text-[10px] text-muted-foreground">{isRTL ? 'أيام متتالية' : '연속 일수'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{selectedUserProgress.filter(p => p.is_memorized).length}</p>
                    <p className="text-[10px] text-muted-foreground">{isRTL ? 'عنصر محفوظ' : '암기 항목'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{selectedUser.phone || '-'}</p>
                    <p className="text-[10px] text-muted-foreground">{isRTL ? 'الهاتف' : '전화'}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{isRTL ? 'الرقم القومي' : '주민등록번호'}: {selectedUser.national_id || '-'}</p>
                  <p>{isRTL ? 'تاريخ التسجيل' : '가입일'}: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('ar-EG') : '-'}</p>
                  <p>{isRTL ? 'آخر نشاط' : '마지막 활동'}: {selectedUser.last_activity_at ? new Date(selectedUser.last_activity_at).toLocaleDateString('ar-EG') : '-'}</p>
                </div>
              </motion.div>
            )}

            {/* Users Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? 'المستخدم' : '사용자'}</TableHead>
                    <TableHead>{isRTL ? 'المستوى' : '레벨'}</TableHead>
                    <TableHead>{isRTL ? 'النقاط' : '점수'}</TableHead>
                    <TableHead>{isRTL ? 'النوع' : '유형'}</TableHead>
                    <TableHead>{isRTL ? 'إجراءات' : '작업'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold overflow-hidden">
                            {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : (u.full_name_arabic || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.full_name_arabic || u.display_name || '-'}</p>
                            <p className="text-[10px] text-muted-foreground">{u.phone || ''}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-sm font-bold text-primary">{u.current_level || 1}</span></TableCell>
                      <TableCell><span className="text-sm">{u.total_points || 0}</span></TableCell>
                      <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded-full">{u.user_type || '-'}</span></TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => viewUserDetails(u)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Levels Tab */}
          <TabsContent value="levels">
            <div className="space-y-3">
              {levelStats.map((stat, i) => (
                <motion.div
                  key={stat.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">{stat.level}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{stat.title}</h3>
                        <p className="text-xs text-muted-foreground">{stat.studentsCount} {isRTL ? 'طالب' : '학생'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">{stat.avgProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.avgProgress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum">
            {/* Admin Post */}
            <div className="bg-card border border-border rounded-2xl p-4 mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isRTL ? '📢 نشر إعلان باسم النظام' : '📢 시스템 이름으로 공지 게시'}</p>
              <textarea
                value={adminPostContent}
                onChange={e => setAdminPostContent(e.target.value)}
                placeholder={isRTL ? 'اكتب إعلاناً...' : '공지를 작성하세요...'}
                className="w-full min-h-[60px] bg-muted/50 rounded-xl p-3 text-sm outline-none resize-none mb-2"
              />
              <Button size="sm" onClick={createAdminPost} disabled={!adminPostContent.trim()}>
                {isRTL ? 'نشر الإعلان' : '공지 게시'}
              </Button>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {forumPosts.map(post => (
                <div key={post.id} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary mb-1">{post.user_name}</p>
                    <p className="text-sm line-clamp-2">{post.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(post.created_at).toLocaleDateString('ar-EG')} · {new Date(post.created_at).toLocaleTimeString('ar-EG')}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteForumPost(post.id)} className="text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
