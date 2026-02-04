import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import HeroSlide from '@/components/onboarding/HeroSlide';
import OnboardingSlide from '@/components/onboarding/OnboardingSlide';
import OnboardingAudioControl from '@/components/onboarding/OnboardingAudioControl';
import { transitions } from '@/components/onboarding/OnboardingTransitions';
import { useOnboardingAudio } from '@/hooks/useOnboardingAudio';
import characterImage from '@/assets/onboarding-character.png';

const Onboarding: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState(0);
  const isRTL = language === 'ar';
  
  // Audio controls
  const { isMuted, toggleMute, speakText, startMusic } = useOnboardingAudio();

  const slides = [
    // Slide 0: Hero with uploaded image
    {
      type: 'hero',
    },
    // Slide 1: Welcome
    {
      type: 'content',
      title: isRTL ? 'مرحباً بك في رحلة التعلم!' : '학습 여정에 오신 것을 환영합니다!',
      subtitle: isRTL ? 'منصة تفاعلية متكاملة' : '종합적인 인터랙티브 플랫폼',
      description: isRTL 
        ? 'منصة متكاملة لتعلم اللغة الكورية من الصفر حتى الاحتراف. دروس تفاعلية، ألعاب تعليمية، وتمارين متنوعة تناسب جميع المستويات.'
        : '처음부터 고급까지 한국어를 배울 수 있는 종합 플랫폼입니다. 대화형 수업, 교육 게임 및 모든 레벨에 맞는 다양한 연습.',
      koreanText: '안녕하세요!',
      bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100',
      iconEmoji: '👋'
    },
    // Slide 2: About Developer
    {
      type: 'content',
      title: isRTL ? 'من قام ببناء هذه المنصة؟' : '이 플랫폼은 누가 만들었나요?',
      subtitle: isRTL ? 'محمد أيمن - المطور والمصمم' : 'Mohamed Ayman - 개발자 및 디자이너',
      description: isRTL 
        ? 'تم تصميم وبرمجة هذه المنصة بشغف وحب من قبل محمد أيمن، بهدف تقديم تجربة تعليمية فريدة ومميزة لكل من يرغب في تعلم اللغة الكورية.'
        : '이 플랫폼은 Mohamed Ayman이 한국어를 배우고자 하는 모든 분들께 독특하고 특별한 학습 경험을 제공하기 위해 열정과 사랑으로 설계하고 프로그래밍했습니다.',
      koreanText: '개발자 소개',
      bgGradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-purple-100',
      iconEmoji: '👨‍💻'
    },
    // Slide 3: Learn Hangul
    {
      type: 'content',
      title: isRTL ? 'تعلم حروف الهانغول' : '한글 문자 배우기',
      subtitle: isRTL ? '40 حرف أساسي' : '40개의 기본 문자',
      description: isRTL 
        ? 'ابدأ بتعلم الحروف الكورية الأساسية (الهانغول). ستتعلم الحروف الساكنة والمتحركة وكيفية تركيبها لتكوين الكلمات.'
        : '한글 기본 문자부터 시작하세요. 자음과 모음, 그리고 단어를 만드는 방법을 배우게 됩니다.',
      koreanText: 'ㄱ ㄴ ㄷ ㄹ',
      bgGradient: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-100',
      iconEmoji: '📝'
    },
    // Slide 4: Vocabulary & Phrases
    {
      type: 'content',
      title: isRTL ? 'مفردات وعبارات يومية' : '일상 어휘와 표현',
      subtitle: isRTL ? 'أكثر من 500 كلمة' : '500개 이상의 단어',
      description: isRTL 
        ? 'تعلم المفردات الأساسية والعبارات اليومية التي ستحتاجها في حياتك اليومية. من التحيات إلى المحادثات المتقدمة.'
        : '일상생활에 필요한 기본 어휘와 일상 표현을 배우세요. 인사말부터 고급 대화까지.',
      koreanText: '사랑해요 ❤️',
      bgGradient: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100',
      iconEmoji: '💬'
    },
    // Slide 5: Games
    {
      type: 'content',
      title: isRTL ? 'ألعاب تعليمية ممتعة' : '재미있는 교육 게임',
      subtitle: isRTL ? '10+ ألعاب متنوعة' : '10개 이상의 다양한 게임',
      description: isRTL 
        ? 'تعلم وأنت تلعب! مجموعة متنوعة من الألعاب التعليمية التي تجعل التعلم ممتعاً ومسلياً. تحديات، مسابقات، وألعاب ذاكرة.'
        : '놀면서 배우세요! 학습을 재미있고 즐겁게 만드는 다양한 교육 게임. 도전, 퀴즈, 기억력 게임.',
      koreanText: '재미있어요!',
      bgGradient: 'bg-gradient-to-br from-blue-100 via-sky-50 to-blue-100',
      iconEmoji: '🎮'
    },
    // Slide 6: TOPIK Test
    {
      type: 'content',
      title: isRTL ? 'استعد لاختبار TOPIK' : 'TOPIK 시험 준비',
      subtitle: isRTL ? 'اختبارات محاكاة حقيقية' : '실제 모의 시험',
      description: isRTL 
        ? 'جهز نفسك لاختبار الكفاءة في اللغة الكورية (TOPIK) من خلال اختبارات محاكاة حقيقية وتدريبات مكثفة.'
        : '실제 모의 시험과 집중 훈련을 통해 한국어 능력 시험(TOPIK)을 준비하세요.',
      koreanText: 'TOPIK 시험',
      bgGradient: 'bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100',
      iconEmoji: '📚'
    },
    // Slide 7: Certificate
    {
      type: 'content',
      title: isRTL ? 'احصل على شهادتك' : '인증서 받기',
      subtitle: isRTL ? 'شهادة إتمام معتمدة' : '공인 수료 인증서',
      description: isRTL 
        ? 'عند إكمال جميع المستويات، ستحصل على شهادة إتمام خاصة بك تثبت إتقانك للغة الكورية.'
        : '모든 레벨을 완료하면 한국어 숙달을 증명하는 특별한 수료 인증서를 받게 됩니다.',
      koreanText: '축하합니다! 🎉',
      bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-100',
      iconEmoji: '🏆'
    },
    // Slide 8: Final - Call to Action
    {
      type: 'final',
    }
  ];

  // Use imported transitions array

  const goToNextSlide = useCallback(() => {
    if (isTransitioning || currentSlide >= slides.length - 1) return;
    
    setIsTransitioning(true);
    setTransitionType(currentSlide % transitions.length);
  }, [currentSlide, isTransitioning, slides.length, transitions.length]);

  const handleTransitionComplete = () => {
    setCurrentSlide(prev => prev + 1);
    setIsTransitioning(false);
  };

  const handleStart = () => {
    localStorage.setItem('onboarding_seen', 'true');
    navigate('/auth');
  };

  // Auto-advance slides (except the last one)
  useEffect(() => {
    if (currentSlide < slides.length - 1 && !isTransitioning) {
      const timer = setTimeout(() => {
        goToNextSlide();
      }, 5000); // 5 seconds per slide
      
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning, goToNextSlide, slides.length]);

  // Speak Korean text when slide changes
  useEffect(() => {
    const slide = slides[currentSlide];
    if (slide.type === 'content' && slide.koreanText) {
      // Small delay to let the slide animation finish
      const timer = setTimeout(() => {
        speakText(slide.koreanText!);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, speakText]);

  // Start music on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      startMusic();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [startMusic]);

  const CurrentTransition = transitions[transitionType];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Audio Control Button */}
      <OnboardingAudioControl 
        isMuted={isMuted} 
        onToggle={toggleMute} 
        isRTL={isRTL} 
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentSlide 
                ? 'w-8 bg-rose-500' 
                : i < currentSlide 
                  ? 'bg-rose-300' 
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Current Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {slides[currentSlide].type === 'hero' && (
            <HeroSlide isRTL={isRTL} />
          )}
          
          {slides[currentSlide].type === 'content' && (
            <OnboardingSlide
              characterImage={characterImage}
              title={slides[currentSlide].title!}
              subtitle={slides[currentSlide].subtitle!}
              description={slides[currentSlide].description!}
              koreanText={slides[currentSlide].koreanText}
              bgGradient={slides[currentSlide].bgGradient!}
              iconEmoji={slides[currentSlide].iconEmoji}
              isRTL={isRTL}
            />
          )}
          
          {slides[currentSlide].type === 'final' && (
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
              {/* Celebration effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][i % 5]
                    }}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{ 
                      y: '-10vh',
                      opacity: [0, 1, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>

              <motion.div
                className="relative z-10 text-center max-w-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {/* Character */}
                <motion.img
                  src={characterImage}
                  alt="Character"
                  className="w-48 h-48 mx-auto mb-8 drop-shadow-2xl"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />

                <motion.div
                  className="text-6xl mb-6"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎉
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  {isRTL ? 'أنت جاهز للبدء!' : '시작할 준비가 되셨습니다!'}
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  {isRTL 
                    ? 'سجل الآن وابدأ رحلتك في تعلم اللغة الكورية'
                    : '지금 가입하고 한국어 학습 여정을 시작하세요'}
                </p>

                <motion.button
                  onClick={handleStart}
                  className="px-12 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-rose-500/30 flex items-center justify-center gap-3 mx-auto hover:shadow-rose-500/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{isRTL ? 'ابدأ الآن' : '지금 시작하기'}</span>
                  <Rocket className="w-6 h-6" />
                </motion.button>

                <p className="mt-6 text-gray-500">
                  {isRTL ? 'أنشئ حساباً أو سجل دخولك' : '계정을 만들거나 로그인하세요'}
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Transition Animation */}
      <AnimatePresence>
        {isTransitioning && (
          <CurrentTransition onComplete={handleTransitionComplete} />
        )}
      </AnimatePresence>

      {/* Skip button (visible only on non-final slides) */}
      {currentSlide < slides.length - 1 && (
        <motion.button
          onClick={handleStart}
          className="absolute top-6 right-6 z-50 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 text-sm font-medium hover:bg-white transition-all flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span>{isRTL ? 'تخطي' : '건너뛰기'}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </motion.button>
      )}
    </div>
  );
};

export default Onboarding;
