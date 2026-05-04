import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import personEgyptianFlag from '@/assets/person-egyptian-flag.png';
import personKoreanFlag from '@/assets/person-korean-flag.png';
import cultureBridge from '@/assets/culture-bridge.png';
import HomeIntroModal from '@/components/HomeIntroModal';
import SakuraParticles from '@/components/SakuraParticles';
import RisingBubbles from '@/components/RisingBubbles';
import WaveDivider from '@/components/WaveDivider';
import TypewriterText from '@/components/TypewriterText';
import EgyptMap from '@/components/maps/EgyptMap';
import SouthKoreaMap from '@/components/maps/SouthKoreaMap';
import {
  Sparkles, ArrowRight, Globe, BookOpen, GraduationCap, Star, Zap,
  Users, Trophy, Brain, ChevronDown, Code, Heart, Play, MessageCircle,
  Award, Target, Gamepad2, Music, BookMarked, Mic
} from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────────
const AnimatedCounter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Multilingual Welcome Rotator ─────────────────────────────────
const welcomeTexts = [
  { text: 'مرحباً بكم', lang: 'العربية' },
  { text: '안녕하세요', lang: '한국어' },
  { text: 'Welcome', lang: 'English' },
  { text: 'Bienvenue', lang: 'Français' },
  { text: 'Willkommen', lang: 'Deutsch' },
  { text: 'ようこそ', lang: '日本語' },
  { text: '欢迎', lang: '中文' },
  { text: 'Bienvenido', lang: 'Español' },
];

const MultilingualWelcome: React.FC = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex(p => (p + 1) % welcomeTexts.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(220,80%,55%)] to-[hsl(340,75%,55%)] bg-clip-text text-transparent">
            {welcomeTexts[index].text}
          </span>
          <span className="text-xs text-muted-foreground ml-2">{welcomeTexts[index].lang}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── Social Media Buttons ─────────────────────────────────────────
