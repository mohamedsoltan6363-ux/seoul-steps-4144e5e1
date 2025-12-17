import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Download, Award } from 'lucide-react';

const Certificate: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'ko-KR');
  const certNumber = `KOR-${Date.now().toString(36).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-effect border-b border-border print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'ar' ? 'العودة' : '뒤로'}</span>
          </button>
          <button onClick={handlePrint} className="korean-button flex items-center gap-2">
            <Download className="w-5 h-5" />
            {language === 'ar' ? 'طباعة' : '출력'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex justify-center">
        <div
          ref={certRef}
          className="w-full max-w-3xl aspect-[1.4/1] bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden print:shadow-none print:rounded-none"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #f8f4ff 50%, #fff 100%)' }}
        >
          {/* Border Design */}
          <div className="absolute inset-4 border-4 border-double border-korean-gold/50 rounded-xl" />
          
          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-korean-gold rounded-tl-xl" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-korean-gold rounded-tr-xl" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-korean-gold rounded-bl-xl" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-korean-gold rounded-br-xl" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            <Award className="w-16 h-16 text-korean-gold mb-4" />
            
            <h1 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-2">
              수료증
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              {language === 'ar' ? 'شهادة إتمام' : 'Certificate of Completion'}
            </h2>

            <p className="text-lg text-muted-foreground mb-4">
              {language === 'ar' ? 'يُشهد بأن' : '이 증서는'}
            </p>

            <p className="text-2xl md:text-3xl font-bold text-gradient mb-4">
              {user?.email?.split('@')[0] || 'Student'}
            </p>

            <p className="text-lg text-muted-foreground mb-6 max-w-md">
              {language === 'ar' 
                ? 'قد أتم بنجاح دورة تعلم أساسيات اللغة الكورية'
                : '한국어 기초 학습 과정을 성공적으로 완료하였음을 증명합니다'}
            </p>

            <div className="flex items-center gap-8 text-sm text-muted-foreground mt-4">
              <div>
                <p className="font-semibold">{language === 'ar' ? 'التاريخ' : '날짜'}</p>
                <p>{today}</p>
              </div>
              <div>
                <p className="font-semibold">{language === 'ar' ? 'رقم الشهادة' : '인증번호'}</p>
                <p>{certNumber}</p>
              </div>
            </div>

            <div className="mt-6 font-korean text-xl text-korean-gold">
              한국어 학습
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Certificate;
