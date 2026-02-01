import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingSlideProps {
  characterImage: string;
  title: string;
  subtitle: string;
  description: string;
  koreanText?: string;
  bgGradient: string;
  iconEmoji?: string;
  isRTL: boolean;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  characterImage,
  title,
  subtitle,
  description,
  koreanText,
  bgGradient,
  iconEmoji,
  isRTL
}) => {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 ${bgGradient}`}>
      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, '-10%'],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Soft glowing orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

      {/* Content Container */}
      <motion.div 
        className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Character Image */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          }}
        >
          {/* Glow behind character */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-110" />
          
          {/* Character */}
          <motion.img
            src={characterImage}
            alt="Character"
            className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Icon emoji badge */}
          {iconEmoji && (
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-3xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              {iconEmoji}
            </motion.div>
          )}
        </motion.div>

        {/* Text Content - Speech Bubble Style */}
        <motion.div
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md shadow-2xl"
          initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Speech bubble pointer */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white/95 rotate-45 ${
              isRTL ? '-right-3' : '-left-3'
            }`}
          />
          
          {/* Korean text badge */}
          {koreanText && (
            <motion.div
              className="inline-block px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-korean mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {koreanText}
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg text-rose-500 font-medium mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {description}
          </motion.p>

          {/* Decorative dots */}
          <div className="flex gap-2 mt-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-rose-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingSlide;
