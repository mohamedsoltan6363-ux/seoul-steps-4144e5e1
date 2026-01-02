import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Heart, Rocket, Globe, Zap } from 'lucide-react';

const Splash: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent && !audioPlayed) {
      const timer = setTimeout(() => {
        playKoreanGreeting();
        setAudioPlayed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showContent, audioPlayed]);

  const playKoreanGreeting = () => {
    const text = '안녕하세요! 한국어 학습 플랫폼에 오신 것을 환영합니다!';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  const handleStart = () => {
    localStorage.setItem('splash_seen', 'true');
    navigate('/home');
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Korean Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['한', '국', '어', '가', '나', '다', '라', '마'].map((char, i) => (
          <motion.span
            key={i}
            className="absolute text-white/10 font-korean text-4xl"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 max-w-2xl w-full"
          >
            {/* Main Card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Logo */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="font-korean text-5xl md:text-6xl text-white font-bold tracking-tight">
                    한국어
                  </span>
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto max-w-xs"
                />
              </motion.div>

              {/* Welcome Text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <h1 className={`text-2xl md:text-3xl font-bold text-white mb-4 ${isRTL ? '' : 'font-korean'}`}>
                  {isRTL ? 'مرحباً بك في منصة تعلم اللغة الكورية' : '한국어 학습 플랫폼에 오신 것을 환영합니다'}
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">
                  {isRTL 
                    ? 'منصة تفاعلية شاملة لتعلم اللغة الكورية من الصفر حتى الاحتراف، مع دروس تفاعلية وتمارين متنوعة وألعاب تعليمية ممتعة.'
                    : '처음부터 고급까지 한국어를 배우는 종합적인 인터랙티브 플랫폼입니다.'}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                {[
                  { icon: Globe, label: isRTL ? 'ثنائي اللغة' : '이중 언어' },
                  { icon: Zap, label: isRTL ? 'تفاعلي' : '인터랙티브' },
                  { icon: Rocket, label: isRTL ? 'احترافي' : '전문적' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                    <item.icon className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                    <span className="text-white/80 text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Developer Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {isRTL ? 'محمد أيمن' : 'Mohamed Ayman'}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {isRTL ? 'مطور ومصمم المنصة' : '플랫폼 개발자 및 디자이너'}
                    </p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {isRTL 
                    ? 'تم تصميم وبناء وبرمجة هذه المنصة بشغف وحب لتقديم تجربة تعليمية فريدة ومميزة. نسعى لجعل تعلم اللغة الكورية متاحاً وممتعاً للجميع.'
                    : '이 플랫폼은 독특하고 특별한 학습 경험을 제공하기 위해 열정과 사랑으로 설계되고 제작되었습니다.'}
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mb-8"
              >
                <p className="text-white/50 text-xs mb-3">
                  {isRTL ? 'تم البناء باستخدام' : '사용된 기술'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'].map((tech, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>{isRTL ? 'ابدأ الآن' : '시작하기'}</span>
                <Rocket className="w-5 h-5" />
              </motion.button>

              {/* Made with love */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center mt-6 text-white/40 text-sm flex items-center justify-center gap-2"
              >
                <span>{isRTL ? 'صُنع بـ' : 'Made with'}</span>
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>{isRTL ? 'في مصر' : 'in Egypt'}</span>
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Splash;
