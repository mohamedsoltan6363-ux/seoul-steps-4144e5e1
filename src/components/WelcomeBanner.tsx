import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WelcomeBannerProps {
  variant?: 'default' | 'minimal' | 'gradient';
  className?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}
      >
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
        <span>
          {isRTL ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
        </span>
      </motion.div>
    );
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-rose-200/20 ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
              {isRTL ? 'محمد أيمن يرحب بك' : 'Mohamed Ayman welcomes you'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'تعلم الكورية بحب وشغف' : '사랑과 열정으로 한국어를 배우세요'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl p-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        <span className="text-sm text-muted-foreground">
          {isRTL ? 'محمد أيمن يرحب بك في رحلة تعلم اللغة الكورية' : 'Mohamed Ayman이 한국어 학습 여정을 환영합니다'}
        </span>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
