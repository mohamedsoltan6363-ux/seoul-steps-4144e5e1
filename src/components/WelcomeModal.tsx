import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import confetti from 'canvas-confetti';

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
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#EC4899', '#10B981', '#F59E0B']
        });
      }, 500);
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pill-shaped container */}
            <div className="relative bg-gradient-to-br from-primary via-violet-500 to-pink-500 rounded-[40px] p-1 shadow-2xl shadow-primary/30">
              <div className="bg-card rounded-[38px] p-6 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="relative text-center" dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Avatar/Icon area */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-500 rounded-full animate-pulse" />
                    <div className="absolute inset-1 bg-card rounded-full flex items-center justify-center">
                      <span className="text-4xl font-korean font-bold text-gradient">한</span>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-2 border-2 border-dashed border-primary/30 rounded-full"
                    />
                  </div>

                  {/* Korean greeting */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-korean text-2xl font-bold text-primary mb-2"
                  >
                    환영합니다!
                  </motion.p>

                  {/* Arabic/English greeting */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold mb-2"
                  >
                    {isRTL ? `مرحباً ${userName || 'بك'}!` : `Welcome ${userName || ''}!`}
                  </motion.h2>

                  {/* Welcome message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2 mb-4"
                  >
                    <p className="text-muted-foreground text-sm">
                      {isRTL 
                        ? 'محمد أمين يرحب بك في رحلة تعلم اللغة الكورية'
                        : 'Mohamed Amin welcomes you to your Korean learning journey'}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                      <span className="text-muted-foreground">
                        {isRTL ? 'نتمنى لك التوفيق!' : '화이팅!'}
                      </span>
                      <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                    </div>
                  </motion.div>

                  {/* Start button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleClose}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-pink-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isRTL ? 'ابدأ التعلم!' : '학습 시작!'}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: [0, (i % 2 === 0 ? 20 : -20)],
                  y: [0, -30]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="absolute"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
