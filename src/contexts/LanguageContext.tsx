import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'ko';

interface Translations {
  [key: string]: {
    ar: string;
    ko: string;
  };
}

const translations: Translations = {
  // Welcome Page
  welcome: { ar: 'مرحباً', ko: '안녕하세요' },
  welcomeSubtitle: { ar: 'تعلم اللغة الكورية بسهولة', ko: '쉽게 한국어를 배우세요' },
  startLearning: { ar: 'ابدأ التعلم', ko: '학습 시작' },
  login: { ar: 'تسجيل الدخول', ko: '로그인' },
  signup: { ar: 'إنشاء حساب', ko: '회원가입' },
  
  // Auth
  email: { ar: 'البريد الإلكتروني', ko: '이메일' },
  password: { ar: 'كلمة المرور', ko: '비밀번호' },
  confirmPassword: { ar: 'تأكيد كلمة المرور', ko: '비밀번호 확인' },
  fullName: { ar: 'الاسم الكامل', ko: '이름' },
  loginWithGoogle: { ar: 'الدخول عبر جوجل', ko: '구글로 로그인' },
  orContinueWith: { ar: 'أو المتابعة باستخدام', ko: '또는 계속하기' },
  noAccount: { ar: 'ليس لديك حساب؟', ko: '계정이 없으신가요?' },
  haveAccount: { ar: 'لديك حساب بالفعل؟', ko: '이미 계정이 있으신가요?' },
  
  // Levels
  level1: { ar: 'المستوى الأول: الحروف', ko: '1단계: 글자' },
  level2: { ar: 'المستوى الثاني: المفردات', ko: '2단계: 어휘' },
  level3: { ar: 'المستوى الثالث: الجمل الأساسية', ko: '3단계: 기본 문장' },
  level4: { ar: 'المستوى الرابع: الجمل المتقدمة', ko: '4단계: 고급 문장' },
  
  // Learning
  consonants: { ar: 'الحروف الساكنة', ko: '자음' },
  vowels: { ar: 'الحروف المتحركة', ko: '모음' },
  listen: { ar: 'استمع', ko: '듣기' },
  memorized: { ar: 'تم الحفظ', ko: '암기 완료' },
  notMemorized: { ar: 'لم يُحفظ بعد', ko: '미암기' },
  pronunciation: { ar: 'النطق', ko: '발음' },
  arabic: { ar: 'بالعربية', ko: '아랍어' },
  english: { ar: 'بالإنجليزية', ko: '영어' },
  korean: { ar: 'بالكورية', ko: '한국어' },
  
  // Progress
  progress: { ar: 'التقدم', ko: '진행 상황' },
  completed: { ar: 'مكتمل', ko: '완료' },
  continue: { ar: 'متابعة', ko: '계속하기' },
  startLevel: { ar: 'ابدأ المستوى', ko: '단계 시작' },
  locked: { ar: 'مقفل', ko: '잠김' },
  
  // Quiz
  quiz: { ar: 'اختبار', ko: '시험' },
  question: { ar: 'سؤال', ko: '질문' },
  correct: { ar: 'صحيح!', ko: '정답!' },
  incorrect: { ar: 'خطأ', ko: '오답' },
  score: { ar: 'النتيجة', ko: '점수' },
  passed: { ar: 'ناجح', ko: '합격' },
  failed: { ar: 'راسب', ko: '불합격' },
  tryAgain: { ar: 'حاول مرة أخرى', ko: '다시 시도' },
  
  // Certificate
  certificate: { ar: 'الشهادة', ko: '수료증' },
  printCertificate: { ar: 'طباعة الشهادة', ko: '수료증 출력' },
  congratulations: { ar: 'مبروك!', ko: '축하합니다!' },
  completedCourse: { ar: 'لقد أتممت دورة تعلم اللغة الكورية', ko: '한국어 학습 과정을 완료했습니다' },
  
  // Profile
  profile: { ar: 'الملف الشخصي', ko: '프로필' },
  settings: { ar: 'الإعدادات', ko: '설정' },
  logout: { ar: 'تسجيل الخروج', ko: '로그아웃' },
  totalPoints: { ar: 'مجموع النقاط', ko: '총 점수' },
  streak: { ar: 'أيام متتالية', ko: '연속 학습' },
  currentLevel: { ar: 'المستوى الحالي', ko: '현재 단계' },
  
  // Dashboard
  dashboard: { ar: 'لوحة التحكم', ko: '대시보드' },
  myLearning: { ar: 'تعلمي', ko: '내 학습' },
  achievements: { ar: 'الإنجازات', ko: '업적' },
  keepGoing: { ar: 'استمر!', ko: '계속하세요!' },
  
  // Navigation
  home: { ar: 'الرئيسية', ko: '홈' },
  learn: { ar: 'تعلم', ko: '학습' },
  
  // Misc
  loading: { ar: 'جاري التحميل...', ko: '로딩 중...' },
  error: { ar: 'حدث خطأ', ko: '오류 발생' },
  save: { ar: 'حفظ', ko: '저장' },
  cancel: { ar: 'إلغاء', ko: '취소' },
  next: { ar: 'التالي', ko: '다음' },
  previous: { ar: 'السابق', ko: '이전' },
  finish: { ar: 'إنهاء', ko: '완료' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('koreanLearning_language') as Language | null;
    return saved ?? 'ar';
  });

  useEffect(() => {
    localStorage.setItem('koreanLearning_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
