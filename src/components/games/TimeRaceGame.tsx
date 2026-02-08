import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Trophy, RotateCcw, Sparkles, Timer, Play, Zap } from 'lucide-react';
import { vocabulary, consonants, vowels } from '@/data/koreanData';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TimeRaceGameProps {
  onBack: () => void;
}

type QuestionType = 'vocab_to_arabic' | 'arabic_to_vocab' | 'letter_to_arabic';

interface Question {
  type: QuestionType;
  question: string;
  correctAnswer: string;
  options: string[];
}

const TimeRaceGame = ({ onBack }: TimeRaceGameProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalRounds] = useState(50); // Changed to 50 rounds instead of timed
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateQuestion = useCallback((): Question => {
    const types: QuestionType[] = ['vocab_to_arabic', 'arabic_to_vocab', 'letter_to_arabic'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'letter_to_arabic') {
      const allLetters = [...consonants, ...vowels];
      const shuffled = shuffleArray(allLetters);
      const correct = shuffled[0];
      const wrongOptions = shuffled.slice(1, 4).map(l => l.arabic);
      const options = shuffleArray([correct.arabic, ...wrongOptions]);

      return {
        type,
        question: correct.korean,
        correctAnswer: correct.arabic,
        options
      };
    } else {
      const shuffled = shuffleArray(vocabulary);
      const correct = shuffled[0];
      const wrongOptions = shuffled.slice(1, 4);

      if (type === 'vocab_to_arabic') {
        const options = shuffleArray([correct.arabic, ...wrongOptions.map(w => w.arabic)]);
        return {
          type,
          question: correct.korean,
          correctAnswer: correct.arabic,
          options
        };
      } else {
        const options = shuffleArray([correct.korean, ...wrongOptions.map(w => w.korean)]);
        return {
          type,
          question: correct.arabic,
          correctAnswer: correct.korean,
          options
        };
      }
    }
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setRound(1);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCurrentQuestion(generateQuestion());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameComplete(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setQuestionsAnswered(prev => prev + 1);

    if (correct) {
      const streakBonus = Math.floor(streak / 3) * 2;
      setScore(prev => prev + 10 + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setGameComplete(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setRound(round + 1);
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 500);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {isArabic ? 'ممتاز! أكملت جميع الجولات 🎉' : '훌륭해요! 모든 라운드 완료! 🎉'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {isArabic ? `أكملت ${round} جولة من ${totalRounds}` : `${round}/${totalRounds} 라운드 완료`}
              </p>
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="p-4 rounded-xl bg-primary/10">
                  <p className="text-3xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">{isArabic ? 'النقاط' : '점수'}</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10">
                  <p className="text-3xl font-bold text-primary">{questionsAnswered}</p>
                  <p className="text-sm text-muted-foreground">{isArabic ? 'الأسئلة' : '문제'}</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={startGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isArabic ? 'إعادة اللعب' : '다시 하기'}
                </Button>
                <Button variant="outline" onClick={onBack}>
                  {isArabic ? 'العودة' : '돌아가기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Timer className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {isArabic ? 'سباق سريع' : '빠른 경주'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {isArabic 
                  ? 'أجب على 50 سؤال بسرعة واحصل على أعلى نقاط!'
                  : '50개의 질문에 빠르게 답하고 점수를 얻으세요!'}
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={startGame} size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Play className="w-5 h-5" />
                  {isArabic ? 'ابدأ!' : '시작!'}
                </Button>
                <Button variant="outline" onClick={onBack}>
                  {isArabic ? 'العودة' : '돌아가기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-bold text-primary">{score}</span>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-lg font-mono text-lg font-bold">
          <span>{isArabic ? 'الجولة' : '라운드'}</span>
          <span className="text-primary">{round}/{totalRounds}</span>
        </div>

        {streak >= 3 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600"
          >
            <Zap className="w-4 h-4" />
            <span className="font-bold text-sm">x{streak}</span>
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <Progress value={(round / totalRounds) * 100} className="h-2 mb-8" />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.question}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {currentQuestion.type === 'arabic_to_vocab' 
                    ? (isArabic ? 'ما هي الكلمة الكورية؟' : '한국어 단어는?')
                    : (isArabic ? 'ما المعنى؟' : '의미는?')}
                </p>
                <p className="text-3xl font-bold">{currentQuestion.question}</p>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-16 text-lg transition-all ${
                      selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-red-500 text-white border-red-500'
                        : selectedAnswer && option === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-green-500'
                        : 'hover:bg-primary/10 hover:border-primary'
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeRaceGame;
