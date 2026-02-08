import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Gamepad2, Music, Video, Lightbulb, Trophy } from 'lucide-react';

const Explore: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const isRTL = language === 'ar';

  const categories = [
    {
      id: 1,
      icon: BookOpen,
      label: isRTL ? 'المفردات' : '단어',
      description: isRTL ? 'تعلم كلمات وعبارات جديدة' : '새로운 단어와 표현을 배우세요',
      path: '/learn/1',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: Gamepad2,
      label: isRTL ? 'الألعاب' : '게임',
      description: isRTL ? 'تعلم من خلال الألعاب التفاعلية' : '게임을 통해 배우세요',
      path: '/games',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      icon: Music,
      label: isRTL ? 'الأغاني' : '노래',
      description: isRTL ? 'تعلم من خلال الموسيقى والأغاني' : '음악과 노래로 배우세요',
      path: '/songs',
      color: 'from-rose-500 to-orange-500'
    },
    {
      id: 4,
      icon: Video,
      label: isRTL ? 'المسلسلات' : '시리즈',
      description: isRTL ? 'شاهد مسلسلات كورية تعليمية' : '한국 드라마로 배우세요',
      path: '/korean-series',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      id: 5,
      icon: Lightbulb,
      label: isRTL ? 'القواعد' : '문법',
      description: isRTL ? 'تعلم قواعد اللغة الكورية' : '한국어 문법을 배우세요',
      path: '/grammar',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 6,
      icon: Trophy,
      label: isRTL ? 'التحديات' : '챌린지',
      description: isRTL ? 'شارك في تحديات يومية' : '매일의 도전에 참여하세요',
      path: '/daily-challenge',
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-blue-50 py-8 px-4">
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
          {isRTL ? 'اكتشف' : '탐색'}
        </h1>
        <p className="text-lg text-slate-600">
          {isRTL 
            ? 'اختر طريقتك المفضلة للتعلم واستمتع برحلتك التعليمية'
            : '선호하는 학습 방법을 선택하고 학습 여정을 즐기세요'}
        </p>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            onHoverStart={() => setHoveredCard(i)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <button
              onClick={() => navigate(category.path)}
              className="relative w-full h-full"
            >
              <motion.div
                className="group relative overflow-hidden rounded-2xl bg-white p-6 h-64 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-xl border border-blue-100"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-md`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold text-slate-800 text-${isRTL ? 'right' : 'left'} mb-2`}>
                    {category.label}
                  </h3>

                  {/* Description */}
                  <p className={`text-slate-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                    {category.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="relative z-10 flex justify-end"
                  animate={{ x: hoveredCard === i ? 4 : 0 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center`}
                    animate={{ scale: hoveredCard === i ? 1.1 : 1 }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-24 md:h-0" />
    </div>
  );
};

export default Explore;
