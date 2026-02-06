import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import personEgyptianFlag from '@/assets/person-egyptian-flag.png';
import personKoreanFlag from '@/assets/person-korean-flag.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles, ArrowRight, BookOpen, Users, Zap, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    setMounted(true);
  }, [user, navigate]);

  const handleStart = () => {
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center px-6 lg:px-16 py-6 border-b border-slate-700/30 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <span className="font-korean text-white font-bold text-xl">한</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-korean text-xl text-white font-semibold">Seoul Steps</span>
            <span className="text-slate-400 text-sm block">{isRTL ? 'تعلم اللغة الكورية' : 'Korean Learning'}</span>
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
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-slate-600 text-white text-sm font-medium hover:bg-white/20 transition-all"
          >
            {isRTL ? 'تسجيل الدخول' : '로그인'}
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 lg:px-8 py-12 lg:py-0">
        
        {/* Content Container */}
        <div className="max-w-7xl w-full">
          {/* Top Section - Hero */}
          <motion.div
            className="text-center mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-slate-200 text-sm font-medium">
                {isRTL ? '🌍 رحلة تعلم عالمية فريدة' : '🌍 Unlock Your Korean Journey'}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {isRTL ? (
                <>تعلم اللغة الكورية <br /> <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">من قلب مصر</span></>
              ) : (
                <>Master Korean <br /> <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">From Anywhere</span></>
              )}
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {isRTL 
                ? 'ابدأ رحلتك نحو إتقان اللغة الكورية مع منصة تعليمية احترافية تجمع بين الثقافات والتعليم العالي الجودة'
                : 'Begin your journey to fluency with our premium platform designed for learners of all levels'}
            </motion.p>

            <motion.button
              onClick={handleStart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-lg shadow-xl shadow-rose-500/50 overflow-hidden hover:shadow-2xl hover:shadow-rose-500/60 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="relative flex items-center gap-2">
                {isRTL ? 'ابدأ الآن' : 'Get Started'}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </span>
            </motion.button>
          </motion.div>

          {/* Middle Section - Characters */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20 lg:mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {/* Egypt Section */}
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -50 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.img
                src={personEgyptianFlag}
                alt="Egyptian learner"
                className="w-full max-w-xs h-auto object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <motion.div className="mt-4 text-center">
                <p className="text-2xl font-bold text-white">{isRTL ? '🇪🇬 مصر' : '🇪🇬 Egypt'}</p>
                <p className="text-slate-400 text-sm mt-2">{isRTL ? 'من قلب الشرق الأوسط' : 'From the heart of culture'}</p>
              </motion.div>
            </motion.div>

            {/* Korea Section */}
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 50 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.img
                src={personKoreanFlag}
                alt="Korean learner"
                className="w-full max-w-xs h-auto object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
              <motion.div className="mt-4 text-center">
                <p className="text-2xl font-bold text-white font-korean">{isRTL ? '🇰🇷 كوريا' : '🇰🇷 Korea'}</p>
                <p className="text-slate-400 text-sm mt-2 font-korean">{isRTL ? 'لغة وثقافة مميزة' : '한국의 아름다운 언어'}</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ delay: 1 }}
          >
            {[
              { icon: BookOpen, label: isRTL ? 'دروس تفاعلية' : 'Interactive Lessons', desc: isRTL ? 'تعلم متقدم وفعال' : 'Engaging content' },
              { icon: Users, label: isRTL ? 'مجتمع عالمي' : 'Global Community', desc: isRTL ? 'تواصل مع متعلمين' : 'Connect & learn' },
              { icon: Zap, label: isRTL ? 'تقدم سريع' : 'Fast Progress', desc: isRTL ? 'نتائج ملموسة بسرعة' : 'Proven methods' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-6 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 backdrop-blur hover:border-rose-500/50 transition-all hover:bg-gradient-to-br hover:from-slate-700/70 hover:to-slate-800/70"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <feature.icon className="w-8 h-8 text-rose-400 mb-3 group-hover:text-rose-300 transition-colors" />
                <h3 className="text-white font-bold text-lg mb-2">{feature.label}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-3 gap-4 lg:gap-8 text-center py-12 border-t border-b border-slate-700/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ delay: 1.3 }}
          >
            {[
              { value: '50K+', label: isRTL ? 'متعلم نشط' : 'Active Learners' },
              { value: '1000+', label: isRTL ? 'درس متقدم' : 'Premium Lessons' },
              { value: '15+', label: isRTL ? 'لغات' : 'Languages' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + i * 0.1 }}>
                <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-700/30 backdrop-blur-sm px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-slate-400 text-sm">
          <span>© 2024 Seoul Steps. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</span>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <span>{isRTL ? 'صنع بحب من' : 'Made with'}</span>
            <span className="text-rose-500">♥</span>
            <span>{isRTL ? 'فريق Seoul Steps' : 'Seoul Steps Team'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
