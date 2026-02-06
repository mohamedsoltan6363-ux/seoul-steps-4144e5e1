import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ConnectionLine from '@/components/maps/ConnectionLine';
import personEgyptianFlag from '@/assets/person-egyptian-flag.png';
import personKoreanFlag from '@/assets/person-korean-flag.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles, ArrowRight, Globe, BookOpen, GraduationCap } from 'lucide-react';

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

  return (
    <div className="min-h-screen h-screen overflow-hidden relative bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50">
      {/* Sky background with subtle clouds */}
      <div className="absolute inset-0">
        {/* Sun */}
        <motion.div
          className="absolute top-8 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400"
          style={{
            boxShadow: '0 0 60px rgba(251, 191, 36, 0.5), 0 0 120px rgba(251, 191, 36, 0.3)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring' }}
        />
        
        {/* Animated clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: 100 + Math.random() * 150,
              height: 40 + Math.random() * 30,
              top: `${10 + i * 8}%`,
              left: `${-20 + i * 25}%`,
            }}
            animate={{ 
              x: [0, 50, 0],
            }}
            transition={{ 
              duration: 15 + i * 3, 
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
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
      <main className="relative z-20 flex-1 h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center px-4 lg:px-8">
        
        {/* Egypt Map Section */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center relative"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -100 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative">
            <img 
              src="/images/egypt-map.png" 
              alt="Egypt Map" 
              className="w-64 sm:w-80 lg:w-[400px] h-auto object-contain drop-shadow-2xl"
            />
            
            {/* Person with Egyptian flag */}
            <motion.img
              src={personEgyptianFlag}
              alt="Person with Egyptian Flag"
              className="absolute bottom-4 right-4 w-24 sm:w-32 lg:w-44 h-auto object-contain drop-shadow-2xl z-10"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          </div>
          
          {/* Egypt label */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <span className="text-2xl">🇪🇬</span>
            <p className="text-slate-700 font-semibold mt-1">
              {isRTL ? 'مصر' : 'Egypt'}
            </p>
          </motion.div>
        </motion.div>

        {/* Center Section - Title, Connection Line, CTA */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center py-6 lg:py-0 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 50 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200 shadow-lg mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-slate-700 text-sm font-medium">
              {isRTL ? 'رحلة تعلم فريدة' : '독특한 학습 여행'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-800 mb-4 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {isRTL ? (
              <>
                <span>رحلة واحدة... بين </span>
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">مصر</span>
                <span> و</span>
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">كوريا</span>
              </>
            ) : (
              <>
                <span className="font-korean">하나의 여정... </span>
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent font-korean">이집트</span>
                <span className="font-korean">와 </span>
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent font-korean">한국</span>
              </>
            )}
          </motion.h1>

          <motion.p
            className="text-slate-600 text-center max-w-md mb-6 text-sm lg:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {isRTL 
              ? 'انطلق في رحلة تعليمية فريدة لتعلم اللغة الكورية، من قلب مصر إلى قلب كوريا الجنوبية'
              : '이집트의 중심에서 한국의 중심까지, 한국어를 배우는 독특한 교육 여정을 시작하세요'}
          </motion.p>

          {/* Connection Line */}
          <ConnectionLine className="w-full max-w-xs h-16 mb-6" />

          {/* Features */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {[
              { icon: Globe, label: isRTL ? 'ثنائي اللغة' : '이중 언어' },
              { icon: BookOpen, label: isRTL ? 'دروس تفاعلية' : '대화형 수업' },
              { icon: GraduationCap, label: isRTL ? 'شهادة معتمدة' : '인증서' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200"
              >
                <feature.icon className="w-4 h-4 text-rose-500" />
                <span className="text-slate-700 text-xs font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={handleStart}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-lg shadow-xl shadow-rose-500/30 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <span className="relative flex items-center gap-3">
              {isRTL ? 'ابدأ رحلتك الآن' : '지금 여정을 시작하세요'}
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </span>
          </motion.button>

          {/* Korean greeting */}
          <motion.p
            className="mt-4 font-korean text-rose-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
          >
            한국어 학습 여행이 여기서 시작됩니다
          </motion.p>
        </motion.div>

        {/* South Korea Map Section */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 100 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative">
            <img 
              src="/images/korea-map.png" 
              alt="South Korea Map" 
              className="w-56 sm:w-72 lg:w-[380px] h-auto object-contain drop-shadow-2xl"
            />
            
            {/* Person with Korean flag */}
            <motion.img
              src={personKoreanFlag}
              alt="Person with Korean Flag"
              className="absolute bottom-4 left-4 w-24 sm:w-32 lg:w-44 h-auto object-contain drop-shadow-2xl z-10"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: -5 }}
            />
          </div>
          
          {/* Korea label */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
          >
            <span className="text-2xl">🇰🇷</span>
            <p className="text-slate-700 font-semibold mt-1 font-korean">
              {isRTL ? 'كوريا' : '한국'}
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-6 py-3 flex justify-between items-center text-slate-500 text-xs">
        <span>© 2024 Korean Learning Platform</span>
        <div className="flex items-center gap-2">
          <span>{isRTL ? 'صنع بحب' : 'Made with'}</span>
          <span className="text-rose-500">♥</span>
          <span>{isRTL ? 'محمد أيمن' : 'Mohamed Ayman'}</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
