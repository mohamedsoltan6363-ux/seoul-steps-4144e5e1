import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft, 
  Volume2, Mic, Keyboard, Clock, Zap, Star, Heart,
  Sparkles, Target, Brain, Lightbulb, Award
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { quizQuestions } from '@/data/koreanData';
import confetti from 'canvas-confetti';

interface EnhancedQuizProps {
  level: number;
  onComplete: (score: number, total: number, passed: boolean) => void;
  onBack: () => void;
}

type QuestionType = 'multiple' | 'listening' | 'writing' | 'matching' | 'fillBlank';

interface EnhancedQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correct: string;
  audio?: string;
  hint?: string;
  korean?: string;
  blank?: string;
}

const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ level, onComplete, onBack }) => {
  const { language, t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [streak, setStreak] = useState(0);
  const [writingInput, setWritingInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get base questions and enhance them
  const baseQuestions = quizQuestions[`level${level}` as keyof typeof quizQuestions] || [];
  
  // Create enhanced questions with different types
  const enhancedQuestions: EnhancedQuestion[] = baseQuestions.map((q, index) => {
    const types: QuestionType[] = ['multiple', 'listening', 'writing', 'fillBlank'];
    const type = types[index % types.length];
    
    return {
      id: index,
      type,
      question: q.question,
      options: q.options,
      correct: q.correct,
      hint: language === 'ar' ? 'فكر في الحرف الأول...' : '첫 글자를 생각해보세요...',
      korean: q.correct,
    };
  });

  const question = enhancedQuestions[currentQuestion];
  const totalQuestions = enhancedQuestions.length;
  const passingScore = Math.ceil(totalQuestions * 0.7);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0 && !isAnswered && !showResults) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, isAnswered, showResults]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setAnswers([...answers, false]);
      setLives(prev => prev - 1);
      setStreak(0);
    }
  };

  const playSound = (korean: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(korean);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = answer.toLowerCase().trim() === question.correct.toLowerCase().trim();
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      setScore(prev => prev + (streak >= 3 ? 2 : 1)); // Bonus points for streak
      setStreak(prev => prev + 1);
      
      // Play success sound
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
    }
  };

  const handleWritingSubmit = () => {
    handleAnswer(writingInput);
  };

  const handleNext = () => {
    if (lives <= 0) {
      setShowResults(true);
      onComplete(score, totalQuestions, false);
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setWritingInput('');
      setShowHint(false);
    } else {
      const passed = score >= passingScore;
      setShowResults(true);
      
      if (passed) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
      
      onComplete(score, totalQuestions, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setLives(3);
    setStreak(0);
    setTimeLeft(30);
    setWritingInput('');
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'listening':
        return (
          <div className="text-center">
            <motion.button
              onClick={() => playSound(question.correct)}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-12 h-12" />
            </motion.button>
            <p className="text-lg text-muted-foreground mb-4">
              {language === 'ar' ? 'استمع واختر الإجابة الصحيحة' : '듣고 정답을 선택하세요'}
            </p>
            <div className="grid gap-3">
              {question.options?.map((option, index) => renderOption(option, index))}
            </div>
          </div>
        );

      case 'writing':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <Keyboard className="w-16 h-16 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{question.question}</h3>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'اكتب الإجابة باللغة الكورية' : '한국어로 답을 쓰세요'}
              </p>
            </motion.div>
            
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="text"
                value={writingInput}
                onChange={(e) => setWritingInput(e.target.value)}
                disabled={isAnswered}
                placeholder={language === 'ar' ? 'اكتب هنا...' : '여기에 쓰세요...'}
                className="w-full p-4 text-2xl text-center font-korean rounded-xl border-2 border-border focus:border-primary outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && !isAnswered && handleWritingSubmit()}
              />
            </div>

            {!isAnswered && (
              <button
                onClick={handleWritingSubmit}
                disabled={!writingInput.trim()}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
              >
                {language === 'ar' ? 'تحقق' : '확인'}
              </button>
            )}
          </div>
        );

      case 'fillBlank':
        return (
          <div>
            <h3 className="text-xl font-bold mb-6 text-center">{question.question}</h3>
            <div className="grid gap-3">
              {question.options?.map((option, index) => renderOption(option, index))}
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3 className="text-xl font-bold mb-6 text-center font-korean">{question.question}</h3>
            <div className="grid gap-3">
              {question.options?.map((option, index) => renderOption(option, index))}
            </div>
          </div>
        );
    }
  };

  const renderOption = (option: string, index: number) => {
    const isSelected = selectedAnswer === option;
    const isCorrect = option === question.correct;
    
    let buttonClass = 'p-4 rounded-xl border-2 font-korean text-lg transition-all duration-300 relative overflow-hidden ';
    
    if (isAnswered) {
      if (isCorrect) {
        buttonClass += 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-600';
      } else if (isSelected && !isCorrect) {
        buttonClass += 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600';
      } else {
        buttonClass += 'border-border bg-muted/50 text-muted-foreground';
      }
    } else {
      buttonClass += isSelected 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary hover:bg-primary/5';
    }

    return (
      <motion.button
        key={index}
        onClick={() => handleAnswer(option)}
        disabled={isAnswered}
        className={buttonClass}
        whileHover={!isAnswered ? { scale: 1.02 } : {}}
        whileTap={!isAnswered ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex items-center justify-between">
          <span className={language === 'ar' ? 'text-right' : 'text-left'}>{option}</span>
          {isAnswered && isCorrect && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          )}
          {isAnswered && isSelected && !isCorrect && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <XCircle className="w-6 h-6 text-red-500" />
            </motion.div>
          )}
        </div>
      </motion.button>
    );
  };

  // Results Screen
  if (showResults) {
    const passed = score >= passingScore;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center p-8"
      >
        <motion.div
          className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: 'spring' }}
        >
          {passed ? (
            <Trophy className="w-16 h-16 text-white" />
          ) : (
            <XCircle className="w-16 h-16 text-white" />
          )}
        </motion.div>

        <h2 className="text-3xl font-bold mb-4">
          {passed 
            ? (language === 'ar' ? 'أحسنت! 🎉' : '잘했어요! 🎉')
            : (language === 'ar' ? 'حاول مرة أخرى! 💪' : '다시 도전해요! 💪')}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground">{language === 'ar' ? 'النقاط' : '점수'}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500">{percentage}%</p>
              <p className="text-sm text-muted-foreground">{language === 'ar' ? 'النسبة' : '비율'}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {answers.map((correct, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`w-3 h-3 rounded-full ${correct ? 'bg-green-500' : 'bg-red-500'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            {language === 'ar' ? 'إعادة' : '다시'}
          </motion.button>
          
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'ar' ? 'رجوع' : '돌아가기'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Stats */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-card border border-border"
      >
        {/* Lives */}
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
            >
              <Heart className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted'}`} />
            </motion.div>
          ))}
        </div>

        {/* Timer */}
        <motion.div 
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            timeLeft <= 10 ? 'bg-red-500/20 text-red-500' : 'bg-primary/10 text-primary'
          }`}
          animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          <Clock className="w-5 h-5" />
          <span className="font-bold font-mono">{timeLeft}s</span>
        </motion.div>

        {/* Streak */}
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${streak >= 3 ? 'text-amber-500' : 'text-muted'}`} />
          <span className="font-bold">{streak}</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10">
          <Star className="w-5 h-5 text-green-500" />
          <span className="font-bold text-green-500">{score}</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {language === 'ar' ? 'السؤال' : '질문'} {currentQuestion + 1}/{totalQuestions}
          </span>
          <span className="font-semibold text-primary">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Type Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          question.type === 'listening' ? 'bg-purple-500/20 text-purple-500' :
          question.type === 'writing' ? 'bg-blue-500/20 text-blue-500' :
          question.type === 'fillBlank' ? 'bg-amber-500/20 text-amber-500' :
          'bg-green-500/20 text-green-500'
        }`}>
          {question.type === 'listening' && (language === 'ar' ? '🎧 استماع' : '🎧 듣기')}
          {question.type === 'writing' && (language === 'ar' ? '✍️ كتابة' : '✍️ 쓰기')}
          {question.type === 'fillBlank' && (language === 'ar' ? '📝 ملء الفراغ' : '📝 빈칸 채우기')}
          {question.type === 'multiple' && (language === 'ar' ? '📋 اختياري' : '📋 선택')}
        </span>
      </motion.div>

      {/* Question Card */}
      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-card rounded-3xl border border-border p-6 shadow-lg"
      >
        {renderQuestionContent()}

        {/* Hint Button */}
        {!isAnswered && !showHint && (
          <motion.button
            onClick={() => setShowHint(true)}
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <Lightbulb className="w-4 h-4" />
            {language === 'ar' ? 'أحتاج تلميح' : '힌트가 필요해요'}
          </motion.button>
        )}

        {showHint && !isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 rounded-xl bg-amber-500/10 text-amber-600 text-sm text-center"
          >
            💡 {question.hint}
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 rounded-xl text-center font-semibold ${
                (selectedAnswer || writingInput).toLowerCase().trim() === question.correct.toLowerCase().trim()
                  ? 'bg-green-100 dark:bg-green-950/30 text-green-600' 
                  : 'bg-red-100 dark:bg-red-950/30 text-red-600'
              }`}
            >
              {(selectedAnswer || writingInput).toLowerCase().trim() === question.correct.toLowerCase().trim() ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {language === 'ar' ? 'صحيح! 🎉' : '정답! 🎉'}
                  {streak >= 3 && <span className="text-amber-500">+2 🔥</span>}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <XCircle className="w-5 h-5" />
                    {language === 'ar' ? 'خطأ!' : '틀렸어요!'}
                  </div>
                  <p className="text-sm opacity-80">
                    {language === 'ar' ? 'الإجابة الصحيحة:' : '정답:'} <span className="font-korean">{question.correct}</span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentQuestion < totalQuestions - 1 
              ? (language === 'ar' ? 'السؤال التالي' : '다음 질문')
              : (language === 'ar' ? 'إنهاء الاختبار' : '시험 종료')}
            <Sparkles className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedQuiz;
