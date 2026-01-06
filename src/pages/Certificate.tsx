import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Download, Award, Star, Trophy, Medal, Crown, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
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
              background: 'linear-gradient(145deg, #ffffff 0%, #fffbeb 25%, #fef3c7 50%, #fffbeb 75%, #ffffff 100%)'
            }}
          >
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="korean-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#b45309" strokeWidth="0.5" />
                  <circle cx="10" cy="10" r="4" fill="none" stroke="#b45309" strokeWidth="0.5" />
                </pattern>
                <rect x="0" y="0" width="100" height="100" fill="url(#korean-pattern)" />
              </svg>
            </div>

            {/* Outer Golden Border */}
            <div className="absolute inset-0 p-2">
              <div className="w-full h-full border-4 border-amber-400/60 rounded-2xl" />
            </div>

            {/* Inner Decorative Border */}
            <div className="absolute inset-0 p-5">
              <div className="w-full h-full border-2 border-double border-amber-500/40 rounded-xl" />
            </div>

            {/* Corner Ornaments */}
            <div className="absolute top-8 left-8">
              <div className="relative">
                <div className="w-20 h-20 border-t-4 border-l-4 border-amber-500 rounded-tl-2xl" />
                <Crown className="absolute top-2 left-2 w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div className="absolute top-8 right-8">
              <div className="relative">
                <div className="w-20 h-20 border-t-4 border-r-4 border-amber-500 rounded-tr-2xl" />
                <Crown className="absolute top-2 right-2 w-8 h-8 text-amber-500" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8">
              <div className="relative">
                <div className="w-20 h-20 border-b-4 border-l-4 border-amber-500 rounded-bl-2xl" />
                <Star className="absolute bottom-2 left-2 w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="relative">
                <div className="w-20 h-20 border-b-4 border-r-4 border-amber-500 rounded-br-2xl" />
                <Star className="absolute bottom-2 right-2 w-6 h-6 text-amber-500" />
              </div>
            </div>

            {/* Certificate Content */}
            <div className="relative z-10 px-12 py-16 md:px-20 md:py-20" dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Header with Logo */}
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                  <motion.div 
                    className="relative"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-xl shadow-amber-400/40">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
                        <Award className="w-12 h-12 text-amber-600" />
                      </div>
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
                    <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-amber-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </motion.div>
                </div>

                <h1 className="font-korean text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent mb-3">
                  수료증
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {isRTL ? 'شهادة إتمام الدراسة' : 'Certificate of Completion'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-400" />
                  <Trophy className="w-5 h-5" />
                  <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-400" />
                </div>
              </div>

              {/* Certification Text */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-4">
                  {isRTL ? 'نشهد بأن' : '아래 학생이'}
                </p>
              </div>

              {/* Recipient Name */}
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/30 via-amber-300/50 to-amber-200/30 rounded-xl blur-sm" />
                  <p className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 bg-clip-text text-transparent px-8 py-3">
                    {user?.email?.split('@')[0] || (isRTL ? 'اسم الطالب' : '학생 이름')}
                  </p>
                </div>
                <div className="mt-3 w-64 mx-auto h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              {/* Achievement Description */}
              <div className="text-center mb-10">
                <div className="max-w-lg mx-auto bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {isRTL 
                      ? 'قد أتم بنجاح وتميز جميع مستويات دورة تعلم اللغة الكورية، مُظهراً التزاماً واجتهاداً في إتقان أساسيات اللغة والكتابة والمحادثة.'
                      : '한국어 기초 학습 과정의 모든 레벨을 성공적으로 완료하였으며, 언어 기초, 쓰기 및 회화 능력에서 뛰어난 학습 능력과 헌신을 보여주었습니다.'}
                  </p>
                </div>
              </div>

              {/* Achievements Badges */}
              <div className="flex justify-center gap-4 mb-10 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {isRTL ? '6 مستويات' : '6 레벨 완료'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full border border-blue-200">
                  <Medal className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {isRTL ? 'جميع الاختبارات' : '모든 퀴즈 통과'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded-full border border-purple-200">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    {isRTL ? 'هوية موثقة' : '신원 확인됨'}
                  </span>
                </div>
              </div>

              {/* Date and Certificate Number */}
              <div className="flex justify-center items-center gap-12 mb-10 flex-wrap">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'تاريخ الإصدار' : '발급일'}</p>
                  <p className="font-semibold text-gray-800 text-lg">{today}</p>
                </div>
                <div className="w-px h-12 bg-amber-300 hidden md:block" />
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">{isRTL ? 'رقم الشهادة' : '인증번호'}</p>
                  <p className="font-mono font-semibold text-gray-800 text-lg">{certNumber}</p>
                </div>
              </div>

              {/* QR Code and Verification */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-amber-200">
                    <QRCodeSVG 
                      value={verificationUrl}
                      size={120}
                      level="H"
                      includeMargin={false}
                      bgColor="#ffffff"
                      fgColor="#b45309"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {isRTL ? 'امسح للتحقق من الشهادة' : 'QR 코드로 인증서 확인'}
                  </p>
                </div>

                <div className="text-center md:text-left">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">{isRTL ? 'مدير البرنامج' : '프로그램 디렉터'}</p>
                    <div className="font-korean text-2xl text-amber-600 mb-1">한국어 학습</div>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 rounded-full">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">
                    {isRTL ? 'شهادة معتمدة ومُصادق عليها رقمياً' : '디지털 인증 및 검증된 인증서'}
                  </span>
                  <Star className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>

            {/* Bottom Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Certificate;
