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
    <div className="min-h-screen h-screen overflow-hidden relative bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50">
      {/* Animated floating elements in background */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: element.left, top: element.top }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.15, y: [0, -30, 0] }}
            transition={{ 
              duration: 4 + i,
              repeat: Infinity,
              delay: element.delay,
              ease: 'easeInOut'
            }}
          >
            <element.icon className="w-12 h-12 text-blue-400" />
          </motion.div>
        ))}
        
        {/* Subtle gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center px-6 lg:px-12 py-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
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
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12 lg:py-0">
        
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12 lg:mb-16 max-w-4xl"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
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
            transition={{ delay: 0.8 }}
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
            transition={{ delay: 1 }}
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
            transition={{ delay: 1.2 }}
          >
            <span className="relative flex items-center justify-center gap-2">
              {isRTL ? 'ابدأ الآن' : '시작하기'}
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </span>
          </motion.button>
        </motion.div>

        {/* Flags Section */}
        <motion.div
          className="flex items-end justify-center gap-8 sm:gap-12 lg:gap-20 w-full max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {/* Egyptian Flag */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ y: -8 }}
          >
            <motion.img
              src={personEgyptianFlag}
              alt="Person with Egyptian Flag"
              className="w-32 sm:w-40 lg:w-56 h-auto object-contain drop-shadow-2xl mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8, type: 'spring' }}
            />
            <span className="text-3xl sm:text-4xl mb-2">🇪🇬</span>
            <p className="text-slate-700 font-semibold">
              {isRTL ? 'مصر' : 'Egypt'}
            </p>
          </motion.div>

          {/* Korean Flag */}
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ y: -8 }}
          >
            <motion.img
              src={personKoreanFlag}
              alt="Person with Korean Flag"
              className="w-32 sm:w-40 lg:w-56 h-auto object-contain drop-shadow-2xl mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
            />
            <span className="text-3xl sm:text-4xl mb-2">🇰🇷</span>
            <p className="text-slate-700 font-semibold font-korean">
              {isRTL ? 'كوريا' : '한국'}
            </p>
          </motion.div>
        </motion.div>
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
