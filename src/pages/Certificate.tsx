import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Download, Award, Star, Trophy, Medal, Crown, Sparkles, Shield, CheckCircle2, Heart, GraduationCap, BookOpen, Flame } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const Certificate: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);
  const isRTL = language === 'ar';

  const today = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const certNumber = `KOR-${Date.now().toString(36).toUpperCase()}`;
  const verificationUrl = `${window.location.origin}/verify/${certNumber}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-amber-200/50 dark:border-amber-800/30 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{isRTL ? 'العودة للوحة التحكم' : '대시보드로 돌아가기'}</span>
          </button>
          
          {/* Mohamed Amin Welcome */}
          <div className="hidden md:flex items-center gap-2 text-sm text-amber-600">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{isRTL ? 'محمد أمين يهنئك!' : 'Mohamed Amin congratulates you!'}</span>
          </div>

          <motion.button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-medium shadow-lg shadow-amber-500/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            {isRTL ? 'طباعة الشهادة' : '인증서 출력'}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex justify-center">
        <motion.div
          ref={certRef}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          {/* Certificate Card */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none"
            style={{
              background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 25%, #fde68a 50%, #fef3c7 75%, #fffbeb 100%)'
            }}
          >
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="korean-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="#b45309" strokeWidth="0.5" />
                    <circle cx="10" cy="10" r="4" fill="none" stroke="#b45309" strokeWidth="0.5" />
                    <path d="M10,2 L10,18 M2,10 L18,10" stroke="#b45309" strokeWidth="0.3" />
                  </pattern>
                  <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill="url(#korean-pattern)" />
              </svg>
            </div>

            {/* Decorative Ribbon Top */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

            {/* Outer Golden Border */}
            <div className="absolute inset-0 p-3">
              <div className="w-full h-full border-4 border-amber-500 rounded-2xl shadow-inner" />
            </div>

            {/* Inner Decorative Border */}
            <div className="absolute inset-0 p-6">
              <div className="w-full h-full border-2 border-double border-amber-400 rounded-xl" />
            </div>

            {/* Second Inner Border */}
            <div className="absolute inset-0 p-8">
              <div className="w-full h-full border border-amber-300/50 rounded-lg" />
            </div>

            {/* Corner Ornaments */}
            {[
              { position: 'top-10 left-10', border: 'border-t-4 border-l-4', rounded: 'rounded-tl-3xl' },
              { position: 'top-10 right-10', border: 'border-t-4 border-r-4', rounded: 'rounded-tr-3xl' },
              { position: 'bottom-10 left-10', border: 'border-b-4 border-l-4', rounded: 'rounded-bl-3xl' },
              { position: 'bottom-10 right-10', border: 'border-b-4 border-r-4', rounded: 'rounded-br-3xl' },
            ].map((corner, i) => (
              <div key={i} className={`absolute ${corner.position}`}>
                <div className={`w-24 h-24 ${corner.border} border-amber-500 ${corner.rounded}`} />
                <div className={`absolute ${i < 2 ? 'top-3' : 'bottom-3'} ${i % 2 === 0 ? 'left-3' : 'right-3'}`}>
                  {i === 0 && <Crown className="w-10 h-10 text-amber-600" />}
                  {i === 1 && <Trophy className="w-10 h-10 text-amber-600" />}
                  {i === 2 && <Medal className="w-10 h-10 text-amber-600" />}
                  {i === 3 && <Award className="w-10 h-10 text-amber-600" />}
                </div>
              </div>
            ))}

            {/* Certificate Content */}
            <div className="relative z-10 px-14 py-20 md:px-24 md:py-24" dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Header with Logo */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-8">
                  <motion.div 
                    className="relative"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1.5 shadow-2xl shadow-amber-400/50">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
                        <Award className="w-16 h-16 text-amber-600" />
                      </div>
                    </div>
                    <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-amber-500 animate-pulse" />
                    <Star className="absolute -bottom-2 -left-2 w-7 h-7 text-amber-500 fill-amber-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <Sparkles className="absolute top-1/2 -left-6 w-5 h-5 text-amber-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </motion.div>
                </div>

                {/* Korean Title */}
                <h1 className="font-korean text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                  수료증
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  {isRTL ? 'شهادة إتمام الدراسة' : 'Certificate of Completion'}
                </h2>
                <p className="text-lg text-amber-700 font-medium">
                  {isRTL ? 'برنامج تعلم اللغة الكورية الشامل' : '종합 한국어 학습 프로그램'}
                </p>
                <div className="flex items-center justify-center gap-3 mt-4 text-amber-600">
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-amber-400" />
                  <GraduationCap className="w-6 h-6" />
                  <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-amber-500 to-amber-400" />
                </div>
              </div>

              {/* Certification Text */}
              <div className="text-center mb-8">
                <p className="text-xl text-gray-700 font-medium">
                  {isRTL ? 'نشهد بأن الطالب/ة' : '아래 학생이 다음 과정을 성공적으로 완료하였음을 인증합니다'}
                </p>
              </div>

              {/* Recipient Name */}
              <div className="text-center mb-10">
                <div className="inline-block relative">
                  <div className="absolute -inset-6 bg-gradient-to-r from-amber-200/40 via-amber-300/60 to-amber-200/40 rounded-2xl blur-md" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl px-12 py-5 border-2 border-amber-400/50 shadow-lg">
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 bg-clip-text text-transparent">
                      {user?.email?.split('@')[0] || (isRTL ? 'اسم الطالب' : '학생 이름')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 w-80 mx-auto h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              </div>

              {/* Achievement Description */}
              <div className="text-center mb-12">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl p-8 border-2 border-amber-200 shadow-inner">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {isRTL 
                      ? 'قد أتم بنجاح وتميز جميع مستويات دورة تعلم اللغة الكورية، مُظهراً التزاماً واجتهاداً استثنائياً في إتقان أساسيات اللغة والكتابة والمحادثة والقواعد النحوية.'
                      : '한국어 기초 학습 과정의 모든 레벨을 성공적으로 완료하였으며, 언어 기초, 쓰기, 회화 및 문법 능력에서 뛰어난 학습 능력과 헌신을 보여주었습니다.'}
                  </p>
                  <p className="text-base text-amber-700 font-medium">
                    {isRTL 
                      ? 'وأظهر كفاءة عالية في الهانغول والمفردات والجمل الأساسية والمتقدمة'
                      : '한글, 어휘, 기초 및 고급 문장에서 높은 능력을 보여주었습니다'}
                  </p>
                </div>
              </div>

              {/* Achievements Badges */}
              <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {[
                  { icon: BookOpen, label: isRTL ? '6 مستويات مكتملة' : '6 레벨 완료', color: 'from-emerald-100 to-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconColor: 'text-emerald-600' },
                  { icon: Trophy, label: isRTL ? 'جميع الاختبارات' : '모든 퀴즈 통과', color: 'from-blue-100 to-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconColor: 'text-blue-600' },
                  { icon: Flame, label: isRTL ? 'تعلم متواصل' : '연속 학습', color: 'from-orange-100 to-orange-50', border: 'border-orange-200', text: 'text-orange-700', iconColor: 'text-orange-600' },
                  { icon: Shield, label: isRTL ? 'هوية موثقة' : '신원 확인됨', color: 'from-purple-100 to-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconColor: 'text-purple-600' },
                ].map((badge, i) => (
                  <div key={i} className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${badge.color} rounded-full border ${badge.border} shadow-sm`}>
                    <badge.icon className={`w-5 h-5 ${badge.iconColor}`} />
                    <span className={`text-sm font-semibold ${badge.text}`}>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Date and Certificate Number */}
              <div className="flex justify-center items-center gap-16 mb-12 flex-wrap">
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-amber-200">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'تاريخ الإصدار' : '발급일'}</p>
                  <p className="font-bold text-gray-800 text-xl">{today}</p>
                </div>
                <div className="w-px h-16 bg-amber-300 hidden md:block" />
                <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-amber-200">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'رقم الشهادة' : '인증번호'}</p>
                  <p className="font-mono font-bold text-gray-800 text-xl">{certNumber}</p>
                </div>
              </div>

              {/* QR Code and Signature */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="text-center">
                  <div className="inline-block p-5 bg-white rounded-2xl shadow-xl border-2 border-amber-200">
                    <QRCodeSVG 
                      value={verificationUrl}
                      size={130}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#b45309"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 font-medium">
                    {isRTL ? 'امسح للتحقق من الشهادة' : 'QR 코드로 인증서 확인'}
                  </p>
                </div>

                <div className="text-center md:text-left">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">{isRTL ? 'مدير البرنامج' : '프로그램 디렉터'}</p>
                    <div className="font-korean text-3xl text-amber-600 mb-2">한국어 학습</div>
                    <div className="w-40 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
                    <p className="text-sm text-amber-700 mt-2 font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      Mohamed Amin
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-14 text-center">
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 rounded-full border border-amber-300">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span className="text-base font-semibold text-amber-800">
                    {isRTL ? 'شهادة معتمدة ومُصادق عليها رقمياً' : '디지털 인증 및 검증된 인증서'}
                  </span>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <p className="mt-4 text-sm text-amber-600/80">
                  {isRTL ? 'تم إصدار هذه الشهادة بواسطة منصة تعلم اللغة الكورية' : '이 인증서는 한국어 학습 플랫폼에서 발급되었습니다'}
                </p>
              </div>
            </div>

            {/* Bottom Decorative Band */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />
              <div className="h-6 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Certificate;
