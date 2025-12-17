import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
    const timer = setTimeout(() => setShowCharacter(true), 500);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const playGreeting = () => {
    const utterance = new SpeechSynthesisUtterance('안녕하세요');
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (showCharacter) {
      const timer = setTimeout(playGreeting, 1000);
      return () => clearTimeout(timer);
    }
  }, [showCharacter]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-korean-pink/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-korean-gold/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-2">
          <span className="font-korean text-2xl text-white font-bold">한국어</span>
          <Sparkles className="w-5 h-5 text-korean-gold" />
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20 min-h-[80vh]">
        {/* Animated Character */}
        <div className={`mb-8 transition-all duration-1000 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-korean-pink to-secondary flex items-center justify-center animate-float shadow-2xl">
            <span className="font-korean text-5xl md:text-6xl text-white">👋</span>
          </div>
        </div>

        {/* Greeting */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-korean text-5xl md:text-7xl font-bold text-white mb-4 animate-pulse-glow inline-block">
            안녕하세요!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">{t('welcome')}</p>
          <p className="text-lg text-white/70">{t('welcomeSubtitle')}</p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-1000 delay-500 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => navigate('/auth')}
            className="flex-1 py-4 px-8 rounded-2xl bg-white text-primary font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {t('startLearning')}
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="flex-1 py-4 px-8 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300"
          >
            {t('login')}
          </button>
        </div>

        {/* Features */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl transition-all duration-1000 delay-700 ${showCharacter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { icon: '🔤', label: language === 'ar' ? 'الحروف الكورية' : '한글' },
            { icon: '📚', label: language === 'ar' ? 'المفردات' : '어휘' },
            { icon: '💬', label: language === 'ar' ? 'الجمل' : '문장' },
            { icon: '🎓', label: language === 'ar' ? 'شهادة' : '수료증' },
          ].map((item, i) => (
            <div key={i} className="glass-effect p-4 rounded-xl text-center border border-white/20">
              <span className="text-3xl mb-2 block">{item.icon}</span>
              <span className="text-white/90 text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
