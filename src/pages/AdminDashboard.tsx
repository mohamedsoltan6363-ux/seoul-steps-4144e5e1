import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, Users, TrendingUp, Eye, Award, BookOpen, Zap, 
  Settings, LogOut, Menu, X, Home, PieChart, LineChart, Activity 
} from 'lucide-react';
import UserAnalytics from '@/components/admin/UserAnalytics';
import LevelsManagement from '@/components/admin/LevelsManagement';
import TestsManagement from '@/components/admin/TestsManagement';
import RewardsManagement from '@/components/admin/RewardsManagement';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const isRTL = language === 'ar';

  const stats = [
    {
      id: 'users',
      label: isRTL ? 'إجمالي المستخدمين' : '총 사용자',
      value: '2,547',
      icon: Users,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      id: 'active-today',
      label: isRTL ? 'نشط اليوم' : '오늘 활동',
      value: '487',
      icon: Activity,
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      id: 'views',
      label: isRTL ? 'إجمالي المشاهدات' : '총 조회수',
      value: '45.2K',
      icon: Eye,
      color: 'purple',
      change: '+24%',
      trend: 'up'
    },
    {
      id: 'revenue',
      label: isRTL ? 'الإجماليات' : '총액',
      value: '$12,540',
      icon: TrendingUp,
      color: 'amber',
      change: '+15%',
      trend: 'up'
    },
  ];

  const menuItems = [
    {
      id: 'overview',
      label: isRTL ? 'نظرة عامة' : '개요',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'users',
      label: isRTL ? 'المستخدمون' : '사용자',
      icon: Users,
      badge: 'new'
    },
    {
      id: 'levels',
      label: isRTL ? 'المستويات' : '레벨',
      icon: Zap,
      badge: null
    },
    {
      id: 'tests',
      label: isRTL ? 'الاختبارات' : '테스트',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'rewards',
      label: isRTL ? 'المكافآت' : '보상',
      icon: Award,
      badge: null
    },
    {
      id: 'analytics',
      label: isRTL ? 'الإحصائيات' : '분석',
      icon: LineChart,
      badge: null
    },
    {
      id: 'settings',
      label: isRTL ? 'الإعدادات' : '설정',
      icon: Settings,
      badge: null
    },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', icon: 'text-purple-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', icon: 'text-amber-500' },
  };

  return (
    <div className={`flex h-screen bg-slate-900 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <motion.div
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <motion.div
            initial={false}
            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-lg">Admin</span>
          </motion.div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'bg-amber-600/20 text-amber-500 border-l-2 border-amber-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  initial={false}
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
                {item.badge && isSidebarOpen && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <motion.span
              initial={false}
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {isRTL ? 'العودة' : '돌아가기'}
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">{isRTL ? 'لوحة التحكم' : '관리자 대시보드'}</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">
              {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'ko-KR')}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    const colors = colorMap[stat.color as keyof typeof colorMap];
                    return (
                      <motion.div
                        key={stat.id}
                        whileHover={{ y: -4 }}
                        className={`${colors.bg} ${colors.border} border rounded-lg p-6 cursor-pointer`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <Icon className={`${colors.icon} w-8 h-8`} />
                          <span className="text-sm font-semibold text-green-600">
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
                        <p className={`${colors.text} text-3xl font-bold`}>{stat.value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Users Chart */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                  >
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {isRTL ? 'نمو المستخدمين' : '사용자 성장'}
                    </h3>
                    <div className="h-64 bg-slate-700/50 rounded flex items-center justify-center text-slate-400">
                      <span>{isRTL ? 'رسم بياني' : '차트 로드 중'}</span>
                    </div>
                  </motion.div>

                  {/* Activity Chart */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                  >
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {isRTL ? 'النشاط اليومي' : '일일 활동'}
                    </h3>
                    <div className="h-64 bg-slate-700/50 rounded flex items-center justify-center text-slate-400">
                      <span>{isRTL ? 'رسم بياني' : '차트 로드 중'}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-white text-lg font-semibold mb-4">
                    {isRTL ? 'النشاط الأخير' : '최근 활동'}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { user: 'أحمد علي', action: isRTL ? 'سجل دخول' : '로그인', time: '2 دقائق' },
                      { user: 'فاطمة محمد', action: isRTL ? 'أنهى الدرس' : '수업 완료', time: '5 دقائق' },
                      { user: 'محمود إبراهيم', action: isRTL ? 'اجتياز الاختبار' : '테스트 통과', time: '10 دقائق' },
                    ].map((activity, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0">
                        <div>
                          <p className="text-white font-medium">{activity.user}</p>
                          <p className="text-slate-400 text-sm">{activity.action}</p>
                        </div>
                        <span className="text-slate-500 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserAnalytics />
              </motion.div>
            )}

            {/* Levels Tab */}
            {activeTab === 'levels' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <LevelsManagement />
              </motion.div>
            )}

            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TestsManagement />
              </motion.div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <RewardsManagement />
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center"
              >
                <p className="text-slate-400 text-lg">
                  {isRTL ? 'رسوم بيانية متقدمة قيد الإنشاء' : '고급 분석 차트 준비 중'}
                </p>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center"
              >
                <p className="text-slate-400 text-lg">
                  {isRTL ? 'إعدادات النظام قيد الإنشاء' : '시스템 설정 준비 중'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
