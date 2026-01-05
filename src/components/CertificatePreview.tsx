import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Lock, ShieldCheck } from 'lucide-react';
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
        <div className="p-2 rounded-xl bg-korean-gold/10">
          <Award className="w-6 h-6 text-korean-gold" />
        </div>
        <div>
          <h3 className="font-bold text-lg">
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
        transition={{ duration: 0.3 }}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'auto'
        }}
      >
        <div
          className="w-full aspect-[1.4/1] rounded-2xl p-6 relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 50%, hsl(var(--card)) 100%)',
            filter: 'blur(0.5px)'
          }}
        >
          {/* Watermark overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 50px,
                rgba(0,0,0,0.03) 50px,
                rgba(0,0,0,0.03) 100px
              )`
            }}
          >
            <div className="text-6xl font-bold text-foreground/20 rotate-[-30deg]">
              PREVIEW
            </div>
          </div>

          {/* Border Design */}
          <div className="absolute inset-3 border-2 border-dashed border-korean-gold/30 rounded-xl" />
          
          {/* Corner Decorations */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-korean-gold/50 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-korean-gold/50 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-korean-gold/50 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-korean-gold/50 rounded-br-lg" />

          {/* Content - Blurred/Hidden */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            <Award className="w-12 h-12 text-korean-gold/50 mb-3" />
            
            <h1 className="font-korean text-2xl font-bold text-primary/50 mb-1">
              수료증
            </h1>
            <h2 className="text-xl font-bold text-foreground/50 mb-4">
              {isRTL ? 'شهادة إتمام' : 'Certificate of Completion'}
            </h2>

            {/* Hidden Name Area */}
            <div className="w-48 h-8 bg-muted/50 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                {isRTL ? 'اسمك هنا' : '이름 입력'}
              </span>
            </div>

            {/* Hidden Info Areas */}
            <div className="w-64 h-6 bg-muted/30 rounded mb-2" />
            <div className="w-48 h-6 bg-muted/30 rounded mb-4" />

            {/* Hidden Date & Number */}
            <div className="flex gap-4">
              <div className="w-20 h-4 bg-muted/30 rounded" />
              <div className="w-24 h-4 bg-muted/30 rounded" />
            </div>
          </div>
        </div>

        {/* Protection Badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-lg">
          <Lock className="w-4 h-4 text-korean-gold" />
          <span className="text-xs font-medium">
            {isRTL ? 'محمية - للعرض فقط' : '보호됨 - 미리보기 전용'}
          </span>
        </div>
      </motion.div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-korean-green mt-0.5" />
          <div>
            <p className="font-medium text-sm mb-1">
              {isRTL ? 'كيف تحصل على الشهادة؟' : '인증서를 받으려면?'}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• {isRTL ? 'أكمل جميع المستويات الستة' : '6개 레벨 모두 완료'}</li>
              <li>• {isRTL ? 'اجتز جميع الاختبارات بنجاح' : '모든 퀴즈 통과'}</li>
              <li>• {isRTL ? 'وثّق هويتك بالبطاقة الشخصية' : '신분증으로 본인 확인'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;