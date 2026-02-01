import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/onboarding-hero.png';

interface HeroSlideProps {
  isRTL: boolean;
}

const HeroSlide: React.FC<HeroSlideProps> = ({ isRTL }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-sky-100 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Animated Korean Characters Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['한', '국', '어', '가', '나', '다', '라', '마', '바', '사', '아', '자'].map((char, i) => (
          <motion.span
            key={i}
            className="absolute font-korean text-6xl text-rose-200/30 select-none"
            initial={{ 
              x: `${(i % 4) * 25 + 5}%`, 
              y: `${Math.floor(i / 4) * 35 + 10}%`,
              opacity: 0
            }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-rose-300/40 to-pink-300/40 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-br from-sky-300/40 to-blue-300/40 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-amber-300/40 to-yellow-300/40 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Image with glow */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 20,
            delay: 0.2
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/30 to-pink-400/30 rounded-full blur-3xl scale-125" />
          
          {/* Flag wave animation overlay */}
          <motion.div
            className="absolute top-0 right-0 w-full h-1/2"
            animate={{ 
              rotateZ: [0, 2, 0, -2, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.img
            src={heroImage}
            alt="Korean Learning Hero"
            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Sparkles around hero */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3"
              style={{
                top: `${20 + Math.sin(i * 60) * 30}%`,
                left: `${50 + Math.cos(i * 60) * 45}%`,
              }}
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z" fill="#F59E0B" />
              </svg>
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Badge */}
        <motion.div
          className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg shadow-rose-500/30 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isRTL ? '🎉 مرحباً بك!' : '🎉 환영합니다!'}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isRTL ? 'منصة تعلم الكورية' : '한국어 학습 플랫폼'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {isRTL 
            ? 'رحلتك لتعلم اللغة الكورية تبدأ الآن'
            : '한국어 학습 여정이 지금 시작됩니다'}
        </motion.p>

        {/* Developer credit */}
        <motion.div
          className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-purple-500 flex items-center justify-center text-white font-bold">
            م
          </div>
          <div className="text-start">
            <p className="text-sm text-gray-500">
              {isRTL ? 'تم التطوير بواسطة' : '개발자'}
            </p>
            <p className="font-bold text-gray-800">Mohamed Ayman</p>
          </div>
        </motion.div>

        {/* Animated arrow down */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm">{isRTL ? 'انتظر...' : '잠시만요...'}</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSlide;
