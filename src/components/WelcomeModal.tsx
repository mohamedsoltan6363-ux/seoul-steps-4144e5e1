import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import confetti from 'canvas-confetti';
import koreanCharacter from '@/assets/korean-character.png';

interface WelcomeModalProps {
  userName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    const isFirstTime = localStorage.getItem('isFirstTimeUser');
    if (isFirstTime === 'true') {
      setIsOpen(true);
      // Play welcome sound
      const utterance = new SpeechSynthesisUtterance('환영합니다! 한국어 배우기에 오신 것을 환영합니다!');
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
      
      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']
        });
      }, 300);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.removeItem('isFirstTimeUser');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.3) 0%, rgba(0,0,0,0.8) 100%)'
          }}
          onClick={handleClose}
        >
          {/* Background floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  y: [0, -100],
                  x: Math.sin(i) * 50
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="absolute text-2xl"
                style={{
                  top: `${70 + Math.random() * 30}%`,
                  left: `${Math.random() * 100}%`
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🎉', '💜', '💖'][i % 7]}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main circular container */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Outer glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #4F46E5, #EC4899, #8B5CF6, #06B6D4, #10B981, #F59E0B, #4F46E5)',
                  padding: '4px'
                }}
              >
                <div className="w-full h-full rounded-full bg-slate-900" />
              </motion.div>

              {/* Inner content circle */}
              <div className="absolute inset-3 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-2xl">
                {/* Decorative inner rings */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-8 border border-pink-500/20 rounded-full"
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8" dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Image */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="relative mb-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-primary to-pink-500 shadow-lg shadow-primary/30">
                      <img 
                        src={koreanCharacter} 
                        alt="Korean Learning" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Star className="w-4 h-4 text-white fill-white" />
                    </motion.div>
                  </motion.div>

                  {/* Korean greeting with glow */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-korean text-3xl sm:text-4xl font-bold mb-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 40px rgba(139, 92, 246, 0.5)'
                    }}
                  >
                    환영합니다!
                  </motion.p>

                  {/* Arabic/English greeting */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl font-bold text-white mb-3"
                  >
                    {isRTL ? `مرحباً ${userName || 'بك'}!` : `Welcome ${userName || ''}!`}
                  </motion.h2>

                  {/* Welcome message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-2"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                      <p className="text-white/80 text-sm sm:text-base font-medium">
                        {isRTL 
                          ? 'محمد أيمن يرحب بك'
                          : 'Mohamed Ayman welcomes you'}
                      </p>
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm">
                      {isRTL ? 'نتمنى لك رحلة تعلم ممتعة!' : '즐거운 학습 여정을 바랍니다!'}
                    </p>
                  </motion.div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Start button at bottom */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleClose}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                {isRTL ? 'ابدأ التعلم!' : '학습 시작!'}
              </motion.button>

              {/* Floating sparkles around the circle */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25
                  }}
                  className="absolute"
                  style={{
                    top: `${50 + 45 * Math.sin((i / 8) * Math.PI * 2)}%`,
                    left: `${50 + 45 * Math.cos((i / 8) * Math.PI * 2)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
