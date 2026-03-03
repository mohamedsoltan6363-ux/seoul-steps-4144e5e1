import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Gamepad2, Music, Video, Lightbulb, Trophy, Mic, BookOpenCheck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const Explore: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const isRTL = language === 'ar';

  const categories = [
    {
      id: 1,
      icon: BookOpen,
      label: isRTL ? 'المستويات' : '레벨',
      description: isRTL ? 'ابدأ رحلة التعلم من المبتدئ إلى المتقدم' : '초급부터 고급까지 학습을 시작하세요',
      path: '/dashboard',
      color: 'from-blue-500 to-indigo-600',
      badge: isRTL ? '6 مستويات' : '6 레벨',
    },
    {
      id: 2,
      icon: Gamepad2,
      label: isRTL ? 'الألعاب' : '게임',
      description: isRTL ? '10 ألعاب تعليمية تفاعلية ممتعة' : '10개의 재미있는 교육 게임',
      path: '/games',
      color: 'from-purple-500 to-pink-500',
      badge: isRTL ? '10 ألعاب' : '10 게임',
    },
    {
      id: 3,
      icon: Music,
      label: isRTL ? 'الأغاني' : '노래',
      description: isRTL ? 'تعلم من خلال الأغاني الكورية الشهيرة' : 'K-POP으로 배우세요',
      path: '/songs',
      color: 'from-rose-500 to-orange-500',
      badge: isRTL ? 'K-POP' : 'K-POP',
    },
    {
      id: 4,
      icon: Video,
      label: isRTL ? 'المسلسلات' : '드라마',
      description: isRTL ? 'شاهد مسلسلات كورية تعليمية مترجمة' : '한국 드라마로 배우세요',
      path: '/korean-series',
      color: 'from-amber-500 to-yellow-500',
      badge: isRTL ? 'مترجمة' : '자막',
    },
    {
      id: 5,
      icon: Lightbulb,
      label: isRTL ? 'القواعد' : '문법',
      description: isRTL ? 'تعلم قواعد اللغة الكورية بطريقة مبسطة' : '한국어 문법을 쉽게 배우세요',
      path: '/grammar',
      color: 'from-green-500 to-emerald-500',
      badge: isRTL ? 'أساسي' : '기본',
    },
    {
      id: 6,
      icon: Trophy,
      label: isRTL ? 'التحديات' : '챌린지',
      description: isRTL ? 'تحديات يومية لتحفيزك على التعلم المستمر' : '매일 도전으로 학습하세요',
      path: '/daily-challenge',
      color: 'from-indigo-500 to-purple-500',
      badge: isRTL ? 'يومي' : '매일',
    },
    {
      id: 7,
      icon: Mic,
      label: isRTL ? 'النطق' : '발음',
      description: isRTL ? 'تدرب على النطق الصحيح للحروف والكلمات' : '올바른 발음을 연습하세요',
      path: '/pronunciation',
      color: 'from-cyan-500 to-blue-500',
      badge: isRTL ? 'صوتي' : '음성',
    },
    {
      id: 8,
      icon: BookOpenCheck,
      label: isRTL ? 'القاموس' : '사전',
      description: isRTL ? 'ابحث عن أي كلمة كورية بسهولة وسرعة' : '한국어 단어를 검색하세요',
      path: '/dictionary',
      color: 'from-teal-500 to-cyan-500',
      badge: isRTL ? 'بحث' : '검색',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 40 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 pb-24">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </motion.button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-gradient">
              {isRTL ? 'اكتشف' : '탐색'}
            </h1>
          </div>
          <div className="w-9" />
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        className="container mx-auto px-4 pt-8 pb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-center text-muted-foreground max-w-md mx-auto">
          {isRTL 
            ? 'اختر طريقتك المفضلة للتعلم واستمتع برحلتك مع اللغة الكورية'
            : '좋아하는 학습 방법을 선택하고 한국어 여정을 즐기세요'}
        </p>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        className="container mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, i) => (
          <motion.button
            key={category.id}
            variants={itemVariants}
            onClick={() => navigate(category.path)}
            onHoverStart={() => setHoveredCard(i)}
            onHoverEnd={() => setHoveredCard(null)}
            className="group relative"
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-card p-4 sm:p-5 h-full flex flex-col items-center text-center border border-border/50 transition-shadow duration-300 hover:shadow-lg"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Gradient overlay */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <motion.div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 shadow-md`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </motion.div>

              {/* Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${category.color} text-white mb-2`}>
                {category.badge}
              </span>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                {category.label}
              </h3>

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Explore;
