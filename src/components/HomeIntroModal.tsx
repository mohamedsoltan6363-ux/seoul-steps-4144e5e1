import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Code, GraduationCap, Heart, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import personKoreanFlag from '@/assets/person-korean-flag.png';

interface HomeIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomeIntroModal: React.FC<HomeIntroModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)' }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header gradient bar */}
            <div className="h-2 bg-gradient-to-r from-[hsl(220,80%,50%)] via-[hsl(270,60%,55%)] to-[hsl(340,75%,55%)]" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Avatar & Name */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-card shadow-lg mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <img src={personKoreanFlag} alt="Mohamed Ayman" className="w-full h-full object-cover" />
                </motion.div>
                <motion.h2
                  className="text-xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {isRTL ? 'أهلاً بك! 👋' : '안녕하세요! 👋'}
                </motion.h2>
                <motion.p
                  className="text-sm text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isRTL ? 'أنا محمد أيمن محمد سلطان' : 'Mohamed Ayman Mohamed Sultan'}
                </motion.p>
              </div>

              {/* Info Cards */}
              <div className="space-y-3 mb-6">
                <motion.div
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{isRTL ? 'طالب بالكلية البترولية' : '석유대학 학생'}</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'جامعة بنسلفانيا التكنولوجية' : 'Pennsylvania Technology University'}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{isRTL ? 'عمل تطوعي بالكامل' : '완전 자원봉사 프로젝트'}</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? 'قمت ببناء هذا النظام تطوعاً لخدمة الجامعة' : '대학교를 위해 자발적으로 구축'}</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{isRTL ? 'كيف تم بناؤه؟' : '어떻게 만들어졌나요?'}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isRTL
                        ? 'اتبعت منهجية الهندسة التجميعية (Assembly Engineering) — React + TypeScript للواجهة، Supabase للبيانات، Tailwind CSS للتصميم، مع Framer Motion للتأثيرات الحركية.'
                        : 'Assembly Engineering 방법론 — React + TypeScript, Supabase 백엔드, Tailwind CSS 디자인, Framer Motion 애니메이션.'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[hsl(220,80%,50%)] to-[hsl(270,60%,55%)] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isRTL ? 'ابدأ الاستكشاف!' : '탐험 시작!'}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeIntroModal;
