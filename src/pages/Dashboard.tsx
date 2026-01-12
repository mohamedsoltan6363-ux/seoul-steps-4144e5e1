import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import StreakDisplay from '@/components/StreakDisplay';
import { 
  BookOpen, MessageSquare, GraduationCap, User, LogOut, Trophy, 
  Flame, Star, Play, Lock, Check, Sparkles, Target, ChevronRight,
  Layers, Award, Gamepad2, Book, Zap, Crown, FileText, BookOpen as BookStory, 
  Mic, Music, Bell, BarChart3, Rocket, Heart, TrendingUp
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import koreanCharacter from '@/assets/korean-character.png';
import NotificationPanel from '@/components/NotificationPanel';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { currentLevel, totalPoints, isLevelUnlocked, getLevelProgress, loading, progressByLevel } = useProgress();
  const { streakDays, todayCompleted, updateStreak } = useStreak();
  const { showAchievement } = useAchievements();
  const [greeting, setGreeting] = useState('');
  const [showWelcomeEffect, setShowWelcomeEffect] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(language === 'ar' ? 'صباح الخير' : '좋은 아침이에요');
    else if (hour < 18) setGreeting(language === 'ar' ? 'مساء الخير' : '좋은 오후예요');
    else setGreeting(language === 'ar' ? 'مساء الخير' : '좋은 저녁이에요');
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeEffect(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const levels = [
    { 
      level: 1, 
      titleKey: 'level1', 
      icon: <span className="text-2xl font-korean">ㄱ</span>, 
      desc: language === 'ar' ? 'تعلم جميع الحروف الكورية' : '모든 한글 배우기',
      color: 'from-blue-500 to-indigo-600',
      items: 40
    },
    { 
      level: 2, 
      titleKey: 'level2', 
      icon: <BookOpen className="w-6 h-6" />, 
      desc: language === 'ar' ? 'كلمات أساسية للحياة اليومية' : '필수 단어',
      color: 'from-pink-500 to-rose-600',
      items: 130
    },
    { 
      level: 3, 
      titleKey: 'level3', 
      icon: <Layers className="w-6 h-6" />, 
      desc: language === 'ar' ? 'مفردات متقدمة وصعبة' : '고급 어휘',
      color: 'from-cyan-500 to-blue-600',
      items: 200
    },
    { 
      level: 4, 
      titleKey: 'level4', 
      icon: <MessageSquare className="w-6 h-6" />, 
      desc: language === 'ar' ? 'جمل أساسية للمحادثة' : '기본 대화 문장',
      color: 'from-amber-500 to-orange-600',
      items: 40
    },
    { 
      level: 5, 
      titleKey: 'level5', 
      icon: <GraduationCap className="w-6 h-6" />, 
      desc: language === 'ar' ? 'جمل متقدمة + اختبار نهائي' : '고급 문장 + 최종 시험',
      color: 'from-purple-500 to-violet-600',
      items: 50
    },
    { 
      level: 6, 
      titleKey: 'level6', 
      icon: <Star className="w-6 h-6" />, 
      desc: language === 'ar' ? 'جمل الحياة اليومية العملية' : '일상생활 문장',
      color: 'from-emerald-500 to-teal-600',
      items: 100
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/30 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <Rocket className="absolute inset-0 m-auto w-8 h-8 text-primary animate-bounce" />
          </div>
          <p className="text-muted-foreground font-medium">{language === 'ar' ? 'جاري التحميل...' : '로딩 중...'}</p>
        </motion.div>
      </div>
    );
  }

  const totalMemorized = Object.values(progressByLevel).reduce((sum, p) => sum + p.memorizedCount, 0);
  const totalItems = Object.values(progressByLevel).reduce((sum, p) => sum + p.totalItems, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  // Item variants used for stagger animations
  const _itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Welcome Effect Overlay */}
      <AnimatePresence>
        {showWelcomeEffect && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <span className="text-8xl font-korean font-bold text-gradient">한국어</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl text-muted-foreground mt-4"
              >
                {language === 'ar' ? 'مرحباً بعودتك!' : '다시 오신 것을 환영합니다!'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 glass-effect border-b border-border/50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <span className="font-korean text-2xl font-bold text-gradient">한국어</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {language === 'ar' ? 'تعلم' : '배우기'}
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NotificationPanel />
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/reports')} 
              className="p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-300 relative group"
            >
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-card px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'ar' ? 'التقارير' : '보고서'}
              </span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')} 
              className="p-2.5 rounded-xl hover:bg-muted transition-all duration-300"
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()} 
              className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="container mx-auto px-4 py-6 max-w-5xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Welcome Section */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-8 p-8 rounded-3xl overflow-hidden group"
          whileHover={{ scale: 1.01 }}
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
          
          {/* Floating Shapes */}
          <motion.div
            className="absolute top-4 right-20 w-20 h-20 bg-white/10 rounded-full"
            animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-4 right-40 w-12 h-12 bg-white/10 rounded-lg"
            animate={{ y: [10, -10, 10], rotate: [0, -180, -360] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 right-10 w-8 h-8 bg-white/20 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="relative flex items-center gap-6">
            <div className="hidden sm:block">
              <motion.img 
                src={koreanCharacter} 
                alt="Korean Character" 
                className="w-36 h-auto drop-shadow-2xl"
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [-2, 2, -2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
            <div className="flex-1">
              <motion.div 
                className="flex items-center gap-2 mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/80 text-sm">{greeting}</p>
                <span className="text-white/50 text-xs">•</span>
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                  {language === 'ar' ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
                </span>
              </motion.div>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {language === 'ar' ? 'مرحباً بك!' : '환영합니다!'} 
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-2"
                >
                  👋
                </motion.span>
              </motion.h1>
              <motion.p 
                className="text-white/90 text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {language === 'ar' 
                  ? `🎯 لقد حفظت ${totalMemorized} من ${totalItems} عنصر - أحسنت!` 
                  : `🎯 ${totalItems}개 중 ${totalMemorized}개 암기 완료 - 잘하고 있어요!`}
              </motion.p>
              <div className="relative h-3 bg-white/20 rounded-full overflow-hidden max-w-sm">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalItems > 0 ? (totalMemorized / totalItems) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="stat-card text-center p-4 relative overflow-hidden group cursor-pointer"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Trophy className="w-6 h-6 mx-auto mb-2 text-white/90" />
            <motion.p 
              className="text-2xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              {totalPoints}
            </motion.p>
            <p className="text-xs text-white/70">{t('totalPoints')}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="stat-card stat-card-secondary text-center p-4 relative overflow-hidden group cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-6 h-6 mx-auto mb-2 text-white/90" />
            </motion.div>
            <p className="text-2xl font-bold text-white">{streakDays}</p>
            <p className="text-xs text-white/70">{language === 'ar' ? 'أيام متتالية' : '연속'}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="stat-card stat-card-success text-center p-4 relative overflow-hidden group cursor-pointer"
          >
            <Target className="w-6 h-6 mx-auto mb-2 text-white/90" />
            <p className="text-2xl font-bold text-white">{totalMemorized}</p>
            <p className="text-xs text-white/70">{language === 'ar' ? 'تم الحفظ' : '암기'}</p>
          </motion.div>
        </motion.div>

        {/* Streak Display */}
        <motion.div variants={itemVariants} className="mb-6">
          <StreakDisplay 
            streakDays={streakDays} 
            todayCompleted={todayCompleted} 
          />
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">{language === 'ar' ? 'الوصول السريع' : '빠른 접근'}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { path: '/review', icon: Layers, color: 'primary', label: language === 'ar' ? 'مراجعة' : '복습' },
              { path: '/games', icon: Gamepad2, color: 'pink-500', label: language === 'ar' ? 'الألعاب' : '게임' },
              { path: '/dictionary', icon: Book, color: 'blue-500', label: language === 'ar' ? 'القاموس' : '사전' },
              { path: '/daily-challenge', icon: Zap, color: 'amber-500', label: language === 'ar' ? 'التحدي اليومي' : '일일 도전' },
              { path: '/leaderboard', icon: Crown, color: 'yellow-500', label: language === 'ar' ? 'المتصدرين' : '리더보드' },
              { path: '/topik', icon: FileText, color: 'purple-500', label: 'TOPIK' },
              { path: '/stories', icon: BookStory, color: 'emerald-500', label: language === 'ar' ? 'القصص' : '스토리' },
              { path: '/ai-chat', icon: MessageSquare, color: 'rose-500', label: language === 'ar' ? 'محادثة AI' : 'AI 채팅' },
              { path: '/grammar', icon: Book, color: 'indigo-500', label: language === 'ar' ? 'القواعد' : '문법' },
              { path: '/pronunciation', icon: Mic, color: 'cyan-500', label: language === 'ar' ? 'النطق' : '발음' },
              { path: '/songs', icon: Music, color: 'fuchsia-500', label: language === 'ar' ? 'الأغاني' : '노래' },
              { path: '/reports', icon: BarChart3, color: 'teal-500', label: language === 'ar' ? 'التقارير' : '보고서' },
            ].map((item, index) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center relative z-10`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <p className="font-semibold text-sm relative z-10">{item.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Levels Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">{t('myLearning')}</h2>
            </div>
            <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
              {language === 'ar' ? `${levels.length} مستويات` : `${levels.length}개 레벨`}
            </span>
          </div>

          <div className="space-y-4">
            {levels.map((item, index) => {
              const isUnlocked = isLevelUnlocked(item.level);
              const progress = getLevelProgress(item.level);
              const isCompleted = progress >= 100;

              return (
                <motion.div
                  key={item.level}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isUnlocked ? 1.02 : 1, x: isUnlocked ? 10 : 0 }}
                  onClick={() => isUnlocked && navigate(`/learn/${item.level}`)}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    !isUnlocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'
                  }`}
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-card" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5`} />
                  
                  {/* Gradient accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />
                  
                  <div className="relative p-5 border border-border rounded-3xl">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                        whileHover={{ rotate: isUnlocked ? 5 : 0 }}
                      >
                        {isCompleted ? <Check className="w-7 h-7" /> : !isUnlocked ? <Lock className="w-6 h-6" /> : item.icon}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{t(item.titleKey)}</h3>
                          {isCompleted && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-0.5 rounded-full bg-korean-green/10 text-korean-green text-xs font-semibold flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              {t('completed')}
                            </motion.span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>

                        {/* Progress */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-sm font-semibold min-w-[3rem] text-end">{progress}%</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      {isUnlocked && (
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          className="self-center"
                        >
                          <ChevronRight className="w-6 h-6 text-muted-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Print Certificate */}
        {getLevelProgress(5) >= 80 && (
          <motion.div
            variants={itemVariants}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/certificate')}
              className="w-full p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Award className="w-6 h-6" />
              {language === 'ar' ? 'طباعة الشهادة' : '인증서 출력'}
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default Dashboard;
