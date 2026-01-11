import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Trophy, Target, Clock, Calendar,
  BookOpen, Brain, Flame, Star, Award, BarChart3, PieChart as PieChartIcon,
  Zap, CheckCircle2, LineChart as LineChartIcon
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

const Reports: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalPoints, progressByLevel, loading } = useProgress();
  const { streakDays } = useStreak();
  const [animatedStats, setAnimatedStats] = useState({ points: 0, streak: 0, memorized: 0 });

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  // Animate stats on load
  useEffect(() => {
    const totalMemorized = Object.values(progressByLevel).reduce((sum, p) => sum + p.memorizedCount, 0);
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        points: Math.round(totalPoints * progress),
        streak: Math.round(streakDays * progress),
        memorized: Math.round(totalMemorized * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalPoints, streakDays, progressByLevel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{language === 'ar' ? 'جاري تحميل التقارير...' : '보고서 로딩 중...'}</p>
        </div>
      </div>
    );
  }

  const totalMemorized = Object.values(progressByLevel).reduce((sum, p) => sum + p.memorizedCount, 0);
  const totalItems = Object.values(progressByLevel).reduce((sum, p) => sum + p.totalItems, 0);
  const overallProgress = totalItems > 0 ? Math.round((totalMemorized / totalItems) * 100) : 0;

  // Level progress data for bar chart
  const levelProgressData = [
    { name: language === 'ar' ? 'المستوى 1' : '레벨 1', progress: progressByLevel[1]?.memorizedCount || 0, total: progressByLevel[1]?.totalItems || 40, color: '#3B82F6' },
    { name: language === 'ar' ? 'المستوى 2' : '레벨 2', progress: progressByLevel[2]?.memorizedCount || 0, total: progressByLevel[2]?.totalItems || 130, color: '#EC4899' },
    { name: language === 'ar' ? 'المستوى 3' : '레벨 3', progress: progressByLevel[3]?.memorizedCount || 0, total: progressByLevel[3]?.totalItems || 200, color: '#06B6D4' },
    { name: language === 'ar' ? 'المستوى 4' : '레벨 4', progress: progressByLevel[4]?.memorizedCount || 0, total: progressByLevel[4]?.totalItems || 40, color: '#F59E0B' },
    { name: language === 'ar' ? 'المستوى 5' : '레벨 5', progress: progressByLevel[5]?.memorizedCount || 0, total: progressByLevel[5]?.totalItems || 50, color: '#8B5CF6' },
    { name: language === 'ar' ? 'المستوى 6' : '레벨 6', progress: progressByLevel[6]?.memorizedCount || 0, total: progressByLevel[6]?.totalItems || 100, color: '#10B981' },
  ];

  // Pie chart data
  const pieData = [
    { name: language === 'ar' ? 'تم الحفظ' : '암기 완료', value: totalMemorized, color: '#10B981' },
    { name: language === 'ar' ? 'متبقي' : '남은', value: totalItems - totalMemorized, color: '#E5E7EB' },
  ];

  // Weekly study data (mock for demo)
  const weeklyData = [
    { day: language === 'ar' ? 'السبت' : '토', points: 45 },
    { day: language === 'ar' ? 'الأحد' : '일', points: 78 },
    { day: language === 'ar' ? 'الاثنين' : '월', points: 120 },
    { day: language === 'ar' ? 'الثلاثاء' : '화', points: 95 },
    { day: language === 'ar' ? 'الأربعاء' : '수', points: 150 },
    { day: language === 'ar' ? 'الخميس' : '목', points: 88 },
    { day: language === 'ar' ? 'الجمعة' : '금', points: 200 },
  ];

  // Radial progress data
  const radialData = [
    { name: language === 'ar' ? 'الحروف' : '글자', value: Math.round(((progressByLevel[1]?.memorizedCount || 0) / (progressByLevel[1]?.totalItems || 40)) * 100), fill: '#3B82F6' },
    { name: language === 'ar' ? 'المفردات' : '어휘', value: Math.round(((progressByLevel[2]?.memorizedCount || 0) / (progressByLevel[2]?.totalItems || 130)) * 100), fill: '#EC4899' },
    { name: language === 'ar' ? 'الجمل' : '문장', value: Math.round((((progressByLevel[4]?.memorizedCount || 0) + (progressByLevel[5]?.memorizedCount || 0)) / ((progressByLevel[4]?.totalItems || 40) + (progressByLevel[5]?.totalItems || 50))) * 100), fill: '#F59E0B' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 rounded-xl hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">
                {language === 'ar' ? 'تقارير الأداء' : '성과 보고서'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <motion.main 
        className="container mx-auto px-4 py-6 max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-primary to-blue-600 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Trophy className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-4xl font-bold mb-1">{animatedStats.points.toLocaleString()}</p>
            <p className="text-white/80">{language === 'ar' ? 'إجمالي النقاط' : '총 포인트'}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Flame className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-4xl font-bold mb-1">{animatedStats.streak}</p>
            <p className="text-white/80">{language === 'ar' ? 'أيام متتالية' : '연속 일수'}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CheckCircle2 className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-4xl font-bold mb-1">{animatedStats.memorized}</p>
            <p className="text-white/80">{language === 'ar' ? 'تم الحفظ' : '암기 완료'}</p>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{language === 'ar' ? 'التقدم الإجمالي' : '전체 진행률'}</h2>
                <p className="text-muted-foreground text-sm">{language === 'ar' ? `${totalMemorized} من ${totalItems} عنصر` : `${totalItems}개 중 ${totalMemorized}개`}</p>
              </div>
              <div className="ml-auto text-3xl font-bold text-primary">{overallProgress}%</div>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Level Progress Bar Chart */}
          <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold">{language === 'ar' ? 'تقدم المستويات' : '레벨별 진행률'}</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={levelProgressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 'dataMax']} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} / ${props.payload.total}`,
                    language === 'ar' ? 'تم الحفظ' : '암기'
                  ]}
                />
                <Bar dataKey="progress" radius={[0, 8, 8, 0]}>
                  {levelProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/10">
                <PieChartIcon className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold">{language === 'ar' ? 'نسبة الإنجاز' : '달성률'}</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-4">
              <span className="text-4xl font-bold text-primary">{overallProgress}%</span>
            </div>
          </motion.div>

          {/* Weekly Activity Line Chart */}
          <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/10">
                <LineChartIcon className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-lg font-bold">{language === 'ar' ? 'نشاط الأسبوع' : '주간 활동'}</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                  formatter={(value: number) => [value, language === 'ar' ? 'نقاط' : '포인트']}
                />
                <Area 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPoints)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radial Chart */}
          <motion.div variants={itemVariants} className="bg-card rounded-3xl p-6 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-amber-500/10">
                <Brain className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold">{language === 'ar' ? 'تحليل المهارات' : '능력 분석'}</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="30%" 
                outerRadius="90%" 
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend 
                  iconSize={10}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, language === 'ar' ? 'النسبة' : '비율']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-lg text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{progressByLevel[1]?.memorizedCount || 0}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'حروف' : '글자'}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-lg text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{progressByLevel[2]?.memorizedCount || 0}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'مفردات' : '어휘'}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-lg text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{(progressByLevel[4]?.memorizedCount || 0) + (progressByLevel[5]?.memorizedCount || 0)}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'جمل' : '문장'}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-lg text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">{Math.floor(totalPoints / 100)}</p>
            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'شارات' : '배지'}</p>
          </div>
        </motion.div>

        {/* Detailed Level Cards */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold mb-4">{language === 'ar' ? 'تفاصيل المستويات' : '레벨 상세'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {levelProgressData.map((level, index) => {
              const percentage = level.total > 0 ? Math.round((level.progress / level.total) * 100) : 0;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-2xl p-5 border border-border shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">{level.name}</h3>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: level.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {level.progress} / {level.total} {language === 'ar' ? 'عنصر' : '항목'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Reports;
