import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import personEgyptianFlag from '@/assets/person-egyptian-flag.png';
import personKoreanFlag from '@/assets/person-korean-flag.png';
import cultureBridge from '@/assets/culture-bridge.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import HomeIntroModal from '@/components/HomeIntroModal';
import { Sparkles, ArrowRight, Globe, BookOpen, GraduationCap, Star, Zap, Users, Trophy, Brain, ChevronDown, Code, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    setMounted(true);
    const hasSeenIntro = localStorage.getItem('homepage_intro_seen');
    if (!hasSeenIntro) {
      setTimeout(() => setShowIntro(true), 1500);
    }
  }, [user, navigate]);

  const handleStart = () => {
    const hasSeenOnboarding = localStorage.getItem('onboarding_seen');
    if (!hasSeenOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/auth');
    }
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
    localStorage.setItem('homepage_intro_seen', 'true');
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #e8f0fe 30%, #fdf2f8 60%, #fef9f0 100%)' }}>
      {/* Animated Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsla(220, 80%, 50%, 0.08), transparent 70%)', top: '-10%', left: '-10%' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsla(340, 75%, 55%, 0.06), transparent 70%)', bottom: '-5%', right: '-5%' }}
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsla(35, 95%, 55%, 0.05), transparent 70%)', top: '40%', right: '20%' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['hsla(220, 80%, 50%, 0.3)', 'hsla(340, 75%, 55%, 0.3)', 'hsla(35, 95%, 55%, 0.3)'][i % 3],
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-30 flex justify-between items-center px-5 lg:px-12 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] flex items-center justify-center shadow-lg shadow-[hsl(220,80%,50%)]/20">
            <span className="font-korean text-white font-bold text-lg">한</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold bg-gradient-to-r from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] bg-clip-text text-transparent">
              {isRTL ? 'خطوات سيول' : 'Seoul Steps'}
            </span>
            <span className="text-muted-foreground text-xs block">{isRTL ? 'تعلم الكورية' : '한국어 학습'}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => navigate('/auth')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border text-foreground text-sm font-medium hover:bg-card transition-all shadow-sm"
          >
            {isRTL ? 'تسجيل الدخول' : '로그인'}
          </button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 w-full flex flex-col items-center px-4 overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto pt-8 lg:pt-16 pb-16 lg:pb-24">
          <div className="flex flex-col items-center text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: mounted ? 1 : 0.8, opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 backdrop-blur border border-border shadow-sm mb-8"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-4 h-4 text-accent" />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground">
                {isRTL ? '🚀 منصة تعليمية متكاملة' : '🚀 올인원 학습 플랫폼'}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-[hsl(220,80%,50%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)] bg-clip-text text-transparent">
                {isRTL ? 'خطوات سيول' : 'Seoul Steps'}
              </span>
              <br />
              <span className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-bold">
                {isRTL ? 'رحلتك لتعلم الكورية' : '한국어 학습 여정'}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 0.7 }}
            >
              {isRTL
                ? 'من مصر إلى كوريا، منصة تفاعلية شاملة تجمع بين 6 مستويات تعليمية، ألعاب ذكية، ومحادثة بالذكاء الاصطناعي'
                : '이집트에서 한국까지, 6단계 학습, 스마트 게임, AI 대화를 결합한 종합 인터랙티브 플랫폼'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={handleStart}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] text-primary-foreground font-bold text-lg shadow-lg shadow-[hsl(220,80%,50%)]/25 overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px hsla(220, 80%, 50%, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)]"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center gap-2">
                  {isRTL ? 'ابدأ الآن مجاناً' : '지금 무료로 시작'}
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl bg-card/80 backdrop-blur border border-border text-foreground font-semibold text-lg hover:bg-card transition-all shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  {isRTL ? 'اكتشف المنصة' : '플랫폼 알아보기'}
                  <ChevronDown className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>

            {/* Flag Characters Section */}
            <motion.div
              className="flex items-end justify-center gap-6 sm:gap-10 lg:gap-16 mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {/* Egyptian Flag Person */}
              <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.img
                    src={personEgyptianFlag}
                    alt={isRTL ? 'شخص يحمل العلم المصري' : 'Person with Egyptian Flag'}
                    className="w-24 sm:w-32 lg:w-44 h-auto object-contain drop-shadow-xl"
                    initial={{ scale: 0.5, opacity: 0, x: -40 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, type: 'spring', stiffness: 80 }}
                  />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="text-3xl mt-2"
                >🇪🇬</motion.span>
              </motion.div>

              {/* Center Bridge Icon */}
              <motion.div
                className="hidden sm:flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(220,80%,50%)]/10 to-[hsl(340,75%,55%)]/10 border-2 border-dashed border-[hsl(220,80%,50%)]/30 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Globe className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>

              {/* Korean Flag Person */}
              <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                >
                  <motion.img
                    src={personKoreanFlag}
                    alt={isRTL ? 'شخص يحمل العلم الكوري' : 'Person with Korean Flag'}
                    className="w-24 sm:w-32 lg:w-44 h-auto object-contain drop-shadow-xl"
                    initial={{ scale: 0.5, opacity: 0, x: 40 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, type: 'spring', stiffness: 80 }}
                  />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="text-3xl mt-2"
                >🇰🇷</motion.span>
              </motion.div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 1.3 }}
            >
              {[
                { value: '6', label: isRTL ? 'مستويات تعليمية' : '학습 레벨', icon: GraduationCap },
                { value: '10+', label: isRTL ? 'ألعاب ذكية' : '스마트 게임', icon: Zap },
                { value: 'AI', label: isRTL ? 'مساعد ذكي' : 'AI 어시스턴트', icon: Brain },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/60 backdrop-blur border border-border/50"
                  whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                  <div className="text-start">
                    <span className="text-lg font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted-foreground block">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-6xl mx-auto py-16 lg:py-24">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {isRTL ? 'لماذا خطوات سيول؟' : 'Why Seoul Steps?'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-3">
              {isRTL ? 'كل ما تحتاجه لتعلم الكورية' : '한국어 학습에 필요한 모든 것'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BookOpen, title: isRTL ? 'دروس تفاعلية' : '대화형 수업', desc: isRTL ? '6 مستويات من المبتدئ إلى المتقدم مع محتوى تعليمي متدرج' : '초급부터 고급까지 6단계 체계적 학습', color: 'from-[hsl(220,80%,50%)] to-[hsl(220,80%,40%)]' },
              { icon: Zap, title: isRTL ? 'ألعاب تعليمية' : '교육 게임', desc: isRTL ? '10+ لعبة ذكية تجعل التعلم ممتعاً ومثيراً' : '10+ 스마트 게임으로 재미있는 학습', color: 'from-[hsl(35,95%,55%)] to-[hsl(35,95%,45%)]' },
              { icon: Brain, title: isRTL ? 'مساعد ذكي AI' : 'AI 어시스턴트', desc: isRTL ? 'محادثة ذكية لتعلم الكورية مع معلم افتراضي' : 'AI 가상 선생님과 대화하며 학습', color: 'from-[hsl(270,60%,55%)] to-[hsl(270,60%,45%)]' },
              { icon: Users, title: isRTL ? 'مجتمع المنتدى' : '커뮤니티 포럼', desc: isRTL ? 'شارك وتفاعل مع زملائك في رحلة التعلم' : '동료 학습자들과 교류하고 공유', color: 'from-[hsl(155,60%,45%)] to-[hsl(155,60%,35%)]' },
              { icon: Trophy, title: isRTL ? 'إنجازات وشهادات' : '업적 & 인증서', desc: isRTL ? 'احصل على شهادات معتمدة وتتبع تقدمك' : '인증서 획득 및 진행 상황 추적', color: 'from-[hsl(340,75%,55%)] to-[hsl(340,75%,45%)]' },
              { icon: Globe, title: isRTL ? 'ثنائي اللغة' : '이중 언어', desc: isRTL ? 'واجهة كاملة بالعربية والكورية لتجربة سلسة' : '아랍어-한국어 완벽한 이중 언어 인터페이스', color: 'from-[hsl(200,80%,50%)] to-[hsl(200,80%,40%)]' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative p-6 rounded-2xl bg-card/70 backdrop-blur border border-border/50 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Culture Bridge Section with uploaded image */}
        <section className="w-full max-w-6xl mx-auto py-16 lg:py-24">
          <motion.div
            className="rounded-3xl bg-card/60 backdrop-blur border border-border/50 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <motion.div className="relative h-64 lg:h-auto min-h-[300px]" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <img src={cultureBridge} alt={isRTL ? 'جسر الثقافات' : 'Culture Bridge'} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent lg:bg-gradient-to-r" />
              </motion.div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
                <motion.span
                  className="text-sm font-semibold text-primary mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {isRTL ? 'عن المنصة' : '플랫폼 소개'}
                </motion.span>
                <motion.h2
                  className="text-2xl lg:text-3xl font-bold text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {isRTL ? 'جسر بين الثقافات' : '문화의 다리'}
                </motion.h2>
                <motion.p
                  className="text-muted-foreground leading-relaxed mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {isRTL
                    ? 'منصة "خطوات سيول" ليست مجرد تطبيق لتعلم اللغة، بل هي جسر ثقافي يربط بين الحضارة المصرية العريقة والثقافة الكورية الحديثة. تم بناؤها بشغف واهتمام بكل تفصيلة لتقديم تجربة تعليمية فريدة.'
                    : '"서울 스텝스"는 단순한 언어 학습 앱이 아닌, 이집트 문명과 한국 문화를 연결하는 문화적 다리입니다. 독특한 학습 경험을 제공하기 위해 세심하게 제작되었습니다.'}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {[
                    { icon: Code, text: isRTL ? 'React & TypeScript' : 'React & TypeScript' },
                    { icon: Heart, text: isRTL ? 'تطوع بالكامل' : '완전 자원봉사' },
                  ].map((tag, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-sm text-foreground font-medium">
                      <tag.icon className="w-4 h-4 text-primary" />
                      {tag.text}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Developer Section */}
        <section className="w-full max-w-6xl mx-auto py-16 lg:py-24">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {isRTL ? 'من بنى هذه المنصة؟' : '이 플랫폼을 만든 사람'}
            </span>
            <h2 className="text-3xl font-bold text-foreground mt-3">
              {isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman Mohamed Sultan'}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              {isRTL
                ? 'طالب بالكلية البترولية - جامعة بنسلفانيا التكنولوجية. قمت ببناء هذا النظام تطوعاً لخدمة مجتمع الجامعة.'
                : '펜실베이니아 공과대학교 석유대학 학생. 대학 커뮤니티를 위해 자발적으로 이 시스템을 구축했습니다.'}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { label: 'React', desc: isRTL ? 'واجهة المستخدم' : 'UI Framework' },
              { label: 'TypeScript', desc: isRTL ? 'لغة البرمجة' : '프로그래밍 언어' },
              { label: 'Supabase', desc: isRTL ? 'قاعدة البيانات' : '데이터베이스' },
              { label: 'Tailwind', desc: isRTL ? 'التصميم' : '스타일링' },
            ].map((tech, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-2xl bg-card/60 backdrop-blur border border-border/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <span className="text-lg font-bold text-foreground">{tech.label}</span>
                <span className="text-xs text-muted-foreground block mt-1">{tech.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-5xl mx-auto py-16 lg:py-24">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, hsl(220, 80%, 50%), hsl(270, 60%, 55%), hsl(340, 75%, 55%))' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }} />

            <div className="relative z-10 text-center p-10 sm:p-14 lg:p-20">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {isRTL ? 'ابدأ رحلتك اليوم' : '오늘 여정을 시작하세요'}
              </motion.h2>
              <motion.p
                className="text-lg text-white/85 mb-8 max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                {isRTL
                  ? 'انضم إلى مجتمع المتعلمين وابدأ تعلم اللغة الكورية بطريقة تفاعلية وممتعة'
                  : '학습자 커뮤니티에 참여하고 재미있고 인터랙티브한 방식으로 한국어를 배우세요'}
              </motion.p>
              <motion.button
                onClick={handleStart}
                className="px-10 py-4 rounded-2xl bg-white text-[hsl(220,80%,50%)] font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRTL ? 'ابدأ الآن مجاناً' : '지금 무료로 시작하기'}
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-border/50 bg-card/30 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] flex items-center justify-center">
                  <span className="font-korean text-white font-bold text-sm">한</span>
                </div>
                <span className="font-bold text-foreground">{isRTL ? 'خطوات سيول' : 'Seoul Steps'}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'منصة تعلم اللغة الكورية للعرب' : '아랍인을 위한 한국어 학습 플랫폼'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{isRTL ? 'روابط سريعة' : '빠른 링크'}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button onClick={() => navigate('/auth')} className="block hover:text-primary transition-colors">{isRTL ? 'تسجيل الدخول' : '로그인'}</button>
                <button onClick={handleStart} className="block hover:text-primary transition-colors">{isRTL ? 'إنشاء حساب' : '회원가입'}</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{isRTL ? 'المطور' : '개발자'}</h4>
              <p className="text-sm text-muted-foreground">{isRTL ? 'محمد أيمن محمد سلطان' : 'Mohamed Ayman'}</p>
              <p className="text-sm text-muted-foreground">{isRTL ? 'جامعة بنسلفانيا التكنولوجية' : 'Pennsylvania Technology University'}</p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
            <p>© 2024 Seoul Steps — {isRTL ? 'خطوات سيول' : '서울 스텝스'}. {isRTL ? 'جميع الحقوق محفوظة' : '모든 권리 보유'}.</p>
          </div>
        </div>
      </footer>

      {/* Intro Modal */}
      <HomeIntroModal isOpen={showIntro} onClose={handleCloseIntro} />
    </div>
  );
};

export default HomePage;
