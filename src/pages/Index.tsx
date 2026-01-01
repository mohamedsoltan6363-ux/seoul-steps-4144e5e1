import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles } from 'lucide-react';
import koreanCharacter from '@/assets/korean-character.png';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCharacter, setShowCharacter] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
    const timer1 = setTimeout(() => setShowCharacter(true), 300);
    const timer2 = setTimeout(() => setShowGreeting(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [user, navigate]);

  const playGreeting = () => {
    const text = language === 'ar'
      ? 'مرحباً! هيا نتعلم اللغة الكورية!'
      : '안녕하세요! 한국어를 배워요!';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ar' ? 'ar' : 'ko-KR';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(playGreeting, 500);
      return () => clearTimeout(timer);
    }
  }, [showGreeting, language]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Cherry Blossom Petals Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <span className="text-korean-pink text-2xl">🌸</span>
          </div>
        ))}
      </div>

      {/* Decorative Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-korean-pink/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-korean-gold/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-2">
          <span className="font-korean text-2xl text-white font-bold">한국어</span>
          <Sparkles className="w-5 h-5 text-korean-gold animate-pulse" />
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-16 min-h-[85vh]">
        {/* Animated Korean Character */}
        <div className={`transition-all duration-1000 ease-out ${showCharacter ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-75'}`}>
          <div className="relative">
            {/* Glow effect behind character */}
            <div className="absolute inset-0 bg-gradient-to-br from-korean-pink/50 to-primary/50 rounded-full blur-3xl scale-150 animate-pulse-glow" />
            
            {/* Character Image */}
            <img
              src={koreanCharacter}
              alt="Korean Learning Mascot"
              className="relative z-10 w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-float cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={playGreeting}
            />
            
            {/* Click hint */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white/70 text-xs animate-bounce">
              {language === 'ar' ? 'اضغط للاستماع' : '클릭하세요'}
            </div>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className={`mt-4 transition-all duration-700 delay-500 ${showGreeting ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="relative glass-effect px-6 py-3 rounded-2xl border border-white/30 shadow-xl">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 backdrop-blur-xl rotate-45 border-l border-t border-white/30" />
            <p className={`${language === 'ar' ? '' : 'font-korean'} text-lg md:text-xl text-white font-medium`}>
              {language === 'ar' ? 'مرحباً! سعيدون بوجودك 👋' : '안녕하세요! 반가워요! 👋'}
            </p>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className={`text-center mt-8 mb-8 transition-all duration-1000 delay-300 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className={`${language === 'ar' ? '' : 'font-korean'} text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg`}>
            <span className="bg-gradient-to-r from-white via-korean-pink-light to-white bg-clip-text text-transparent">
              {language === 'ar' ? 'هيا نتعلم الكورية!' : '한국어를 배워요!'}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">{t('welcome')}</p>
          <p className="text-lg text-white/70">{t('welcomeSubtitle')}</p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-1000 delay-500 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => navigate('/auth')}
            className="flex-1 py-4 px-8 rounded-2xl bg-white text-primary font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            {t('startLearning')}
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="flex-1 py-4 px-8 rounded-2xl border-2 border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            {t('login')}
          </button>
        </div>

        {/* Features Grid */}
        <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl transition-all duration-1000 delay-700 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { icon: '🔤', label: language === 'ar' ? 'الحروف الكورية' : '한글', sublabel: language === 'ar' ? '40 حرف' : '40자' },
            { icon: '📚', label: language === 'ar' ? 'المفردات' : '어휘', sublabel: language === 'ar' ? '+130 كلمة' : '130+ 단어' },
            { icon: '💬', label: language === 'ar' ? 'الجمل' : '문장', sublabel: language === 'ar' ? '+90 جملة' : '90+ 문장' },
            { icon: '🎓', label: language === 'ar' ? 'شهادة' : '수료증', sublabel: language === 'ar' ? 'معتمدة' : '인증서' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="glass-effect p-4 rounded-2xl text-center border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-4xl mb-2 block group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
              <span className="text-white font-semibold block">{item.label}</span>
              <span className="text-white/60 text-sm">{item.sublabel}</span>
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <p className={`mt-8 text-white/50 text-sm text-center transition-all duration-1000 delay-1000 ${showCharacter ? 'opacity-100' : 'opacity-0'}`}>
          {language === 'ar' 
            ? '🌸 تعلم اللغة الكورية بسهولة ومتعة مع دروس تفاعلية' 
            : '🌸 쉽고 재미있게 한국어를 배우세요'}
        </p>
      </main>
    </div>
  );
};

export default Index;