const socialLinks = [
  { icon: '𝕏', color: 'hsl(220, 10%, 20%)', label: 'X / Twitter' },
  { icon: 'in', color: 'hsl(210, 80%, 45%)', label: 'LinkedIn' },
  { icon: 'fb', color: 'hsl(220, 65%, 50%)', label: 'Facebook' },
  { icon: 'ig', color: 'hsl(340, 75%, 55%)', label: 'Instagram' },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN HOMEPAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const isRTL = language === 'ar';

  useEffect(() => {
    if (user) { navigate('/dashboard'); return; }
    setMounted(true);
    const hasSeenIntro = localStorage.getItem('homepage_intro_seen');
    if (!hasSeenIntro) setTimeout(() => setShowIntro(true), 1500);
  }, [user, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleStart = () => {
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    navigate(hasSeenOnboarding ? '/auth' : '/onboarding');
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
    localStorage.setItem('homepage_intro_seen', 'true');
  };

  const typewriterTexts = isRTL
    ? ['تعلم الكورية بسهولة...', 'من الحروف إلى المحادثة...', 'رحلة ممتعة وتفاعلية...', '6 مستويات تعليمية...']
    : ['쉽게 한국어를 배우세요...', '글자부터 대화까지...', '재미있고 인터랙티브한 여정...', '6단계 학습 과정...'];

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ═══ GLOBAL EFFECTS ═══ */}
      <SakuraParticles />
      <RisingBubbles />

      {/* Animated Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'linear-gradient(180deg, #f8faff 0%, #f0f4ff 20%, #fdf2f8 50%, #fef9f0 75%, #f0fdf4 100%)'
      }} />

      {/* Animated Grid */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          y: parallaxY2,
        }}
      />

      {/* Floating Gradient Orbs with Parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[2]">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsla(220, 85%, 55%, 0.1), transparent 70%)', top: '-15%', left: '-10%', y: parallaxY1 }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsla(340, 80%, 60%, 0.08), transparent 70%)', bottom: '5%', right: '-8%', y: parallaxY1 }}
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsla(270, 70%, 60%, 0.07), transparent 70%)', top: '35%', left: '50%' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsla(35, 95%, 60%, 0.06), transparent 70%)', top: '60%', left: '20%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 4) * 2,
              height: 3 + (i % 4) * 2,
              background: ['hsla(220,80%,55%,0.4)', 'hsla(340,75%,55%,0.35)', 'hsla(35,95%,55%,0.35)', 'hsla(270,60%,55%,0.35)', 'hsla(155,60%,50%,0.3)'][i % 5],
              left: `${8 + i * 9}%`,
              top: `${15 + (i % 4) * 22}%`,
            }}
            animate={{ y: [0, -25, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* ═══ TRANSPARENT NAVBAR ═══ */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/[0.03]'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex justify-between items-center">
          {/* Logo with 3D Aurora Effect */}
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.03 }}>
            <motion.div
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden"
              animate={{ boxShadow: ['0 0 15px hsla(220,80%,55%,0.3)', '0 0 30px hsla(270,60%,55%,0.4)', '0 0 15px hsla(340,75%,55%,0.3)', '0 0 15px hsla(220,80%,55%,0.3)'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,80%,50%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)] animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] flex items-center justify-center">
                <span className="font-korean text-white font-black text-lg relative z-10">한</span>
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-lg font-black bg-gradient-to-r from-[hsl(220,80%,50%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)] bg-clip-text text-transparent">
                {isRTL ? 'خطوات سيول' : 'Seoul Steps'}
              </span>
              <span className="text-muted-foreground text-[10px] block font-medium">{isRTL ? 'تعلم الكورية' : '한국어 학습'}</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Pill Language Switcher */}
            <motion.button
              onClick={() => {}}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-full bg-card/70 backdrop-blur-sm border border-border/60 text-sm font-semibold hover:border-primary/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className={language === 'ar' ? 'font-korean text-xs' : 'text-xs'}>{language === 'ar' ? '한국어' : 'العربية'}</span>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.button
              onClick={() => navigate('/auth')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] text-white text-sm font-bold shadow-lg shadow-[hsl(220,80%,55%)]/20 hover:shadow-xl hover:shadow-[hsl(220,80%,55%)]/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRTL ? 'تسجيل الدخول' : '로그인'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ HERO SECTION ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative z-20 w-full min-h-screen flex flex-col items-center justify-start px-4 pt-16 lg:pt-12">
        <motion.div style={{ scale: parallaxScale }} className="w-full max-w-7xl mx-auto">
          
          {/* Top: Welcome + Badge compact */}
          <div className="text-center mb-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.2 }}
              className="mb-2"
            >
              <MultilingualWelcome />
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: mounted ? 1 : 0.8, opacity: mounted ? 1 : 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/[0.03] mb-3"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-4 h-4 text-[hsl(35,95%,50%)]" />
              </motion.div>
              <span className="text-sm font-semibold text-muted-foreground">
                {isRTL ? '🚀 منصة تعليمية متكاملة' : '🚀 올인원 학습 플랫폼'}
              </span>
            </motion.div>
          </div>

          {/* 3 Column Layout: Egyptian | Center | Korean */}
          <div className="flex items-center justify-between gap-2 lg:gap-6">
            
            {/* LEFT - Egyptian Flag (desktop only) */}
            <motion.div
              className="hidden lg:flex flex-col items-center flex-shrink-0 w-48"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -80 }}
              transition={{ delay: 1.3, type: 'spring', stiffness: 60 }}
            >
              <motion.div className="relative" whileHover={{ scale: 1.08 }}>
                <motion.div
                  className="absolute -inset-4 rounded-full blur-2xl"
                  style={{ background: 'radial-gradient(circle, hsla(35,95%,55%,0.2), transparent 70%)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <motion.img
                    src={personEgyptianFlag}
                    alt={isRTL ? 'شخص يحمل العلم المصري' : 'Person with Egyptian Flag'}
                    className="w-40 h-auto object-contain drop-shadow-2xl relative z-10"
                    initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 70, damping: 12 }}
                  />
                </motion.div>
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: 'spring' }} className="text-4xl mt-2 block text-center relative z-10">🇪🇬</motion.span>
              </motion.div>
            </motion.div>

            {/* CENTER Content */}
            <div className="flex-1 text-center">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-2 tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
                transition={{ delay: 0.6, duration: 0.9 }}
              >
                <motion.span
                  className="inline-block bg-gradient-to-r from-[hsl(220,85%,55%)] via-[hsl(270,65%,55%)] to-[hsl(340,80%,55%)] bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {isRTL ? 'خطوات سيول' : 'Seoul Steps'}
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground/80 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                {isRTL ? 'رحلتك لتعلم الكورية تبدأ هنا' : '한국어 학습 여정의 시작'}
              </motion.p>

              <motion.div
                className="mb-5 h-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: mounted ? 1 : 0 }}
                transition={{ delay: 1 }}
              >
                <TypewriterText texts={typewriterTexts} className="text-base text-muted-foreground" />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 mb-5 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 1.1 }}
              >
            <motion.button
              onClick={handleStart}
              className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-[hsl(220,80%,50%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)] text-white font-bold text-lg shadow-xl shadow-[hsl(220,80%,55%)]/25 overflow-hidden"
              whileHover={{ scale: 1.06, boxShadow: '0 25px 50px -12px hsla(220, 80%, 55%, 0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[hsl(340,75%,55%)] via-[hsl(270,60%,55%)] to-[hsl(220,80%,50%)]"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative flex items-center gap-2">
                <Play className="w-5 h-5" />
                {isRTL ? 'ابدأ الآن مجاناً' : '지금 무료로 시작'}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </span>
            </motion.button>
            <motion.button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 text-foreground font-semibold text-base hover:bg-card/80 transition-all shadow-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2 justify-center">
                {isRTL ? 'اكتشف المنصة' : '플랫폼 알아보기'}
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </span>
            </motion.button>
          </motion.div>

              {/* Mobile: Flag Characters */}
              <motion.div
                className="flex lg:hidden items-end justify-center gap-6 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                transition={{ delay: 1.3 }}
              >
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.08 }}>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <img src={personEgyptianFlag} alt="" className="w-24 sm:w-28 h-auto object-contain drop-shadow-xl" />
                  </motion.div>
                  <span className="text-2xl mt-1">🇪🇬</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring' }}
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="w-10 h-10 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </motion.div>
                </motion.div>
                <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.08 }}>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}>
                    <img src={personKoreanFlag} alt="" className="w-24 sm:w-28 h-auto object-contain drop-shadow-xl" />
                  </motion.div>
                  <span className="text-2xl mt-1">🇰🇷</span>
                </motion.div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 1.5 }}
              >
                {[
                  { value: 6, suffix: '', label: isRTL ? 'مستويات تعليمية' : '학습 레벨', icon: GraduationCap },
                  { value: 10, suffix: '+', label: isRTL ? 'ألعاب ذكية' : '스마트 게임', icon: Gamepad2 },
                  { value: 500, suffix: '+', label: isRTL ? 'كلمة ومفردة' : '단어 & 어휘', icon: BookMarked },
                  { value: 1, suffix: ' AI', label: isRTL ? 'مساعد ذكي' : 'AI 어시스턴트', icon: Brain },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/30 shadow-sm"
                    whileHover={{ y: -4, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                  >
                    <motion.div whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: 'spring' }}>
                      <stat.icon className="w-4 h-4 text-primary" />
                    </motion.div>
                    <div className="text-start">
                      <span className="text-lg font-black text-foreground"><AnimatedCounter target={stat.value} suffix={stat.suffix} /></span>
                      <span className="text-[10px] text-muted-foreground block leading-tight">{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT - Korean Flag (desktop only) */}
            <motion.div
              className="hidden lg:flex flex-col items-center flex-shrink-0 w-48"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 80 }}
              transition={{ delay: 1.3, type: 'spring', stiffness: 60 }}
            >
              <motion.div className="relative" whileHover={{ scale: 1.08 }}>
                <motion.div
                  className="absolute -inset-4 rounded-full blur-2xl"
                  style={{ background: 'radial-gradient(circle, hsla(220,80%,55%,0.2), transparent 70%)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
                  <motion.img
                    src={personKoreanFlag}
                    alt={isRTL ? 'شخص يحمل العلم الكوري' : 'Person with Korean Flag'}
                    className="w-40 h-auto object-contain drop-shadow-2xl relative z-10"
                    initial={{ scale: 0.3, opacity: 0, rotate: 15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 1.5, type: 'spring', stiffness: 70, damping: 12 }}
                  />
                </motion.div>
                <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, type: 'spring' }} className="text-4xl mt-2 block text-center relative z-10">🇰🇷</motion.span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-primary/50"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ WAVE DIVIDER ═══ */}
      <div className="relative z-20">
        <WaveDivider color="hsl(var(--card))" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ FEATURES SECTION ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-20 py-20 lg:py-28" style={{ background: 'hsl(var(--card))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {isRTL ? '— لماذا خطوات سيول —' : '— Why Seoul Steps —'}
            </motion.span>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground">
              {isRTL ? 'كل ما تحتاجه لتعلم الكورية' : '한국어 학습에 필요한 모든 것'}
            </h2>
            <div className="w-24 h-1.5 mx-auto mt-6 rounded-full bg-gradient-to-r from-[hsl(220,80%,55%)] to-[hsl(340,75%,55%)]" />
          </motion.div>

          {/* Features Grid - Glassmorphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: isRTL ? 'دروس تفاعلية' : '대화형 수업', desc: isRTL ? '6 مستويات من المبتدئ إلى المتقدم مع محتوى تعليمي متدرج ومنهجي' : '초급부터 고급까지 6단계 체계적 학습 콘텐츠', gradient: 'from-[hsl(220,80%,55%)] to-[hsl(220,80%,42%)]' },
              { icon: Gamepad2, title: isRTL ? 'ألعاب تعليمية' : '교육 게임', desc: isRTL ? '10+ لعبة ذكية تجعل التعلم ممتعاً ومشوقاً ومحفزاً' : '10+ 스마트 게임으로 재미있고 흥미진진한 학습', gradient: 'from-[hsl(35,95%,55%)] to-[hsl(35,95%,42%)]' },
              { icon: Brain, title: isRTL ? 'مساعد ذكي AI' : 'AI 어시스턴트', desc: isRTL ? 'محادثة ذكية مع معلم افتراضي لتعلم الكورية بسهولة' : 'AI 가상 선생님과 쉬운 한국어 대화 학습', gradient: 'from-[hsl(270,65%,55%)] to-[hsl(270,65%,42%)]' },
              { icon: Users, title: isRTL ? 'مجتمع تفاعلي' : '인터랙티브 커뮤니티', desc: isRTL ? 'منتدى نقاش وتفاعل مع زملائك في رحلة التعلم' : '동료 학습자들과 토론하고 교류하는 포럼', gradient: 'from-[hsl(155,60%,45%)] to-[hsl(155,60%,35%)]' },
              { icon: Award, title: isRTL ? 'شهادات معتمدة' : '공인 인증서', desc: isRTL ? 'احصل على شهادة إتمام مع رقم تسلسلي فريد' : '고유 일련번호가 있는 수료 인증서 획득', gradient: 'from-[hsl(340,75%,55%)] to-[hsl(340,75%,42%)]' },
              { icon: Mic, title: isRTL ? 'تدريب النطق' : '발음 훈련', desc: isRTL ? 'تمارين نطق تفاعلية مع تقنية التعرف على الصوت' : '음성 인식 기술을 활용한 인터랙티브 발음 훈련', gradient: 'from-[hsl(200,80%,50%)] to-[hsl(200,80%,38%)]' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative p-7 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <motion.div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring' }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GRADIENT DIVIDER ═══ */}
      <div className="relative z-20 h-1.5 bg-gradient-to-r from-[hsl(220,80%,55%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)]" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ KOREAN BAKERY 3D SHOWCASE ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-20 lg:py-28 bg-gradient-to-br from-[hsl(340,80%,97%)] via-background to-[hsl(35,95%,97%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* LEFT: 3D Bakery */}
          <motion.div
            className="lg:col-span-3 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <KoreanBakery3D height={460} enableControls />
            <p className="text-center text-xs text-muted-foreground mt-3">
              {isRTL ? '🖱️ اسحب للتدوير • مرر للتكبير' : '🖱️ 드래그하여 회전 • 스크롤하여 확대'}
            </p>
          </motion.div>

          {/* RIGHT: Story */}
          <motion.div
            className="lg:col-span-2 order-1 lg:order-2 text-center lg:text-start"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.15 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-xl border border-border/40 mb-5 shadow-md"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xl">🥐</span>
              <span className="text-xs font-bold text-[hsl(340,75%,50%)]">
                {isRTL ? 'تجربة كورية ثلاثية الأبعاد' : '3D 한국 체험'}
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-[hsl(340,80%,50%)] via-[hsl(35,95%,55%)] to-[hsl(220,80%,55%)] bg-clip-text text-transparent">
                {isRTL ? 'مخبزة كورية حقيقية' : '진짜 한국 빵집'}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              {isRTL
                ? 'تجوّل داخل مخبزة كورية تقليدية ثلاثية الأبعاد، استكشف التفاصيل، وانغمس في الهوية البصرية الكورية الأصيلة من قلب سيول.'
                : '서울 한복판에서 직접 가져온 듯한 3D 한국 전통 빵집을 자유롭게 둘러보세요. 모든 디테일을 탐험하고 한국 문화에 빠져보세요.'}
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {[
                { e: '🎨', t: isRTL ? 'هوية بصرية كورية' : '한국 디자인' },
                { e: '🔄', t: isRTL ? 'تدوير 360°' : '360° 회전' },
                { e: '🔍', t: isRTL ? 'تكبير وتفاصيل' : '확대 가능' },
              ].map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs font-semibold shadow-sm"
                >
                  <span>{b.e}</span>
                  <span>{b.t}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ GRADIENT DIVIDER ═══ */}
      <div className="relative z-20 h-1.5 bg-gradient-to-r from-[hsl(220,80%,55%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)]" />


      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ CULTURE BRIDGE + MAPS SECTION ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-20 lg:py-28 bg-gradient-to-b from-background via-[hsl(var(--card))] to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3 block">
              {isRTL ? '— جسر الثقافات —' : '— Culture Bridge —'}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground">
              {isRTL ? 'من مصر إلى كوريا' : '이집트에서 한국까지'}
            </h2>
            <div className="w-24 h-1.5 mx-auto mt-6 rounded-full bg-gradient-to-r from-[hsl(35,95%,55%)] to-[hsl(220,80%,55%)]" />
          </motion.div>

          {/* Culture Bridge Image + Content */}
          <motion.div
            className="rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 overflow-hidden shadow-xl shadow-black/[0.03] mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <motion.div className="relative h-72 lg:h-auto min-h-[350px] overflow-hidden" whileHover={{ scale: 1.02 }}>
                <motion.img
                  src={cultureBridge}
                  alt={isRTL ? 'جسر الثقافات' : 'Culture Bridge'}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  viewport={{ once: true }}
                />
                {/* Light Halo on Image */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(circle at 50% 50%, hsla(220,80%,55%,0.12), transparent 70%)' }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent lg:bg-gradient-to-r" />
              </motion.div>

              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <motion.h3
                  className="text-3xl font-black text-foreground mb-5"
                  initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {isRTL ? 'جسر بين الحضارات' : '문명 사이의 다리'}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground leading-relaxed mb-7 text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {isRTL
                    ? 'منصة "خطوات سيول" ليست مجرد تطبيق لتعلم اللغة، بل هي جسر ثقافي يربط بين الحضارة المصرية العريقة والثقافة الكورية الحديثة. تم بناؤها بشغف واهتمام بكل تفصيلة.'
                    : '"서울 스텝스"는 단순한 언어 앱이 아니라, 이집트 문명과 한국 문화를 연결하는 문화적 다리입니다.'}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {[
                    { icon: Code, text: 'React & TypeScript' },
                    { icon: Heart, text: isRTL ? 'تطوع بالكامل' : '완전 자원봉사' },
                    { icon: Star, text: isRTL ? 'مفتوح المصدر' : '오픈 소스' },
                  ].map((tag, i) => (
                    <motion.span
                      key={i}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground font-semibold"
                      whileHover={{ scale: 1.05, backgroundColor: 'hsla(var(--primary), 0.1)' }}
                    >
                      <tag.icon className="w-4 h-4 text-primary" />
                      {tag.text}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mini Maps - Egypt & South Korea */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 p-6 flex flex-col items-center overflow-hidden"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">🇪🇬</span>
                {isRTL ? 'مصر' : '이집트'}
              </h3>
              <div className="w-full max-w-[280px]">
                <EgyptMap className="w-full" />
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl bg-card/40 backdrop-blur-xl border border-border/30 p-6 flex flex-col items-center overflow-hidden"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">🇰🇷</span>
                {isRTL ? 'كوريا الجنوبية' : '대한민국'}
              </h3>
              <div className="w-full max-w-[280px]">
                <SouthKoreaMap className="w-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WAVE DIVIDER ═══ */}
      <div className="relative z-20">
        <WaveDivider color="hsl(var(--background))" flip />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ DEVELOPER SECTION ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3 block">
              {isRTL ? '— المطور —' : '— Developer —'}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground">
              {isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman Mohamed Sultan'}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              {isRTL
                ? 'طالب بالكلية البترولية — جامعة بنسلفانيا التكنولوجية. قمت ببناء هذا النظام تطوعاً لخدمة مجتمع الجامعة.'
                : '펜실베이니아 공과대학교 석유대학 학생. 대학 커뮤니티를 위해 자발적으로 이 시스템을 구축했습니다.'}
            </p>
            <div className="w-24 h-1.5 mx-auto mt-6 rounded-full bg-gradient-to-r from-[hsl(220,80%,55%)] to-[hsl(340,75%,55%)]" />
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { label: 'React 18', desc: isRTL ? 'واجهة المستخدم' : 'UI Framework', icon: '⚛️' },
              { label: 'TypeScript', desc: isRTL ? 'لغة البرمجة' : '프로그래밍 언어', icon: '📘' },
              { label: 'Supabase', desc: isRTL ? 'قاعدة البيانات' : '데이터베이스', icon: '🗄️' },
              { label: 'Tailwind', desc: isRTL ? 'التصميم' : '스타일링', icon: '🎨' },
            ].map((tech, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: '0 15px 35px -8px rgba(0,0,0,0.08)' }}
              >
                <span className="text-3xl block mb-2">{tech.icon}</span>
                <span className="text-lg font-black text-foreground block">{tech.label}</span>
                <span className="text-xs text-muted-foreground mt-1 block">{tech.desc}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Media Circular Buttons */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, i) => (
              <motion.button
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{ background: social.color }}
                whileHover={{ scale: 1.15, y: -4, boxShadow: `0 10px 30px -5px ${social.color}66` }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ GRADIENT DIVIDER ═══ */}
      <div className="relative z-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ CTA SECTION ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-20 lg:py-28 px-4">
        <motion.div
          className="max-w-5xl mx-auto relative rounded-[2rem] overflow-hidden"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated BG */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, hsl(220, 85%, 52%), hsl(270, 65%, 52%), hsl(340, 80%, 52%))' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
            transition={{ duration: 10, repeat: Infinity }}
            // backgroundSize handled via style
          />
          {/* Dot Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />

          <div className="relative z-10 text-center p-12 sm:p-16 lg:p-24">
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {isRTL ? 'ابدأ رحلتك اليوم' : '오늘 여정을 시작하세요'}
            </motion.h2>
            <motion.p
              className="text-xl text-white/85 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {isRTL
                ? 'انضم إلى مجتمع المتعلمين وابدأ تعلم اللغة الكورية بطريقة تفاعلية وممتعة ومجانية بالكامل'
                : '학습자 커뮤니티에 참여하고 무료로 재미있게 한국어를 배우세요'}
            </motion.p>
            <motion.button
              onClick={handleStart}
              className="px-12 py-5 rounded-2xl bg-white text-[hsl(220,80%,50%)] font-black text-lg shadow-2xl hover:shadow-3xl transition-all"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
            >
              {isRTL ? '🚀 ابدأ الآن مجاناً' : '🚀 지금 무료로 시작하기'}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══ WAVE DIVIDER TO FOOTER ═══ */}
      <div className="relative z-20">
        <WaveDivider color="hsl(220, 15%, 15%)" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ═══ FOOTER ═══ */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 bg-[hsl(220,15%,15%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(220,80%,55%)] to-[hsl(270,60%,55%)] flex items-center justify-center">
                  <span className="font-korean text-white font-black text-base">한</span>
                </div>
                <span className="font-black text-lg">{isRTL ? 'خطوات سيول' : 'Seoul Steps'}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                {isRTL ? 'منصة تعلم اللغة الكورية للعرب. مشروع تطوعي مفتوح المصدر.' : '아랍인을 위한 한국어 학습 플랫폼. 오픈 소스 자원봉사 프로젝트.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white/90 mb-4">{isRTL ? 'روابط سريعة' : '빠른 링크'}</h4>
              <div className="space-y-2.5 text-sm text-white/50">
                <button onClick={() => navigate('/auth')} className="block hover:text-white transition-colors">{isRTL ? 'تسجيل الدخول' : '로그인'}</button>
                <button onClick={handleStart} className="block hover:text-white transition-colors">{isRTL ? 'إنشاء حساب' : '회원가입'}</button>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="block hover:text-white transition-colors">{isRTL ? 'المميزات' : '기능'}</button>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="font-bold text-white/90 mb-4">{isRTL ? 'التقنيات المستخدمة' : '사용 기술'}</h4>
              <div className="space-y-2.5 text-sm text-white/50">
                <p>React 18 + TypeScript 5</p>
                <p>Tailwind CSS + Framer Motion</p>
                <p>Supabase (Auth + DB + Edge)</p>
                <p>Vite 5 + PWA Ready</p>
              </div>
            </div>

            {/* Developer */}
            <div>
              <h4 className="font-bold text-white/90 mb-4">{isRTL ? 'المطور' : '개발자'}</h4>
              <p className="text-sm text-white/50 mb-2">{isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman M. Sultan'}</p>
              <p className="text-sm text-white/50 mb-4">{isRTL ? 'جامعة بنسلفانيا التكنولوجية' : 'Pennsylvania Tech University'}</p>
              <div className="flex gap-3">
                {socialLinks.map((s, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer">
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/40">
              © 2024 Seoul Steps — {isRTL ? 'خطوات سيول' : '서울 스텝스'}. {isRTL ? 'جميع الحقوق محفوظة' : '모든 권리 보유'}.
            </p>
            <p className="text-xs text-white/30">
              {isRTL ? 'تم البناء بمنهجية الهندسة التجميعية (Assembly Engineering)' : 'Built with Assembly Engineering methodology'}
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ INTRO MODAL ═══ */}
      <HomeIntroModal isOpen={showIntro} onClose={handleCloseIntro} />
    </div>
  );
};

export default HomePage;
