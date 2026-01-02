import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Gamepad2, 
  GraduationCap,
  ArrowRight,
  Volume2,
  Star
} from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
    setMounted(true);
  }, [user, navigate]);

  const isRTL = language === 'ar';

  const playKoreanPhrase = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  const features = [
    {
      icon: BookOpen,
      title: isRTL ? 'الهانغول' : '한글',
      subtitle: isRTL ? '40 حرف كوري' : '40 한글 문자',
      korean: 'ㄱ ㄴ ㄷ ㄹ',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Star,
      title: isRTL ? 'المفردات' : '어휘',
      subtitle: isRTL ? '+130 كلمة' : '130+ 단어',
      korean: '사랑 행복',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Gamepad2,
      title: isRTL ? 'الألعاب' : '게임',
      subtitle: isRTL ? 'تعلم بالمرح' : '재미있게 배우기',
      korean: '재미있어요',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: GraduationCap,
      title: isRTL ? 'شهادة' : '수료증',
      subtitle: isRTL ? 'احصل على شهادتك' : '인증서 받기',
      korean: '축하합니다',
      color: 'from-blue-500 to-indigo-500',
    },
  ];

  const koreanTexts = [
    { text: '안녕하세요', meaning: isRTL ? 'مرحباً' : 'Hello' },
    { text: '감사합니다', meaning: isRTL ? 'شكراً' : 'Thank you' },
    { text: '사랑해요', meaning: isRTL ? 'أحبك' : 'I love you' },
  ];

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden lg:overflow-hidden overflow-y-auto">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Gradient Orbs - Subtle */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-6 lg:px-12 py-4 lg:py-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
            <span className="font-korean text-white font-bold text-lg">한</span>
          </div>
          <span className="font-korean text-xl text-white font-semibold hidden sm:block">한국어</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <LanguageSwitcher />
          <button
            onClick={() => navigate('/auth')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm font-medium hover:bg-white/10 transition-all"
          >
            {t('login')}
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 py-6 lg:py-0 gap-8 lg:gap-16">
        {/* Left Side - Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 max-w-xl text-center lg:text-start"
        >
          {/* Korean Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-white/80 text-sm">
              {isRTL ? 'تعلم بسهولة' : '쉽게 배우세요'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {isRTL ? (
              <>
                <span>تعلم </span>
                <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">اللغة الكورية</span>
                <span> بطريقة ممتعة</span>
              </>
            ) : (
              <>
                <span className="font-korean">한국어를 </span>
                <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent font-korean">재미있게</span>
                <span className="font-korean"> 배우세요</span>
              </>
            )}
          </h1>

          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            {isRTL 
              ? 'منصة تفاعلية متكاملة لتعلم اللغة الكورية من البداية حتى الاحتراف. دروس، ألعاب، قصص، واختبارات TOPIK.'
              : '처음부터 고급까지 한국어를 배우는 종합적인 인터랙티브 플랫폼. 레슨, 게임, 이야기, TOPIK 시험.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300"
            >
              <span>{t('startLearning')}</span>
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{isRTL ? 'اختبار TOPIK' : 'TOPIK 시험'}</span>
            </motion.button>
          </div>

          {/* Korean Phrases */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            {koreanTexts.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => playKoreanPhrase(item.text)}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300"
              >
                <Volume2 className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-korean text-white">{item.text}</span>
                <span className="text-white/40 text-sm">({item.meaning})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 gap-4 w-full max-w-md lg:max-w-lg"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
              <p className="text-white/50 text-sm mb-3">{feature.subtitle}</p>

              {/* Korean Text */}
              <div className="font-korean text-white/30 text-sm group-hover:text-white/50 transition-colors">
                {feature.korean}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer - Minimal */}
      <footer className="relative z-10 px-6 lg:px-12 py-4 flex justify-between items-center text-white/30 text-sm">
        <span>{isRTL ? '© 2024 منصة تعلم الكورية' : '© 2024 Korean Learning'}</span>
        <div className="flex items-center gap-2">
          <span className="font-korean text-lg">🇰🇷</span>
          <span className="hidden sm:inline">{isRTL ? 'صُنع بحب في مصر' : 'Made with ♥ in Egypt'}</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
