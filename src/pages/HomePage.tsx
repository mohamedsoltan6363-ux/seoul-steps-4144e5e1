import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import personEgyptianFlag from '@/assets/person-egyptian-flag.png';
import personKoreanFlag from '@/assets/person-korean-flag.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles, ArrowRight, Globe, BookOpen, GraduationCap, Star, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
      return;
    }
    setMounted(true);
  }, [user, navigate]);

  const handleStart = () => {
    // Check if onboarding was seen
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const isRTL = language === 'ar';

  const floatingElements = [
    { delay: 0.2, left: '10%', top: '15%', icon: Star },
    { delay: 0.4, left: '85%', top: '20%', icon: Zap },
    { delay: 0.6, left: '15%', top: '70%', icon: Sparkles },
    { delay: 0.8, left: '80%', top: '65%', icon: Star },
  ];

  return (
    <div className="min-h-screen w-screen relative bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 overflow-x-hidden">
      {/* Animated Background Elements - Professional Floating Objects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Falling circles from top */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              width: 60 + (i % 3) * 30,
              height: 60 + (i % 3) * 30,
              backgroundColor: [
                'rgba(59, 130, 246, 0.08)',
                'rgba(147, 51, 234, 0.08)',
                'rgba(251, 146, 60, 0.08)',
              ][i % 3],
            }}
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: [0.08, 0.15, 0.08],
              y: ['-100px', 'calc(100vh + 100px)']
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear'
            }}
          />
        ))}
        
        {/* Floating icons from top */}
        {floatingElements.map((element, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute"
            style={{ left: element.left }}
            initial={{ opacity: 0, y: -60, x: 0 }}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              y: ['0px', '100px', '0px'],
            }}
            transition={{ 
              duration: 6 + i,
              repeat: Infinity,
              delay: element.delay,
              ease: 'easeInOut'
            }}
          >
            <element.icon className="w-16 h-16 text-blue-300" />
          </motion.div>
        ))}
        
        {/* Large background orbs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        
        {/* Additional accent orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center px-6 lg:px-12 py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-600/25">
            <span className="font-korean text-white font-bold text-xl">한</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-korean text-xl text-slate-800 font-semibold">한국어</span>
            <span className="text-slate-500 text-sm block">Korean Learning</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <LanguageSwitcher />
          <button
            onClick={() => navigate('/auth')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/10 backdrop-blur-sm border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-800/20 transition-all"
          >
            {isRTL ? 'تسجيل الدخول' : '로그인'}
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-8 lg:py-12 overflow-x-hidden">
        
        {/* Full Hero Section Container */}
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-8 lg:gap-12">
          
          {/* Top Text Section */}
          <motion.div
            className="text-center max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 backdrop-blur-sm border border-blue-200 shadow-sm mb-6 w-fit mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700 text-sm font-medium">
                {isRTL ? 'رحلة تعلم فريدة' : '독특한 학습 여행'}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {isRTL ? (
                <>
                  <span>من </span>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">مصر</span>
                  <span> إلى </span>
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">كوريا</span>
                </>
              ) : (
                <>
                  <span className="font-korean">이집트에서 </span>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-korean">한국</span>
                  <span className="font-korean">으로</span>
                </>
              )}
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {isRTL 
                ? 'تعلم اللغة الكورية بطريقة تفاعلية وممتعة. رحلة تعليمية شاملة تجمع بين الثقافتين المصرية والكورية'
                : '한국어를 배우는 가장 재미있는 방법을 발견하세요. 이집트와 한국의 문화를 함께 배우며 성장하세요'}
            </motion.p>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-3 gap-3 sm:gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: Globe, label: isRTL ? 'ثنائي اللغة' : '이중 언어' },
                { icon: Zap, label: isRTL ? 'تفاعلي' : '상호작용' },
                { icon: GraduationCap, label: isRTL ? 'معتمد' : '인증서' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-blue-100 hover:bg-white/90 transition-all"
                  whileHover={{ y: -4 }}
                >
                  <feature.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={handleStart}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/50 overflow-hidden transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <span className="relative flex items-center justify-center gap-2">
                {isRTL ? 'ابدأ الآن' : '시작하기'}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </span>
            </motion.button>
          </motion.div>

          {/* Flags Section - Now visible without scrolling */}
          <motion.div
            className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
            transition={{ delay: 0.6, duration: 0.9 }}
          >
            {/* Egyptian Flag */}
            <motion.div
              className="flex flex-col items-center gap-3"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  src={personEgyptianFlag}
                  alt="Person with Egyptian Flag"
                  className="w-24 sm:w-32 lg:w-48 h-auto object-contain drop-shadow-2xl filter brightness-110"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, type: 'spring' }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <span className="text-3xl sm:text-4xl block mb-2">🇪🇬</span>
                <p className="text-slate-700 font-semibold">
                  {isRTL ? 'مصر' : 'Egypt'}
                </p>
              </motion.div>
            </motion.div>

            {/* Decorative divider on desktop */}
            <motion.div
              className="hidden lg:flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
              <Star className="w-6 h-6 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
            </motion.div>

            {/* Korean Flag */}
            <motion.div
              className="flex flex-col items-center gap-3"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8, type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              >
                <motion.img
                  src={personKoreanFlag}
                  alt="Person with Korean Flag"
                  className="w-24 sm:w-32 lg:w-48 h-auto object-contain drop-shadow-2xl filter brightness-110"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center"
              >
                <span className="text-3xl sm:text-4xl block mb-2">🇰🇷</span>
                <p className="text-slate-700 font-semibold font-korean">
                  {isRTL ? 'كوريا' : '한국'}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-20 text-center py-6 px-4 text-slate-500 text-xs sm:text-sm border-t border-blue-100/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p>© 2024 Korean Learning Platform</p>
      </motion.footer>
    </div>
  );
};

export default HomePage;
