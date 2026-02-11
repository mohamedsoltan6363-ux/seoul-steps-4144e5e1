import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, TrendingUp, Activity, Home, Menu, X, 
  LogOut, BookOpen, Award, Zap, Clock, Target
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalLessonsCompleted: number;
  averageStreak: number;
  topUser?: { name: string; points: number };
  usersByLevel: Record<number, number>;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const isRTL = language === 'ar';
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    totalLessonsCompleted: 0,
    averageStreak: 0,
    usersByLevel: {}
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user) navigate('/auth');
    else fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users and their stats
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, total_points, current_level, streak_days, created_at');

      if (profilesError) throw profilesError;

      // Fetch lesson progress for all users
      const { data: lessonData, error: lessonError } = await supabase
        .from('lesson_progress')
        .select('user_id, is_memorized, updated_at');

      if (lessonError) throw lessonError;

      // Calculate stats
      const totalUsers = profilesData?.length || 0;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const activeToday = profilesData?.filter(p => {
        if (!p.created_at) return false;
        const created = new Date(p.created_at);
        const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());
        return createdDay.getTime() === today.getTime();
      }).length || 0;

      const totalLessonsCompleted = lessonData?.filter(l => l.is_memorized).length || 0;

      const usersByLevel: Record<number, number> = {};
      profilesData?.forEach(p => {
        const level = p.current_level || 1;
        usersByLevel[level] = (usersByLevel[level] || 0) + 1;
      });

      const averageStreak = profilesData && profilesData.length > 0
        ? Math.round(
            profilesData.reduce((sum, p) => sum + (p.streak_days || 0), 0) / profilesData.length
          )
        : 0;

      const topUser = profilesData && profilesData.length > 0
        ? profilesData.sort((a, b) => (b.total_points || 0) - (a.total_points || 0))[0]
        : undefined;

      setStats({
        totalUsers,
        activeToday,
        totalLessonsCompleted,
        averageStreak,
        topUser: topUser ? { name: topUser.full_name || 'Unknown', points: topUser.total_points || 0 } : undefined,
        usersByLevel
      });

      // Fetch all users for display
      setAllUsers(profilesData || []);

      // Fetch recent activity
      const recentData = lessonData?.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ).slice(0, 10) || [];
      setRecentActivity(recentData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-xl border border-opacity-20 border-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <Icon className="w-12 h-12 text-white/30" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div>
          <p>{isRTL ? 'جاري التحميل...' : '로드 중...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 w-64 h-screen bg-slate-800 border-r border-slate-700 p-6 flex flex-col transition-all duration-300 z-50 ${
          !sidebarOpen ? 'hidden' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {isRTL ? 'لوحة التحكم' : '대시보드'}
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { id: 'overview', label: isRTL ? 'نظرة عامة' : '개요', icon: BarChart3 },
            { id: 'users', label: isRTL ? 'المستخدمون' : '사용자', icon: Users },
            { id: 'activity', label: isRTL ? 'النشاط' : '활동', icon: Activity },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                  : 'hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {isRTL ? 'تسجيل الخروج' : '로그아웃'}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? (isRTL ? 'pr-64' : 'pl-64') : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">{isRTL ? 'لوحة تحكم النظام' : '시스템 관리'}</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
          >
            <Home className="w-5 h-5" />
            {isRTL ? 'العودة' : '돌아가기'}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6">{isRTL ? 'الإحصائيات الرئيسية' : '주요 통계'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label={isRTL ? 'إجمالي المستخدمين' : '전체 사용자'}
                  value={stats.totalUsers}
                  color="from-blue-600 to-blue-800"
                />
                <StatCard
                  icon={Activity}
                  label={isRTL ? 'نشط اليوم' : '오늘 활성'}
                  value={stats.activeToday}
                  color="from-green-600 to-green-800"
                />
                <StatCard
                  icon={BookOpen}
                  label={isRTL ? 'الدروس المكتملة' : '완료된 레슨'}
                  value={stats.totalLessonsCompleted}
                  color="from-purple-600 to-purple-800"
                />
                <StatCard
                  icon={Award}
                  label={isRTL ? 'متوسط التتابع' : '평균 스트릭'}
                  value={`${stats.averageStreak} ${isRTL ? 'يوم' : '일'}`}
                  color="from-orange-600 to-orange-800"
                />
              </div>

              {/* Users by Level */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isRTL ? 'المستخدمون حسب المستوى' : '레벨별 사용자'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <div key={level} className="bg-slate-700/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-white/70 mb-2">{isRTL ? 'المستوى' : 'レベル'} {level}</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.usersByLevel[level] || 0}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top User */}
              {stats.topUser && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 mt-6"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                    {isRTL ? 'أفضل مستخدم' : '상위 사용자'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl">{stats.topUser.name}</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.topUser.points} {isRTL ? 'نقطة' : '포인트'}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6">{isRTL ? 'قائمة المستخدمين' : '사용자 목록'}</h3>
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left">{isRTL ? 'الاسم' : '이름'}</th>
                        <th className="px-6 py-3 text-left">{isRTL ? 'المستوى' : '레벨'}</th>
                        <th className="px-6 py-3 text-left">{isRTL ? 'النقاط' : '포인트'}</th>
                        <th className="px-6 py-3 text-left">{isRTL ? 'التتابع' : '스트릭'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {allUsers.slice(0, 20).map((user, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/50 transition-all">
                          <td className="px-6 py-3">{user.full_name || 'Unknown'}</td>
                          <td className="px-6 py-3">{user.current_level || 1}</td>
                          <td className="px-6 py-3 font-bold text-blue-400">{user.total_points || 0}</td>
                          <td className="px-6 py-3">{user.streak_days || 0} {isRTL ? 'يوم' : '일'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-bold mb-6">{isRTL ? 'النشاط الأخير' : '최근 활동'}</h3>
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-all">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-semibold">{isRTL ? 'مستخدم' : '사용자'} #{activity.user_id?.slice(0, 8)}</p>
                          <p className="text-xs text-white/50">{new Date(activity.updated_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-sm">
                        {activity.is_memorized ? (isRTL ? 'تم الحفظ' : '암기 완료') : (isRTL ? 'قيد المراجعة' : '검토 중')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-center py-8">{isRTL ? 'لا توجد أنشطة حديثة' : '최근 활동 없음'}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
