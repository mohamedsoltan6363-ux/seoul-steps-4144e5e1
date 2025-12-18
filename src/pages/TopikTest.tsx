import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, 
  BookOpen, Headphones, Edit3, MessageSquare,
  Trophy, Target, AlertCircle, ChevronRight,
  Play, Pause, RotateCcw, Award
} from 'lucide-react';

interface TopikQuestion {
  id: number;
  type: 'reading' | 'listening' | 'grammar' | 'vocabulary';
  question: { ar: string; ko: string };
  korean?: string;
  options: { text: string; isCorrect: boolean }[];
  explanation?: { ar: string; ko: string };
  difficulty: 'easy' | 'medium' | 'hard';
}

const topikQuestions: TopikQuestion[] = [
  {
    id: 1,
    type: 'vocabulary',
    question: { ar: 'ما معنى كلمة "사랑"؟', ko: '"사랑"의 뜻은?' },
    korean: '사랑',
    options: [
      { text: 'حب / 사랑', isCorrect: true },
      { text: 'صداقة / 우정', isCorrect: false },
      { text: 'عائلة / 가족', isCorrect: false },
      { text: 'سعادة / 행복', isCorrect: false },
    ],
    explanation: { ar: 'سارانغ (사랑) تعني "حب" في اللغة الكورية', ko: '사랑은 "love"라는 뜻입니다' },
    difficulty: 'easy'
  },
  {
    id: 2,
    type: 'grammar',
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
    id: 3,
    type: 'reading',
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
    id: 4,
    type: 'vocabulary',
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
    id: 5,
    type: 'grammar',
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
    id: 6,
    type: 'reading',
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
    id: 7,
    type: 'vocabulary',
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
    id: 8,
    type: 'grammar',
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
    id: 9,
    type: 'reading',
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
    id: 10,
    type: 'vocabulary',
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
];

const TopikTest: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<'topik1' | 'topik2'>('topik1');

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
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers(new Array(topikQuestions.length).fill(null));
    setTimeLeft(600);
    setTestCompleted(false);
    setScore(0);
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

    if (currentQuestion + 1 >= topikQuestions.length) {
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
    
    topikQuestions.forEach((q, idx) => {
      const answerIdx = answersToCheck[idx];
      if (answerIdx !== null && q.options[answerIdx]?.isCorrect) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setTestCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'listening': return <Headphones className="w-4 h-4" />;
      case 'grammar': return <Edit3 className="w-4 h-4" />;
      case 'vocabulary': return <MessageSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; ko: string }> = {
      reading: { ar: 'قراءة', ko: '읽기' },
      listening: { ar: 'استماع', ko: '듣기' },
      grammar: { ar: 'قواعد', ko: '문법' },
      vocabulary: { ar: 'مفردات', ko: '어휘' },
    };
    return labels[type]?.[language === 'ar' ? 'ar' : 'ko'] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-korean-green bg-korean-green/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'hard': return 'text-red-500 bg-red-500/10';
      default: return '';
    }
  };

  const currentQ = topikQuestions[currentQuestion];

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
              timeLeft <= 60 ? 'bg-red-500/10 text-red-500' : 'bg-muted'
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
            {/* Level Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedLevel('topik1')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedLevel === 'topik1' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl font-bold text-primary mb-2">TOPIK I</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المستوى 1-2 (مبتدئ)' : '레벨 1-2 (초급)'}
                </p>
              </button>
              <button
                onClick={() => setSelectedLevel('topik2')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedLevel === 'topik2' 
                    ? 'border-secondary bg-secondary/5' 
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                <div className="text-3xl font-bold text-secondary mb-2">TOPIK II</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المستوى 3-6 (متوسط-متقدم)' : '레벨 3-6 (중고급)'}
                </p>
              </button>
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
                    <p className="font-medium">{topikQuestions.length} {language === 'ar' ? 'سؤال' : '문제'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'قراءة، مفردات، قواعد' : '읽기, 어휘, 문법'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">10 {language === 'ar' ? 'دقائق' : '분'}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'الوقت المحدد للاختبار' : '제한 시간'}
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
                  {language === 'ar' ? 'السؤال' : '문제'} {currentQuestion + 1}/{topikQuestions.length}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty === 'easy' && (language === 'ar' ? 'سهل' : '쉬움')}
                  {currentQ.difficulty === 'medium' && (language === 'ar' ? 'متوسط' : '보통')}
                  {currentQ.difficulty === 'hard' && (language === 'ar' ? 'صعب' : '어려움')}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / topikQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-card rounded-3xl border border-border p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm`}>
                  {getTypeIcon(currentQ.type)}
                  {getTypeLabel(currentQ.type)}
                </span>
              </div>

              {currentQ.korean && (
                <div className="text-center mb-4 p-4 bg-muted/50 rounded-2xl">
                  <span className="font-korean text-3xl">{currentQ.korean}</span>
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
                        <span className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold">
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <span className="flex-1">{option.text}</span>
                        {showResult && option.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-korean-green" />
                        )}
                        {showResult && selectedAnswer === idx && !option.isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500" />
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
                  {currentQuestion + 1 >= topikQuestions.length 
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
                  strokeDasharray={`${(score / topikQuestions.length) * 553} 553`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold">{Math.round((score / topikQuestions.length) * 100)}%</span>
                <span className="text-muted-foreground">{score}/{topikQuestions.length}</span>
              </div>
            </div>

            {/* Result Message */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              (score / topikQuestions.length) >= 0.7 
                ? 'bg-korean-green/10 text-korean-green' 
                : 'bg-amber-500/10 text-amber-600'
            }`}>
              {(score / topikQuestions.length) >= 0.7 ? (
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
              {(score / topikQuestions.length) >= 0.7 
                ? (language === 'ar' ? 'ممتاز!' : '훌륭합니다!') 
                : (language === 'ar' ? 'استمر في التعلم!' : '계속 공부하세요!')}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'ar' 
                ? `أجبت بشكل صحيح على ${score} من ${topikQuestions.length} سؤال`
                : `${topikQuestions.length}문제 중 ${score}문제를 맞추셨습니다`}
            </p>

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
