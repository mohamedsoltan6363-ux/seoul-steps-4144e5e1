import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Flame, Target, Crown, Medal, Award, Zap, 
  BookOpen, MessageSquare, Sparkles, Heart, Gift, Rocket, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/contexts/LanguageContext';

interface AchievementData {
  id: string;
  titleAr: string;
  titleKo: string;
  descriptionAr: string;
  descriptionKo: string;
  icon: string;
  color: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: AchievementData | null;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-8 h-8" />,
  medal: <Medal className="w-8 h-8" />,
  award: <Award className="w-8 h-8" />,
  trophy: <Trophy className="w-8 h-8" />,
  book: <BookOpen className="w-8 h-8" />,
  target: <Target className="w-8 h-8" />,
  sparkles: <Sparkles className="w-8 h-8" />,
  message: <MessageSquare className="w-8 h-8" />,
  flame: <Flame className="w-8 h-8" />,
  crown: <Crown className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  gift: <Gift className="w-8 h-8" />,
  rocket: <Rocket className="w-8 h-8" />,
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Trigger confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4CAF50', '#2196F3'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4CAF50', '#2196F3'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} blur-3xl opacity-30 rounded-3xl`} />
            
            {/* Card */}
            <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header with gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-white/5 opacity-30" />
                
                {/* Animated stars */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                        ease: 'easeInOut'
                      }}
                      className="absolute"
                      style={{
                        top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                        left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-white/60" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2, damping: 10 }}
                  className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
                >
                  {iconMap[achievement.icon] || <Trophy className="w-8 h-8" />}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'ar' ? '🎉 إنجاز جديد!' : '🎉 새로운 업적!'}
                  </p>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'ar' ? achievement.titleAr : achievement.titleKo}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {language === 'ar' ? achievement.descriptionAr : achievement.descriptionKo}
                  </p>
                  
                  {/* Points badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${achievement.color} text-white font-bold shadow-lg`}
                  >
                    <Trophy className="w-5 h-5" />
                    +{achievement.points} {language === 'ar' ? 'نقطة' : '포인트'}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
