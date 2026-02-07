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
      <main className="relative z-20 w-full flex flex-col items-center justify-start px-4 py-8 lg:py-12 overflow-x-hidden">
        
        {/* Full Hero Section Container */}
        <div className="flex flex-col-reverse lg:flex-col items-center w-full max-w-7xl mx-auto gap-2 lg:gap-8 mb-16 lg:mb-24">
          
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

          {/* Flags Section - Positioned at top with premium animations */}
          <motion.div
            className="w-full flex flex-row items-start justify-center gap-4 sm:gap-6 lg:gap-12 mb-8 lg:mb-16 order-first lg:order-last"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -60 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Egyptian Flag */}
            <motion.div
              className="flex flex-col items-center gap-2"
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, x: -60, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 80, damping: 15 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  src={personEgyptianFlag}
                  alt="Person with Egyptian Flag"
                  className="w-20 sm:w-24 lg:w-40 h-auto object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                  initial={{ scale: 0.6, opacity: 0, rotateZ: -15 }}
                  animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                  transition={{ delay: 0.7, duration: 1, type: 'spring', stiffness: 80 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <span className="text-2xl sm:text-3xl block">🇪🇬</span>
              </motion.div>
            </motion.div>

            {/* Decorative element between */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 100 }}
            >
              <div className="hidden lg:block relative">
                <div className="w-16 h-16 rounded-full border-2 border-blue-300 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Star className="w-6 h-6 text-blue-500" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Korean Flag */}
            <motion.div
              className="flex flex-col items-center gap-2"
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, x: 60, y: -40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 1, type: 'spring', stiffness: 80, damping: 15 }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              >
                <motion.img
                  src={personKoreanFlag}
                  alt="Person with Korean Flag"
                  className="w-20 sm:w-24 lg:w-40 h-auto object-contain drop-shadow-2xl filter brightness-110 contrast-110"
                  initial={{ scale: 0.6, opacity: 0, rotateZ: 15 }}
                  animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
                  transition={{ delay: 0.7, duration: 1, type: 'spring', stiffness: 80 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center"
              >
                <span className="text-2xl sm:text-3xl block">🇰🇷</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section
          className="w-full max-w-7xl mx-auto mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '0px 0px -200px 0px' }}
        >
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-center text-slate-800 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {isRTL ? 'لماذا تختار منصتنا؟' : '왜 우리 플랫폼을 선택할까요?'}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: isRTL ? 'دروس تفاعلية' : '대화형 수업',
                desc: isRTL ? 'تعلم من خلال محتوى تفاعلي مصمم بعناية' : '신중하게 설계된 대화형 콘텐츠를 통해 학습하세요'
              },
              {
                icon: GraduationCap,
                title: isRTL ? 'معلمون محترفون' : '전문 강사진',
                desc: isRTL ? 'تعليم من قبل متخصصين في اللغة الكورية' : '한국어 전문가들로부터 배우세요'
              },
              {
                icon: Zap,
                title: isRTL ? 'تقدم سريع' : '빠른 진도',
                desc: isRTL ? 'تقدم ملحوظ في مستوى اللغة الكورية' : '한국어 수준을 빠르게 향상시키세요'
              },
              {
                icon: Globe,
                title: isRTL ? 'مجتمع عالمي' : '글로벌 커뮤니티',
                desc: isRTL ? 'تواصل مع متعلمين من جميع أنحاء العالم' : '전 세계 학습자들과 연결하세요'
              },
              {
                icon: Star,
                title: isRTL ? 'شهادات معتمدة' : '인증 자격증',
                desc: isRTL ? 'احصل على شهادة معترف بها دولياً' : '국제적으로 인정받는 인증서를 획득하세요'
              },
              {
                icon: Sparkles,
                title: isRTL ? 'محتوى حصري' : '독점 콘텐츠',
                desc: isRTL ? 'وصول حصري للمحتوى الثقافي الكوري الحصري' : '독점적인 한국 문화 콘텐츠에 접근하세요'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 hover:bg-white/80 transition-all duration-300 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                  >
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="w-full max-w-5xl mx-auto mb-16 lg:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '0px 0px -200px 0px' }}
        >
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 sm:p-12 lg:p-16 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Background pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />

            <div className="relative z-10 text-center text-white max-w-2xl mx-auto">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                {isRTL 
                  ? 'ابدأ رحلتك التعليمية اليوم'
                  : '오늘부터 학습 여정을 시작하세요'}
              </motion.h2>

              <motion.p
                className="text-lg sm:text-xl text-white/90 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                {isRTL
                  ? 'انضم إلى آلاف المتعلمين حول العالم وتعلم اللغة الكورية بطريقة ممتعة وفعالة'
                  : '전 세계 수천 명의 학습자와 함께 재미있고 효과적인 방식으로 한국어를 배우세요'}
              </motion.p>

              <motion.button
                onClick={handleStart}
                className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRTL ? 'ابدأ الآن مجاناً' : '지금 무료로 시작하기'}
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
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
