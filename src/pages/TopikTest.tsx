import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, 
  BookOpen, Headphones, Edit3, MessageSquare,
  Trophy, Target, AlertCircle, ChevronRight,
  Play, Pause, RotateCcw, Award, BookMarked,
  Sparkles, Star, Zap
} from 'lucide-react';

interface TopikQuestion {
  id: number;
  section: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  question: { ar: string; ko: string };
  korean?: string;
  passage?: { ar: string; ko: string };
  options: { text: string; isCorrect: boolean }[];
  explanation?: { ar: string; ko: string };
  difficulty: 'easy' | 'medium' | 'hard';
}

// TOPIK I Questions (Beginner Level 1-2)
const topik1Questions: TopikQuestion[] = [
  // === VOCABULARY SECTION ===
  {
    id: 1,
    section: 'vocabulary',
    question: { ar: 'ما معنى كلمة "사랑"؟', ko: '"사랑"의 뜻은?' },
    korean: '사랑',
    options: [
      { text: 'حب / Love', isCorrect: true },
      { text: 'صداقة / Friendship', isCorrect: false },
      { text: 'عائلة / Family', isCorrect: false },
      { text: 'سعادة / Happiness', isCorrect: false },
    ],
    explanation: { ar: 'سارانغ (사랑) تعني "حب" في اللغة الكورية', ko: '사랑은 "love"라는 뜻입니다' },
    difficulty: 'easy'
  },
  {
    id: 2,
    section: 'vocabulary',
    question: { ar: 'ما هو عكس كلمة "크다" (كبير)؟', ko: '"크다"의 반대말은?' },
    korean: '크다',
    options: [
      { text: '작다 (صغير)', isCorrect: true },
      { text: '높다 (عالي)', isCorrect: false },
      { text: '많다 (كثير)', isCorrect: false },
      { text: '길다 (طويل)', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 3,
    section: 'vocabulary',
    question: { ar: 'ما معنى "맛있다"؟', ko: '"맛있다"의 뜻은?' },
    korean: '맛있다',
    options: [
      { text: 'لذيذ', isCorrect: true },
      { text: 'حار', isCorrect: false },
      { text: 'بارد', isCorrect: false },
      { text: 'حلو', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 4,
    section: 'vocabulary',
    question: { ar: 'ما معنى "친구"؟', ko: '"친구"의 뜻은?' },
    korean: '친구',
    options: [
      { text: 'صديق', isCorrect: true },
      { text: 'عائلة', isCorrect: false },
      { text: 'معلم', isCorrect: false },
      { text: 'جار', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 5,
    section: 'vocabulary',
    question: { ar: 'ما معنى كلمة "학교"؟', ko: '"학교"의 뜻은?' },
    korean: '학교',
    options: [
      { text: 'مدرسة', isCorrect: true },
      { text: 'مستشفى', isCorrect: false },
      { text: 'مطعم', isCorrect: false },
      { text: 'متجر', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 6,
    section: 'vocabulary',
    question: { ar: 'ما هو الرقم الذي تمثله "다섯"؟', ko: '"다섯"은 어떤 숫자입니까?' },
    korean: '다섯',
    options: [
      { text: '5', isCorrect: true },
      { text: '3', isCorrect: false },
      { text: '7', isCorrect: false },
      { text: '4', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 7,
    section: 'vocabulary',
    question: { ar: 'ما معنى "아침"؟', ko: '"아침"의 뜻은?' },
    korean: '아침',
    options: [
      { text: 'صباح', isCorrect: true },
      { text: 'مساء', isCorrect: false },
      { text: 'ليل', isCorrect: false },
      { text: 'ظهر', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 8,
    section: 'vocabulary',
    question: { ar: 'ما معنى "가족"؟', ko: '"가족"의 뜻은?' },
    korean: '가족',
    options: [
      { text: 'عائلة', isCorrect: true },
      { text: 'صديق', isCorrect: false },
      { text: 'زميل', isCorrect: false },
      { text: 'جار', isCorrect: false },
    ],
    difficulty: 'easy'
  },

  // === GRAMMAR SECTION ===
  {
    id: 9,
    section: 'grammar',
    question: { ar: 'اختر الجملة الصحيحة نحوياً', ko: '문법적으로 올바른 문장을 선택하세요' },
    options: [
      { text: '저는 학생이에요', isCorrect: true },
      { text: '저는 학생이다에요', isCorrect: false },
      { text: '저가 학생이에요', isCorrect: false },
      { text: '저를 학생이에요', isCorrect: false },
    ],
    explanation: { ar: 'نستخدم "는/은" للموضوع و"이에요/예요" للربط', ko: '주어에는 "는/은"을, 서술어에는 "이에요/예요"를 사용합니다' },
    difficulty: 'medium'
  },
  {
    id: 10,
    section: 'grammar',
    question: { ar: 'أكمل الجملة: "저는 한국어___ 공부해요"', ko: '"저는 한국어___ 공부해요" 빈칸을 채우세요' },
    options: [
      { text: '를', isCorrect: true },
      { text: '가', isCorrect: false },
      { text: '은', isCorrect: false },
      { text: '에', isCorrect: false },
    ],
    explanation: { ar: 'نستخدم "를/을" لتحديد المفعول به', ko: '목적어에는 "를/을"을 사용합니다' },
    difficulty: 'medium'
  },
  {
    id: 11,
    section: 'grammar',
    question: { ar: 'أي صيغة صحيحة للماضي من "가다"؟', ko: '"가다"의 과거형은?' },
    options: [
      { text: '갔어요', isCorrect: true },
      { text: '가았어요', isCorrect: false },
      { text: '갔다요', isCorrect: false },
      { text: '가어요', isCorrect: false },
    ],
    explanation: { ar: 'الفعل "가다" يصبح "갔어요" في الماضي', ko: '"가다"의 과거형은 "갔어요"입니다' },
    difficulty: 'hard'
  },
  {
    id: 12,
    section: 'grammar',
    question: { ar: 'أكمل: "학교___ 가요" (أذهب إلى المدرسة)', ko: '"학교___ 가요" 빈칸을 채우세요' },
    options: [
      { text: '에', isCorrect: true },
      { text: '를', isCorrect: false },
      { text: '이', isCorrect: false },
      { text: '와', isCorrect: false },
    ],
    explanation: { ar: 'نستخدم "에" للإشارة إلى الاتجاه أو المكان', ko: '방향이나 장소를 나타낼 때 "에"를 사용합니다' },
    difficulty: 'medium'
  },
  {
    id: 13,
    section: 'grammar',
    question: { ar: 'أكمل: "친구___ 만나요" (ألتقي بصديقي)', ko: '"친구___ 만나요" 빈칸을 채우세요' },
    options: [
      { text: '를', isCorrect: true },
      { text: '에', isCorrect: false },
      { text: '가', isCorrect: false },
      { text: '도', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 14,
    section: 'grammar',
    question: { ar: 'ما هي الصيغة المستقبلية لـ "먹다"؟', ko: '"먹다"의 미래형은?' },
    options: [
      { text: '먹을 거예요', isCorrect: true },
      { text: '먹었어요', isCorrect: false },
      { text: '먹고 있어요', isCorrect: false },
      { text: '먹는다', isCorrect: false },
    ],
    explanation: { ar: 'للمستقبل نستخدم صيغة "ㄹ/을 거예요"', ko: '미래형은 "ㄹ/을 거예요"를 사용합니다' },
    difficulty: 'hard'
  },
  {
    id: 15,
    section: 'grammar',
    question: { ar: 'أكمل: "오늘 날씨___ 좋아요"', ko: '"오늘 날씨___ 좋아요" 빈칸을 채우세요' },
    options: [
      { text: '가', isCorrect: true },
      { text: '를', isCorrect: false },
      { text: '에', isCorrect: false },
      { text: '도', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 16,
    section: 'grammar',
    question: { ar: 'اختر الجملة الصحيحة:', ko: '올바른 문장을 선택하세요:' },
    options: [
      { text: '저는 빵을 먹어요', isCorrect: true },
      { text: '저는 빵이 먹어요', isCorrect: false },
      { text: '저는 빵에 먹어요', isCorrect: false },
      { text: '저는 빵가 먹어요', isCorrect: false },
    ],
    difficulty: 'medium'
  },

  // === READING SECTION ===
  {
    id: 17,
    section: 'reading',
    question: { ar: 'ماذا تعني هذه الجملة: "오늘 날씨가 좋아요"؟', ko: '"오늘 날씨가 좋아요"는 무슨 뜻입니까?' },
    korean: '오늘 날씨가 좋아요',
    options: [
      { text: 'الطقس جميل اليوم', isCorrect: true },
      { text: 'أنا بخير اليوم', isCorrect: false },
      { text: 'الطعام لذيذ اليوم', isCorrect: false },
      { text: 'أنا مشغول اليوم', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 18,
    section: 'reading',
    question: { ar: 'ماذا يطلب الشخص في هذه الجملة: "물 주세요"؟', ko: '"물 주세요"에서 무엇을 부탁합니까?' },
    korean: '물 주세요',
    options: [
      { text: 'ماء', isCorrect: true },
      { text: 'طعام', isCorrect: false },
      { text: 'قهوة', isCorrect: false },
      { text: 'شاي', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 19,
    section: 'reading',
    question: { ar: 'ما الوقت المذكور في "지금 세 시예요"؟', ko: '"지금 세 시예요"는 몇 시입니까?' },
    korean: '지금 세 시예요',
    options: [
      { text: 'الساعة 3', isCorrect: true },
      { text: 'الساعة 4', isCorrect: false },
      { text: 'الساعة 2', isCorrect: false },
      { text: 'الساعة 5', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 20,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص التالي ثم أجب:', 
      ko: '다음 글을 읽고 답하세요:' 
    },
    question: { 
      ar: '"저는 아침에 빵을 먹어요. 그리고 커피를 마셔요." - ماذا يأكل الشخص صباحاً؟', 
      ko: '"저는 아침에 빵을 먹어요. 그리고 커피를 마셔요." - 아침에 무엇을 먹습니까?' 
    },
    korean: '저는 아침에 빵을 먹어요. 그리고 커피를 마셔요.',
    options: [
      { text: 'خبز وقهوة', isCorrect: true },
      { text: 'أرز وشاي', isCorrect: false },
      { text: 'بيض وحليب', isCorrect: false },
      { text: 'فواكه وعصير', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 21,
    section: 'reading',
    question: { ar: 'ماذا تعني: "어디에 가요?"', ko: '"어디에 가요?"는 무슨 뜻입니까?' },
    korean: '어디에 가요?',
    options: [
      { text: 'إلى أين تذهب؟', isCorrect: true },
      { text: 'ماذا تفعل؟', isCorrect: false },
      { text: 'من أنت؟', isCorrect: false },
      { text: 'كيف حالك؟', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 22,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص التالي:', 
      ko: '다음 글을 읽으세요:' 
    },
    question: { 
      ar: '"제 이름은 민수예요. 저는 서울에 살아요." - أين يعيش مينسو؟', 
      ko: '"제 이름은 민수예요. 저는 서울에 살아요." - 민수는 어디에 삽니까?' 
    },
    korean: '제 이름은 민수예요. 저는 서울에 살아요.',
    options: [
      { text: 'سيول', isCorrect: true },
      { text: 'بوسان', isCorrect: false },
      { text: 'إنشون', isCorrect: false },
      { text: 'دايغو', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 23,
    section: 'reading',
    question: { ar: 'ماذا تعني: "이것은 뭐예요?"', ko: '"이것은 뭐예요?"는 무슨 뜻입니까?' },
    korean: '이것은 뭐예요?',
    options: [
      { text: 'ما هذا؟', isCorrect: true },
      { text: 'أين هذا؟', isCorrect: false },
      { text: 'لمن هذا؟', isCorrect: false },
      { text: 'كم هذا؟', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 24,
    section: 'reading',
    passage: { 
      ar: 'اقرأ المحادثة:', 
      ko: '대화를 읽으세요:' 
    },
    question: { 
      ar: 'أ: "뭐 해요?" ب: "책을 읽어요." - ماذا يفعل الشخص ب؟', 
      ko: '가: "뭐 해요?" 나: "책을 읽어요." - 나는 무엇을 합니까?' 
    },
    korean: '가: 뭐 해요?\n나: 책을 읽어요.',
    options: [
      { text: 'يقرأ كتاباً', isCorrect: true },
      { text: 'يشاهد التلفاز', isCorrect: false },
      { text: 'يأكل', isCorrect: false },
      { text: 'ينام', isCorrect: false },
    ],
    difficulty: 'medium'
  },

  // === LISTENING SIMULATION ===
  {
    id: 25,
    section: 'listening',
    question: { 
      ar: '(استماع) إذا سمعت "감사합니다", ماذا يقول المتحدث؟', 
      ko: '(듣기) "감사합니다"를 들었다면, 화자는 무엇을 말합니까?' 
    },
    korean: '감사합니다',
    options: [
      { text: 'شكراً', isCorrect: true },
      { text: 'آسف', isCorrect: false },
      { text: 'مرحباً', isCorrect: false },
      { text: 'مع السلامة', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 26,
    section: 'listening',
    question: { 
      ar: '(استماع) "안녕히 가세요" تقال عندما:', 
      ko: '(듣기) "안녕히 가세요"는 언제 말합니까?' 
    },
    korean: '안녕히 가세요',
    options: [
      { text: 'عند الوداع (للذاهب)', isCorrect: true },
      { text: 'عند اللقاء', isCorrect: false },
      { text: 'عند الشكر', isCorrect: false },
      { text: 'عند الاعتذار', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 27,
    section: 'listening',
    question: { 
      ar: '(استماع) ما الرد المناسب لـ "잘 지내요?"', 
      ko: '(듣기) "잘 지내요?"에 대한 적절한 대답은?' 
    },
    korean: '잘 지내요?',
    options: [
      { text: '네, 잘 지내요', isCorrect: true },
      { text: '안녕하세요', isCorrect: false },
      { text: '감사합니다', isCorrect: false },
      { text: '괜찮아요', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 28,
    section: 'listening',
    question: { 
      ar: '(استماع) "죄송합니다" تستخدم للتعبير عن:', 
      ko: '(듣기) "죄송합니다"는 무엇을 표현할 때 사용합니까?' 
    },
    korean: '죄송합니다',
    options: [
      { text: 'الاعتذار', isCorrect: true },
      { text: 'الشكر', isCorrect: false },
      { text: 'السعادة', isCorrect: false },
      { text: 'الحزن', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 29,
    section: 'vocabulary',
    question: { ar: 'ما معنى "행복"؟', ko: '"행복"의 뜻은?' },
    korean: '행복',
    options: [
      { text: 'سعادة', isCorrect: true },
      { text: 'حزن', isCorrect: false },
      { text: 'غضب', isCorrect: false },
      { text: 'خوف', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 30,
    section: 'vocabulary',
    question: { ar: 'ما معنى "시간"؟', ko: '"시간"의 뜻은?' },
    korean: '시간',
    options: [
      { text: 'وقت', isCorrect: true },
      { text: 'مكان', isCorrect: false },
      { text: 'شخص', isCorrect: false },
      { text: 'شيء', isCorrect: false },
    ],
    difficulty: 'easy'
  },
];

// TOPIK II Questions (Intermediate-Advanced Level 3-6)
const topik2Questions: TopikQuestion[] = [
  // === VOCABULARY SECTION ===
  {
    id: 1,
    section: 'vocabulary',
    question: { ar: 'ما معنى "경험"؟', ko: '"경험"의 뜻은?' },
    korean: '경험',
    options: [
      { text: 'تجربة / خبرة', isCorrect: true },
      { text: 'معرفة', isCorrect: false },
      { text: 'دراسة', isCorrect: false },
      { text: 'عمل', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 2,
    section: 'vocabulary',
    question: { ar: 'ما معنى "환경"؟', ko: '"환경"의 뜻은?' },
    korean: '환경',
    options: [
      { text: 'بيئة', isCorrect: true },
      { text: 'طبيعة', isCorrect: false },
      { text: 'مناخ', isCorrect: false },
      { text: 'جو', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 3,
    section: 'vocabulary',
    question: { ar: 'ما معنى "발전"؟', ko: '"발전"의 뜻은?' },
    korean: '발전',
    options: [
      { text: 'تطور / تقدم', isCorrect: true },
      { text: 'تراجع', isCorrect: false },
      { text: 'استقرار', isCorrect: false },
      { text: 'تغيير', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 4,
    section: 'vocabulary',
    question: { ar: 'ما معنى "책임"؟', ko: '"책임"의 뜻은?' },
    korean: '책임',
    options: [
      { text: 'مسؤولية', isCorrect: true },
      { text: 'واجب', isCorrect: false },
      { text: 'حق', isCorrect: false },
      { text: 'قانون', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 5,
    section: 'vocabulary',
    question: { ar: 'ما معنى "성공"؟', ko: '"성공"의 뜻은?' },
    korean: '성공',
    options: [
      { text: 'نجاح', isCorrect: true },
      { text: 'فشل', isCorrect: false },
      { text: 'محاولة', isCorrect: false },
      { text: 'جهد', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 6,
    section: 'vocabulary',
    question: { ar: 'ما معنى "관계"؟', ko: '"관계"의 뜻은?' },
    korean: '관계',
    options: [
      { text: 'علاقة', isCorrect: true },
      { text: 'صداقة', isCorrect: false },
      { text: 'حب', isCorrect: false },
      { text: 'زواج', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 7,
    section: 'vocabulary',
    question: { ar: 'ما معنى "문화"؟', ko: '"문화"의 뜻은?' },
    korean: '문화',
    options: [
      { text: 'ثقافة', isCorrect: true },
      { text: 'تاريخ', isCorrect: false },
      { text: 'تقليد', isCorrect: false },
      { text: 'فن', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 8,
    section: 'vocabulary',
    question: { ar: 'ما معنى "정보"؟', ko: '"정보"의 뜻은?' },
    korean: '정보',
    options: [
      { text: 'معلومات', isCorrect: true },
      { text: 'أخبار', isCorrect: false },
      { text: 'بيانات', isCorrect: false },
      { text: 'حقائق', isCorrect: false },
    ],
    difficulty: 'easy'
  },

  // === GRAMMAR SECTION ===
  {
    id: 9,
    section: 'grammar',
    question: { ar: 'اختر الجملة الصحيحة باستخدام "~기 때문에":', ko: '"~기 때문에"를 사용한 올바른 문장을 선택하세요:' },
    options: [
      { text: '비가 오기 때문에 우산을 가져갔어요', isCorrect: true },
      { text: '비가 오기 때문에 우산을 가져가요', isCorrect: false },
      { text: '비가 왔기 때문에 우산을 가져갔어요', isCorrect: false },
      { text: '비가 오는 때문에 우산을 가져갔어요', isCorrect: false },
    ],
    explanation: { ar: '"~기 때문에" تستخدم لربط السبب والنتيجة', ko: '"~기 때문에"는 원인과 결과를 연결할 때 사용합니다' },
    difficulty: 'hard'
  },
  {
    id: 10,
    section: 'grammar',
    question: { ar: 'أكمل: "열심히 공부하_____ 시험에 합격했어요"', ko: '"열심히 공부하_____ 시험에 합격했어요" 빈칸을 채우세요' },
    options: [
      { text: '면', isCorrect: false },
      { text: '니까', isCorrect: false },
      { text: '서', isCorrect: true },
      { text: '고', isCorrect: false },
    ],
    explanation: { ar: '"~아서/어서" تستخدم للربط بين السبب والنتيجة بترتيب زمني', ko: '"~아서/어서"는 시간 순서대로 원인과 결과를 연결합니다' },
    difficulty: 'hard'
  },
  {
    id: 11,
    section: 'grammar',
    question: { ar: 'اختر الاستخدام الصحيح لـ "~(으)ㄹ 수 있다":', ko: '"~(으)ㄹ 수 있다"의 올바른 사용을 선택하세요:' },
    options: [
      { text: '저는 한국어를 말할 수 있어요', isCorrect: true },
      { text: '저는 한국어를 말하는 수 있어요', isCorrect: false },
      { text: '저는 한국어를 말한 수 있어요', isCorrect: false },
      { text: '저는 한국어를 말았을 수 있어요', isCorrect: false },
    ],
    explanation: { ar: '"~(으)ㄹ 수 있다" تعبر عن القدرة أو الإمكانية', ko: '"~(으)ㄹ 수 있다"는 능력이나 가능성을 나타냅니다' },
    difficulty: 'medium'
  },
  {
    id: 12,
    section: 'grammar',
    question: { ar: 'أكمل: "내일 회의가 _____ 오늘 준비해야 해요"', ko: '"내일 회의가 _____ 오늘 준비해야 해요" 빈칸을 채우세요' },
    options: [
      { text: '있으니까', isCorrect: true },
      { text: '있어서', isCorrect: false },
      { text: '있으면', isCorrect: false },
      { text: '있고', isCorrect: false },
    ],
    explanation: { ar: '"~(으)니까" تستخدم لإعطاء سبب مع أمر أو اقتراح', ko: '"~(으)니까"는 명령이나 제안의 이유를 말할 때 사용합니다' },
    difficulty: 'hard'
  },
  {
    id: 13,
    section: 'grammar',
    question: { ar: 'اختر الجملة الصحيحة مع "~(으)ㄹ 때":', ko: '"~(으)ㄹ 때"를 사용한 올바른 문장을 선택하세요:' },
    options: [
      { text: '어릴 때 서울에서 살았어요', isCorrect: true },
      { text: '어렸을 때 서울에서 살았어요', isCorrect: false },
      { text: '어리는 때 서울에서 살았어요', isCorrect: false },
      { text: '어린 때 서울에서 살았어요', isCorrect: false },
    ],
    difficulty: 'hard'
  },
  {
    id: 14,
    section: 'grammar',
    question: { ar: 'أكمل: "이 책은 _____ 재미있어요"', ko: '"이 책은 _____ 재미있어요" 빈칸을 채우세요' },
    options: [
      { text: '읽으면 읽을수록', isCorrect: true },
      { text: '읽으면 읽으면', isCorrect: false },
      { text: '읽을수록 읽으면', isCorrect: false },
      { text: '읽으니까 읽을수록', isCorrect: false },
    ],
    explanation: { ar: '"~(으)면 ~(으)ㄹ수록" تعني "كلما... كلما..."', ko: '"~(으)면 ~(으)ㄹ수록"은 "~하면 할수록"의 의미입니다' },
    difficulty: 'hard'
  },
  {
    id: 15,
    section: 'grammar',
    question: { ar: 'اختر الصحيح: "시간이 _____ 연락할게요"', ko: '"시간이 _____ 연락할게요" 빈칸을 채우세요' },
    options: [
      { text: '되면', isCorrect: true },
      { text: '되서', isCorrect: false },
      { text: '되니까', isCorrect: false },
      { text: '되고', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 16,
    section: 'grammar',
    question: { ar: 'أكمل: "그 영화를 _____ 울었어요"', ko: '"그 영화를 _____ 울었어요" 빈칸을 채우세요' },
    options: [
      { text: '보다가', isCorrect: true },
      { text: '보면서', isCorrect: false },
      { text: '보고', isCorrect: false },
      { text: '봐서', isCorrect: false },
    ],
    explanation: { ar: '"~다가" تستخدم عندما يتغير فعل أثناء فعل آخر', ko: '"~다가"는 동작이 중간에 바뀔 때 사용합니다' },
    difficulty: 'hard'
  },

  // === READING SECTION ===
  {
    id: 17,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص:', 
      ko: '다음 글을 읽으세요:' 
    },
    question: { 
      ar: '"요즘 한국에서는 1인 가구가 증가하고 있습니다. 이로 인해 편의점 음식이나 배달 음식의 인기가 높아지고 있습니다." - ما سبب زيادة شعبية طعام التوصيل؟', 
      ko: '"요즘 한국에서는 1인 가구가 증가하고 있습니다. 이로 인해 편의점 음식이나 배달 음식의 인기가 높아지고 있습니다." - 배달 음식 인기 증가의 원인은?' 
    },
    korean: '요즘 한국에서는 1인 가구가 증가하고 있습니다. 이로 인해 편의점 음식이나 배달 음식의 인기가 높아지고 있습니다.',
    options: [
      { text: 'زيادة الأسر المكونة من شخص واحد', isCorrect: true },
      { text: 'انخفاض أسعار الطعام', isCorrect: false },
      { text: 'تحسن جودة الطعام', isCorrect: false },
      { text: 'زيادة عدد المطاعم', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 18,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص:', 
      ko: '다음 글을 읽으세요:' 
    },
    question: { 
      ar: '"기후 변화로 인해 전 세계적으로 이상 기후 현상이 늘어나고 있다. 폭염, 한파, 폭우 등 극단적인 날씨가 자주 발생하고 있다." - ما الموضوع الرئيسي؟', 
      ko: '"기후 변화로 인해 전 세계적으로 이상 기후 현상이 늘어나고 있다. 폭염, 한파, 폭우 등 극단적인 날씨가 자주 발생하고 있다." - 주제는?' 
    },
    korean: '기후 변화로 인해 전 세계적으로 이상 기후 현상이 늘어나고 있다.',
    options: [
      { text: 'تغير المناخ والظواهر الجوية المتطرفة', isCorrect: true },
      { text: 'السياحة في الشتاء', isCorrect: false },
      { text: 'الطاقة المتجددة', isCorrect: false },
      { text: 'التلوث البيئي', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 19,
    section: 'reading',
    passage: { 
      ar: 'اقرأ الإعلان:', 
      ko: '광고를 읽으세요:' 
    },
    question: { 
      ar: '"신입 사원 모집\n지원 자격: 대학 졸업자, 영어 능통자 우대\n근무 시간: 9시~18시\n급여: 협의" - ما المطلوب للتقدم؟', 
      ko: '"신입 사원 모집\n지원 자격: 대학 졸업자, 영어 능통자 우대\n근무 시간: 9시~18시\n급여: 협의" - 지원 자격은?' 
    },
    korean: '신입 사원 모집\n지원 자격: 대학 졸업자, 영어 능통자 우대',
    options: [
      { text: 'خريج جامعة، يفضل من يجيد الإنجليزية', isCorrect: true },
      { text: 'خبرة 5 سنوات على الأقل', isCorrect: false },
      { text: 'شهادة ماجستير', isCorrect: false },
      { text: 'إجادة اللغة الكورية فقط', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 20,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص:', 
      ko: '다음 글을 읽으세요:' 
    },
    question: { 
      ar: '"인공지능 기술의 발전으로 많은 직업이 사라질 것이라는 우려가 있다. 하지만 동시에 새로운 직업도 생겨날 것이다." - ما موقف الكاتب؟', 
      ko: '"인공지능 기술의 발전으로 많은 직업이 사라질 것이라는 우려가 있다. 하지만 동시에 새로운 직업도 생겨날 것이다." - 필자의 관점은?' 
    },
    korean: '인공지능 기술의 발전으로 많은 직업이 사라질 것이라는 우려가 있다. 하지만 동시에 새로운 직업도 생겨날 것이다.',
    options: [
      { text: 'متوازن - بعض الوظائف ستختفي وأخرى ستظهر', isCorrect: true },
      { text: 'سلبي تماماً', isCorrect: false },
      { text: 'إيجابي تماماً', isCorrect: false },
      { text: 'محايد بدون رأي', isCorrect: false },
    ],
    difficulty: 'hard'
  },
  {
    id: 21,
    section: 'reading',
    question: { ar: 'ما معنى المثل الكوري: "시작이 반이다"؟', ko: '"시작이 반이다"의 뜻은?' },
    korean: '시작이 반이다',
    options: [
      { text: 'البداية نصف العمل', isCorrect: true },
      { text: 'النهاية أهم من البداية', isCorrect: false },
      { text: 'الوقت من ذهب', isCorrect: false },
      { text: 'الصبر مفتاح الفرج', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 22,
    section: 'reading',
    passage: { 
      ar: 'اقرأ النص:', 
      ko: '다음 글을 읽으세요:' 
    },
    question: { 
      ar: '"한국의 사계절은 뚜렷합니다. 봄에는 벚꽃이 피고, 여름에는 덥고 습합니다. 가을에는 단풍이 아름답고, 겨울에는 눈이 옵니다." - ما الذي يميز كوريا حسب النص؟', 
      ko: '"한국의 사계절은 뚜렷합니다..." - 한국의 특징은?' 
    },
    korean: '한국의 사계절은 뚜렷합니다.',
    options: [
      { text: 'الفصول الأربعة واضحة ومميزة', isCorrect: true },
      { text: 'الطقس حار طوال السنة', isCorrect: false },
      { text: 'لا يوجد شتاء', isCorrect: false },
      { text: 'المطر يهطل دائماً', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 23,
    section: 'reading',
    question: { ar: 'ماذا يعني "고생 끝에 낙이 온다"؟', ko: '"고생 끝에 낙이 온다"의 뜻은?' },
    korean: '고생 끝에 낙이 온다',
    options: [
      { text: 'بعد المشقة تأتي الراحة', isCorrect: true },
      { text: 'لا ألم لا مكسب', isCorrect: false },
      { text: 'الصديق وقت الضيق', isCorrect: false },
      { text: 'من جد وجد', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 24,
    section: 'reading',
    passage: { 
      ar: 'اقرأ الخبر:', 
      ko: '뉴스를 읽으세요:' 
    },
    question: { 
      ar: '"서울시는 내년부터 대중교통 요금을 10% 인상할 계획이라고 발표했다. 시민들의 반발이 예상된다." - ماذا ستفعل سيول؟', 
      ko: '"서울시는 내년부터 대중교통 요금을 10% 인상할 계획..." - 서울시는 무엇을 할 계획입니까?' 
    },
    korean: '서울시는 내년부터 대중교통 요금을 10% 인상할 계획이라고 발표했다.',
    options: [
      { text: 'رفع أسعار النقل العام 10%', isCorrect: true },
      { text: 'خفض أسعار النقل', isCorrect: false },
      { text: 'إلغاء وسائل النقل العام', isCorrect: false },
      { text: 'بناء مترو جديد', isCorrect: false },
    ],
    difficulty: 'medium'
  },

  // === LISTENING SIMULATION ===
  {
    id: 25,
    section: 'listening',
    question: { 
      ar: '(استماع) "회의가 3시에 시작될 예정이니까 2시 50분까지 오세요." - متى يجب الحضور؟', 
      ko: '(듣기) "회의가 3시에 시작될 예정이니까 2시 50분까지 오세요." - 언제까지 와야 합니까?' 
    },
    korean: '회의가 3시에 시작될 예정이니까 2시 50분까지 오세요.',
    options: [
      { text: '2:50', isCorrect: true },
      { text: '3:00', isCorrect: false },
      { text: '2:30', isCorrect: false },
      { text: '3:10', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 26,
    section: 'listening',
    question: { 
      ar: '(استماع) "이 제품은 30일 이내에 환불이 가능합니다. 단, 영수증이 있어야 합니다." - ما شرط الاسترداد؟', 
      ko: '(듣기) "이 제품은 30일 이내에 환불이 가능합니다. 단, 영수증이 있어야 합니다." - 환불 조건은?' 
    },
    korean: '이 제품은 30일 이내에 환불이 가능합니다. 단, 영수증이 있어야 합니다.',
    options: [
      { text: 'يجب وجود الإيصال', isCorrect: true },
      { text: 'الدفع نقداً فقط', isCorrect: false },
      { text: 'خلال أسبوع فقط', isCorrect: false },
      { text: 'بدون شروط', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 27,
    section: 'listening',
    question: { 
      ar: '(استماع) "오늘 발표는 김 과장님이 하실 예정이었는데, 갑자기 출장을 가셔서 제가 대신 하게 되었습니다." - لماذا تغير المقدم؟', 
      ko: '(듣기) "오늘 발표는 김 과장님이 하실 예정이었는데, 갑자기 출장을 가셔서 제가 대신 하게 되었습니다." - 발표자가 바뀐 이유는?' 
    },
    korean: '오늘 발표는 김 과장님이 하실 예정이었는데, 갑자기 출장을 가셔서 제가 대신 하게 되었습니다.',
    options: [
      { text: 'لأن مدير كيم ذهب في رحلة عمل مفاجئة', isCorrect: true },
      { text: 'لأنه مريض', isCorrect: false },
      { text: 'لأنه استقال', isCorrect: false },
      { text: 'لأنه مشغول', isCorrect: false },
    ],
    difficulty: 'hard'
  },
  {
    id: 28,
    section: 'listening',
    question: { 
      ar: '(استماع) ما الرد المناسب لـ "혹시 시간 있으시면 커피 한잔 하실래요?"', 
      ko: '(듣기) "혹시 시간 있으시면 커피 한잔 하실래요?"에 대한 적절한 대답은?' 
    },
    korean: '혹시 시간 있으시면 커피 한잔 하실래요?',
    options: [
      { text: '네, 좋아요. 어디로 갈까요?', isCorrect: true },
      { text: '네, 배가 고파요', isCorrect: false },
      { text: '아니요, 커피가 싫어요', isCorrect: false },
      { text: '네, 집에 갈게요', isCorrect: false },
    ],
    difficulty: 'medium'
  },
  {
    id: 29,
    section: 'vocabulary',
    question: { ar: 'ما معنى "도전"؟', ko: '"도전"의 뜻은?' },
    korean: '도전',
    options: [
      { text: 'تحدي', isCorrect: true },
      { text: 'فشل', isCorrect: false },
      { text: 'استسلام', isCorrect: false },
      { text: 'هروب', isCorrect: false },
    ],
    difficulty: 'easy'
  },
  {
    id: 30,
    section: 'vocabulary',
    question: { ar: 'ما معنى "목표"؟', ko: '"목표"의 뜻은?' },
    korean: '목표',
    options: [
      { text: 'هدف', isCorrect: true },
      { text: 'حلم', isCorrect: false },
      { text: 'أمل', isCorrect: false },
      { text: 'خطة', isCorrect: false },
    ],
    difficulty: 'easy'
  },
];

type Section = 'all' | 'vocabulary' | 'grammar' | 'reading' | 'listening';

const TopikTest: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<'topik1' | 'topik2'>('topik1');
  const [selectedSection, setSelectedSection] = useState<Section>('all');
  const [activeQuestions, setActiveQuestions] = useState<TopikQuestion[]>([]);
  const [sectionScores, setSectionScores] = useState<Record<string, { correct: number; total: number }>>({});

  // Get questions based on selected level and section
  const getFilteredQuestions = useCallback(() => {
    const baseQuestions = selectedLevel === 'topik1' ? topik1Questions : topik2Questions;
    if (selectedSection === 'all') return baseQuestions;
    return baseQuestions.filter(q => q.section === selectedSection);
  }, [selectedLevel, selectedSection]);

  // Timer
  useEffect(() => {
    if (!testStarted || isPaused || testCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, isPaused, testCompleted]);

  const startTest = () => {
    const questions = getFilteredQuestions();
    setActiveQuestions(questions);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setTimeLeft(questions.length * 60); // 1 minute per question
    setTestCompleted(false);
    setScore(0);
    setSectionScores({});
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestion + 1 >= activeQuestions.length) {
      finishTest(newAnswers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const checkAnswer = () => {
    setShowResult(true);
  };

  const finishTest = (finalAnswers?: (number | null)[]) => {
    const answersToCheck = finalAnswers || answers;
    let correctCount = 0;
    const scores: Record<string, { correct: number; total: number }> = {};
    
    activeQuestions.forEach((q, idx) => {
      if (!scores[q.section]) {
        scores[q.section] = { correct: 0, total: 0 };
      }
      scores[q.section].total++;
      
      const answerIdx = answersToCheck[idx];
      if (answerIdx !== null && q.options[answerIdx]?.isCorrect) {
        correctCount++;
        scores[q.section].correct++;
      }
    });
    
    setScore(correctCount);
    setSectionScores(scores);
    setTestCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'listening': return <Headphones className="w-4 h-4" />;
      case 'grammar': return <Edit3 className="w-4 h-4" />;
      case 'vocabulary': return <MessageSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, { ar: string; ko: string }> = {
      reading: { ar: 'قراءة', ko: '읽기' },
      listening: { ar: 'استماع', ko: '듣기' },
      grammar: { ar: 'قواعد', ko: '문법' },
      vocabulary: { ar: 'مفردات', ko: '어휘' },
      all: { ar: 'الكل', ko: '전체' },
    };
    return labels[section]?.[language === 'ar' ? 'ar' : 'ko'] || section;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-korean-green bg-korean-green/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return '';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'vocabulary': return 'from-blue-500 to-cyan-500';
      case 'grammar': return 'from-purple-500 to-violet-500';
      case 'reading': return 'from-amber-500 to-orange-500';
      case 'listening': return 'from-pink-500 to-rose-500';
      default: return 'from-primary to-secondary';
    }
  };

  const currentQ = activeQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'اختبار TOPIK' : 'TOPIK 시험'}
            </h1>
          </div>
          {testStarted && !testCompleted && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
              timeLeft <= 60 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-muted'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Test Selection */}
        {!testStarted && !testCompleted && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
                <BookMarked className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {language === 'ar' ? 'اختبار TOPIK التحضيري' : 'TOPIK 모의시험'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'اختبر مستواك في اللغة الكورية' : '한국어 실력을 테스트해보세요'}
              </p>
            </div>

            {/* Level Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedLevel('topik1')}
                className={`relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  selectedLevel === 'topik1' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {selectedLevel === 'topik1' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="text-3xl font-bold text-primary mb-2">TOPIK I</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المستوى 1-2 (مبتدئ)' : '레벨 1-2 (초급)'}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3" />
                  {topik1Questions.length} {language === 'ar' ? 'سؤال' : '문제'}
                </div>
              </button>
              <button
                onClick={() => setSelectedLevel('topik2')}
                className={`relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  selectedLevel === 'topik2' 
                    ? 'border-secondary bg-secondary/5' 
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                {selectedLevel === 'topik2' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                )}
                <div className="text-3xl font-bold text-secondary mb-2">TOPIK II</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المستوى 3-6 (متقدم)' : '레벨 3-6 (중고급)'}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  {topik2Questions.length} {language === 'ar' ? 'سؤال' : '문제'}
                </div>
              </button>
            </div>

            {/* Section Selection */}
            <div className="bg-card rounded-2xl border border-border p-4 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'اختر القسم' : '섹션 선택'}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {(['all', 'vocabulary', 'grammar', 'reading', 'listening'] as Section[]).map((section) => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedSection === section
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-primary/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {section !== 'all' && getSectionIcon(section)}
                      <span className="text-xs font-medium">{getSectionLabel(section)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Info */}
            <div className="bg-card rounded-3xl border border-border p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'ar' ? 'معلومات الاختبار' : '시험 정보'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{getFilteredQuestions().length} {language === 'ar' ? 'سؤال' : '문제'}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSection === 'all' 
                        ? (language === 'ar' ? 'جميع الأقسام' : '모든 섹션')
                        : getSectionLabel(selectedSection)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{getFilteredQuestions().length} {language === 'ar' ? 'دقيقة' : '분'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'دقيقة واحدة لكل سؤال' : '문제당 1분'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-korean-green/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-korean-green" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'ar' ? '70% للنجاح' : '합격 기준 70%'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الحد الأدنى للنجاح' : '최소 합격 점수'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-500/10 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700">
                    {language === 'ar' ? 'نصائح للاختبار' : '시험 팁'}
                  </p>
                  <ul className="text-sm text-amber-600 mt-1 space-y-1">
                    <li>• {language === 'ar' ? 'اقرأ كل سؤال بعناية' : '각 문제를 주의 깊게 읽으세요'}</li>
                    <li>• {language === 'ar' ? 'لا تقضِ وقتاً طويلاً على سؤال واحد' : '한 문제에 너무 오래 머물지 마세요'}</li>
                    <li>• {language === 'ar' ? 'راجع إجاباتك إذا بقي وقت' : '시간이 남으면 답을 다시 확인하세요'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={startTest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <Play className="w-6 h-6" />
              {language === 'ar' ? 'ابدأ الاختبار' : '시험 시작'}
            </button>
          </>
        )}

        {/* Active Test */}
        {testStarted && !testCompleted && currentQ && (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {language === 'ar' ? 'السؤال' : '문제'} {currentQuestion + 1}/{activeQuestions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gradient-to-r ${getSectionColor(currentQ.section)} text-white`}>
                    {getSectionIcon(currentQ.section)}
                    {getSectionLabel(currentQ.section)}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs ${getDifficultyColor(currentQ.difficulty)}`}>
                    {currentQ.difficulty === 'easy' && (language === 'ar' ? 'سهل' : '쉬움')}
                    {currentQ.difficulty === 'medium' && (language === 'ar' ? 'متوسط' : '보통')}
                    {currentQ.difficulty === 'hard' && (language === 'ar' ? 'صعب' : '어려움')}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-card rounded-3xl border border-border p-6 mb-6">
              {/* Passage if exists */}
              {currentQ.passage && (
                <div className="mb-4 p-4 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentQ.passage[language === 'ar' ? 'ar' : 'ko']}
                  </p>
                </div>
              )}

              {currentQ.korean && (
                <div className="text-center mb-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                  <span className="font-korean text-2xl sm:text-3xl whitespace-pre-line">{currentQ.korean}</span>
                </div>
              )}

              <h2 className="text-lg font-bold mb-6">
                {currentQ.question[language === 'ar' ? 'ar' : 'ko']}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  let optionClass = 'bg-muted hover:bg-primary/10 border-transparent';
                  
                  if (showResult) {
                    if (option.isCorrect) {
                      optionClass = 'bg-korean-green/10 border-korean-green text-korean-green';
                    } else if (selectedAnswer === idx) {
                      optionClass = 'bg-red-500/10 border-red-500 text-red-500';
                    }
                  } else if (selectedAnswer === idx) {
                    optionClass = 'bg-primary/10 border-primary';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !showResult && handleAnswer(idx)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-2xl border-2 text-start transition-all ${optionClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-sm">
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <span className="flex-1 text-sm sm:text-base">{option.text}</span>
                        {showResult && option.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-korean-green flex-shrink-0" />
                        )}
                        {showResult && selectedAnswer === idx && !option.isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showResult && currentQ.explanation && (
                <div className="mt-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-700">
                    <strong>{language === 'ar' ? 'شرح: ' : '설명: '}</strong>
                    {currentQ.explanation[language === 'ar' ? 'ar' : 'ko']}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {language === 'ar' ? 'تحقق من الإجابة' : '정답 확인'}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center gap-2"
                >
                  {currentQuestion + 1 >= activeQuestions.length 
                    ? (language === 'ar' ? 'إنهاء الاختبار' : '시험 종료')
                    : (language === 'ar' ? 'السؤال التالي' : '다음 문제')}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Results */}
        {testCompleted && (
          <div className="text-center">
            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / activeQuestions.length) * 553} 553`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{Math.round((score / activeQuestions.length) * 100)}%</span>
                <span className="text-muted-foreground">{score}/{activeQuestions.length}</span>
              </div>
            </div>

            {/* Result Message */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              (score / activeQuestions.length) >= 0.7 
                ? 'bg-korean-green/10 text-korean-green' 
                : 'bg-amber-500/10 text-amber-600'
            }`}>
              {(score / activeQuestions.length) >= 0.7 ? (
                <>
                  <Trophy className="w-5 h-5" />
                  {language === 'ar' ? 'أحسنت! لقد نجحت' : '축하합니다! 합격'}
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  {language === 'ar' ? 'حاول مرة أخرى' : '다시 도전해보세요'}
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {(score / activeQuestions.length) >= 0.7 
                ? (language === 'ar' ? 'ممتاز!' : '훌륭합니다!') 
                : (language === 'ar' ? 'استمر في التعلم!' : '계속 공부하세요!')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' 
                ? `أجبت بشكل صحيح على ${score} من ${activeQuestions.length} سؤال`
                : `${activeQuestions.length}문제 중 ${score}문제를 맞추셨습니다`}
            </p>

            {/* Section Breakdown */}
            {Object.keys(sectionScores).length > 1 && (
              <div className="bg-card rounded-2xl border border-border p-4 mb-6 text-start">
                <h3 className="font-bold mb-3 text-center">
                  {language === 'ar' ? 'نتائج الأقسام' : '섹션별 결과'}
                </h3>
                <div className="space-y-3">
                  {Object.entries(sectionScores).map(([section, { correct, total }]) => (
                    <div key={section} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getSectionColor(section)} flex items-center justify-center text-white`}>
                        {getSectionIcon(section)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{getSectionLabel(section)}</span>
                          <span className="text-sm text-muted-foreground">{correct}/{total}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getSectionColor(section)}`}
                            style={{ width: `${(correct / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTestStarted(false);
                  setTestCompleted(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-muted font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                {language === 'ar' ? 'إعادة الاختبار' : '다시 시험보기'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold"
              >
                {language === 'ar' ? 'العودة' : '돌아가기'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TopikTest;