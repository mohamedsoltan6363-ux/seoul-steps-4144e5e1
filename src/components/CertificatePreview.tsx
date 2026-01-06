import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Lock, ShieldCheck, Crown, Star, Trophy, Sparkles, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificatePreview: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10">
          <Award className="w-7 h-7 text-amber-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">
            {isRTL ? 'شهادتك المستقبلية' : '미래 인증서'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'أكمل جميع المستويات للحصول عليها' : '모든 레벨을 완료하면 받을 수 있습니다'}
          </p>
        </div>
      </div>

      {/* Certificate Preview - Protected */}
      <motion.div
        className="relative select-none"
        onContextMenu={handleContextMenu}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'auto'
        }}
      >
        <div
          className="w-full aspect-[1.4/1] rounded-2xl relative overflow-hidden shadow-xl"
          onDragStart={handleDragStart}
          style={{ 
            background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 30%, #fde68a 50%, #fef3c7 70%, #fffbeb 100%)'
          }}
        >
          {/* Decorative Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="cert-pattern" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="7.5" cy="7.5" r="5" fill="none" stroke="#b45309" strokeWidth="0.3" />
              </pattern>
              <rect x="0" y="0" width="100" height="100" fill="url(#cert-pattern)" />
            </svg>
          </div>

          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-5xl font-bold text-amber-900/10 rotate-[-20deg] tracking-widest">
              PREVIEW
            </div>
          </div>

          {/* Golden Border */}
          <div className="absolute inset-2 border-2 border-amber-400/50 rounded-xl" />
          <div className="absolute inset-4 border border-dashed border-amber-500/30 rounded-lg" />
          
          {/* Corner Decorations */}
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 border-t-2 border-l-2 border-amber-500/60 rounded-tl-xl" />
            <Crown className="absolute top-1 left-1 w-5 h-5 text-amber-500/50" />
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 border-t-2 border-r-2 border-amber-500/60 rounded-tr-xl" />
            <Crown className="absolute top-1 right-1 w-5 h-5 text-amber-500/50" />
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 border-b-2 border-l-2 border-amber-500/60 rounded-bl-xl" />
            <Star className="absolute bottom-1 left-1 w-4 h-4 text-amber-500/50" />
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="w-12 h-12 border-b-2 border-r-2 border-amber-500/60 rounded-br-xl" />
            <Star className="absolute bottom-1 right-1 w-4 h-4 text-amber-500/50" />
          </div>

          {/* Content - Blurred/Hidden */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            {/* Logo/Award Icon */}
            <motion.div 
              className="relative mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/40 to-amber-500/30 flex items-center justify-center border-2 border-amber-400/30">
                <Award className="w-8 h-8 text-amber-600/60" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400/60" />
            </motion.div>
            
            <h1 className="font-korean text-2xl font-bold text-amber-700/60 mb-1">
              수료증
            </h1>
            <h2 className="text-lg font-bold text-amber-800/50 mb-3">
              {isRTL ? 'شهادة إتمام' : 'Certificate of Completion'}
            </h2>

            {/* Decorative Line */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-amber-400/40" />
              <Trophy className="w-4 h-4 text-amber-500/40" />
              <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>

            {/* Hidden Name Area */}
            <div className="w-40 h-7 bg-amber-200/40 rounded-lg mb-3 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xs text-amber-700/50 font-medium">
                {isRTL ? '✨ اسمك هنا ✨' : '✨ 이름 입력 ✨'}
              </span>
            </div>

            {/* Hidden Info Areas */}
            <div className="w-52 h-5 bg-amber-200/30 rounded mb-2" />
            <div className="w-36 h-5 bg-amber-200/30 rounded mb-4" />

            {/* Hidden QR Area */}
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-amber-200/30 rounded-lg flex items-center justify-center">
                <Medal className="w-5 h-5 text-amber-500/40" />
              </div>
              <div className="space-y-1">
                <div className="w-20 h-3 bg-amber-200/30 rounded" />
                <div className="w-16 h-3 bg-amber-200/30 rounded" />
              </div>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400/40 via-amber-300/30 to-amber-400/40" />
        </div>

        {/* Protection Badge */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-full shadow-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Lock className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-amber-700">
            {isRTL ? 'محمية - للعرض فقط' : '보호됨 - 미리보기 전용'}
          </span>
        </motion.div>
      </motion.div>

      {/* Info Box */}
      <div className="mt-8 p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-base mb-2 text-foreground">
              {isRTL ? 'كيف تحصل على الشهادة الرسمية؟' : '공식 인증서를 받으려면?'}
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {isRTL ? 'أكمل جميع المستويات الستة بنجاح' : '6개 레벨 모두 완료'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {isRTL ? 'اجتز جميع الاختبارات بنسبة 80% أو أعلى' : '80% 이상으로 모든 퀴즈 통과'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {isRTL ? 'وثّق هويتك بالبطاقة الشخصية' : '신분증으로 본인 확인'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
